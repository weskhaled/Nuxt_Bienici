import { ofetch } from 'ofetch'
import { ApolloServer } from '@apollo/server'
import { startServerAndCreateH3Handler } from '@as-integrations/h3'
import { schema } from '#graphql/schema'
import type { Resolvers } from '#graphql/resolver'

const url = 'https://www.bienici.com/realEstateAds-all.json'
const url_suggest = 'https://res.bienici.com/suggest.json'
async function getBiens(args?: any) {
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
  const { realEstateAds, total } = await ofetch(`${url}?filters=${encodeURIComponent(JSON.stringify(filters))}`, {
    method: 'GET',
  })

  return {
    data: realEstateAds,
    total,
    perPage: filters.size,
    page: filters.page,
  }
}
async function getPlaces(args?: any) {
  const filters = {
    q: args?.q ? `${args?.q}`.toLowerCase() : '',
  }
  const data = await ofetch(`${url_suggest}?q=${encodeURIComponent(JSON.stringify(filters))}`, {
    method: 'GET',
  })

  return {
    data,
    total: data.length,
  }
}

const resolvers: Resolvers = {
  Query: {
    getManyBiens: async (_, args) => {
      const { input } = args
      return await getBiens(input)
    },
    getManyPlaces: async (_, args) => {
      const { input } = args

      return await getPlaces(input)
    },
  },
}
const apollo = new ApolloServer({ typeDefs: schema, resolvers })
export default startServerAndCreateH3Handler(apollo, {
  // context: (event) => {
  //   console.log(event)
  // },
})
