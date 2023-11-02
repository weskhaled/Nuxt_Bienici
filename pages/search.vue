<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'

const mapRef = ref<HTMLElement | null>(null)
const { gMaps } = useGoogleMaps(mapRef)

const filtersQuery = useRouteQuery('filters', '')
const filters = computed(() => {
  try {
    return JSON.parse(decodeURIComponent(filtersQuery.value))
  }
  catch (error) {
    return {}
  }
})
const layoutView = ref('MAP')
const viewInMap = ref(false)
const selectedBien: Ref<any> = ref(null)

function selectBien({ bien }: any) {
  selectedBien.value = bien
  if (!bien || !gMaps.value)
    return

  const { lat, lon: lng } = bien.blurInfo.position
  if (!lat || !lng)
    return

  gMaps.value?.panTo({ lat, lng })
  gMaps.value?.setZoom(19)
}
</script>

<template>
  <Suspense>
    <div class="relative h-full w-full flex overflow-hidden">
      <div
        class="relative top-0 z-5 h-[calc(100vh-3.6rem)] min-h-160 w-full flex transition-all duration-300 md:h-[calc(100vh-6.175rem)] dark:text-light !transition-color-0"
      >
        <div class="absolute left-0 top-0 z-4 mt--0 h-[calc(100vh-6.215rem)] flex transition-all" :class="[layoutView !== 'MAP' ? 'w-2/2' : 'w-2/2 md:w-2/6 lg:w-1/2 z-3', viewInMap && (layoutView === 'MAP' ? 'lt-md:pb-40px' : 'lt-md:pr-50px'), layoutView === 'MAP' ? (viewInMap ? 'lt-md:h-full' : 'lt-md:h-40%') : 'lt-md:h-full']">
          <div id="maps" ref="mapRef" class="h-full min-h-full w-full flex" />
        </div>
        <div :class="[layoutView !== 'MAP' ? 'w-2/2' : 'md:w-4/6 lg:w-1/2', layoutView === 'MAP' && 'lt-md:top-40% lt-md:h-60%', viewInMap ? (layoutView === 'MAP' ? 'lt-md:translate-y-[calc(100%-40px)] shadow-md' : 'translate-x-[calc(100%-50px)] shadow-md') : 'translate-0']" class="relative z-5 ml-auto w-full flex transition-all-200">
          <ClientOnly>
            <BienList v-model:filters-query="filters" v-model:layoutView="layoutView" v-model:viewInMap="viewInMap" v-model:selectedBien="selectedBien" @select-bien="selectBien" />
          </ClientOnly>
        </div>
      </div>
    </div>
    <template #fallback>
      <div h-full w-full italic op50>
        <span animate-pulse>Loading...</span>
      </div>
    </template>
  </Suspense>
</template>
