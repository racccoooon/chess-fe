<template>
  <div class="md:mx-auto md:w-3/4 lg:w-3/5 max-w-7xl py-12 md:py-24">
    <div class="flex flex-col gap-6 md:gap-16">
      <div class="p-4 flex justify-center md:justify-start">
        <RaccoonChessLogo class="w-64" />
      </div>
      <CreateGameCard />
      <div
        class="p-6 md:p-12 lg:p-16 bg-gray-100 dark:bg-gray-800 md:rounded-3xl"
      >
        <div class="flex flex-col gap-8 lg:gap-12">
          <RouterLink :to="{ name: 'sandbox-board' }">
            <LargeSecondaryButton class="w-full">
              Open sandbox board <SvgIcon type="mdi" :path="mdiArrowRight" />
            </LargeSecondaryButton>
          </RouterLink>
          <div class="mx-auto w-full lg:w-2/3 rounded-xl overflow-hidden">
            <FreeBoard />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RaccoonChessLogo from "@/components/icons/RaccoonChessLogo.vue";
import CreateGameCard from "@/components/CreateGameCard.vue";
import FreeBoard from "@/components/FreeBoard.vue";
// @ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiArrowRight } from "@mdi/js";
import LargeSecondaryButton from "@/components/forms/LargeSecondaryButton.vue";
</script>
