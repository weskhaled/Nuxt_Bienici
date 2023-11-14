<script setup lang="ts">
import { UseDraggable as Draggable } from '@vueuse/components'

// import { promiseTimeout } from '@vueuse/core'
import { mdAndSmaller, sideFixed, smAndSmaller } from '~/common/stores/index'

const { width: windowWidth, height: windowHeight } = useWindowSize()
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

const popupVisible = ref(false)
const handle = ref<HTMLElement | null>(null)
// await promiseTimeout(120000)
</script>

<template>
  <div class="mx-auto transition-width">
    <a-layout class="relative font-sans">
      <a-layout>
        <a-layout-header class="5xl:container fixed z-99 mx-auto hidden w-full bg-white/75 backdrop-blur backdrop-filter md:block dark:bg-black/75">
          <LayoutHeader class="" />
        </a-layout-header>
        <a-layout class="ml-0 flex flex-col transition-margin !md:mt-14.5" :class="[sideFixed ? (smAndSmaller ? '!md:ml-0' : '!md:ml-60') : '!md:ml-0']">
          <a-layout-content id="layoutMain" class="relative h-full overflow-hidden">
            <slot />
          </a-layout-content>
        </a-layout>
        <a-layout-footer class="flex-0 hidden w-full md:block">
          <LayoutFooter />
        </a-layout-footer>
      </a-layout>
      <div class="fixed bottom-0 z-99 w-full px-0 md:hidden">
        <div
          class="relative z-15 mx-auto w-auto flex items-center border border-slate-2/55 rounded-0 bg-slate-1/95 py-1 text-slate-500 dark:border-slate-9/55 dark:bg-black/95 dark:text-slate-200"
        >
          <div class="flex flex-auto items-center justify-evenly">
            <a-button
              shape="circle" class="block !h-11 !w-11" type="text" aria-label="FavoriteList"
            >
              <template #icon>
                <span i-carbon-user-avatar class="" />
              </template>
            </a-button>
            <a-button
              shape="circle" class="block !h-11 !w-11" type="text" aria-label="Previous"
            >
              <template #icon>
                <span i-carbon-settings class="" />
              </template>
            </a-button>
          </div>
          <a-button
            long
            class="mx-auto mb-0 flex flex-none items-center justify-center rounded-full shadow-sm ring-1 ring-slate-900/5 -my-3 !h-15 !w-15 dark:text-slate-1 lg:-my-3"
            type="primary"
            shape="circle" @click="async() => await $router.push('/')"
          >
            <span i-carbon-home class="text-2xl" />
          </a-button>
          <div class="flex flex-auto items-center justify-evenly">
            <a-button
              shape="circle" class="block xl:block !h-11 !w-11" type="text" aria-label="Next"
            >
              <template #icon>
                <span i-carbon-earth class="" />
              </template>
            </a-button>
            <a-tooltip content="Toggle Dark mode" position="tr" mini>
              <a-button shape="circle" class="block !h-11 !w-11" type="text" @click="toggleDark()">
                <template #icon>
                  <span class="i-carbon-sun dark:i-carbon-moon block h-5 w-5 text-sm" />
                </template>
              </a-button>
            </a-tooltip>
          </div>
        </div>
      </div>
      <ClientOnly>
        <Draggable
          storage-key="vueuse-draggable" storage-type="session"
          class="fixed z-1001" :initial-value="{ x: windowWidth - 150, y: windowHeight - 150 }" :prevent-default="true"
        >
          <div ref="handle">
            <span class="absolute left--5px top--5px z-102 h-5 w-5 flex cursor-grab items-center justify-center rounded-full bg-blue-700 text-10px text-light-50 active:cursor-grabbing">
              <IconDragArrow />
            </span>
          </div>
          <a-trigger v-model:popupVisible="popupVisible" :trigger="[mdAndSmaller ? 'click' : 'hover']" position="top" class="cursor-grab !dark:[&_.arco-menu-item]:bg-dark-9">
            <div :class="`button-trigger ${popupVisible ? 'button-trigger-active' : ''}`">
              <span v-if="popupVisible" i-carbon-close />
              <span v-else i-carbon-overflow-menu-vertical />
            </div>
            <template #content>
              <a-menu
                :style="{ marginBottom: '-2px' }" mode="popButton" :tooltip-props="{ mini: true, position: 'left' }"
                show-collapse-button
              >
                <a-menu-item key="1">
                  <template #icon>
                    <IconBug />
                  </template>
                  Bugs
                </a-menu-item>
                <a-menu-item key="2">
                  <template #icon>
                    <IconBulb />
                  </template>
                  Ideas
                </a-menu-item>
              </a-menu>
            </template>
          </a-trigger>
        </Draggable>
      </ClientOnly>
    </a-layout>
  </div>
</template>

<style lang="less" scoped>
.button-trigger {
  @apply absolute cursor-pointer rounded-full z-101 items-center justify-center fixed text-sm flex h-40px w-40px text-zinc-100 bg-blue-600 shadow-md;
  transition: all 0.1s;
}
</style>
