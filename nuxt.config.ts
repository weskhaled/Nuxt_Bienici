import process from 'node:process'
import { vitePluginForArco } from '@arco-plugins/vite-vue'
import { pwa } from './config/pwa'
import { appDescription } from './constants/index'

export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@vite-pwa/nuxt',
    '@nuxt/devtools',
    'nuxt-graphql-server',
  ],

  runtimeConfig: {
    public: {
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
      API_BIEN_URL: process.env.API_BIEN_URL,
      API_BIEN_SUGGEST: process.env.API_BIEN_SUGGEST,
    },
  },

  graphqlServer: {
    url: '/api/graphql',
    schema: './server/**/*.graphql',
    codegen: {
      // Map your internal enum values to your GraphQL's enums.
      enumValues: '~/graphql/enums/index',

      // Map your internal enum values to your GraphQL's enums.
      scalars: '~/graphql/scalars/index',

      // Make use of your custom GraphQL Context type and let codegen use it so that the
      // generated resolvers automatically makes use of it.
      contextType: '~/server/graphql/GraphQLContext#GraphQLContext',

      // Change the naming convention of your enum keys
      namingConvention: {
        enumValues: 'change-case-all#lowerCase',
      },

      // ... and many more, refer to the plugin docs!
    },
  },

  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    inlineSSRStyles: false,
    renderJsonPayloads: true,
    typedPages: true,
  },

  css: [
    '@unocss/reset/tailwind.css',
  ],

  colorMode: {
    classSuffix: '',
  },

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
        tsconfigRaw: {
          compilerOptions: {
            experimentalDecorators: true,
          },
        },
      },
    },

    prerender: {
      crawlLinks: false,
      routes: ['/'],
      ignore: ['/search'],
    },
  },

  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/nuxt.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: appDescription },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
    },
  },

  pwa,

  devtools: {
    enabled: false,
  },

  vite: {
    plugins: [
      // https://github.com/arco-design/arco-plugins/blob/main/packages/plugin-vite-vue/README.md
      vitePluginForArco({
        style: true,
        modifyVars: {
          'arcoblue-6': '#00aaff',
        },
      }),
    ],
    optimizeDeps: {
      include: [
        '@arco-design/web-vue',
      ],
    },
  },

  devServer: {
    port: 3333,
  },

  build: {
    transpile: ['@arco-design/web-vue', '@googlemaps/js-api-loader'],
  },
})
