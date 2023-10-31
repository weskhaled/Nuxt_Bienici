import { ofetch } from 'ofetch'

const url = 'https://www.bienici.com/realEstateAds-all.json'
const filters = {
  filterType: 'buy',
  propertyType: ['house', 'flat', 'loft', 'castle', 'townhouse'],
  page: 0,
  sortBy: 'relevance',
  newProperty: true,
  sortOrder: 'desc',
  onTheMarket: [true],
  tileKeys: ['6_32_21', '6_33_21', '6_32_22', '6_33_22', '6_31_21', '6_31_22'],
  blurInfoType: ['disk', 'exact'],
  size: 5,
}

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'GET') {
    const data = await ofetch(`${url}?filters=${encodeURIComponent(JSON.stringify(filters))}`, {
      method: 'GET',
    })

    return data
  }
  if (event.node.req.method === 'POST') {
    // delete a blog by id
    return 'success'
  }
})
