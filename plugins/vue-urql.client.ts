import urql, { cacheExchange, fetchExchange, gql, subscriptionExchange } from '@urql/vue'
import { authExchange } from '@urql/exchange-auth'
import { WebSocket } from 'ws'
import { createClient as createWSClient } from 'graphql-ws'
import { refreshToken, token } from '~/common/stores'

const API_WS_URL = 'ws://localhost:3000/api/graphql'

const REFRESH = gql`mutation($token: JWT!) {
  refreshToken(token: $token){
    accessToken
    refreshToken
  }
}`

const wsClient = createWSClient({
  webSocketImpl: WebSocket,
  url: API_WS_URL,
  connectionParams: () => {
    if (!token.value)
      return undefined
    return {
      authorization: `Bearer ${token.value}`,
    }
  },
})

const clientConfig = {
  url: `/api/graphql`,
  exchanges: [
    cacheExchange,
    authExchange(async (utils) => {
      return {
        addAuthToOperation(operation) {
          if (!token.value)
            return operation
          return utils.appendHeaders(operation, {
            'authorization': `Bearer ${token.value}`,
            'apollo-require-preflight': 'true',
          })
        },
        async refreshAuth() {
          if (!refreshToken.value)
            return

          const result = await utils.mutate(REFRESH, { token: refreshToken.value })

          if (result?.data?.refreshToken) {
            // Update our local variables and write to our storage
            token.value = result.data.refreshToken.accessToken
            refreshToken.value = result.data.refreshToken.refreshToken
          }
          else {
            // This is where auth has gone wrong and we need to clean up and redirect to a login page
            token.value = null
            refreshToken.value = null
          }
          window?.location?.reload()
        },
        didAuthError(error, _operation) {
          // if (error.graphQLErrors.some(e => e.extensions?.code === 'UNAUTHENTICATED')) {
          //   token.value = null
          //   refreshToken.value = null
          // }

          return error.graphQLErrors.some(e => e.extensions?.code === 'UNAUTHENTICATED')
        },
      }
    }),
    fetchExchange,
    subscriptionExchange({
      forwardSubscription(request) {
        const input = { ...request, query: request.query || '' }
        return {
          subscribe(sink) {
            const unsubscribe = wsClient.subscribe(input, sink)
            return { unsubscribe }
          },
        }
      },
    }),
  ],
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(urql, clientConfig)
})
