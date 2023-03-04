<template>
  <div class="flex flex-row gap-6 items-center">
    <SvgIcon type="mdi" :path="mdiLoading" class="animate-spin w-6 h-6" />
    <h2 class="font-medium text-lg">Loading...</h2>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiLoading } from "@mdi/js";
</script>
