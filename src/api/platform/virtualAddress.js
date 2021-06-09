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
    url: `/virtual/address/disabled/${obj.id}/${obj.disabled}`,
    method: 'patch',
  })
}
