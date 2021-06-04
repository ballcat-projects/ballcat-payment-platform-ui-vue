module.exports = {
  // 项目标题
  projectTitle: 'Payment',
  // 项目描述
  projectDesc: '支付平台',
  // 开启 websocket，开启此选项需要服务端同步支持 websocket 功能
  // 若服务端不支持，则本地启动时，抛出 socket 异常，导致 proxyServer 关闭
  enableWebsocket: true,
  // Vue ls 配置
  storageOptions: {
    namespace: 'payment/', // key prefix
    name: 'ls', // name variable Vue.[ls] or this.[$ls],
    storage: 'local' // storage name session, local, memory
  }
}


