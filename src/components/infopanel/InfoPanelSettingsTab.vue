<template>
  <div class="grow flex flex-col gap-6">
    <div class="flex flex-col gap-4">
      <label class="text-gray-900 dark:text-gray-50 font-medium"
        >Notation style</label
      >
      <div class="flex flex-wrap items-center">
        <button
          @click="notationType = NotationType.Algebraic"
          :aria-selected="notationType === NotationType.Algebraic"
          class="px-4 py-2 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-sm font-medium rounded-xl transition-all ease-in-out"
        >
          Algebraic
        </button>
        <button
          @click="notationType = NotationType.LongAlgebraic"
          :aria-selected="notationType === NotationType.LongAlgebraic"
          class="px-4 py-2 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-sm font-medium rounded-xl transition-all ease-in-out"
        >
          Long Algebraic
        </button>
        <button
          @click="notationType = NotationType.Spoken"
          :aria-selected="notationType === NotationType.Spoken"
          class="px-4 py-2 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-sm font-medium rounded-xl transition-all ease-in-out"
        >
          Spoken
        </button>
      </div>
      <div class="flex flex-wrap items-center">
        <button
          @click="useUnicodeIconsInNotation = true"
          :aria-selected="useUnicodeIconsInNotation"
          class="px-4 py-2 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-sm font-medium rounded-xl transition-all ease-in-out"
        >
          Use unicode icons
        </button>
        <button
          @click="useUnicodeIconsInNotation = false"
          :aria-selected="!useUnicodeIconsInNotation"
          class="px-4 py-2 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-sm font-medium rounded-xl transition-all ease-in-out"
        >
          Use letters
        </button>
      </div>
    </div>
    <div class="flex flex-col gap-4">
      <label class="text-gray-900 dark:text-gray-50 font-medium"
        >Chess Board</label
      >
      <div class="flex flex-wrap items-center">
        <button
          @click="boardColor = ChessBoardColor.Neutral"
          :aria-selected="boardColor === ChessBoardColor.Neutral"
          class="px-4 py-2 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-sm font-medium rounded-xl transition-all ease-in-out"
        >
          Neutral
        </button>
        <button
          @click="boardColor = ChessBoardColor.Wood"
          :aria-selected="boardColor === ChessBoardColor.Wood"
          class="px-4 py-2 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-sm font-medium rounded-xl transition-all ease-in-out"
        >
          Wood
        </button>
        <button
          @click="boardColor = ChessBoardColor.Green"
          :aria-selected="boardColor === ChessBoardColor.Green"
          class="px-4 py-2 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-sm font-medium rounded-xl transition-all ease-in-out"
        >
          Green
        </button>
        <button
          @click="boardColor = ChessBoardColor.Blue"
          :aria-selected="boardColor === ChessBoardColor.Blue"
          class="px-4 py-2 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-sm font-medium rounded-xl transition-all ease-in-out"
        >
          Blue
        </button>
        <button
          @click="boardColor = ChessBoardColor.Red"
          :aria-selected="boardColor === ChessBoardColor.Red"
          class="px-4 py-2 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-sm font-medium rounded-xl transition-all ease-in-out"
        >
          Red
        </button>
        <button
          @click="boardColor = ChessBoardColor.Orange"
          :aria-selected="boardColor === ChessBoardColor.Orange"
          class="px-4 py-2 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-sm font-medium rounded-xl transition-all ease-in-out"
        >
          Orange
        </button>
        <button
          @click="boardColor = ChessBoardColor.Purple"
          :aria-selected="boardColor === ChessBoardColor.Purple"
          class="px-4 py-2 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-sm font-medium rounded-xl transition-all ease-in-out"
        >
          Purple
        </button>
        <button
          @click="boardColor = ChessBoardColor.Pink"
          :aria-selected="boardColor === ChessBoardColor.Pink"
          class="px-4 py-2 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-sm font-medium rounded-xl transition-all ease-in-out"
        >
          Pink
        </button>
        <button
          @click="boardColor = ChessBoardColor.HighContrast"
          :aria-selected="boardColor === ChessBoardColor.HighContrast"
          class="px-4 py-2 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-sm font-medium rounded-xl transition-all ease-in-out"
        >
          High Contrast
        </button>
      </div>
      <div class="flex flex-wrap items-center">
        <button
          @click="boardBorder = ChessBoardBorder.None"
          :aria-selected="boardBorder === ChessBoardBorder.None"
          class="px-4 py-2 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-sm font-medium rounded-xl transition-all ease-in-out"
        >
          No border
        </button>
        <button
          @click="boardBorder = ChessBoardBorder.Thin"
          :aria-selected="boardBorder === ChessBoardBorder.Thin"
          class="px-4 py-2 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-sm font-medium rounded-xl transition-all ease-in-out"
        >
          Thin border
        </button>
        <button
          @click="boardBorder = ChessBoardBorder.Thick"
          :aria-selected="boardBorder === ChessBoardBorder.Thick"
          class="px-4 py-2 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-sm font-medium rounded-xl transition-all ease-in-out"
        >
          Thick border
        </button>
      </div>
    </div>
    <div class="flex flex-col gap-4">
      <label class="text-gray-900 dark:text-gray-50 font-medium"
        >Chess Pieces</label
      >
      <div class="flex flex-wrap items-center">
        <button
          @click="raccoonMode = false"
          :aria-selected="!raccoonMode"
          class="px-4 py-2 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-sm font-medium rounded-xl transition-all ease-in-out"
        >
          Normal
        </button>
        <button
          @click="raccoonMode = true"
          :aria-selected="raccoonMode"
          class="px-4 py-2 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-sm font-medium rounded-xl transition-all ease-in-out"
        >
          Racoon
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings";
import { NotationType } from "@/lib/chessNotation";
import { ChessBoardColor, ChessBoardBorder } from "@/lib/types";
import { storeToRefs } from "pinia";

const settingsStore = useSettingsStore();

const {
  notationType,
  useUnicodeIconsInNotation,
  raccoonMode,
  boardColor,
  boardBorder,
} = storeToRefs(settingsStore);
</script>
