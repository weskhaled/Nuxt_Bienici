<script setup lang="ts">
import { UseDraggable as Draggable } from '@vueuse/components'

// import { promiseTimeout } from '@vueuse/core'
import { layoutBoxed, mdAndSmaller, sideFixed, smAndSmaller } from '~/common/stores/index'

const { width: windowWidth, height: windowHeight } = useWindowSize()

const popupVisible = ref(false)
const handle = ref<HTMLElement | null>(null)
// await promiseTimeout(120000)
</script>

<template>
  <div class="5xl:container mx-auto bg-light-1 shadow-md shadow-slate-2/25 transition-width dark:bg-dark-9 dark:shadow-slate-8/25" :class="[layoutBoxed ? 'md:container' : 'w-full']">
    <a-layout class="relative font-sans">
      <a-layout>
        <a-layout-header class="5xl:container fixed z-99 mx-auto w-full bg-white/75 backdrop-blur backdrop-filter dark:bg-black/75" :class="[layoutBoxed ? 'md:container' : 'w-full']">
          <LayoutHeader class="" />
        </a-layout-header>
        <a-layout class="ml-0 min-h-[calc(100vh-6.175rem)] flex flex-col transition-margin !mt-14.5" :class="[sideFixed ? (smAndSmaller ? '!md:ml-0' : '!md:ml-60') : '!md:ml-0']">
          <a-layout-content id="layoutMain" class="relative h-full">
            <slot />
          </a-layout-content>
        </a-layout>
        <a-layout-footer class="flex-0">
          <LayoutFooter />
        </a-layout-footer>
      </a-layout>

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
