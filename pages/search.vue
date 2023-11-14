<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'

const mapRef = ref<HTMLElement | null>(null)
const { googleMapsApi, gMapsInstance, googleMapsCoreApi, MarkerClusterer, mapTools } = useGoogleMaps(mapRef)

let infoWindow: any = null
let markerClusterer: any = null
let markers: any = []
let latlngbounds: any = null

const bienLocalizations: Ref<any> = ref([])
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

function deleteMarkers() {
  markers.forEach((marker) => {
    marker.setMap(null)
  })

  markers = []
}

function reinsertMarkers() {
  if (markerClusterer) {
    markerClusterer.clearMarkers()
    markerClusterer.addMarkers(markers)
  }
}

async function initMarkerClusterer() {
  deleteMarkers()
  latlngbounds = new googleMapsCoreApi.value.LatLngBounds()

  markers = bienLocalizations.value?.map((bien) => {
    const position = new googleMapsCoreApi.value.LatLng(Number.parseFloat(bien.position.lat), Number.parseFloat(bien.position.lon))
    const marker = new mapTools.Marker({
      position,
      // icon: 'https://api.iconify.design/emojione-v1:house.svg?color=%23ffffff&width=30px',
      opacity: 1,
      map: gMapsInstance.value,
    })

    marker.addListener('click', () => {
      // selectedBienId.value === hotel.id ? (selectedBienId.value = null) : (selectedBienId.value = hotel.id)
      // if (!selectedBienId.value) {
      //   infoWindow?.close()
      //   return
      // }

      infoWindow.setContent(`
          <h3 class="font-semibold text-sm text-gray-8 mb-1">${bien.price}€</h3>
        `)
      infoWindow.open({
        anchor: marker,
        map: gMapsInstance.value,
        shouldFocus: true,
      })
    })
    latlngbounds?.extend(position)
    return marker
  })

  if (!markerClusterer) {
    markerClusterer = new MarkerClusterer({ markers })
    markerClusterer.setMap(gMapsInstance.value)
  }
  else {
    reinsertMarkers()
  }

  gMapsInstance.value.setCenter(latlngbounds.getCenter())
  gMapsInstance.value.fitBounds(latlngbounds)
}

watch([() => googleMapsApi.value, () => bienLocalizations.value], () => {
  if (googleMapsApi.value)
    initMarkerClusterer()
})

watchOnce(() => googleMapsApi.value, (value) => {
  if (value) {
    infoWindow = new mapTools.InfoWindow({
      content: '',
      disableAutoPan: true,
    })

    latlngbounds = new googleMapsCoreApi.value.LatLngBounds()
  }
})
watch(() => layoutView.value, () => {
  selectedBien.value = null
  viewInMap.value = false
})
function selectBien({ bien }: any) {
  selectedBien.value = bien
  if (!bien || !gMapsInstance.value)
    return

  const { lat, lon: lng } = bien.blurInfo.position
  if (!lat || !lng)
    return

  gMapsInstance.value?.panTo({ lat, lng })
  gMapsInstance.value?.setZoom(18)
}
</script>

<template>
  <Suspense>
    <div class="relative h-full w-full flex overflow-hidden">
      <div
        class="relative top-0 z-5 h-[calc(100vh-3.625rem)] min-h-140 w-full flex transition-all duration-300 md:h-[calc(100vh-6.175rem)] dark:text-light !transition-color-0"
      >
        <div class="bg-balack-4 absolute left-0 top-0 z-4 mt--0 h-[calc(100vh-6.215rem)] flex transition-all" :class="[layoutView !== 'MAP' ? 'w-2/2' : 'w-2/2 md:w-2/6 lg:w-1/2 z-3', viewInMap && (layoutView === 'MAP' ? 'lt-md:pb-70px' : 'pr-50px'), layoutView === 'MAP' ? (viewInMap ? 'lt-md:h-full' : 'lt-md:h-40%') : 'lt-md:h-full']">
          <div id="maps" ref="mapRef" class="h-full min-h-full w-full flex overflow-hidden rounded-2px shadow-sm" />
        </div>
        <div :class="[layoutView !== 'MAP' ? 'w-2/2' : 'md:w-4/6 lg:w-1/2', layoutView === 'MAP' && 'lt-md:top-40% lt-md:h-60%', viewInMap ? (layoutView === 'MAP' ? 'lt-md:translate-y-[calc(100%-70px)] shadow-md' : 'translate-x-[calc(100%-50px)] shadow-md') : 'translate-0']" class="relative z-5 ml-auto w-full flex transition-all-200">
          <ClientOnly>
            <BienList v-model:bienLocalizations="bienLocalizations" v-model:filters-query="filters" v-model:layoutView="layoutView" v-model:viewInMap="viewInMap" v-model:selectedBien="selectedBien" @select-bien="selectBien" />
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
