<script setup lang="ts">
import { currentUser, sideFixed, sideHidden } from '~/common/stores/index'

const color = useColorMode()
const route = useRoute()
const router = useRouter()

const currentRoutePath = computed(() => route.path)
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

const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()
</script>

<template>
  <div class="h-14.5 flex items-center justify-between border-b border-zinc-3/30 px-2 md:ml-0 dark:border-zinc-6/30 dark:text-light">
    <div class="flex grow-0 items-center transition-width duration-300" :class="[sideFixed ? 'w-[calc(11.5rem-1px)]' : 'w-35 md:w-55']">
      <div class="ml--2 hidden h-full w-9 items-center justify-center md:w-12">
        <a-button type="text" @click="() => (sideHidden = false)">
          <template #icon>
            <span class="i-line-md-menu-fold-right" />
          </template>
        </a-button>
      </div>
      <a href="" class="relative" @click.prevent="async () => await $router.push('/')">
        <span
          class="flex items-center"
        >
          <img class="h-35px" src="https://www.bienici.com/cacheForever/13b6e34a7173148f77fcdb0f45e2657a5e2788c3/logos/logo_bienici_halloween.svg" alt="">
        </span>
      </a>
    </div>
    <div class="header-menu [--primary-6:var(--gray-9)] flex grow-1 justify-end md:justify-between">
      <div class="flex-1 border-l border-zinc-4/20 ![&_.arco-menu]:bg-transparent">
        <a-menu class="![&_.arco-menu-item:not(:hover)]:bg-transparent !dark:[&_.arco-menu-item]:text-light" mode="horizontal" :theme="color.value === 'dark' ? 'dark' : 'light'" :default-selected-keys="[currentRoutePath]">
          <a-menu-item key="/" @click="async() => await $router.push('/')">
            Accueil
          </a-menu-item>
          <a-menu-item key="/search" @click="async() => await $router.push('/search')">
            <span md:flex>
              <span font-normal>Commencez votre <span class="font-semibold">
                recherche
              </span>
              </span>
            </span>
          </a-menu-item>
        </a-menu>
      </div>
      <div class="items-center border-l border-zinc-4/20 px-2 !hidden md:flex space-x-1">
        <a-button class="px-2" size="medium" :type="currentRoutePath === '/' ? 'primary' : 'text'" @click="async() => await $router.push('/')">
          <span text-sm md:flex>
            <span font-normal>Accueil</span>
          </span>
        </a-button>
        <a-button class="px-2" size="medium" :type="currentRoutePath === '/search' ? 'primary' : 'text'" @click="async() => await $router.push('/search')">
          <span text-sm md:flex>
            <span font-normal>Commencez votre <span class="font-semibold">
              recherche
            </span>
            </span>
          </span>
        </a-button>
      </div>
      <div class="flex items-center space-x-1">
        <a-button class="" type="text" @click.stop="async() => await toggleFullscreen()">
          <template #icon>
            <span :class="[isFullscreen ? 'i-carbon-minimize' : 'i-carbon-center-to-fit']" />
          </template>
        </a-button>
        <div class="hidden items-center border-x border-zinc-4/20 px-2 md:flex">
          <a-badge :count="9" dot :offset="[-22, 5]" class="[&>.arco-badge-custom-dot]:overflow-visible">
            <template #content>
              <span class="pointer-events-none relative block h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_0_1px_var(--color-bg-2)]">
                <span class="absolute left--0.25 top--0.25 block h-2 w-2 inline-flex animate-ping rounded-full bg-green-400 opacity-75" />
              </span>
            </template>
            <a-trigger trigger="click" show-arrow :popup-translate="[130, 5]" class="!fixed !top-12 [&_.arco-trigger-arrow]:bg-zinc-4/20">
              <a-button shape="circle" class="mx-1" size="small" type="text">
                <template #icon>
                  <span i-carbon-earth-filled />
                </template>
              </a-button>
              <template #content>
                <div class="min-w-75 border-1px border-zinc-4/20 rounded-2px bg-white shadow dark:bg-dark-9">
                  <div flex items-center justify-between p-2 class="border-b border-zinc-4/20 bg-zinc-4/5">
                    <h3 class="text-3">
                      Notifications
                    </h3>
                    <a-button class="text-3" size="mini" type="text">
                      Read All
                    </a-button>
                  </div>
                  <div class="relative min-h-45 flex overflow-hidden overflow-y-scroll">
                    <a-empty class="flex flex-col justify-center" />
                  </div>
                </div>
              </template>
            </a-trigger>
          </a-badge>
        </div>
        <a-tooltip content="Toggle Dark mode" position="br" mini>
          <a-button class="px-2" type="text" @click="toggleDark()">
            <template #icon>
              <span class="i-carbon-sun dark:i-carbon-moon mx-1 block h-4 w-4 text-sm" />
            </template>
          </a-button>
        </a-tooltip>
        <div class="border-l border-zinc-4/20 pl-1">
          <a-dropdown trigger="hover">
            <a-button class="px-2" type="text">
              <span class="flex items-center">
                <span class="i-carbon-user-avatar-filled mr-1 inline-block h-4 w-4 text-sm leading-30px" />
                <span sm:inline-block>
                  {{ currentUser ? currentUser?.nickname : 'Nom, Prénom' }}
                </span>
                <span class="i-carbon-chevron-down ml-0.5 inline-block h-3 w-3 text-sm leading-30px" />
              </span>
            </a-button>
            <template #content>
              <a-doption>
                <template #icon>
                  <span class="text-md i-carbon-calculation inline-block h-5 w-5 leading-30px" />
                </template>
                <template #default>
                  Estimer la valeur d’un bien
                </template>
              </a-doption>
              <a-doption>
                <template #icon>
                  <span class="text-md i-carbon-virtual-column-key inline-block h-5 w-5 leading-30px" />
                </template>
                <template #default>
                  Vendre ou louer un bien
                </template>
              </a-doption>
              <a-doption>
                <template #icon>
                  <span class="text-md i-carbon-favorite inline-block h-5 w-5 leading-30px" />
                </template>
                <template #default>
                  Mes favoris
                </template>
              </a-doption>
              <a-doption>
                <template #icon>
                  <span class="text-md i-carbon-notification inline-block h-5 w-5 leading-30px" />
                </template>
                <template #default>
                  Mes alertes
                </template>
              </a-doption>
              <a-doption>
                <template #icon>
                  <span class="text-md i-carbon-logout inline-block h-5 w-5 leading-30px" />
                </template>
                <template #default>
                  Se connecter
                </template>
              </a-doption>
            </template>
          </a-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
header {
  .arco-btn-text, .arco-btn-text[type='button'], .arco-btn-text[type='submit'] {
    color: inherit!important;
  }
}
// :deep(.arco-menu-horizontal .arco-menu-inner) {
//   @apply !p-0;
// }
// .demo-arrow {
//   box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
//   padding: 10px;
//   width: 200px;
//   background-color: var(--color-bg-popup);
//   border-radius: 4px;
// }
</style>
