import { ApolloServer } from '@apollo/server'
import { startServerAndCreateH3Handler } from '@as-integrations/h3'
import { getBiens, getPlaces } from '../services'
import type { Resolvers } from '#graphql/resolver'
import { schema } from '#graphql/schema'

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
  // context: ({ event }) => {
  //   const { headers } = event.node.req
  //   console.log(headers.authorization)
  // },
  // subscriptions: {
  //   'subscriptions-transport-ws': true,
  //   'graphql-ws': true,
  // },
})
