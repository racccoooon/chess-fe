<template>
  <div class="mx-3 sm:mx-auto sm:w-3/4 lg:w-2/3 2xl:w-11/12 max-w-7xl py-12 flex flex-col gap-12">
    <h1 class="dark:text-gray-50 text-gray-900 text-2xl font-bold">Chess</h1>
    <div>
      <RouterLink :to="{name: 'start-playing'}" class="px-6 py-3 rounded-2xl bg-gray-700 border-b-4 border-gray-800 text-gray-50 font-medium text-lg">Start Playing</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>