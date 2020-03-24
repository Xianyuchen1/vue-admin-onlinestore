import request from '@/utils/request'

// 获取当前产品属性值列表
export function getPropertyValueList(id) {
  return request({
    url: '/product/products/' + id + '/propertyValues',
    method: 'get'
  })
}

// 修改产品属性值
export function updatePropertyValue(data) {
  return request({
    url: '/product/propertyValues',
    method: 'put',
    data
  })
}

// 修改产品所有属性值，一次提交一个list
export function updatePropertyValueList(data) {
  return request({
    url: '/product/propertyValueList',
    method: 'put',
    data
  })
}
