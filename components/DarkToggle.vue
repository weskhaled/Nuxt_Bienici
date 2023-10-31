<script setup lang="ts">
const color = useColorMode()

useHead({
  meta: [{
    id: 'theme-color',
    name: 'theme-color',
    content: () => color.value === 'dark' ? '#222222' : '#ffffff',
  }],
})

function toggleDark() {
  color.preference = color.value === 'dark' ? 'light' : 'dark'

  if (color.preference === 'light')
    document?.body.removeAttribute('arco-theme')

  else
    document?.body.setAttribute('arco-theme', 'dark')
}

onMounted(() => {
  if (color.preference === 'light')
    document?.body.removeAttribute('arco-theme')
  else
    document?.body.setAttribute('arco-theme', 'dark')
})
</script>

<template>
  <a-button type="text" @click="toggleDark">
    <template #icon>
      <div class="i-carbon-sun dark:i-carbon-moon" />
    </template>
  </a-button>
</template>
