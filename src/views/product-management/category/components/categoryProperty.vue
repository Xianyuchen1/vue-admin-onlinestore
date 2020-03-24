<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>用户操作</span>
      <el-button size="mini" class="btn-add" @click="handleAddProperty()" style="margin-left: 20px">添加</el-button>
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
        <el-table-column label="属性ID" align="center" width="95">
          <template v-slot="slotProps">
            {{ slotProps.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="属性名称" align="center" >
          <template v-slot="slotProps">
            {{ slotProps.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" >
          <template v-slot="slotProps">
            <el-button
              size="mini"
              @click="handleUpdateProperty(slotProps.$index, slotProps.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteProperty(slotProps.$index, slotProps.row)">删除
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
          :model="defaultProperty"
          ref="adminForm"
          label-width="150px"
          size="small">
        <el-form-item label="属性名称：">
          <el-input v-model="defaultProperty.name" style="width: 250px"></el-input>
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
import { getPropertyList, addProperty, updateProperty, deleteProperty } from '@/api/category'
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
      // 默认的图片前缀，来源oss，图片格式为前缀+属性id+.jpg
      defaultImagePrefix: 'https://xianyuchen-oss.oss-cn-shenzhen.aliyuncs.com/store/img/category/',
      defaultPage: {
        start: 0,
        size: 5
      },
      defaultProperty: {
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
      getPropertyList(this.$route.query.id, this.defaultPage).then(response => {
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
    // 处理增加属性
    handleAddProperty(index, row) {
      this.dialogVisible = true
      // isEdit设为false说明是增加属性而不是编辑属性
      this.isEdit = false
    },
    // 处理更新属性
    handleUpdateProperty(index, row) {
      this.dialogVisible = true
      this.isEdit = true
      // 将当前属性信息放到待属性用户信息中
      this.defaultProperty = row
    },
    // 增加或修改界面的提交处理
    handleDialogConfirm() {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) {
          updateProperty(this.defaultProperty).then(response => {
            this.$message({
              message: '修改成功！',
              type: 'success'
            })
            this.dialogVisible = false
            this.fetchData()
          })
        } else {
          addProperty(this.defaultProperty).then(response => {
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
    // 处理删除属性
    handleDeleteProperty(index, row) {
      this.$confirm('是否要删除该属性', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProperty(row.id).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          })
          this.fetchData()
        })
      })
    }
  }
}
</script>
