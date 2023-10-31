<script setup lang="ts">
const mapRef = ref<HTMLElement | null>(null)
const { gMaps } = useGoogleMaps(mapRef)

const layoutView = ref('MAP')
const viewInMap = ref(false)
const selectedBien: Ref<any> = ref(null)

function selectBien({ bien }: any) {
  selectedBien.value = bien
  if (layoutView.value === 'GALLERY' || !bien || !gMaps.value)
    return

  const { lat, lon: lng } = bien.blurInfo.position
  if (!lat || !lng)
    return

  gMaps.value?.panTo({ lat, lng })
  gMaps.value?.setZoom(20)
}
</script>

<template>
  <Suspense>
    <div class="relative h-full w-full flex overflow-hidden">
      <div
        class="relative top-0 z-5 h-[calc(100vh-6.175rem)] min-h-160 w-full flex transition-all duration-300 dark:text-light"
      >
        <div class="absolute left-0 top-0 z-4 mt--0 h-[calc(100vh-6.215rem)] flex transition-all" :class="[layoutView !== 'MAP' ? 'w-2/2' : 'w-2/2 md:w-2/6 lg:w-1/2 z-3', (layoutView === 'LIST' && selectedBien) && 'pr-70px']">
          <div id="maps" ref="mapRef" class="h-full min-h-full w-full flex" />
        </div>
        <div :class="[layoutView !== 'MAP' ? 'w-2/2' : 'md:w-4/6 lg:w-1/2', viewInMap ? 'translate-x-[calc(100%-70px)] shadow-md' : 'translate-x-0']" class="relative z-5 ml-auto w-full flex transition-all">
          <ClientOnly>
            <BienList v-model:layoutView="layoutView" v-model:viewInMap="viewInMap" v-model:selectedBien="selectedBien" @select-bien="selectBien" />
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
