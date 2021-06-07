import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/pay',
    method: 'get',
    params: query
  })
}

export function logs(query) {
  return request({
    url: '/pay/logs/' + query.tradeNo,
    method: 'get',
    params: query
  })
}
