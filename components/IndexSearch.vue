<script setup lang="ts">
import { gql, useClientHandle } from '@urql/vue'
import { getManyPlaces } from '~/graphql/queries'
import 'swiper/css/scrollbar'
import 'swiper/css'

const emit = defineEmits(['popupVisibleChange', 'handleSearch'])
const { client: urqlClient } = useClientHandle()
const optionsPlaces = ref([])
const loadingPlaces = ref(false)
const filters = reactive(
  {
    filterType: 'RENT',
    zoneIds: [],
  },
)
function handleSearchPlaces(value: string) {
  if (value.length < 2) {
    optionsPlaces.value = []
    return
  }

  loadingPlaces.value = true
  urqlClient.executeQuery({
    key: 1,
    query: gql`${getManyPlaces}`,
    variables: { input: { q: value } },
  }, { requestPolicy: 'cache-and-network' })
    .then(({ data, error }) => {
      if (error) {
        console.error(error)
        optionsPlaces.value = []
      }

      else if (data) {
        if (data.getManyPlaces) {
          optionsPlaces.value = data.getManyPlaces.data?.map(item => ({
            value: item.name,
            label: item.name,
            extra: { postalCodes: item.postalCodes, zoneIds: item.zoneIds[0] },
          }))
        }
      }
      loadingPlaces.value = false
    })
}
function handleSearch() {
  emit('handleSearch', filters)
}
</script>

<template>
  <div
    class="relative z-2 ml-0 mt-7 max-w-xl w-full border border-zinc-5/10 rounded-2px bg-white/80 p-5 shadow-black/3 shadow-sm backdrop-blur dark:bg-zinc-9/70"
  >
    <button
      class="absolute right--6 top--6 z-2 block h-10 w-10 flex content-center justify-center border border-blue-8/20 bg-blue-6/90 backdrop-blur transition-all active:(border-blue-8 bg-blue-7/80) hover:bg-blue-7/90"
      @click="handleSearch"
    >
      <span i-carbon-search m-auto block text-sm leading-8 text-white class="icon-shadow" />
    </button>
    <div>
      <a-radio-group v-model="filters.filterType" class="font-medium" type="button" size="large">
        <a-radio value="BUY">
          Achat
        </a-radio>
        <a-radio value="RENT">
          Location
        </a-radio>
        <a-radio value="NEW">
          Neuf
        </a-radio>
        <a-radio value="TERRAIN">
          Terrain
        </a-radio>
      </a-radio-group>
    </div>
    <div class="mt-3">
      <div>
        <a-select
          v-model="filters.zoneIds"
          :trigger-props="{
            updateAtScroll: false,
            scrollToClose: true,
          }"
          size="large"
          class="w-4/6"
          placeholder="Saisissez une ville, un code postal ou un département"
          :scrollbar="true"
          allow-clear
          multiple :bordered="true"
          :loading="loadingPlaces"
          :filter-option="false" :show-extra-options="false"
          @popup-visible-change="(visible) => emit('popupVisibleChange', visible) "
          @search="handleSearchPlaces"
        >
          <a-option v-for="item of optionsPlaces" :key="item.value" :value="item" :label="item.label" />
        </a-select>
      </div>
      <div class="pt-3">
        <a href="javascript:;" class="text-3.8 font-medium text-blue-8 dark:text-blue-1" rel="noopener noreferrer" @click="$router.push('/search')">Ma dernière recherche</a>
      </div>
    </div>
  </div>
</template>
