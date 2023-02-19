<template>
  <ModalWrapper>
    <ModalCard>
      <slot />
    </ModalCard>
  </ModalWrapper>
</template>

<script setup lang="ts">
import ModalWrapper from "@/components/modals/ModalWrapper.vue";
import ModalCard from "@/components/modals/ModalCard.vue";
</script>
