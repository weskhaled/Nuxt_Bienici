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
    class="relative z-2 ml-0 max-w-xl w-full border border-zinc-5/10 rounded-2px bg-white/80 p-5 shadow-black/3 shadow-sm backdrop-blur md:mt-7 dark:bg-black/80"
  >
    <div>
      <a-radio-group v-model="filters.filterType" class="font-medium lt-md:w-full" type="button" size="medium">
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
    <div class="mt-2">
      <div class="w-full flex flex-col">
        <div class="flex-1">
          <a-select
            v-model="filters.zoneIds"
            :trigger-props="{
              updateAtScroll: false,
              scrollToClose: true,
            }"
            size="medium"
            class="font-medium md:w-full !lt-md:[&_.arco-select-view-input]:max-w-220px"
            placeholder="Saisissez une ville, un code postal ou un département"
            :scrollbar="true"
            :max-tag-count="3"
            allow-clear
            multiple :bordered="true"
            :loading="loadingPlaces"
            :filter-option="false" :show-extra-options="false"
            @popup-visible-change="(visible) => emit('popupVisibleChange', visible) "
            @search="handleSearchPlaces"
          >
            <a-option v-for="item of optionsPlaces" :key="item.extra?.id || item.name" :value="item" :label="item.label" />
          </a-select>
        </div>
        <div class="flex-0">
          <button
            class="right--6 top--6 z-2 ml-auto mt-2 h-8 w-auto flex flex content-center items-center justify-center border border-blue-8/20 rounded-1px bg-blue-6/90 px-3 backdrop-blur transition-all md:absolute md:h-9 active:(border-blue-8 bg-blue-7/80) hover:bg-blue-7/90"
            @click="handleSearch"
          >
            <span class="mr-2 text-4 font-400 text-light-1 md:block">Recherche</span>
            <span i-carbon-search m-auto block text-sm leading-8 text-white class="icon-shadow" />
          </button>
        </div>
      </div>
      <div class="pt-3">
        <a href="javascript:;" class="text-3.8 font-medium font-general text-blue-8 dark:text-blue-1" @click="$router.push('/search')">Ma dernière recherche</a>
      </div>
    </div>
  </div>
</template>
