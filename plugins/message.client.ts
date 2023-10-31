import { Message } from '@arco-design/web-vue'

export default defineNuxtPlugin((nuxtApp) => {
  Message._context = nuxtApp.vueApp._context
  nuxtApp.vueApp.use(Message)
})
