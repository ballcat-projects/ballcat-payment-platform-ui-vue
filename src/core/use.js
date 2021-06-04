import Vue from 'vue'
import VueStorage from 'vue-ls'
import projectConfig from '@/config/projectConfig'

// base library
import Antd from 'ant-design-vue'
import VueCropper from 'vue-cropper'
import 'ant-design-vue/dist/antd.less'

// ext library
import VueClipboard from 'vue-clipboard2'
import MultiTab from '@/components/MultiTab'
import PageLoading from '@/components/PageLoading'

// 权限控制
import {has, role, plugin} from '@/utils/authorize'
Vue.use(has)
Vue.use(role)
Vue.use(plugin)


VueClipboard.config.autoSetContainer = true

Vue.use(Antd)
Vue.use(MultiTab)
Vue.use(PageLoading)
Vue.use(VueStorage, projectConfig.storageOptions)
Vue.use(VueClipboard)
Vue.use(VueCropper)
