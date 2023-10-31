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
const loader = new Loader({
  apiKey: 'AIzaSyArAlXAOzPVnONsf-0Uhh1hQ0XAPwGBtuM',
  version: 'weekly',
  libraries: ['places'],
})

export function useGoogleMaps(mapRef: Ref<HTMLElement | null>) {
  const googleMapsApi: Ref<CoreLibrary | null> = ref(null)
  const gMaps: Ref<MapsLibrary | null> = ref(null)

  onMounted(() => {
    if (!mapRef.value)
      return

    loader
      .importLibrary('core')
      .then((google) => {
        googleMapsApi.value = google
      }).then(() => {
        loader
          .importLibrary('maps')
          .then(({ Map }) => {
            gMaps.value = new Map(mapRef.value, mapOptions(googleMapsApi.value))
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
    gMaps,
  }
}
