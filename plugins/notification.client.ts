import { Notification } from '@arco-design/web-vue'

export default defineNuxtPlugin((nuxtApp) => {
  Notification._context = nuxtApp.vueApp._context
  nuxtApp.vueApp.use(Notification)
})
