<template>
  <div class="grow h-min">
    <CompactFormWrapper>
      <CompactFormSection open>
        <template #label>Your Name</template>
        <template #description
          >Your name gets displayed to your opponent and spectators</template
        >
        <CompactFormInputElement>
          <LargeTextInput v-model="userName" />
        </CompactFormInputElement>
      </CompactFormSection>
      <CompactFormSection open>
        <template #label>Chess Board</template>
        <template #description>Configure the chess board</template>
        <CompactFormInputElement>
          <template #label>Board Style</template>
          <template #description>Choose a board style that you like</template>
          <SmallPreviewOptionsGroup
            :options="[
              {
                value: ChessBoardColor.Neutral,
                label: 'Neutral',
              },
              {
                value: ChessBoardColor.HighContrast,
                label: 'Darker',
              },
              {
                value: ChessBoardColor.Wood,
                label: 'Wood',
              },
              {
                value: ChessBoardColor.Green,
                label: 'Green',
              },
              {
                value: ChessBoardColor.Blue,
                label: 'Blue',
              },
              {
                value: ChessBoardColor.Red,
                label: 'Red',
              },
              {
                value: ChessBoardColor.Orange,
                label: 'Orange',
              },
              {
                value: ChessBoardColor.Purple,
                label: 'Purple',
              },
              {
                value: ChessBoardColor.Pink,
                label: 'Pink',
              },
            ]"
            class="grid-cols-2 md:grid-cols-3"
            v-model="boardColor"
          >
            <template #preview="option">
              <svg viewBox="0 0 20 20">
                <rect
                  width="10"
                  height="10"
                  x="0"
                  y="0"
                  data-dark="false"
                  :class="getSquareColorClass(option.value)"
                />
                <rect
                  width="10"
                  height="10"
                  x="10"
                  y="0"
                  data-dark="true"
                  :class="getSquareColorClass(option.value)"
                />
                <rect
                  width="10"
                  height="10"
                  x="00"
                  y="10"
                  data-dark="true"
                  :class="getSquareColorClass(option.value)"
                />
                <rect
                  width="10"
                  height="10"
                  x="10"
                  y="10"
                  data-dark="false"
                  :class="getSquareColorClass(option.value)"
                />
              </svg>
            </template>
          </SmallPreviewOptionsGroup>
        </CompactFormInputElement>
        <CompactFormInputElement>
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
        </CompactFormInputElement>
        <CompactFormInputElement>
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
        </CompactFormInputElement>
        <CompactFormInputElement>
          <template #label>Board Orientation</template>
          <template #description>
            What side of the board is facing you. (is on the bottom of the
            screen)
          </template>
          <SmallOptionsGroup
            v-model="boardOrientation"
            :options="[
              {
                value: ChessBoardOrientation.PlayerBottom,
                label: 'Your side',
              },
              {
                value: ChessBoardOrientation.OpponentBottom,
                label: 'Opponent\'s side',
              },
              {
                value: ChessBoardOrientation.WhiteBottom,
                label: 'White',
              },
              {
                value: ChessBoardOrientation.BlackBottom,
                label: 'Black',
              },
            ]"
          />
        </CompactFormInputElement>
      </CompactFormSection>
      <CompactFormSection open>
        <template #label>Chess Pieces</template>
        <template #description
          >How chess pieces look like on the board</template
        >
        <CompactFormInputElement>
          <SmallPreviewOptionsGroup
            v-model="pieceSet"
            :options="[
              {
                value: PieceSet.Modern,
                label: 'Modern',
              },
              {
                value: PieceSet.Flat,
                label: 'Flat',
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
                value: PieceSet.Obfuscated,
                label: 'Obfuscated',
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
        </CompactFormInputElement>
        <CompactFormInputElement>
          <template #label>Piece Size</template>
          <template #description>How big do you like your chess?</template>
          <RangeInput
            v-model="piecesDisplaySize"
            :labels="[
              { value: 10, label: 'Ant' },
              { value: 50, label: 'Tiny' },
              { value: 80, label: 'Normal' },
              { value: 90, label: 'Bigger' },
              { value: 100, label: 'Huge' },
              { value: 150, label: 'Enormous' },
            ]"
            :min="10"
            :max="200"
            :step="10"
          />
        </CompactFormInputElement>
      </CompactFormSection>
      <CompactFormSection>
        <template #label>Highlight Squares</template>
        <template #description
          >What the computer should highlight for you</template
        >
        <CompactFormInputElement>
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
        </CompactFormInputElement>
        <CompactFormInputElement>
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
        </CompactFormInputElement>
        <CompactFormInputElement>
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
        </CompactFormInputElement>
      </CompactFormSection>
      <CompactFormSection>
        <template #label>Highlight Colors</template>
        <template #description>The color of highlights on the board</template>
        <CompactFormInputElement>
          <template #label>User Arrows</template>
          <template #description
            >The color of arrow you draw (hold and drag right click)</template
          >
          <SmallPreviewOptionsGroup
            :options="highlightOptions"
            class="grid-cols-2 md:grid-cols-3"
            v-model="userArrowColor"
          >
            <template #preview="option">
              <div class="w-full h-full" :class="option.userOptions.class" />
            </template>
          </SmallPreviewOptionsGroup>
        </CompactFormInputElement>
        <CompactFormInputElement>
          <template #label>User highlighted squares</template>
          <template #description
            >The color of squares you highlight (right click)</template
          >
          <SmallPreviewOptionsGroup
            :options="highlightOptions"
            class="grid-cols-2 md:grid-cols-3"
            v-model="userHighlightColor"
          >
            <template #preview="option">
              <div class="w-full h-full" :class="option.userOptions.class" />
            </template>
          </SmallPreviewOptionsGroup>
        </CompactFormInputElement>
        <CompactFormInputElement>
          <template #label>Last Move</template>
          <template #description
            >The color in which the last move gets highlighted</template
          >
          <SmallPreviewOptionsGroup
            :options="highlightOptions"
            class="grid-cols-2 md:grid-cols-3"
            v-model="lastMoveHighlightColor"
          >
            <template #preview="option">
              <div class="w-full h-full" :class="option.userOptions.class" />
            </template>
          </SmallPreviewOptionsGroup>
        </CompactFormInputElement>
        <CompactFormInputElement>
          <template #label>Selected Square</template>
          <template #description
            >The color in which the piece you are about to move gets
            highlighted</template
          >
          <SmallPreviewOptionsGroup
            :options="highlightOptions"
            class="grid-cols-2 md:grid-cols-3"
            v-model="selectedSquareHighlightColor"
          >
            <template #preview="option">
              <div class="w-full h-full" :class="option.userOptions.class" />
            </template>
          </SmallPreviewOptionsGroup>
        </CompactFormInputElement>
        <CompactFormInputElement>
          <template #label>Legal Moves</template>
          <template #description
            >The color in which legal moves of the selected piece get
            highlighted</template
          >
          <SmallPreviewOptionsGroup
            :options="highlightOptions"
            class="grid-cols-2 md:grid-cols-3"
            v-model="legalMoveHighlightColor"
          >
            <template #preview="option">
              <div class="w-full h-full" :class="option.userOptions.class" />
            </template>
          </SmallPreviewOptionsGroup>
        </CompactFormInputElement>
      </CompactFormSection>
      <CompactFormSection>
        <template #label>Notation</template>
        <template #description
          >How to notate the moves in the game history</template
        >
        <CompactFormInputElement>
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
        </CompactFormInputElement>
        <CompactFormInputElement>
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
        </CompactFormInputElement>
      </CompactFormSection>
      <CompactFormSection>
        <template #label>Animations</template>
        <template #description>How fast pieces move across the board</template>
        <CompactFormInputElement>
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
        </CompactFormInputElement>
      </CompactFormSection>
      <CompactFormSection>
        <template #label>Move style</template>
        <template #description> The way you make moves on the board </template>
        <CompactFormInputElement>
          <template #description>
            If moving pieces doesn't work with a touch screen try setting this
            to click only.
          </template>
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
        </CompactFormInputElement>
        <CompactFormInputElement>
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
        </CompactFormInputElement>
      </CompactFormSection>
    </CompactFormWrapper>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings";
