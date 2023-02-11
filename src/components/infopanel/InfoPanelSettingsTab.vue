<template>
  <div class="grow flex flex-col gap-6">
    <div class="flex flex-col gap-4">
      <label class="text-gray-900 dark:text-gray-50 font-medium"
        >Notation style</label
      >
      <div class="flex flex-wrap gap-4 items-center">
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
    </div>
    <div class="flex flex-wrap gap-4">
      <label class="text-gray-900 dark:text-gray-50 font-medium"
        >Use icons in notation</label
      >
      <div class="flex flex-row gap-4 items-center">
        <button
          @click="useUnicodeIconsInNotation = true"
          :aria-selected="useUnicodeIconsInNotation"
          class="px-4 py-2 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-sm font-medium rounded-xl transition-all ease-in-out"
        >
          yes
        </button>
        <button
          @click="useUnicodeIconsInNotation = false"
          :aria-selected="!useUnicodeIconsInNotation"
          class="px-4 py-2 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-sm font-medium rounded-xl transition-all ease-in-out"
        >
          no
        </button>
      </div>
    </div>
    <div class="flex flex-wrap gap-4">
      <label class="text-gray-900 dark:text-gray-50 font-medium"
        >Raccoon Mode</label
      >
      <div class="flex flex-row gap-4 items-center">
        <button
          @click="raccoonMode = true"
          :aria-selected="raccoonMode"
          class="px-4 py-2 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-sm font-medium rounded-xl transition-all ease-in-out"
        >
          yes
        </button>
        <button
          @click="raccoonMode = false"
          :aria-selected="!raccoonMode"
          class="px-4 py-2 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-sm font-medium rounded-xl transition-all ease-in-out"
        >
          no
        </button>
      </div>
    </div>
    <div class="flex flex-wrap gap-4">
      <label class="text-gray-900 dark:text-gray-50 font-medium"
        >Chess Board Border</label
      >
      <div class="flex flex-row gap-4 items-center">
        <button
          @click="chessBoardBorder = ChessBoardBorder.None"
          :aria-selected="chessBoardBorder === ChessBoardBorder.None"
          class="px-4 py-2 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-sm font-medium rounded-xl transition-all ease-in-out"
        >
          None
        </button>
        <button
          @click="chessBoardBorder = ChessBoardBorder.Thin"
          :aria-selected="chessBoardBorder === ChessBoardBorder.Thin"
          class="px-4 py-2 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-sm font-medium rounded-xl transition-all ease-in-out"
        >
          Thin
        </button>
        <button
          @click="chessBoardBorder = ChessBoardBorder.Thick"
          :aria-selected="chessBoardBorder === ChessBoardBorder.Thick"
          class="px-4 py-2 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-sm font-medium rounded-xl transition-all ease-in-out"
        >
          Thick
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings";
import { NotationType } from "@/lib/chessNotation";
import { ChessBoardBorder } from "@/lib/types";
import { storeToRefs } from "pinia";

const settingsStore = useSettingsStore();

const {
  notationType,
  useUnicodeIconsInNotation,
  raccoonMode,
  chessBoardBorder,
} = storeToRefs(settingsStore);
</script>
