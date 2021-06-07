import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/project',
    method: 'get',
    params: query
  })
}


export function addObj(obj) {
  return request({
    url: '/project',
    method: 'post',
    data: obj
  })
}

export function resetApi(obj) {
  return request({
    url: '/project/reset/api/' + obj,
    method: 'patch',
  })
}

export function disabled(obj) {
  return request({
    url: `/project/disabled/${obj.id}/${obj.disabled}`,
    method: 'patch',
  })
}

export function history(query) {
  return request({
    url: '/project/history/' + query.projectId,
    method: 'get',
    params: query
  })
}
