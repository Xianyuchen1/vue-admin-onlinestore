<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>用户操作</span>
      <el-button size="mini" class="btn-add" @click="handleAddUser()" style="margin-left: 20px">添加</el-button>
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
        <el-table-column label="ID" align="center" width="95">
          <template v-slot="slotProps">
            {{ slotProps.$index }}
          </template>
        </el-table-column>
        <el-table-column label="账号名" align="center" >
          <template v-slot="slotProps">
            {{ slotProps.row.username }}
          </template>
        </el-table-column>
        <el-table-column label="用户昵称" align="center">
          <template v-slot="slotProps">
            {{ slotProps.row.nickname }}
          </template>
        </el-table-column>
        <el-table-column label="是否启用" align="center">
          <template v-slot="slotProps">
            <el-switch
              @change="handleStatusChange(slotProps.$index, slotProps.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="slotProps.row.status">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="slotProps">
            <el-button
                       size="mini"
                       type="primary"
                       icon="el-icon-edit"
                       @click="handleUpdateUser(slotProps.$index, slotProps.row)">
              编辑
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
          :model="defaultUser"
          ref="adminForm"
          label-width="150px"
          size="small">
        <el-form-item label="帐号：">
          <el-input v-model="defaultUser.username" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="昵称：">
          <el-input v-model="defaultUser.nickname" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="密码：">
          <el-input v-model="defaultUser.password"  type="password" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-radio-group v-model="defaultUser.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
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
import { getUserList, updateStatus, createUser, updateUser } from '@/api/user'
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
      defaultPage: {
        start: 0,
        size: 5
      },
      defaultUser: {
        id: null,
        username: null,
        password: null,
        nickname: null,
        status: 1
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
      getUserList(this.defaultPage).then(response => {
        // 分页类
        this.pagination = response.data
        // 包含的数字类
        this.beans = response.data.content
        this.listLoading = false
        console.log(this.beans)
      })
    },
    // 处理状态变化
    handleStatusChange(index, row) {
      this.$confirm('是否要修改该状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateStatus(row).then(response => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消修改'
        })
        this.fetchData()
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
    handleAddUser() {
      // 将dialogVisible属性设为true使得<el-dialog>弹出
      this.dialogVisible = true
      // isEdit设为false说明是增加用户
      this.isEdit = false
    },
    // 处理更新用户
    handleUpdateUser(index, row) {
      this.dialogVisible = true
      this.isEdit = true
      // 将当前用户信息放到待提交用户信息中
      this.defaultUser = row
    },
    // 增加或修改用户界面的提交处理
    handleDialogConfirm() {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) {
          updateUser(this.defaultUser).then(response => {
            this.$message({
              message: '修改成功！',
              type: 'success'
            })
            this.dialogVisible = false
            this.fetchData()
          })
        } else {
          createUser(this.defaultUser).then(response => {
            this.$message({
              message: '添加成功！',
              type: 'success'
            })
            this.dialogVisible = false
            this.fetchData()
          })
        }
      })
    }
  }
}
</script>
