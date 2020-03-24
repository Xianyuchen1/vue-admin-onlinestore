import request from '@/utils/request'

// 获取所有产品
export function getProductList(id) {
  return request({
    url: '/product/categories/' + id + '/products',
    method: 'get'
  })
}

// 增加产品
export function addProduct(data) {
  return request({
    url: '/product/products/',
    method: 'post',
    data
  })
}

// 修改产品
export function updateProduct(data) {
  return request({
    url: '/product/products/',
    method: 'put',
    data
  })
}

// 删除产品，传递产品id
export function deleteProduct(id) {
  return request({
    url: '/product/properties/' + id,
    method: 'delete'
  })
}
