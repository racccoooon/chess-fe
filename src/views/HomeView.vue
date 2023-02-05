<template>
  <div
    class="mx-3 sm:mx-auto sm:w-3/4 lg:w-2/3 2xl:w-11/12 max-w-7xl py-12 flex flex-col gap-12"
  >
    <div
      class="p-24 flex flex-col gap-12 bg-gray-100 dark:bg-gray-800 rounded-2xl"
    >
      <div class="flex flex-col gap-16 items-center">
        <h1 class="dark:text-gray-50 text-gray-900 text-4xl font-bold">
          Raccoon Chess
        </h1>
        <div>
          <RouterLink
            :to="{ name: 'start-playing' }"
            class="relative top-0 px-12 py-6 rounded-full bg-green-300 border-b-8 active:border-b-0 active:border-t-8 active:top-4 active:bg-green-400 scale-100 active:scale-50 border-green-600 text-green-900 font-medium text-xl transition-all ease-in-out"
            >Start Playing</RouterLink
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
