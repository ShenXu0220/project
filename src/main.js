import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// // 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 导入图标
import './assets/fonts/iconfont.css'

import axios from 'axios'
//配置请求的根路径  
// axios.defaults.baseURL = 'https://api.naccl.top/vue/shop/api/private/v1/'
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 固定写法，必须要return这个config
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)
// 将富文本编辑器注册成全局可用的组件
Vue.use(VueQuillEditor)

//创建全局的事件过滤器  太旧了这方法
// Vue.filter('dateFormat', function (originVal) {
//   const dt = new Date(originVal)
//   const y = dt.getFullYear()
//   const m = (dt.getMonth + 1 + '').padStart(2, "0")
//   const d = (dt.getDate() + '').padStart(2, "0")
//   const hh = (dt.getHours() + '').padStart(2, "0")
//   const mm = (dt.getMinutes() + '').padStart(2, "0")
//   const ss = (dt.getSeconds() + '').padStart(2, "0")
  
//   return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
// })

// 时间格式
import dayjs from 'dayjs'
Vue.prototype.$dayjs = dayjs


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
