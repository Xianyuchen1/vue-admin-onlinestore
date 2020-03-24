import request from '@/utils/request'

// 获取所有分类
export function getCategoryList(params) {
  return request({
    url: '/product/categories',
    method: 'get',
    params
  })
}

// 增加新分类
export function addCategory(data) {
  return request({
    url: '/product/categories/',
    method: 'post',
    data
  })
}

// 修改分类
export function updateCategory(data) {
  return request({
    url: '/product/addCategory/',
    method: 'put',
    data
  })
}

// 删除分类，传递分类id
export function deleteCategory(id) {
  return request({
    url: '/product/categories/' + id,
    method: 'delete'
  })
}

// 获取属性，传分类id和分页查询数据到后台
export function getPropertyList(id, params) {
  return request({
    url: '/product/categories/' + id + '/properties',
    method: 'get',
    params
  })
}

// 增加属性
export function addProperty(data) {
  return request({
    url: '/product/properties/',
    method: 'post',
    data
  })
}

// 修改属性
export function updateProperty(data) {
  return request({
    url: '/product/properties/',
    method: 'put',
    data
  })
}

// 删除属性，传递属性id
export function deleteProperty(id) {
  return request({
    url: '/product/properties/' + id,
    method: 'delete'
  })
}

