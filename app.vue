<script setup lang="ts">
import enUS from '@arco-design/web-vue/es/locale/lang/en-us'
import frFR from '@arco-design/web-vue/es/locale/lang/fr-fr'
import { appName } from '~/constants'

import 'animate.css'

const locales: any = {
  'en-US': enUS,
  'fr-FR': frFR,
}

const localeProvider = computed(() => {
  return locales['fr-FR'] || enUS
})

// watch(userLang, async (val) => {
//   val && availableLocales.includes(val) && (await loadLanguageAsync(val))
// })
useHead({
  title: appName,
})
</script>

<template>
  <a-config-provider :locale="localeProvider">
    <VitePwaManifest />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </a-config-provider>
</template>
