<template>
  <div
    class="mx-3 sm:mx-auto sm:w-3/4 lg:w-2/3 2xl:w-11/12 max-w-7xl py-24 flex flex-col gap-12"
  >
    <div class="flex flex-col gap-16 items-start">
      <h1 class="dark:text-gray-50 text-gray-900 text-4xl font-bold">
        Raccoon Chess
      </h1>
      <div>
        <RouterLink
          :to="{ name: 'start-playing' }"
          class="flex items-center justify-center px-8 py-3 h-16 rounded-2xl bg-green-300 border-b-4 active:border-b-0 active:border-t-4 border-green-600 text-green-900 shadow-xl shadow-green-600/40 font-medium text-lg transition-all ease-in-out"
          >Play against friends</RouterLink
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
