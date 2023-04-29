<template>
  <button
    class="h-min p-2 flex flex-row justify-center rounded-lg overflow-hidden bg-white"
    @click="toggleShow()"
  >
    <span
      v-if="!show"
      class="w-full h-12 flex flex-row gap-2 items-center justify-center text-gray-900 font-medium text-sm"
    >
      <SvgIcon type="mdi" :path="mdiQrcode" size="28" />
      <span>Show QRCode</span>
    </span>
    <img
      v-else
      class="w-full md:w-1/3 xl:w-2/5"
      :src="dataUrl"
      :alt="alt || 'QRCode'"
    />
  </button>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useToggle } from "@vueuse/core";
import { useQRCode } from "@vueuse/integrations/useQRCode";
// @ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiQrcode } from "@mdi/js";

const props = defineProps<{
  text: string;
  alt?: string;
}>();

const show = ref(false);
const toggleShow = useToggle(show);

const dataUrl = useQRCode(props.text);
</script>
