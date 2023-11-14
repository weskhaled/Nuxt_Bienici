<script setup lang='ts'>
import { gql, useClientHandle } from '@urql/vue'
import { UseImage } from '@vueuse/components'
import { FilterType, KeySort, PropertyType, getManyPlaces, queryGetManyBiens } from '~/graphql/queries'
import { mdAndLarger, mdAndSmaller } from '~/common/stores'

interface Props {
  layoutView?: string
  selectedBien?: any
  viewInMap?: boolean
  filtersQuery?: any
  bienLocalizations?: []
  selectedBienId?: any
}

const props = withDefaults(defineProps<Props>(), {
  layoutView: () => 'LIST',
  selectedBien: () => null,
  viewInMap: () => false,
  filtersQuery: () => {},
  bienLocalizations: () => [],
  selectedBienId: () => null,
})

const emit = defineEmits(['selectBien', 'update:layoutView', 'update:selectedBien', 'update:viewInMap', 'update:bienLocalizations'])

const { layoutView, selectedBien, selectedBienId, viewInMap, filtersQuery, bienLocalizations } = useVModels(props, emit)

const { client: urqlClient } = useClientHandle()

const { height: windowHeight } = useWindowSize()
const listBienRef = ref<HTMLElement | null>(null)
const { y: yListBienRef } = useScroll(listBienRef)

const variables: Ref<any> = ref({
  input: {
    sort: { direction: 'DESC', key: 'RELEVANCE' },
    pagination: {
      page: 0,
      perPage: 24,
    },
    filters: {
      propertyType: ['TERRAIN'].includes(filtersQuery?.value.filterType) ? [filtersQuery.value?.filterType] : [],
      filterType: ['RENT', 'BUY'].includes(filtersQuery?.value.filterType) ? filtersQuery.value?.filterType : 'BUY',
      zoneIdsByTypes: { zoneIds: filtersQuery.value.zoneIds?.map(z => z.extra.zoneIds) || [] },
      newProperty: filtersQuery.value.filterType === 'NEW',
    },
  },
})
const columns = [
  {
    title: 'City',
    dataIndex: 'city',
    width: 280,
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
  },
  {
    title: 'RoomsQuantity',
    dataIndex: 'roomsQuantity',
    width: 740,
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
  },
  {
    title: 'Price',
    dataIndex: 'price',
    width: 740,
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
  },
  {
    title: 'Date de construction',
    dataIndex: 'yearOfConstruction',
    width: 700,
  },
  {
    title: 'Surface',
    dataIndex: 'surfaceArea',
    width: 200,
  },
  {
    title: 'Actions',
    slotName: 'actions',
    fixed: 'right',
    width: 125,
  },
]
const userLang = ref('fr-FR')
const rangeBudget = ref([10, 20])
const visibleDrawer = ref(false)
const visibleImg = ref(false)
const currentImg = ref(0)
const srcListImgs = ref([])
const optionsPlaces = ref([])
const loadingPlaces = ref(false)
const errorBiens = ref(null)
const listBiens: Ref<any[]> = ref([])
const total = ref(0)
const isFetching = ref(true)
const toggleViewInMap = useToggle(viewInMap)
const filters = reactive(
  {
    size: 24,
    from: 0,
    optionsPlaceValue: filtersQuery.value?.zoneIds || [],
    showAllModels: false,
    filterType: ['RENT', 'BUY', 'NEW'].includes(filtersQuery?.value.filterType) ? filtersQuery.value?.filterType : (filtersQuery?.value.filterType === 'TERRAIN' ? 'BUY' : 'RENT'),
    propertyType: ['TERRAIN'].includes(filtersQuery?.value.filterType) ? [filtersQuery.value?.filterType] : [],
    minPrice: 0,
    maxPrice: 0,
    minRooms: 1,
    maxRooms: 3,
    page: 1,
    sortBy: 'RELEVANCE',
    sortOrder: 'DESC',
    onTheMarket: [true],
    newProperty: false,
    blurInfoType: ['disk', 'exact'],
  },
)
const contentDataRef: Ref<HTMLElement | null> = ref(null)
const { width: widthContentDataRef, height: heightContentDataRef } = useElementSize(contentDataRef)
function handleSearch(value: string) {
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
            value: item.id,
            label: item.name,
            extra: { postalCodes: item.postalCodes, zoneIds: item.zoneIds[0] },
          }))
        }
      }
      loadingPlaces.value = false
    })
}

