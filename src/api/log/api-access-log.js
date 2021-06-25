import request from '@/utils/request'

export function getPage(query) {
  return request({
    url: '/api/access/log',
    method: 'get',
    params: query
  })
}
