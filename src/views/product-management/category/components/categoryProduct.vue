<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>用户操作</span>
      <el-button size="mini" class="btn-add" @click="handleAddProduct()" style="margin-left: 20px">添加</el-button>
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
        <el-table-column label="产品ID" align="center" width="95">
          <template v-slot="slotProps">
            {{ slotProps.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="图片" align="center" width="120">
          <template v-slot="slotProps"><img height="40px" :src="defaultImagePrefix+slotProps.row.firstProductImage.id+'.jpg'"></template>
        </el-table-column>
        <el-table-column label="产品名称" align="center" >
          <template v-slot="slotProps">
            {{ slotProps.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="产品小标题" align="center" >
          <template v-slot="slotProps">
            {{ slotProps.row.subTitle }}
          </template>
        </el-table-column>
        <el-table-column label="原价" align="center" width="120">
          <template v-slot="slotProps">
            {{ slotProps.row.originalPrice }}
          </template>
        </el-table-column>
        <el-table-column label="优惠价" align="center" width="120">
          <template v-slot="slotProps">
            {{ slotProps.row.promotePrice }}
          </template>
        </el-table-column>
        <el-table-column label="库存" align="center" width="120">
          <template v-slot="slotProps">
            {{ slotProps.row.stock }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="280">
          <template v-slot="slotProps">
            <p>
                <el-button
                size="mini"
                @click="handleImage(slotProps.$index, slotProps.row)">图片管理
                </el-button>
                <el-button
                size="mini"
                @click="handleProperty(slotProps.$index, slotProps.row)">属性设置
                </el-button>
            </p>
            <p>
                <el-button
                size="mini"
                @click="handleUpdateProduct(slotProps.$index, slotProps.row)">编辑产品
                </el-button>
                <el-button
                size="mini"
                type="danger"
                @click="handleDeleteProduct(slotProps.$index, slotProps.row)">删除产品
                </el-button>
            </p>
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
          :model="defaultProduct"
          ref="adminForm"
          label-width="150px"
          size="small">
        <el-form-item label="产品名称：">
          <el-input v-model="defaultProduct.name" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="产品小标题：">
          <el-input v-model="defaultProduct.subTitle" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="原价：">
          <el-input v-model="defaultProduct.originalPrice" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="优惠价：">
          <el-input v-model="defaultProduct.promotePrice" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="库存：">
          <el-input v-model="defaultProduct.stock" style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="propertyDialogVisible"
      width="40%">
      <el-form
          :model="propertyValue"
          ref="propertyValueForm"
          label-width="150px"
          size="small">
        <el-form-item
            v-for=" domain in propertyValue.domains"
            :label="domain.property.name"
            :key="domain.property.name.key"
            :prop="value"
            :rules="{
                required: true, message: '属性值不能为空', trigger: 'blur'
            }"
        >
            <el-input v-model="domain.value" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button @click="propertyDialogVisible = false" size="small">取 消</el-button>
            <el-button type="primary" @click="handlePropertyValueDialogConfirm('propertyValueForm')" size="small">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getProductList, addProduct, updateProduct, deleteProduct } from '@/api/product'
import { getPropertyValueList, updatePropertyValueList } from '@/api/propertyValue'
import { formatDate } from '@/utils/date'

export default {
  data() {
    return {
      beans: [],
      pagination: {},
      listLoading: true,
      // 是否弹出编辑/添加产品的对话框
      dialogVisible: false,
      // 是否弹出修改属性值的对话框
      propertyDialogVisible: false,
      // 是否是编辑用户
      isEdit: false,
      // 默认的图片前缀，来源oss，图片格式为前缀+属性id+.jpg
      defaultImagePrefix: 'https://xianyuchen-oss.oss-cn-shenzhen.aliyuncs.com/store/img/productSingle/',
      defaultPage: {
        start: 0,
        size: 5
      },
      defaultProduct: {
        id: null,
        name: null,
        originalPrice: 0,
        promotePrice: 0,
        stock: 0
      },
      // 属性值列表
      propertyValue: {
        domains: []
      },
      value: null
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
      getProductList(this.$route.query.id, this.defaultPage).then(response => {
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
    handleAddProduct(index, row) {
      this.dialogVisible = true
      // isEdit设为false说明是增加属性而不是编辑属性
      this.isEdit = false
    },
    // 处理更新属性
    handleUpdateProduct(index, row) {
      this.dialogVisible = true
      this.isEdit = true
      // 将当前属性信息放到待属性用户信息中
      this.defaultProduct = row
    },
    // 增加或修改界面的提交处理
    handleDialogConfirm() {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) {
          updateProduct(this.defaultProduct).then(response => {
            this.$message({
              message: '修改成功！',
              type: 'success'
            })
            this.dialogVisible = false
            this.fetchData()
          })
        } else {
          addProduct(this.defaultProduct).then(response => {
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
    handleDeleteProduct(index, row) {
      this.$confirm('是否要删除该产品', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProduct(row.id).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          })
          this.fetchData()
        })
      })
    },
    handleImage() {

    },
    // 处理属性值管理
    handleProperty(index, row) {
      // 通过产品id加载产品对应的属性值列表，列表中包含产品
      getPropertyValueList(row.id).then(response => {
        //   属性值列表
        this.propertyValue.domains = response.data
        this.listLoading = false
      })
      this.propertyDialogVisible = true
    },
    // 属性值提交界面的处理
    handlePropertyValueDialogConfirm(formName) {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs[formName].validate((valid) => {
          console.log(valid)
          if (valid) {
            updatePropertyValueList(this.propertyValue.domains).then(response => {
              this.$message({
                message: '修改成功！',
                type: 'success'
              })
              this.dialogVisible = false
              this.fetchData()
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      })
    }
  }
}
</script>
