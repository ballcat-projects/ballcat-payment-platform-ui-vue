import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/virtual/address',
    method: 'get',
    params: query
  })
}


export function addObj(obj) {
  return request({
    url: '/virtual/address',
    method: 'post',
    data: obj
  })
}


export function disabled(obj) {
  return request({
    url: `/virtual/address/disabled`,
    method: 'patch',
    data: obj
  })
}


export function mode(obj) {
  return request({
    url: `/virtual/address/mode/`,
    method: 'patch',
    data: obj
  })
}


export function project(obj) {
  return request({
    url: `/virtual/address/project/`,
    method: 'patch',
    data: obj
  })
}
