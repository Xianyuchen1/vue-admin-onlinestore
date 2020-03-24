<template>
  <div class="app-container">
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
          {{ slotProps.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="账号名" align="center" >
        <template v-slot="slotProps">
          {{ slotProps.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center"  >
        <template v-slot="slotProps">
          <span>{{ slotProps.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center">
        <template v-slot="slotProps">
          {{ slotProps.row.email }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template v-slot="slotProps">
          <i class="el-icon-time" />
          <span>{{ slotProps.row.createTime | formatDateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后登录时间" align="center">
        <template v-slot="slotProps">
          <i class="el-icon-time" />
          <span>{{ slotProps.row.createTime | formatDateTime }}</span>
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
    </el-table>
  </div>
</template>

<script>
import { getAdminList, updateStatus } from '@/api/user'
import { formatDate } from '@/utils/date'

export default {
  data() {
    return {
      beans: [],
      pagination: {},
      listLoading: true
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
    fetchData() {
      this.listLoading = true
      getAdminList().then(response => {
        // 分页类
        this.pagination = response.data
        // 包含的数字类
        this.beans = response.data.content
        this.listLoading = false
        console.log(this.beans)
      })
    },
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
    }
  }
}
</script>
