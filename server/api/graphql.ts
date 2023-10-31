import { ApolloServer } from '@apollo/server'
import { startServerAndCreateH3Handler } from '@as-integrations/h3'
import { getBiens, getPlaces } from '../services'
import { schema } from '#graphql/schema'
import type { Resolvers } from '#graphql/resolver'

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
