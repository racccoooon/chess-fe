<template>
  <div class="grow">
    <div class="flex flex-col gap-6 pb-12 md:w-5/6">
      <div class="flex flex-col gap-4">
        <label class="text-gray-900 dark:text-gray-50 font-medium"
          >Chess Board</label
        >
        <div>
          <SmallPreviewOptionsGroup
            :options="[
              {
                value: ChessBoardColor.Neutral,
                label: 'Neutral',
                userOptions: {
                  lightClass: 'fill-gray-100',
                  darkClass: 'fill-gray-500',
                },
              },
              {
                value: ChessBoardColor.Wood,
                label: 'Wood',
                userOptions: {
                  lightClass: 'fill-brown-200',
                  darkClass: 'fill-brown-500',
                },
              },
              {
                value: ChessBoardColor.Green,
                label: 'Green',
                userOptions: {
                  lightClass: 'fill-green-100',
                  darkClass: 'fill-green-500',
                },
              },
              {
                value: ChessBoardColor.Blue,
                label: 'Blue',
                userOptions: {
                  lightClass: 'fill-blue-200',
                  darkClass: 'fill-blue-500',
                },
              },
              {
                value: ChessBoardColor.Red,
                label: 'Red',
                userOptions: {
                  lightClass: 'fill-red-200',
                  darkClass: 'fill-red-500',
                },
              },
              {
                value: ChessBoardColor.Orange,
                label: 'Orange',
                userOptions: {
                  lightClass: 'fill-orange-100',
                  darkClass: 'fill-orange-400',
                },
              },
              {
                value: ChessBoardColor.Purple,
                label: 'Purple',
                userOptions: {
                  lightClass: 'fill-purple-100',
                  darkClass: 'fill-purple-500',
                },
              },
              {
                value: ChessBoardColor.Pink,
                label: 'Pink',
                userOptions: {
                  lightClass: 'fill-pink-200',
                  darkClass: 'fill-pink-400',
                },
              },
            ]"
            class="grid-cols-2"
            v-model="boardColor"
          >
            <template #preview="option">
              <svg viewBox="0 0 20 20">
                <rect
                  width="10"
                  height="10"
                  x="0"
                  y="0"
                  :class="option.userOptions.lightClass"
                />
                <rect
                  width="10"
                  height="10"
                  x="10"
                  y="0"
                  :class="option.userOptions.darkClass"
                />
                <rect
                  width="10"
                  height="10"
                  x="00"
                  y="10"
                  :class="option.userOptions.darkClass"
                />
                <rect
                  width="10"
                  height="10"
                  x="10"
                  y="10"
                  :class="option.userOptions.lightClass"
                />
              </svg>
            </template>
          </SmallPreviewOptionsGroup>
        </div>
        <div>
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
        <div>
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
        <div>
          <SmallPreviewOptionsGroup
            v-model="pieceSet"
            :options="[
              {
                value: PieceSet.Modern,
                label: 'Modern',
              },
              {
                value: PieceSet.Raccoon,
                label: 'Raccoon',
              },
              {
                value: PieceSet.Classic,
                label: 'Classic',
              },
              {
                value: PieceSet.Blindfold,
                label: 'Blind',
              },
            ]"
            class="grid-cols-2"
          >
            <template #preview="option">
              <PieceRenderer
                :color="PieceColor.White"
                :type="PieceType.Pawn"
                :set="option.value"
              />
            </template>
          </SmallPreviewOptionsGroup>
        </div>
        <div>
          <SmallOptionsGroup
            v-model="piecesDisplaySize"
            :options="[
              {
                value: PiecesDisplaySize.Small,
                label: 'Tiny',
              },
              {
                value: PiecesDisplaySize.Medium,
                label: 'Normal',
              },
              {
                value: PiecesDisplaySize.Large,
                label: 'Bigger',
              },
              {
                value: PiecesDisplaySize.ExtraLarge,
                label: 'Huge',
              },
            ]"
          />
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <label class="text-gray-900 dark:text-gray-50 font-medium"
          >Highlight Squares</label
        >
        <div>
          <SmallOptionsGroup
            v-model="showLegalMoves"
            :options="[
              {
                value: true,
                label: 'Show legal moves',
              },
              {
                value: false,
                label: 'Hide legal moves',
              },
            ]"
          />
        </div>
        <div>
          <SmallOptionsGroup
            v-model="showLastMove"
            :options="[
              {
                value: true,
                label: 'Show last move',
              },
              {
                value: false,
                label: 'Hide last move',
              },
            ]"
          />
        </div>
        <div>
          <SmallOptionsGroup
            v-model="showCheck"
            :options="[
              {
                value: true,
                label: 'Show check',
              },
              {
                value: false,
                label: 'Hide check',
              },
            ]"
          />
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <label class="text-gray-900 dark:text-gray-50 font-medium"
          >Notation style</label
        >
        <div>
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
        <div>
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
          >Animations</label
        >
        <div>
          <SmallOptionsGroup
            v-model="animationDuration"
            :options="[
              {
                value: AnimationDuration.None,
                label: 'None',
              },
              {
                value: AnimationDuration.Slow,
                label: 'Slow',
              },
              {
                value: AnimationDuration.Medium,
                label: 'Medium',
              },
              {
                value: AnimationDuration.Fast,
                label: 'Fast',
              },
            ]"
          />
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="text-gray-900 dark:text-gray-50 font-medium"
            >Move style</label
          >
          <p class="text-sm text-gray-700 dark:text-gray-300">
            If moving pieces doesn't work with a touch screen try setting this
            to click only.
          </p>
        </div>
        <div>
          <SmallOptionsGroup
            v-model="preferredMoveStyle"
            :options="[
              {
                value: MoveStyle.Both,
                label: 'Both',
              },
              {
                value: MoveStyle.DragAndDropOnly,
                label: 'Drag and Drop',
              },
              {
                value: MoveStyle.ClickOnly,
                label: 'Click only',
              },
            ]"
          />
        </div>
        <div>
          <SmallOptionsGroup
            v-model="clickDuration"
            :options="[
              {
                value: ClickDuration.Short,
                label: 'Short click',
              },
              {
                value: ClickDuration.Medium,
                label: 'Medium click',
              },
              {
                value: ClickDuration.Long,
                label: 'Long click',
              },
            ]"
          />
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <label class="text-gray-900 dark:text-gray-50 font-medium"
          >Miscellaneous</label
        >
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >User arrows and highlights</label
          >
          <SmallOptionsGroup
            v-model="alwaysKeepUserHighlights"
            :options="[
              {
                value: false,
                label: 'Always keep',
              },
              {
                value: true,
                label: 'Remove after board change',
              },
            ]"
          />
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <label class="text-gray-900 dark:text-gray-50 font-medium"
          >Highlight Colors</label
        >
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >User Arrows</label
          >
          <SmallPreviewOptionsGroup
            :options="[
              {
                value: HighlightColor.Green,
                label: 'Green',
                userOptions: {
                  class: 'bg-green-300',
                },
              },
              {
                value: HighlightColor.Yellow,
                label: 'Yellow',
                userOptions: {
                  class: 'bg-yellow-300',
                },
              },
              {
                value: HighlightColor.Red,
                label: 'Red',
                userOptions: {
                  class: 'bg-red-400',
                },
              },
              {
                value: HighlightColor.Purple,
                label: 'Purple',
                userOptions: {
                  class: 'bg-purple-300',
                },
              },
              {
                value: HighlightColor.Blue,
                label: 'Blue',
                userOptions: {
                  class: 'bg-blue-300',
                },
              },
              {
                value: HighlightColor.Highlight,
                label: 'White',
                userOptions: {
                  class: 'bg-gray-200',
                },
              },
            ]"
            class="grid-cols-2"
            v-model="userArrowColor"
          >
            <template #preview="option">
              <div class="w-full h-full" :class="option.userOptions.class" />
            </template>
          </SmallPreviewOptionsGroup>
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >User highlighted squares</label
          >
          <SmallPreviewOptionsGroup
            :options="[
              {
                value: HighlightColor.Green,
                label: 'Green',
                userOptions: {
                  class: 'bg-green-300',
                },
              },
              {
                value: HighlightColor.Yellow,
                label: 'Yellow',
                userOptions: {
                  class: 'bg-yellow-300',
                },
              },
              {
                value: HighlightColor.Red,
                label: 'Red',
                userOptions: {
                  class: 'bg-red-400',
                },
              },
              {
                value: HighlightColor.Purple,
                label: 'Purple',
                userOptions: {
                  class: 'bg-purple-300',
                },
              },
              {
                value: HighlightColor.Blue,
                label: 'Blue',
                userOptions: {
                  class: 'bg-blue-300',
                },
              },
              {
                value: HighlightColor.Highlight,
                label: 'White',
                userOptions: {
                  class: 'bg-gray-200',
                },
              },
            ]"
            class="grid-cols-2"
            v-model="userHighlightColor"
          >
            <template #preview="option">
              <div class="w-full h-full" :class="option.userOptions.class" />
            </template>
          </SmallPreviewOptionsGroup>
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >Last Move</label
          >
          <SmallPreviewOptionsGroup
            :options="[
              {
                value: HighlightColor.Green,
                label: 'Green',
                userOptions: {
                  class: 'bg-green-300',
                },
              },
              {
                value: HighlightColor.Yellow,
                label: 'Yellow',
                userOptions: {
                  class: 'bg-yellow-300',
                },
              },
              {
                value: HighlightColor.Red,
                label: 'Red',
                userOptions: {
                  class: 'bg-red-400',
                },
              },
              {
                value: HighlightColor.Purple,
                label: 'Purple',
                userOptions: {
                  class: 'bg-purple-300',
                },
              },
              {
                value: HighlightColor.Blue,
                label: 'Blue',
                userOptions: {
                  class: 'bg-blue-300',
                },
              },
              {
                value: HighlightColor.Highlight,
                label: 'White',
                userOptions: {
                  class: 'bg-gray-200',
                },
              },
            ]"
            class="grid-cols-2"
            v-model="lastMoveHighlightColor"
          >
            <template #preview="option">
              <div class="w-full h-full" :class="option.userOptions.class" />
            </template>
          </SmallPreviewOptionsGroup>
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >Selected Square</label
          >
          <SmallPreviewOptionsGroup
            :options="[
              {
                value: HighlightColor.Green,
                label: 'Green',
                userOptions: {
                  class: 'bg-green-300',
                },
              },
              {
                value: HighlightColor.Yellow,
                label: 'Yellow',
                userOptions: {
                  class: 'bg-yellow-300',
                },
              },
              {
                value: HighlightColor.Red,
                label: 'Red',
                userOptions: {
                  class: 'bg-red-400',
                },
              },
              {
                value: HighlightColor.Purple,
                label: 'Purple',
                userOptions: {
                  class: 'bg-purple-300',
                },
              },
              {
                value: HighlightColor.Blue,
                label: 'Blue',
                userOptions: {
                  class: 'bg-blue-300',
                },
              },
              {
                value: HighlightColor.Highlight,
                label: 'White',
                userOptions: {
                  class: 'bg-gray-200',
                },
              },
            ]"
            class="grid-cols-2"
            v-model="selectedSquareHighlightColor"
          >
            <template #preview="option">
              <div class="w-full h-full" :class="option.userOptions.class" />
            </template>
          </SmallPreviewOptionsGroup>
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >Legal Moves</label
          >
          <SmallPreviewOptionsGroup
            :options="[
              {
                value: HighlightColor.Green,
                label: 'Green',
                userOptions: {
                  class: 'bg-green-300',
                },
              },
              {
                value: HighlightColor.Yellow,
                label: 'Yellow',
                userOptions: {
                  class: 'bg-yellow-300',
                },
              },
              {
                value: HighlightColor.Red,
                label: 'Red',
                userOptions: {
                  class: 'bg-red-400',
                },
              },
              {
                value: HighlightColor.Purple,
                label: 'Purple',
                userOptions: {
                  class: 'bg-purple-300',
                },
              },
              {
                value: HighlightColor.Blue,
                label: 'Blue',
                userOptions: {
                  class: 'bg-blue-300',
                },
              },
              {
                value: HighlightColor.Highlight,
                label: 'White',
                userOptions: {
                  class: 'bg-gray-200',
                },
              },
            ]"
            class="grid-cols-2"
            v-model="legalMoveHighlightColor"
          >
            <template #preview="option">
              <div class="w-full h-full" :class="option.userOptions.class" />
            </template>
          </SmallPreviewOptionsGroup>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings";
import { NotationType } from "@/lib/chessNotation";
import {
  ChessBoardColor,
  ChessBoardBorder,
  PieceSet,
  PiecesDisplaySize,
  MoveStyle,
  ClickDuration,
  AnimationDuration,
  PieceColor,
  PieceType,
  HighlightColor,
} from "@/lib/types";
import { storeToRefs } from "pinia";
import SmallOptionsGroup from "@/components/forms/SmallOptionsGroup.vue";
import SmallPreviewOptionsGroup from "@/components/forms/SmallPreviewOptionsGroup.vue";
import PieceRenderer from "@/components/pieces/PieceRenderer.vue";

const settingsStore = useSettingsStore();

const {
  preferredMoveStyle,
  clickDuration,
  notationType,
  useUnicodeIconsInNotation,
  showLegalMoves,
  showLastMove,
  showCheck,
  boardColor,
  boardBorder,
  pieceSet,
  piecesDisplaySize,
  animationDuration,
  showCoordinates,
  userHighlightColor,
  userArrowColor,
  lastMoveHighlightColor,
  selectedSquareHighlightColor,
  legalMoveHighlightColor,
  alwaysKeepUserHighlights,
} = storeToRefs(settingsStore);
</script>
