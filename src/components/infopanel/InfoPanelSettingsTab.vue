<template>
  <div class="grow flex flex-col gap-6 mb-12">
    <div class="flex flex-col gap-4">
      <label class="text-gray-900 dark:text-gray-50 font-medium"
        >Notation style</label
      >
      <div class="md:w-3/4">
        <SmallOptionsGroup
          v-model="notationType"
          :options="[
            {
              value: NotationType.Algebraic,
              label: 'Algebraic',
            },
            {
              value: NotationType.LongAlgebraic,
              label: 'Long algebraic',
            },
            {
              value: NotationType.Spoken,
              label: 'Spoken',
            },
          ]"
        />
      </div>
      <div class="md:w-3/4">
        <SmallOptionsGroup
          v-model="useUnicodeIconsInNotation"
          :options="[
            {
              value: true,
              label: 'Use unicode icons',
            },
            {
              value: false,
              label: 'Use Letters',
            },
          ]"
        />
      </div>
    </div>
    <div class="flex flex-col gap-4">
      <label class="text-gray-900 dark:text-gray-50 font-medium"
        >Chess Board</label
      >
      <div class="md:w-3/4">
        <SmallCheckBoardOptionsGroup
          class="sm:grid-cols-2"
          v-model="boardColor"
          :options="[
            {
              value: ChessBoardColor.Neutral,
              label: 'Neutral',
              lightClass: 'fill-gray-100',
              darkClass: 'fill-gray-500',
            },
            {
              value: ChessBoardColor.Wood,
              label: 'Wood',
              lightClass: 'fill-brown-200',
              darkClass: 'fill-brown-500',
            },
            {
              value: ChessBoardColor.Green,
              label: 'Green',
              lightClass: 'fill-green-100',
              darkClass: 'fill-green-500',
            },
            {
              value: ChessBoardColor.Blue,
              label: 'Blue',
              lightClass: 'fill-blue-100',
              darkClass: 'fill-blue-500',
            },
            {
              value: ChessBoardColor.Red,
              label: 'Red',
              lightClass: 'fill-red-200',
              darkClass: 'fill-red-500',
            },
            {
              value: ChessBoardColor.Orange,
              label: 'Orange',
              lightClass: 'fill-orange-100',
              darkClass: 'fill-orange-400',
            },
            {
              value: ChessBoardColor.Purple,
              label: 'Purple',
              lightClass: 'fill-purple-100',
              darkClass: 'fill-purple-500',
            },
            {
              value: ChessBoardColor.Pink,
              label: 'Pink',
              lightClass: 'fill-pink-200',
              darkClass: 'fill-pink-400',
            },
          ]"
        />
      </div>
      <div class="md:w-3/4">
        <SmallOptionsGroup
          v-model="boardBorder"
          :options="[
            {
              value: ChessBoardBorder.None,
              label: 'No border',
            },
            {
              value: ChessBoardBorder.Thin,
              label: 'Thin border',
            },
            {
              value: ChessBoardBorder.Thick,
              label: 'Thick border',
            },
          ]"
        />
      </div>
      <div class="md:w-3/4">
        <SmallOptionsGroup
          v-model="showCoordinates"
          :options="[
            {
              value: true,
              label: 'Show coordinates',
            },
            {
              value: false,
              label: 'Hide coordinates',
            },
          ]"
        />
      </div>
    </div>
    <div class="flex flex-col gap-4">
      <label class="text-gray-900 dark:text-gray-50 font-medium"
        >Chess Pieces</label
      >
      <div class="md:w-3/4">
        <SmallOptionsGroup
          v-model="raccoonMode"
          :options="[
            {
              value: false,
              label: 'Normal',
            },
            {
              value: true,
              label: 'Raccoon',
            },
          ]"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings";
import { NotationType } from "@/lib/chessNotation";
import { ChessBoardColor, ChessBoardBorder } from "@/lib/types";
import { storeToRefs } from "pinia";
import SmallOptionsGroup from "@/components/forms/SmallOptionsGroup.vue";
import SmallCheckBoardOptionsGroup from "@/components/forms/SmallCheckBoardOptionsGroup.vue";

const settingsStore = useSettingsStore();

const {
  notationType,
  useUnicodeIconsInNotation,
  raccoonMode,
  boardColor,
  boardBorder,
  showCoordinates,
} = storeToRefs(settingsStore);
</script>
