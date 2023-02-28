<template>
  <div class="grow flex flex-col h-min">
    <CompactFormWrapper>
      <CompactFormSection>
        <div
          class="flex flex-col gap-1 px-4 py-3 bg-yellow-300/30 text-yellow-700 dark:text-yellow-300 border-2 border-current shadow-xl shadow-yellow-300/10 rounded-xl"
        >
          <h3 class="text-lg font-bold">Careful!</h3>
          <p>Editing the board will delete your move history.</p>
        </div>
      </CompactFormSection>
      <CompactFormSection>
        <template #label>Mode</template>
        <MediumOptionsGroup
          class="grid grid-cols-3 gap-4"
          :model-value="pointerMode"
          @update:model-value="emit('update:pointerMode', $event)"
          :options="[
            { value: BoardPointerMode.Move },
            { value: BoardPointerMode.Paint },
            { value: BoardPointerMode.Erase },
          ]"
        >
          <template #preview="option">
            <SvgIcon
              type="mdi"
              :path="
                option.value === BoardPointerMode.Move
                  ? mdiCursorMove
                  : option.value === BoardPointerMode.Paint
                  ? mdiBrush
                  : mdiEraser
              "
              class="w-10"
            />
          </template>
        </MediumOptionsGroup>
      </CompactFormSection>
      <CompactFormSection>
        <template #label>Color</template>
        <MediumOptionsGroup
          class="grid grid-cols-2 gap-4"
          :model-value="paintPieceColor"
          @update:model-value="emit('update:paintPieceColor', $event)"
          :options="[
            { label: 'White', value: PieceColor.White },
            { label: 'Black', value: PieceColor.Black },
          ]"
        >
          <template #preview="option">
            <div
              :data-color="option.value"
              class="mr-2 w-7 h-7 border-2 data-[color=white]:bg-gray-100 data-[color=white]:border-gray-800 data-[color=black]:bg-gray-800 data-[color=black]:border-gray-100 rounded-md"
            />
          </template>
        </MediumOptionsGroup>
      </CompactFormSection>
      <CompactFormSection>
        <template #label>Pieces</template>
        <MediumOptionsGroup
          class="grid grid-cols-3 gap-4"
          :model-value="paintPieceType"
          @update:model-value="emit('update:paintPieceType', $event)"
          :options="[
            { value: PieceType.Pawn },
            { value: PieceType.Knight },
            { value: PieceType.Bishop },
            { value: PieceType.Rook },
            { value: PieceType.Queen },
            { value: PieceType.King },
          ]"
        >
          <template #preview="option">
            <PieceRenderer
              :type="option.value"
              :color="paintPieceColor"
              class="w-9"
            />
          </template>
        </MediumOptionsGroup>
      </CompactFormSection>
    </CompactFormWrapper>
  </div>
</template>

<script setup lang="ts">
import { BoardPointerMode, PieceColor, PieceType } from "@/lib/types";
import MediumOptionsGroup from "@/components/forms/MediumOptionsGroup.vue";
import PieceRenderer from "@/components/pieces/PieceRenderer.vue";
import CompactFormWrapper from "@/components/forms/CompactFormWrapper.vue";
import CompactFormSection from "@/components/forms/CompactFormSection.vue";
// @ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiBrush, mdiCursorMove, mdiEraser } from "@mdi/js";

defineProps<{
  pointerMode: BoardPointerMode;
  paintPieceType: PieceType;
  paintPieceColor: PieceColor;
}>();

const emit = defineEmits<{
  (event: "update:pointerMode", payload: BoardPointerMode): void;
  (event: "update:paintPieceType", payload: PieceType): void;
  (event: "update:paintPieceColor", payload: PieceColor): void;
}>();
</script>
