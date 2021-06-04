import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import { ACCESS_TOKEN } from '@/store/storage-types'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  timeout: 600000 // 请求超时时间
})

// 请求失败处理函数
const onRejected = (error) => {
  if (error.response) {
    const data = error.response.data
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
      error.resolved = true
    }
    if (error.response.status === 401) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      error.resolved = true
      store.dispatch('CLEAN_USER_INFO').then(() => {
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      })
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers['Authorization'] = 'Bearer '+ token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, onRejected)

// response interceptor
service.interceptors.response.use((response) => {
  return response.data
}, onRejected)


export default service
