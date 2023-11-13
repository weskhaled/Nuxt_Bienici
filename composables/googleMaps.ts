import { MarkerClusterer } from '@googlemaps/markerclusterer'
import type { CoreLibrary, MapsLibrary } from '@types/google.maps'
import { Loader } from '@googlemaps/js-api-loader'

function mapOptions(coreLibrary: CoreLibrary) {
  const center = new coreLibrary.LatLng({ lat: 48.9005423, lng: 2.3527788 })
  const zoom = 12.5

  return {
    zoom,
    minZoom: zoom - 12,
    maxZoom: zoom + 12,
    mapTypeControl: false,
    streetViewControl: true,
    center,
    fullscreenControl: false,
  }
}

export function useGoogleMaps(mapRef: Ref<HTMLElement | null>) {
  const googleMapsCoreApi: Ref<CoreLibrary | null> = ref(null)
  const googleMapsApi: Ref<CoreLibrary | null> = ref(null)
  const gMapsInstance: Ref<MapsLibrary | null> = ref(null)
  const mapTools: any = reactive({
    Marker: null,
    InfoWindow: null,
  })

  const runtimeConfig = useRuntimeConfig()
  const GOOGLE_API_KEY = runtimeConfig.public.GOOGLE_API_KEY

  onMounted(() => {
    if (!mapRef.value)
      return

    const loader = new Loader({
      apiKey: `${GOOGLE_API_KEY}`,
      version: 'weekly',
      libraries: ['places'],
    })

    loader
      .importLibrary('core')
      .then((coreApi) => {
        googleMapsCoreApi.value = coreApi
        mapTools.Marker = google.maps.Marker
        mapTools.InfoWindow = google.maps.InfoWindow
      }).then(() => {
        loader
          .importLibrary('maps')
          .then((googleMaps) => {
            gMapsInstance.value = new googleMaps.Map(mapRef.value, mapOptions(googleMapsCoreApi.value))
            googleMapsApi.value = googleMaps
          })
          .catch((e) => {
            console.error(e.message)
          })
      })
      .catch((e) => {
        console.error(e.message)
      })
  })

  return {
    googleMapsApi,
    googleMapsCoreApi,
    gMapsInstance,
    MarkerClusterer,
    mapTools,
  }
}
