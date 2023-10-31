<script setup lang="ts">
const online = useOnline()

const sliders: Ref<any[]> = ref([
  {
    title: 'Intro',
    content: h('div', { class: 'text-left max-w-3xl ml-0 font-general flex flex-col' }, [h('h1', { class: 'font-chillax font-semibold uppercase text-1.6rem md:text-3.2rem leading-tight ![--animate-delay:0.1s] animate__animated animate__slideInDown' }, 'Demain commence ici 👋'), h('p', { class: 'font-thin text-5 ![--animate-delay:0.15s] animate__delay-2s animate__animated animate__backInUp' }, '')]),
    image: {
      screen: 'https://images.unsplash.com/photo-1515172421830-247785f9be55?auto=format&fit=crop&q=80&w=900&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      thumb: 'https://images.unsplash.com/photo-1515172421830-247785f9be55?auto=format&fit=crop&q=80&w=200&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  },
  {
    title: 'Intro',
    content: h('div', { class: 'text-left max-w-3xl ml-0 font-general flex flex-col' }, [h('h1', { class: 'font-chillax font-semibold uppercase text-1.6rem md:text-3.2rem leading-tight ![--animate-delay:0.1s] animate__animated animate__slideInDown' }, 'Demain commence ici 👋'), h('p', { class: 'font-thin text-5 ![--animate-delay:0.15s] animate__delay-2s animate__animated animate__backInUp' }, '')]),
    image: {
      screen: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&q=80&w=900&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      thumb: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&q=80&w=200&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  },
  {
    title: 'Intro',
    content: h('div', { class: 'text-left max-w-3xl ml-0 font-general flex flex-col' }, [h('h1', { class: 'font-chillax font-semibold uppercase text-1.6rem md:text-3.2rem leading-tight ![--animate-delay:0.1s] animate__animated animate__slideInDown' }, 'Demain commence ici 👋'), h('p', { class: 'font-thin text-5 ![--animate-delay:0.15s] animate__delay-2s animate__animated animate__backInUp' }, '')]),
    image: {
      screen: 'https://images.unsplash.com/photo-1471623320832-752e8bbf8413?auto=format&fit=crop&q=80&w=900&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      thumb: 'https://images.unsplash.com/photo-1471623320832-752e8bbf8413?auto=format&fit=crop&q=80&w=200&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  },
])
</script>

<template>
  <div class="5xl:container relative mx-auto shadow-xl">
    <section class="relative mt--14.5 font-sans">
      <CommonHeroSlider :grab-cursor="true" class="h-[calc(100vh-3rem)] !max-h-70rem !min-h-400px md:h-[calc(100vh)]" :sliders="sliders" />
    </section>
    <section class="relative mx-auto xl:container dark:text-slate-1">
      content is here
    </section>
  </div>
</template>
