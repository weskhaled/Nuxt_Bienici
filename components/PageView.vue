<script setup lang="ts">
import { gql, useQuery } from '@urql/vue'

// const { client: urqlClient } = useClientHandle()
const { data } = await useFetch('/api/pageview')

const queryGetManyBiens = gql`
query getManyBiens($input: GetManyInput) {
  getManyBiens(input: $input) {
    total
    page
    perPage
    data {
      city
      price
      yearOfConstruction
      surfaceArea
      blurInfo {
        position {
          lat
          lon
        }
      }
    }
  }
}`

const getManyBiens = useQuery({
  query: queryGetManyBiens,
  variables: {
    input: {
      sort: { direction: 'ASC', key: 'PRICE' },
      pagination: {
        page: 0,
        perPage: 50,
      },
      filters: {
        propertyType: [],
      },

    },
  },
})

async function getData() {
  const { data, error } = await getManyBiens.executeQuery()

  console.log(error?.value)
  console.log(data?.value?.getManyBiens?.data)
}

const time = useTimeAgo(() => data.value?.startAt || 0)
</script>

<template>
  <div text-gray:80>
    <span font-500 text-gray>{{ data?.pageview }}</span>
    page views since
    <span text-gray>{{ time }}</span>
    <a-space>
      <a-button type="primary" @click="getData()">
        getData
      </a-button>
      <a-button>Secondary</a-button>
      <a-button type="dashed">
        Dashed
      </a-button>
      <a-button type="outline">
        Outline
      </a-button>
      <a-button type="text">
        Text
      </a-button>
    </a-space>
  </div>
</template>
