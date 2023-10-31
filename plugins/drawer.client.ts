import { Drawer } from '@arco-design/web-vue'

export default defineNuxtPlugin((nuxtApp) => {
  Drawer._context = nuxtApp.vueApp._context
  nuxtApp.vueApp.use(Drawer)
})
