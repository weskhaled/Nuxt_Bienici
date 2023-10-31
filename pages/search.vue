<script setup lang="ts">
const mapRef = ref<HTMLElement | null>(null)
const { gMaps } = useGoogleMaps(mapRef)

const layoutView = ref('MAP')
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
      <div class="to-0 absolute left-0 z-4 mt--0 h-[calc(100vh-6.215rem)] flex transition-all" :class="[layoutView !== 'MAP' ? 'delay-0 w-2/2' : 'delay-0 w-2/2 sm:w-1/2 z-6', (layoutView === 'LIST' && selectedBien) && 'pr-70px']">
        <div id="maps" ref="mapRef" class="h-full min-h-full w-full flex" />
      </div>
      <ClientOnly>
        <BienList v-model:layoutView="layoutView" v-model:selectedBien="selectedBien" @select-bien="selectBien" />
      </ClientOnly>
    </div>
    <template #fallback>
      <div h-full w-full italic op50>
        <span animate-pulse>Loading...</span>
      </div>
    </template>
  </Suspense>
</template>
