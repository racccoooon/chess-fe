<template>
  <div class="flex flex-col gap-8 lg:gap-10 lg:w-96">
    <div class="flex flex-col gap-2 items-center">
      <h2 class="font-bold text-lg">Do you have a name?</h2>
      <p class="text-gray-500 text-sm">
        You can also change your name later in the settings.
      </p>
    </div>
    <LargeTextInput v-model="name" />
    <LargePrimaryButton @click="dismiss">Looks Good</LargePrimaryButton>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import LargeTextInput from "@/components/forms/LargeTextInput.vue";
import LargePrimaryButton from "@/components/forms/LargePrimaryButton.vue";
import { set } from "@vueuse/core";

const { name, hasSetName } = storeToRefs(useUserStore());

const emits = defineEmits<{
  (event: "dismissed"): void;
}>();

const dismiss = () => {
  set(hasSetName, true);
  emits("dismissed");
};
</script>
