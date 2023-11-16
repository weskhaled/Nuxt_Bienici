import { getBiens, insertMultiEstate } from '../services'

const filters = {
  filterType: 'buy',
  propertyType: ['house'],
  page: 0,
  sortBy: 'relevance',
  newProperty: true,
  sortOrder: 'desc',
  onTheMarket: [true],
  tileKeys: ['6_32_21', '6_33_21', '6_32_22', '6_33_22', '6_31_21', '6_31_22'],
  blurInfoType: ['disk', 'exact'],
  size: 2,
  pagination: {
    perPage: 100,
  },
}

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'GET') {
    const { data } = await getBiens(filters)
    // insertMultiEstate(data)
    return data
  }
})
