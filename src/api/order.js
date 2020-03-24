import request from '@/utils/request'

// 获取所有订单
export function getOrderList(params) {
  return request({
    url: '/order/orders',
    method: 'get',
    params
  })
}

// 订单发货
export function deliveryOrder(id) {
  return request({
    url: '/order/deliveryOrder' + id,
    method: 'put'
  })
}

// 获取单个订单
export function getSingleOrder(id) {
  return request({
    url: '/order/orders/' + id,
    method: 'get'
  })
}

// 删除订单
export function deleteOrder(id) {
  return request({
    url: '/order/deleteOrder',
    method: 'put',
    id
  })
}

// 获取订单操作历史
export function getOrderHistoryList(params) {
  return request({
    url: '/order/orders',
    method: 'get',
    params
  })
}
