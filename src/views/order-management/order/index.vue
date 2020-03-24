<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>订单列表</span>
    </el-card>
    <div class="table-container">
      <el-table
        v-loading="listLoading"
        :data="beans"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column label="行数" align="center" width="95">
          <template v-slot="slotProps">
            {{ slotProps.$index }}
          </template>
        </el-table-column>
        <el-table-column label="订单ID" align="center" width="95">
          <template v-slot="slotProps">
            {{ slotProps.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="订单号" align="center" width="200">
          <template v-slot="slotProps">
            {{ slotProps.row.orderCode }}
          </template>
        </el-table-column>
        <el-table-column label="买家账号" align="center" width="">
          <template v-slot="slotProps">
            {{ slotProps.row.user.username }}
          </template>
        </el-table-column>
        <el-table-column label="买家名称" align="center" width="">
          <template v-slot="slotProps">
            {{ slotProps.row.user.nickname }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="">
          <template v-slot="slotProps">
            {{ slotProps.row.createDate | formatDateTime }}
          </template>
        </el-table-column>
        <el-table-column label="商品数量" align="center" width="">
          <template v-slot="slotProps">
            {{ slotProps.row.totalNumber }}
          </template>
        </el-table-column>
        <el-table-column label="订单状态" align="center" width="">
          <template v-slot="slotProps">
            {{ slotProps.row.statusDesc }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleViewOrder(scope.$index, scope.row)"
            >查看订单</el-button>
            <el-button
              size="mini"
              @click="handleDeliveryOrder(scope.$index, scope.row)"
              v-show="scope.row.status==='waitDelivery'">订单发货</el-button>
            <el-button
              size="mini"
              @click="handleViewLogistics(scope.$index, scope.row)"
              v-show="scope.row.status==='finish'||scope.row.status==='waitReview'">订单跟踪</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container" >
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="pagination.number+1"
        :page-size="pagination.size"
        :page-sizes="[10,15,20]"
        :total="pagination.totalElements">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getOrderList, deliveryOrder } from '@/api/order'
import { formatDate } from '@/utils/date'

export default {
  data() {
    return {
      beans: [],
      pagination: {},
      listLoading: true,
      // 是否弹出修改/注册的对话框
      dialogVisible: false,
      // 是否是编辑用户
      isEdit: false,
      // 默认的图片前缀，来源oss，图片格式为前缀+分类id+.jpg
      defaultImagePrefix: 'https://xianyuchen-oss.oss-cn-shenzhen.aliyuncs.com/store/img/category/',
      defaultPage: {
        start: 0,
        size: 5
      }
    }
  },
  created() {
    this.fetchData()
  },
  filters: {
    formatDateTime(time) {
      if (time == null || time === '') {
        return 'N/A'
      }
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  methods: {
    // 获取数据
    fetchData() {
      this.listLoading = true
      // 传递当前页码和每页显示数据条数给后台
      getOrderList(this.defaultPage).then(response => {
        // 分页类
        this.pagination = response.data
        // 包含的数字类
        this.beans = response.data.content
        this.listLoading = false
        console.log(this.beans)
      })
    },
    // 处理一页显示的数据条数
    handleSizeChange(val) {
      // 当前页码
      this.defaultPage.start = 0
      this.defaultPage.size = val
      this.fetchData()
    },
    // 处理页跳转
    handleCurrentChange(val) {
      // 页码从0开始，所以自动减一
      this.defaultPage.start = val - 1
      this.fetchData()
    },
    // 查看订单，跳转实现
    handleViewOrder(index, row) {
      this.$router.push({ path: '/order-management/orderInfo', query: { id: row.id }})
    },
    // 订单发货
    handleDeliveryOrder(index, row) {
      this.$confirm('是否要发货？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deliveryOrder(row.id).then(response => {
          this.$message({
            message: '发货成功',
            type: 'success',
            duration: 1000
          })
          this.fetchData()
        })
      })
    },
    // 跟踪订单
    handleViewLogistics(index, row) {

    }
  }
}
</script>
