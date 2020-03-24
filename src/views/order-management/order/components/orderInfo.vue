<template>
  <div class="detail-container">
    <div>
      <el-steps :active="formatStepStatus(order.status)" finish-status="success" align-center>
        <el-step title="提交订单" :description="formatTime(order.createDate)"></el-step>
        <el-step title="支付订单" :description="formatTime(order.payDate)"></el-step>
        <el-step title="平台发货" :description="formatTime(order.deliveryDate)"></el-step>
        <el-step title="确认收货" :description="formatTime(order.confirmDate)"></el-step>
        <el-step title="完成评价" :description="formatTime(order.commentDate)"></el-step>
      </el-steps>
    </div>
    <el-card shadow="never" style="margin-top: 15px">
      <div class="operate-container">
        <i class="el-icon-warning color-danger" style="margin-left: 20px"></i>
        <span class="color-danger">当前订单状态：{{ order.statusDesc }}</span>
        <div class="operate-button-container" v-show="order.status==='waitPay'">
          <el-button size="mini" @click="showUpdateReceiverDialog">修改收货人信息</el-button>
          <el-button size="mini">修改商品信息</el-button>
          <el-button size="mini" @click="showUpdateMoneyDialog">修改费用信息</el-button>
          <el-button size="mini" @click="showMessageDialog">发送站内信</el-button>
          <el-button size="mini" @click="showCloseOrderDialog">关闭订单</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
        <div class="operate-button-container" v-show="order.status==='waitDelivery'">
          <el-button size="mini" @click="showUpdateReceiverDialog">修改收货人信息</el-button>
          <el-button size="mini" @click="showMessageDialog">发送站内信</el-button>
          <el-button size="mini">取消订单</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
        <div class="operate-button-container" v-show="order.status==='waitConfirm'||order.status==='waitReview'">
          <el-button size="mini" @click="showLogisticsDialog">订单跟踪</el-button>
          <el-button size="mini" @click="showMessageDialog">发送站内信</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
        <div class="operate-button-container" v-show="order.status==='finish'">
          <el-button size="mini" @click="handleDeleteOrder">删除订单</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">基本信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="4" class="table-cell-title">订单编号</el-col>
          <el-col :span="4" class="table-cell-title">发货单流水号</el-col>
          <el-col :span="4" class="table-cell-title">用户账号</el-col>
          <el-col :span="4" class="table-cell-title">支付方式</el-col>
          <el-col :span="4" class="table-cell-title">订单来源</el-col>
          <el-col :span="4" class="table-cell-title">订单类型</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">{{order.orderCode}}</el-col>
          <el-col :span="4" class="table-cell">暂无</el-col>
          <el-col :span="4" class="table-cell">{{order.user.username}}</el-col>
          <el-col :span="4" class="table-cell">{{order.payType | formatPayType}}</el-col>
          <el-col :span="4" class="table-cell">{{order.sourceType | formatSourceType}}</el-col>
          <el-col :span="4" class="table-cell">{{order.orderType | formatOrderType}}</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">收货人信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">收货人</el-col>
          <el-col :span="6" class="table-cell-title">手机号码</el-col>
          <el-col :span="6" class="table-cell-title">邮政编码</el-col>
          <el-col :span="6" class="table-cell-title">收货地址</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">{{order.user.nickname}}</el-col>
          <el-col :span="6" class="table-cell">{{order.mobile}}</el-col>
          <el-col :span="6" class="table-cell">{{order.post}}</el-col>
          <el-col :span="6" class="table-cell">{{order.address}}</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">商品信息</span>
      </div>
      <el-table
        ref="orderItemTable"
        :data="order.orderItems"
        style="width: 100%;margin-top: 20px"
        border
        fit
        highlight-current-row
        >
        <el-table-column label="商品图片" width="120" align="center">
          <template v-slot="slotProps">
            <img :src="defaultImagePrefix+slotProps.row.product.id+'.jpg'" style="height: 80px">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template v-slot="slotProps">
            <p>{{slotProps.row.product.name}}</p>
            <p>品牌：</p>
          </template>
        </el-table-column>
        <el-table-column label="单价/货号" width="150" align="center">
          <template v-slot="slotProps">
            <p>价格：￥{{slotProps.row.product.promotePrice}}</p>
            <p>货号：{{slotProps.row.product.id}}</p>
          </template>
        </el-table-column>
        <el-table-column label="属性" width="120" align="center">
          <!-- <template v-slot="slotProps">
            {{slotProps.row.productAttr | formatProductAttr}}
          </template> -->
        </el-table-column>
        <el-table-column label="数量" width="120" align="center">
          <template v-slot="slotProps">
            {{slotProps.row.number}}
          </template>
        </el-table-column>
        <el-table-column label="小计" width="120" align="center">
          <template v-slot="slotProps">
            ￥{{slotProps.row.product.promotePrice*slotProps.row.number}}
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">操作信息</span>
      </div>
      <el-table
                style="margin-top: 20px;width: 100%"
                ref="orderHistoryTable"
                :data="order.orderHistories"
        border>
        <el-table-column label="操作者"  width="120" align="center">
          <template v-slot="slotProps">
            {{slotProps.row.operators}}
          </template>
        </el-table-column>
        <el-table-column label="操作时间"  width="160" align="center">
          <template v-slot="slotProps">
            {{formatTime(slotProps.row.createTime)}}
          </template>
        </el-table-column>
        <el-table-column label="订单状态"  width="120" align="center">
          <template v-slot="slotProps">
            {{slotProps.row.statusDesc}}
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template v-slot="slotProps">
            {{slotProps.row.note}}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
               title="发送站内信"
               :visible.sync="messageDialogVisible"
               width="40%">
      <el-form
               :model="message"
               ref="receiverInfoForm"
               label-width="150px">
        <el-form-item label="标题：">
          <el-input v-model="message.title" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="内容：">
          <el-input v-model="message.content" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="messageDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSendMessage">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
               title="备注订单"
               :visible.sync="markOrderDialogVisible"
               width="40%">
      <el-form
               :model="markInfo"
               label-width="150px">
        <el-form-item label="操作备注：">
          <el-input v-model="markInfo.note" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="markOrderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleMarkOrder">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getSingleOrder, deleteOrder } from '@/api/order'
