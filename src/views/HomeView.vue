<template>
  <div class="md:mx-auto md:w-3/4 lg:w-3/5 max-w-7xl py-12 md:py-24">
    <div class="flex flex-col gap-6 md:gap-16">
      <div class="p-4 flex justify-center md:justify-start">
        <RaccoonChessLogo class="w-64" />
      </div>
      <CreateGameCard />
    </div>
  </div>
</template>

<script setup lang="ts">
import RaccoonChessLogo from "@/components/icons/RaccoonChessLogo.vue";
import CreateGameCard from "@/components/CreateGameCard.vue";
</script>
