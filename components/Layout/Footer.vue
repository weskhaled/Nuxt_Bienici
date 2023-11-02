<script setup lang="ts">
const formatted = useDateFormat(useNow(), 'YYYY')
</script>

<template>
  <div class="relative z-5 hidden items-center justify-between border-t-1px border-zinc-2/40 bg-white/75 p-2 text-center text-xl backdrop-blur-2px md:flex dark:border-zinc-8/60 dark:bg-dark-9/75">
    <a-button type="outline" size="mini">
      <span class="flex items-center">
        <span class="i-carbon-favorite-filled mr-1 inline-block h-3 w-3 text-red" />
        designed with love
      </span>
    </a-button>
    <span class="hidden text-xs leading-21px text-gray-900 md:inline-block dark:text-gray-100">
      Created by Weskhaled ⓒ Copyright {{ formatted }}
    </span>
  </div>
</template>
