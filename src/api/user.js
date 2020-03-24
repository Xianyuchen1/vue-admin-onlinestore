import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

// 获取所有管理员用户
export function getAdminList(params) {
  return request({
    url: '/user/adminList',
    method: 'get',
    params
  })
}

// 获取所有普通用户
export function getUserList(params) {
  return request({
    url: '/user/userList',
    method: 'get',
    params
  })
}

// 改变用户使用状态
export function updateStatus(data) {
  return request({
    url: '/user/updateStatus/',
    method: 'post',
    data
  })
}

// 注册普通用户
export function createUser(data) {
  return request({
    url: '/user/register/',
    method: 'post',
    data
  })
}

// 修改普通用户
export function updateUser(data) {
  return request({
    url: '/user/update/',
    method: 'post',
    data
  })
}