import { NotationType } from "@/lib/chessNotation";
import {
  ChessBoardColor,
  ChessBoardBorder,
  PieceSet,
  MoveStyle,
  ClickDuration,
  AnimationDuration,
  PieceColor,
  PieceType,
  HighlightColor,
  ChessBoardOrientation,
} from "@/lib/types";
import { storeToRefs } from "pinia";
import SmallOptionsGroup from "@/components/forms/SmallOptionsGroup.vue";
import SmallPreviewOptionsGroup from "@/components/forms/SmallPreviewOptionsGroup.vue";
import PieceRenderer from "@/components/pieces/PieceRenderer.vue";
import { useUserStore } from "@/stores/user";
import LargeTextInput from "@/components/forms/LargeTextInput.vue";
import CompactFormWrapper from "@/components/forms/CompactFormWrapper.vue";
import CompactFormSection from "@/components/forms/CompactFormSection.vue";
import CompactFormInputElement from "@/components/forms/CompactFormInputElement.vue";
import { getSquareColorClass } from "@/lib/chessBoard";
import RangeInput from "@/components/forms/RangeInput.vue";

const settingsStore = useSettingsStore();

const userStore = useUserStore();

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
  boardOrientation,
  pieceSet,
  piecesDisplaySize,
  animationDuration,
  showCoordinates,
  userHighlightColor,
  userArrowColor,
  lastMoveHighlightColor,
  selectedSquareHighlightColor,
  legalMoveHighlightColor,
} = storeToRefs(settingsStore);

const { name: userName } = storeToRefs(userStore);

const highlightOptions = [
  {
    value: HighlightColor.White,
    label: "White",
    userOptions: {
      class: "bg-gray-200",
    },
  },
  {
    value: HighlightColor.Gray,
    label: "Gray",
    userOptions: {
      class: "bg-gray-500",
    },
  },
  {
    value: HighlightColor.Black,
    label: "Black",
    userOptions: {
      class: "bg-gray-700",
    },
  },
  {
    value: HighlightColor.Red,
    label: "Red",
    userOptions: {
      class: "bg-red-400",
    },
  },
  {
    value: HighlightColor.Orange,
    label: "Orange",
    userOptions: {
      class: "bg-orange-400",
    },
  },
  {
    value: HighlightColor.Yellow,
    label: "Yellow",
    userOptions: {
      class: "bg-amber-300",
    },
  },
  {
    value: HighlightColor.Green,
    label: "Green",
    userOptions: {
      class: "bg-green-300",
    },
  },
  {
    value: HighlightColor.Teal,
    label: "Teal",
    userOptions: {
      class: "bg-teal-300",
    },
  },
  {
    value: HighlightColor.LightBlue,
    label: "Sky Blue",
    userOptions: {
      class: "bg-sky-300",
    },
  },
  {
    value: HighlightColor.Blue,
    label: "Blue",
    userOptions: {
      class: "bg-blue-400",
    },
  },
  {
    value: HighlightColor.Purple,
    label: "Purple",
    userOptions: {
      class: "bg-purple-400",
    },
  },
  {
    value: HighlightColor.Pink,
    label: "Pink",
    userOptions: {
      class: "bg-pink-300",
    },
  },
];
</script>
