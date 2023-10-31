import type { CoreLibrary, MapsLibrary } from '@typesgoogle.maps'
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
  const googleMapsApi: Ref<CoreLibrary | null> = ref(null)
  const gMaps: Ref<MapsLibrary | null> = ref(null)
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