async function getData(variables: any) {
  isFetching.value = true
  errorBiens.value = null
  selectedBien.value = null
  urqlClient.executeQuery({
    key: 1,
    query: gql`${queryGetManyBiens}`,
    variables,
  }, { requestPolicy: 'cache-and-network' }).then(({ data, error }) => {
    if (error) { errorBiens.value = error }

    else if (data) {
      if (data.getManyBiens) {
        isFetching.value = false
        const { getManyBiens } = data
        if (getManyBiens) {
          listBiens.value = getManyBiens.data
          total.value = getManyBiens.total
          bienLocalizations.value = getManyBiens.data.map(b => ({
            id: b.id,
            city: b.city,
            price: b.price,
            position: b.blurInfo?.position,
          }))
        }
      }
    }
  })
}

getData(variables.value)

watchDebounced(
  filters,
  (value) => {
    variables.value = {
      input: {
        sort: { direction: value.sortOrder, key: value.sortBy },
        pagination: {
          page: value.page - 1,
          perPage: value.size,
        },
        filters: {
          propertyType: value.propertyType,
          filterType: value.filterType === 'RENT' ? 'RENT' : 'BUY',
          newProperty: value.filterType === 'NEW',
          zoneIdsByTypes: { zoneIds: filters.optionsPlaceValue.map(item => item.extra?.zoneIds) },
        },
      },
    }
    getData(variables.value)
  },
  { debounce: 200, maxWait: 1000 },
)

watch(() => selectedBienId.value, (val) => {
  if (!val) {
    selectedBien.value = null
  }

  else {
    selectedBien.value = listBiens.value.find(b => b.id === val) || null
    const el = document.getElementById(val)
    if (el) {
      const { top } = useElementBounding(el)
      yListBienRef.value += (top.value - (mdAndLarger.value ? 150 : (windowHeight.value * 0.4 + 68)))
    }
  }
})
</script>

