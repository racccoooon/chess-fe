<template>
  <div class="grow flex flex-col gap-6">
    <div class="flex flex-col gap-4">
      <label class="text-gray-900 dark:text-gray-50 font-medium"
        >Notation style</label
      >
      <div class="flex flex-row gap-4 items-center">
        <button
          @click="notationType = NotationType.Algebraic"
          :aria-selected="notationType === NotationType.Algebraic"
          class="px-3 h-11 rounded-2xl bg-gray-200 dark:bg-gray-700 border-b-4 aria-selected:border-b-0 aria-selected:border-t-4 border-gray-300 dark:border-gray-900 text-gray-800 dark:text-gray-50 font-medium text-sm aria-selected:outline outline-3 outline-gray-800 dark:outline-gray-100 outline-offset-0 transition-all ease-in-out"
        >
          Algebraic
        </button>
        <button
          @click="notationType = NotationType.LongAlgebraic"
          :aria-selected="notationType === NotationType.LongAlgebraic"
          class="px-3 h-11 rounded-2xl bg-gray-200 dark:bg-gray-700 border-b-4 aria-selected:border-b-0 aria-selected:border-t-4 border-gray-300 dark:border-gray-900 text-gray-800 dark:text-gray-50 font-medium text-sm aria-selected:outline outline-3 outline-gray-800 dark:outline-gray-100 outline-offset-0 transition-all ease-in-out"
        >
          Long Algebraic
        </button>
        <button
          @click="notationType = NotationType.Spoken"
          :aria-selected="notationType === NotationType.Spoken"
          class="px-3 h-11 rounded-2xl bg-gray-200 dark:bg-gray-700 border-b-4 aria-selected:border-b-0 aria-selected:border-t-4 border-gray-300 dark:border-gray-900 text-gray-800 dark:text-gray-50 font-medium text-sm aria-selected:outline outline-3 outline-gray-800 dark:outline-gray-100 outline-offset-0 transition-all ease-in-out"
        >
          Spoken
        </button>
      </div>
    </div>
    <div class="flex flex-col gap-4">
      <label class="text-gray-900 dark:text-gray-50 font-medium"
        >Use icons in notation</label
      >
      <div class="flex flex-row gap-4 items-center">
        <button
          @click="useUnicodeIconsInNotation = true"
          :aria-selected="useUnicodeIconsInNotation"
          class="px-3 h-11 rounded-2xl bg-gray-200 dark:bg-gray-700 border-b-4 aria-selected:border-b-0 aria-selected:border-t-4 border-gray-300 dark:border-gray-900 text-gray-800 dark:text-gray-50 font-medium text-sm aria-selected:outline outline-3 outline-gray-800 dark:outline-gray-100 outline-offset-0 transition-all ease-in-out"
        >
          yes
        </button>
        <button
          @click="useUnicodeIconsInNotation = false"
          :aria-selected="!useUnicodeIconsInNotation"
          class="px-3 h-11 rounded-2xl bg-gray-200 dark:bg-gray-700 border-b-4 aria-selected:border-b-0 aria-selected:border-t-4 border-gray-300 dark:border-gray-900 text-gray-800 dark:text-gray-50 font-medium text-sm aria-selected:outline outline-3 outline-gray-800 dark:outline-gray-100 outline-offset-0 transition-all ease-in-out"
        >
          no
        </button>
      </div>
    </div>
    <div class="flex flex-col gap-4">
      <label class="text-gray-900 dark:text-gray-50 font-medium"
        >Raccoon Mode</label
      >
      <div class="flex flex-row gap-4 items-center">
        <button
          @click="raccoonMode = true"
          :aria-selected="raccoonMode"
          class="px-3 h-11 rounded-2xl bg-gray-200 dark:bg-gray-700 border-b-4 aria-selected:border-b-0 aria-selected:border-t-4 border-gray-300 dark:border-gray-900 text-gray-800 dark:text-gray-50 font-medium text-sm aria-selected:outline outline-3 outline-gray-800 dark:outline-gray-100 outline-offset-0 transition-all ease-in-out"
        >
          yes
        </button>
        <button
          @click="raccoonMode = false"
          :aria-selected="!raccoonMode"
          class="px-3 h-11 rounded-2xl bg-gray-200 dark:bg-gray-700 border-b-4 aria-selected:border-b-0 aria-selected:border-t-4 border-gray-300 dark:border-gray-900 text-gray-800 dark:text-gray-50 font-medium text-sm aria-selected:outline outline-3 outline-gray-800 dark:outline-gray-100 outline-offset-0 transition-all ease-in-out"
        >
          no
        </button>
      </div>
    </div>
    <div class="flex flex-col gap-4">
      <label class="text-gray-900 dark:text-gray-50 font-medium"
        >Chess Board Border</label
      >
      <div class="flex flex-row gap-4 items-center">
        <button
          @click="chessBoardBorder = ChessBoardBorder.None"
          :aria-selected="chessBoardBorder === ChessBoardBorder.None"
          class="px-3 h-11 rounded-2xl bg-gray-200 dark:bg-gray-700 border-b-4 aria-selected:border-b-0 aria-selected:border-t-4 border-gray-300 dark:border-gray-900 text-gray-800 dark:text-gray-50 font-medium text-sm aria-selected:outline outline-3 outline-gray-800 dark:outline-gray-100 outline-offset-0 transition-all ease-in-out"
        >
          None
        </button>
        <button
          @click="chessBoardBorder = ChessBoardBorder.Thin"
          :aria-selected="chessBoardBorder === ChessBoardBorder.Thin"
          class="px-3 h-11 rounded-2xl bg-gray-200 dark:bg-gray-700 border-b-4 aria-selected:border-b-0 aria-selected:border-t-4 border-gray-300 dark:border-gray-900 text-gray-800 dark:text-gray-50 font-medium text-sm aria-selected:outline outline-3 outline-gray-800 dark:outline-gray-100 outline-offset-0 transition-all ease-in-out"
        >
          Thin
        </button>
        <button
          @click="chessBoardBorder = ChessBoardBorder.Thick"
          :aria-selected="chessBoardBorder === ChessBoardBorder.Thick"
          class="px-3 h-11 rounded-2xl bg-gray-200 dark:bg-gray-700 border-b-4 aria-selected:border-b-0 aria-selected:border-t-4 border-gray-300 dark:border-gray-900 text-gray-800 dark:text-gray-50 font-medium text-sm aria-selected:outline outline-3 outline-gray-800 dark:outline-gray-100 outline-offset-0 transition-all ease-in-out"
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
