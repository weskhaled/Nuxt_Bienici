import { getBiens } from '../services'

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
  if (event.node.req.method === 'GET')
    return await getBiens(filters)
})