<template>
  <template v-if="viewInMap">
    <div v-if="layoutView !== 'MAP' || mdAndSmaller" class="absolute right-0 top-0 z-21 h-full w-full bg-light/50 transition-all duration-400 dark:bg-black/70" @click="toggleViewInMap()" />

    <div class="absolute z-9" :class="[layoutView === 'MAP' ? 'left-0 top--10' : 'left--3rem top-0']">
      <a-tooltip content="Toggle Map" position="br" mini>
        <a-button class="px-2 shadow-md !h-10 !w-12 !rounded-0 !border-none !bg-white !dark:bg-black" block @click="toggleViewInMap()">
          <template #icon>
            <span :class="[layoutView === 'MAP' ? 'i-carbon-arrow-up' : 'i-carbon-arrow-left']" class="mx-1 block h-6 w-6" />
          </template>
        </a-button>
      </a-tooltip>
    </div>
  </template>
  <div
    class="top-0 z-10 h-full w-full flex flex-col overflow-hidden p-0" :class="[layoutView === 'MAP' && 'lt-md:rounded-t-md']"
  >
    <div
      class="relative h-full w-full flex-1 overflow-hidden border-gray/25 rounded-0 bg-white/95 shadow-black/10 shadow-sm dark:bg-dark-8/95"
      :class="[layoutView === 'MAP' && 'border-l-1px']"
    >
      <div class="header flex flex-none items-center justify-between bg-slate-1 p-2 leading-6.5 dark:bg-dark-4">
        <div class="flex items-center text-3.5">
          {{ filters.filterType === 'RENT' ? 'Location' : 'Achat' }}
        </div>
        <div class="flex items-center space-x-1">
          <a-button :type="layoutView === 'MAP' ? 'primary' : 'text'" size="mini" @click="() => layoutView = 'MAP'">
            <i class="i-carbon-choropleth-map mr-1" />
            Carte
          </a-button>
          <a-button :type="layoutView === 'LIST' ? 'primary' : 'text'" size="mini" @click="() => layoutView = 'LIST'">
            <i class="i-carbon-list mr-1" />
            Liste
          </a-button>
          <a-button :type="layoutView === 'GALLERY' ? 'primary' : 'text'" size="mini" @click="() => layoutView = 'GALLERY'">
            <i class="i-carbon-image mr-1" />
            Galerie
          </a-button>
        </div>
      </div>
      <div ref="listBienRef" class="content h-[calc(100%-2.585rem)] w-full flex flex-1 flex-col overflow-auto">
        <div class="flex-none px-2 py-1">
          <div class="flex flex-col md:flex-row space-y-1 md:space-x-1 md:space-y-0">
            <a-select v-model="filters.filterType" class="w-full !md:max-w-40" placeholder="Votre projet" :bordered="true">
              <a-option v-for="t in FilterType" :key="t" :value="t">
                <span>{{ t }}</span>
              </a-option>
            </a-select>
            <a-select
              v-model="filters.optionsPlaceValue"
              :max-tag-count="2"
              placeholder="Saisissez une ville, un code postal ou un département"
              :scrollbar="true"
              allow-clear multiple :bordered="true"
              :loading="loadingPlaces" :filter-option="false" :show-extra-options="false"
              @search="handleSearch"
            >
              <a-option v-for="item of optionsPlaces" :key="item.value" :value="item" :label="item.label" />
            </a-select>
          </div>
          <div class="mt-1 flex space-x-1">
            <div class="w-full md:w-2/6">
              <a-select
                v-model="filters.propertyType" class="md:w-full" :default-value="[]" placeholder="Type de bien" multiple
                :scrollbar="true" allow-clear :max-tag-count="2"
              >
                <a-option v-for="pt in PropertyType" :key="pt" :value="pt">
                  {{ pt.toLowerCase() }}
                </a-option>
              </a-select>
            </div>
            <div class="hidden md:w-full md:flex md:flex-1 md:space-x-1">
              <a-trigger trigger="click" show-arrow>
                <a-button class="w-1/3">
                  <span class="text-3">
                    Budget
                  </span>
                </a-button>
                <template #content>
                  <div class="demo-arrow w-80 p-2">
                    <div class="m--2 bg-gray/10 p-1 text-3.5/7 font-sans dark:text-light">
                      Budget
                    </div>
                    <div class="pt-4">
                      <a-slider
                        v-model:value="rangeBudget" :default-value="[10, 20]" range
                        :format-tooltip="(value) => `${Intl.NumberFormat(userLang, { style: 'currency', currency: 'EUR' }).format(Math.round((value / 50) * 10000))}`"
                      />
                    </div>
                  </div>
                </template>
              </a-trigger>
              <a-trigger trigger="click" show-arrow>
                <a-button class="w-1/3">
                  1 à 3 pièces
                </a-button>
                <template #content>
                  <div class="demo-arrow w-80 p-2">
                    <a-empty />
                  </div>
                </template>
              </a-trigger>
              <a-trigger trigger="click" show-arrow>
                <a-button class="w-1/3">
                  Surface
                </a-button>
                <template #content>
                  <div class="demo-arrow w-80 p-2">
                    <a-empty />
                  </div>
                </template>
              </a-trigger>
            </div>
          </div>
          <div class="mt-1 flex justify-between">
            <a-button type="primary" size="small" class="flex items-center px-1.5" @click="() => visibleDrawer = true">
              <span class="hidden sm:block">
                Afficher tous les critères
              </span>
              <span class="i-carbon-add ml-0.5 h-5 w-4" />
            </a-button>
            <a-button type="primary" status="danger" size="small" class="px-1.5">
              <i class="i-carbon-notification mr-1" />
              <span class="hidden sm:block">
                Créer une alerte
              </span>
            </a-button>
          </div>
        </div>
        <div class="flex-1 bg-white dark:bg-dark-3">
          <div class="sticky top-0 z-30 bg-slate-1/90 shadow-[0_0_0_1px_var(--color-bg-3)] shadow-sm backdrop-blur backdrop-filter dark:bg-dark-8/95">
            <div class="flex items-center justify-between p-2">
              <h4 class="sm:flex-0 overflow-hidden truncate">
                {{ total || 0 }} {{ filters.filterType === 'RENT' ? 'Location' : 'Achat' }} en&nbsp;
                <span v-if="filters.optionsPlaceValue.length">
                  {{ filters.optionsPlaceValue.map(s => s.label).join(', ') }}
                </span>
                <span v-else>
                  France
                </span>
              </h4>
              <div class="w-60 w-full flex items-center">
                <div class="flex flex-1 items-center">
                  <a-select v-model="filters.sortBy" class="flex-1" size="small" placeholder="Pertinence" :bordered="true">
                    <a-option v-for="sk in KeySort" :key="sk" :value="sk">
                      {{ sk.toLowerCase() }}
                    </a-option>
                  </a-select>
                  <a-button type="dashed" size="small" class="ml-1 flex-none" @click="() => filters.sortOrder === 'ASC' ? (filters.sortOrder = 'DESC') : (filters.sortOrder = 'ASC')">
                    <i :class="[filters.sortOrder === 'ASC' ? 'i-carbon-sort-ascending' : 'i-carbon-sort-descending']" class="h-4 w-4" />
                  </a-button>
                </div>
              </div>
            </div>
          </div>
          <div class="relative h-[calc(100%-5.3rem)] p-0">
            <template v-if="layoutView === 'LIST'">
              <div v-if="!errorBiens" ref="contentDataRef" class="m-0 h-full">
                <a-table
                  class="[--border-radius-medium:0] ![&_.arco-table-container]:border-none"
                  :columns="columns"
                  :scrollbar="false"
                  :pagination="false"
                  size="small"
                  :data="listBiens"
                  :loading="isFetching"
                  :scroll="{
                    x: `${widthContentDataRef}px`,
                    y: `${heightContentDataRef ? heightContentDataRef - 1 : 300}px`,
                  }"
                >
                  <template #actions="{ record }">
                    <div class="flex space-x-1">
                      <a-button size="mini" @click="(selectedBien = record, viewInMap = true)">
                        view in map
                      </a-button>
                    </div>
                  </template>
                </a-table>
              </div>
            </template>
            <template v-else>
              <div v-if="listBiens && !errorBiens && !isFetching" class="h-full p-2">
                <div class="grid grid-cols-1 gap-2" :class="[layoutView === 'GALLERY' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5' : 'md:grid-cols-2']">
                  <div v-for="item in listBiens" :id="item.id" :key="item.id">
                    <a-card
                      class="w-full overflow-hidden !rounded-2px !bg-zinc-1 !dark:bg-zinc-9 ![&>.arco-card-body]:p-0" :bordered="false"
                      :class="[selectedBien?.id === item.id && '[&_.selected]:(bg-blue-1 dark:bg-blue-5)']"
                      hoverable
                    >
                      <template #cover>
                        <a-carousel
                          :style="{
                            width: '100%',
                            height: '160px',
                          }"
                          class="border-b-1px border-zinc-3 bg-slate-3 dark:border-zinc-8 dark:bg-dark-9 ![&_.arco-carousel-arrow>div]:bg-black/60"
                          :auto-play="{ interval: 15000, hoverToPause: true }" indicator-type="dot"
                          show-arrow="hover" animation-name="fade"
                        >
                          <a-carousel-item v-for="(image, index) in item.photos.slice(0, 3)" :key="image.url">
                            <div
                              class="h-full w-full flex items-center justify-center"
                              @click="() => {
                                srcListImgs = item.photos.map((image) => image.url_photo)
                                currentImg = index
                                visibleImg = true
                              }"
                            >
                              <UseImage
                                class="h-auto w-full"
                                :src="image.url_photo"
                              >
                                <template #loading>
                                  <a-spin />
                                </template>

                                <template #error>
                                  <span class="flex items-center overflow-hidden truncate text-gray-4">
                                    <h4>Image Not found</h4>
                                  </span>
                                </template>
                              </UseImage>
                            </div>
                          </a-carousel-item>
                        </a-carousel>
                      </template>
                      <div
                        class="min-h-35 flex flex-col justify-between"
                        :class="[selectedBien?.id === item.id && 'selected']"
                      >
                        <div class="flex flex-1 flex-col cursor-pointer p-2 pb-0" @click="() => (selectedBien?.id !== item.id ? (selectedBien = item, viewInMap = true) : selectedBien = null)">
                          <h3 mb-2 text-3.9>
                            {{ `${item.propertyType === 'house' ? 'Maison' : (item.propertyType === 'flat' ? 'Appartement' : 'Local')} ${item.roomsQuantity} pièce ${item.surfaceArea} m²` }}
                          </h3>
                          <div h-full flex flex-1 items-end justify-end>
                            <h4>
                              <span class="text-lg">
                                {{ item.price }}
                              </span>
                              <sup>
                                €
                              </sup>
                            </h4>
                          </div>
                          <div>
                            <h5 />
                          </div>
                        </div>
                        <div class="mx--0 flex justify-between bg-light-9/35 p-2 dark:bg-dark-9/35">
                          <div flex-0 flex items-center overflow-hidden truncate text-ellipsis>
                            <span class="text-black dark:text-white">{{ item.postalCode }} {{ item.city }}</span>
                          </div>
                          <div flex space-x-1.5>
                            <a-button class="!px-1" type="text" size="mini">
                              <span class="i-carbon-favorite text-red" />
                            </a-button>
                            <a-button class="!px-1" type="text" size="mini">
                              <span class="i-carbon-share text-blue" />
                            </a-button>
                            <a-button class="!px-1" type="text" size="mini">
                              <IconMore />
                            </a-button>
                          </div>
                        </div>
                      </div>
                    </a-card>
                  </div>
                </div>
                <div v-if="!listBiens.length" class="z-3 h-full">
                  <a-result class="h-full flex flex-col justify-center" status="404" subtitle="Whoops, this search is empty." />
                </div>
                <div v-else class="flex justify-center py-3">
                  <a-button type="primary" status="danger" size="small" class="px-1.5">
                    <i class="i-carbon-notification mr-1" />
                    Créer une alerte pour cette recherche
                  </a-button>
                </div>
              </div>
              <div v-if="isFetching && !errorBiens" class="left-0 top-0 z-15 h-full w-full bg-blue-3/5">
                <span class="h-full flex content-center justify-center">
                  <span class="m-auto">
                    <a-spin tip="Loading..." />
                  </span>
                </span>
              </div>
            </template>
            <div v-if="errorBiens" class="z-3 h-full">
              <a-result class="h-full flex flex-col justify-center" status="404" subtitle="errorBiens">
                <template #extra>
                  <a-space>
                    <a-button size="mini" type="primary" @click="() => { filters.page = 1 }">
                      Back
                    </a-button>
                  </a-space>
                </template>
              </a-result>
            </div>
            <div class="sticky bottom-0 z-30 m--0 mt-0 flex items-center justify-end border-t-1px border-dark/10 bg-gray-1 px-3 leading-10 dark:border-gray-4/20 dark:bg-dark-9">
              <a-pagination v-model:current="filters.page" v-model:page-size="filters.size" :simple="!mdAndLarger" class="flex items-center [&>.arco-pagination-list]:flex [&>.arco-pagination-list]:items-center" :default-current="1" :total="total || 0" size="small" :page-size-options="[24, 52, 100, 200]" :default-page-size="24" :show-total="mdAndLarger" show-page-size :disabled="isFetching" @page-size-change="() => { filters.page = 1 }" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <a-image-preview-group v-model:visible="visibleImg" v-model:current="currentImg" infinite :src-list="srcListImgs" />
  <a-drawer popup-container="#layoutMain" class="!z-99 ![&_.arco-drawer]:w-85% !md:[&_.arco-drawer]:w-35%" :visible="visibleDrawer" unmount-on-close @ok="() => visibleDrawer = false" @cancel="() => visibleDrawer = false">
    <template #title>
      Title
    </template>
    <div class="">
      You can customize modal body text by the current situation. This modal will be closed immediately once you
      press the OK button.
    </div>
  </a-drawer>
</template>

<style>
.demo-arrow {
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  background-color: var(--color-bg-popup);
}
</style>
