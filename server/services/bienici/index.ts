import { ofetch } from 'ofetch'

const config = useRuntimeConfig()
const API_BIEN_URL = config.public.API_BIEN_URL
const API_BIEN_SUGGEST = config.public.API_BIEN_SUGGEST

export async function getBiens(args?: any) {
  const filters = {
    filterType: args?.filters?.filterType ? `${args?.filters?.filterType}`.toLowerCase() : 'rent',
    propertyType: args?.filters?.propertyType ? args?.filters?.propertyType?.map(pt => pt.toLowerCase()) : ['house', 'flat', 'loft', 'castle', 'townhouse'],
    page: args?.pagination?.page || 0,
    sortBy: args?.sort?.key ? `${args?.sort?.key}`.toLowerCase() : 'relevance',
    sortOrder: `${args?.sort?.direction || 'DESC'}`.toLowerCase(),
    onTheMarket: [true],
    tileKeys: [],
    blurInfoType: ['disk', 'exact'],
    size: args?.pagination?.perPage || 24,
    from: (args?.pagination?.perPage || 24) * (args?.pagination?.page || 0),
    newProperty: args?.filters?.newProperty || false,
    zoneIdsByTypes: args?.filters?.zoneIdsByTypes || {},
  }
  const { realEstateAds, total } = await ofetch(`${API_BIEN_URL}?filters=${encodeURIComponent(JSON.stringify(filters))}`, {
    method: 'GET',
  })

  return {
    data: realEstateAds,
    total,
    perPage: filters.size,
    page: filters.page,
  }
}

export async function getPlaces(args?: any) {
  const filters = {
    q: args?.q ? `${args?.q}`.toLowerCase() : '',
  }
  const data = await ofetch(`${API_BIEN_SUGGEST}?q=${encodeURIComponent(JSON.stringify(filters))}`, {
    method: 'GET',
  })

  return {
    data,
    total: data.length,
  }
}
