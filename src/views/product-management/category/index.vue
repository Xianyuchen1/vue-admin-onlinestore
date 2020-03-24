<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>用户操作</span>
      <el-button size="mini" class="btn-add" @click="handleAddCategory()" style="margin-left: 20px">添加</el-button>
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
        <el-table-column label="分类ID" align="center" width="95">
          <template v-slot="slotProps">
            {{ slotProps.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="图片" align="center">
          <template v-slot="slotProps"><img height="40px" :src="defaultImagePrefix+slotProps.row.id+'.jpg'"></template>
        </el-table-column>
        <el-table-column label="分类名称" align="center" width="200">
          <template v-slot="slotProps">
            {{ slotProps.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="管理" align="center" width="200">
          <template v-slot="slotProps">
            <p>
              <el-button
                size="mini"
                @click="handleProberty(slotProps.$index, slotProps.row)">属性管理
              </el-button>
            </p>
            <p>
              <el-button
                size="mini"
                @click="handleProduct(slotProps.$index, slotProps.row)">产品管理
              </el-button>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template v-slot="slotProps">
            <el-button
              size="mini"
              @click="handleUpdateCategory(slotProps.$index, slotProps.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteCategory(slotProps.$index, slotProps.row)">删除
            </el-button>
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
    <el-dialog
      :visible.sync="dialogVisible"
      width="40%">
      <el-form
          :model="defaultCategory"
          ref="adminForm"
          label-width="150px"
          size="small">
        <el-form-item label="分类名称：">
          <el-input v-model="defaultCategory.name" style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCategoryList, addCategory, updateCategory, deleteCategory } from '@/api/category'
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
      },
      defaultCategory: {
        id: null,
        name: null
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
      getCategoryList(this.defaultPage).then(response => {
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
    // 处理增加分类
    handleAddCategory(index, row) {
      this.dialogVisible = true
      // isEdit设为false说明是增加分类而不是编辑分类
      this.isEdit = false
    },
    // 处理更新分类
    handleUpdateCategory(index, row) {
      this.dialogVisible = true
      this.isEdit = true
      // 将当前分类信息放到待分类用户信息中
      this.defaultCategory = row
    },
    // 增加或修改界面的提交处理
    handleDialogConfirm() {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) {
          updateCategory(this.defaultCategory).then(response => {
            this.$message({
              message: '修改成功！',
              type: 'success'
            })
            this.dialogVisible = false
            this.fetchData()
          })
        } else {
          addCategory(this.defaultCategory).then(response => {
            this.$message({
              message: '添加成功！',
              type: 'success'
            })
            this.dialogVisible = false
            this.fetchData()
          })
        }
      })
    },
    // 处理删除分类
    handleDeleteCategory(index, row) {
      this.$confirm('是否要删除该属性', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCategory(row.id).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          })
          this.fetchData()
        })
      })
    },
    // 使用路由跳转到该分类的属性页，携带分类的id属性
    handleProberty(index, row) {
      this.$router.push({ path: '/product-management/proberty', query: { id: row.id }})
    },
    // 使用路由跳转到该分类的产品页，携带分类的id属性
    handleProduct(index, row) {
      this.$router.push({ path: '/product-management/categoryProduct', query: { id: row.id }})
    }
  }
}
</script>
