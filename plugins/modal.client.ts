import { Modal } from '@arco-design/web-vue'

export default defineNuxtPlugin((nuxtApp) => {
  Modal._context = nuxtApp.vueApp._context
  nuxtApp.vueApp.use(Modal)
})