import { formatDate } from '@/utils/date'
export default {
  name: 'OrderInfo',
  data() {
    return {
      id: null,
      order: {},
      // 默认的图片前缀，来源oss，图片格式为前缀+分类id+.jpg
      defaultImagePrefix: 'https://xianyuchen-oss.oss-cn-shenzhen.aliyuncs.com/store/img/productSingle/',
      messageDialogVisible: false,
      message: { title: null, content: null },
      closeDialogVisible: false,
      closeInfo: { note: null, id: null },
      markOrderDialogVisible: false,
      markInfo: { note: null }
    }
  },
  created() {
    // this.id = this.$route.query.id
    // getSingleOrder(this.id).then(response => {
    //   this.order = response.data
    //   console.log('订单数据：' + response.data)
    // })
    this.fetchData()
  },
  filters: {
    formatNull(value) {
      if (value === undefined || value === null || value === '') {
        return '暂无'
      } else {
        return value
      }
    },
    formatLongText(value) {
      if (value === undefined || value === null || value === '') {
        return '暂无'
      } else if (value.length > 8) {
        return value.substr(0, 8) + '...'
      } else {
        return value
      }
    },
    //   下面3个全部写死，没空写了
    formatPayType(value) {
      // if (value === 1) {
      //   return '支付宝';
      // } else if (value === 2) {
      //   return '微信';
      // } else {
      //   return '未支付';
      // }
      return '支付宝'
    },
    formatSourceType(value) {
      // if (value === 1) {
      //   return 'APP订单';
      // } else {
      //   return 'PC订单';
      // }
      return 'PC订单'
    },
    formatOrderType(value) {
      // if (value === 1) {
      //   return '秒杀订单';
      // } else {
      //   return '正常订单';
      // }
      return '正常订单'
    },
    formatPayStatus(value) {
      if (value === 0) {
        return '未支付'
      } else if (value === 4) {
        return '已退款'
      } else {
        return '已支付'
      }
    },
    formatDeliverStatus(value) {
      if (value === 0 || value === 1) {
        return '未发货'
      } else {
        return '已发货'
      }
    },
    formatProductAttr(value) {
      if (value == null) {
        return ''
      } else {
        const attr = JSON.parse(value)
        let result = ''
        for (let i = 0; i < attr.length; i++) {
          result += attr[i].key
          result += ':'
          result += attr[i].value
          result += ';'
        }
        return result
      }
    }
  },
  methods: {
    // 获取数据
    fetchData() {
      this.listLoading = true
      // 传递当前页码和每页显示数据条数给后台
      getSingleOrder(this.$route.query.id).then(response => {
        this.order = response.data
        console.log(this.order)
      })
    },
    formatTime(time) {
      if (time == null || time === '') {
        return ''
      }
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    // el-step的active属性由数字表示步骤，读取order中的状态用以切换进度，从1开始
    formatStepStatus(value) {
      if (value === 'waitDelivery') {
        // 步骤1，待发货
        return 2
      } else if (value === 'waitConfirm') {
        // 已发货
        return 3
      } else if (value === 'waitReview') {
        // 已收货
        return 4
      } else if (value === 'finish') {
        // 已完成
        return 5
      } else {
        // 待付款、已关闭、无限订单
        return 1
      }
    },
    handleDeleteOrder() {
      this.$confirm('是否要进行该删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteOrder(this.order.id).then(response => {
          this.$message({
            message: '删除成功！',
            type: 'success',
            duration: 1000
          })
          this.$router.back()
        })
      })
    },
    showUpdateReceiverDialog() {

    },
    showUpdateMoneyDialog() {

    },
    showMessageDialog() {

    },
    showCloseOrderDialog() {

    },
    showMarkOrderDialog() {

    },
    showLogisticsDialog() {

    },
    handleSendMessage() {

    },
    handleMarkOrder() {

    }
  }
}
</script>
<style scoped>
  .detail-container {
    width: 80%;
    padding: 20px 20px 20px 20px;
    margin: 20px auto;
  }

  .operate-container {
    background: #F2F6FC;
    height: 80px;
    margin: -20px -20px 0;
    line-height: 80px;
  }

  .operate-button-container {
    float: right;
    margin-right: 20px
  }

  .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }

  .table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }

  .table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
  }
</style>

