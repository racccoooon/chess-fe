<template>
  <svg
    class="aspect-square select-none"
    :class="{
      'cursor-grab': isAllowedToInteractWithHoveredPiece && allowMoveByDragging,
      'cursor-pointer':
        (!isDragging && selectedPiece !== null) ||
        (isAllowedToInteractWithHoveredPiece &&
          allowMoveByClicking &&
          !allowMoveByDragging),
      'cursor-grabbing': isDragging,
    }"
    :viewBox="`0 0 ${squareAbsoluteWidth * 8 + borderAbsoluteSize * 2} ${
      squareAbsoluteHeight * 8 + borderAbsoluteSize * 2
    }`"
    @mousedown.left.prevent="handleMouseLeftDown"
    @mouseup.left.prevent="handleMouseLeftUp"
    @mousedown.right.prevent="handleMouseRightDown"
    @mouseup.right.prevent="handleMouseRightUp"
    @contextmenu.prevent
    ref="outerSvg"
  >
    <rect width="100%" height="100%" class="fill-gray-100 dark:fill-gray-800" />
    <g>
      <template v-if="borderAbsoluteSize > 0 && showCoordinates">
        <template v-for="i in 8" :key="i">
          <text
            :x="borderAbsoluteSize / 2"
            :y="(i - 1) * squareAbsoluteHeight + borderAbsoluteSize + 18"
            class="fill-gray-800 dark:fill-gray-100"
            font-size="20"
            font-weight="500"
            text-anchor="middle"
            dominant-baseline="middle"
            v-text="getRankName(displayYToBoardY(i - 1))"
          />
        </template>
        <template v-for="i in 8" :key="i">
          <text
            :x="i * squareAbsoluteWidth + borderAbsoluteSize - 18"
            :y="
              squareAbsoluteHeight * 8 +
              borderAbsoluteSize +
              borderAbsoluteSize / 2
            "
            class="fill-gray-800 dark:fill-gray-100"
            font-size="20"
            font-weight="500"
            text-anchor="middle"
            dominant-baseline="middle"
            v-text="getFileName(displayXToBoardX(i - 1))"
          />
        </template>
      </template>
    </g>
    <svg
      :x="borderAbsoluteSize"
      :y="borderAbsoluteSize"
      :width="squareAbsoluteWidth * 8"
      :height="squareAbsoluteHeight * 8"
      ref="innerSvg"
    >
      <g id="background">
        <template v-for="x in 8" :key="x">
          <template v-for="y in 8" :key="y">
            <rect
              :x="(x - 1) * squareAbsoluteWidth"
              :y="(y - 1) * squareAbsoluteHeight"
              :width="squareAbsoluteWidth"
              :height="squareAbsoluteHeight"
              :data-dark="!!((x + y) % 2)"
              :class="fillClass"
              class="transition duration-300 ease-in-out"
            />
          </template>
        </template>
      </g>
      <g id="highlightSquares">
        <template v-for="(highlight, index) in highlightSquares" :key="index">
          <g
            :transform="`
              translate(
                ${boardXToDisplayX(highlight.square.x) * squareAbsoluteWidth},
                ${boardYToDisplayY(highlight.square.y) * squareAbsoluteHeight}
            )`"
            :class="{
              'fill-gray-50/50 data-[dark=true]:fill-white/75':
                highlight.color === HighlightColor.Highlight,
              'fill-yellow-300/75': highlight.color === HighlightColor.Yellow,
              'fill-red-400/75 data-[dark=true]:fill-red-300/90':
                highlight.color === HighlightColor.Red,
              'fill-lime-400/75 data-[dark=true]:fill-lime-500/90':
                highlight.color === HighlightColor.Green,
              'fill-blue-400/75 data-[dark=true]:fill-blue-500/90':
                highlight.color === HighlightColor.Blue,
              'fill-purple-400/75 data-[dark=true]:fill-purple-500/90':
                highlight.color === HighlightColor.Purple,
            }"
          >
            <rect
              v-if="highlight.shape === HighlightShape.SquareFill"
              :width="squareAbsoluteWidth"
              :height="squareAbsoluteHeight"
              :data-dark="!((highlight.square.x + highlight.square.y) % 2)"
            />
            <path
              v-else-if="highlight.shape === HighlightShape.SquareOutline"
              d="M100,0L100,100L0,100L0,0L100,0ZM90,10L10,10L10,90L90,90L90,10Z"
              :data-dark="!((highlight.square.x + highlight.square.y) % 2)"
            />
            <circle
              v-if="highlight.shape === HighlightShape.Dot"
              cx="50"
              cy="50"
              r="18"
              :data-dark="!((highlight.square.x + highlight.square.y) % 2)"
            />
            <path
              v-else-if="highlight.shape === HighlightShape.CircleOutline"
              d="M50,0C77.596,0 100,22.404 100,50C100,77.596 77.596,100 50,100C22.404,100 0,77.596 0,50C0,22.404 22.404,0 50,0ZM50,10C72.077,10 90,27.923 90,50C90,72.077 72.077,90 50,90C27.923,90 10,72.077 10,50C10,27.923 27.923,10 50,10Z"
              :data-dark="!((highlight.square.x + highlight.square.y) % 2)"
            />
          </g>
        </template>
      </g>
      <template v-if="borderAbsoluteSize === 0 && showCoordinates">
        <g id="labels">
          <template v-for="i in 8" :key="i">
            <text
              :x="12"
              :y="(i - 1) * squareAbsoluteHeight + borderAbsoluteSize + 18"
              :data-dark="!!(i % 2)"
              :class="fillClass"
              class="transition duration-300 ease-in-out"
              font-size="20"
              font-weight="500"
              text-anchor="middle"
              dominant-baseline="middle"
              v-text="getRankName(displayYToBoardY(i - 1))"
            />
          </template>
          <template v-for="i in 8" :key="i">
            <text
              :x="i * squareAbsoluteWidth + borderAbsoluteSize - 18"
              :y="squareAbsoluteHeight * 8 - 12"
              :data-dark="!!((i + 1) % 2)"
              :class="fillClass"
              class="transition duration-300 ease-in-out"
              font-size="20"
              font-weight="500"
              text-anchor="middle"
              dominant-baseline="middle"
              v-text="getFileName(displayXToBoardX(i - 1))"
            />
          </template>
        </g>
      </template>
      <g id="pieces">
        <g
          v-for="piece in pieces"
          :key="objectHash(piece)"
          :transform="`
            translate(
              ${
                objectHash(piece) === objectHash(selectedPiece)
                  ? boardXToDisplayX(piece.x) * squareAbsoluteWidth +
                    dragMouseDeltaScaled.x
                  : boardXToDisplayX(piece.x) * squareAbsoluteWidth
              },
              ${
                objectHash(piece) === objectHash(selectedPiece)
                  ? boardYToDisplayY(piece.y) * squareAbsoluteHeight +
                    dragMouseDeltaScaled.y
                  : boardYToDisplayY(piece.y) * squareAbsoluteHeight
              }
            )
          `"
          :data-x="piece.x"
          :data-y="piece.y"
          :data-type="piece.type"
          :data-color="piece.color"
          :id="
            objectHash(piece) === objectHash(selectedPiece)
              ? 'selected-piece'
              : ''
          "
          ref="pieceElements"
        >
          <g transform="translate(0, 0)">
            <PieceRenderer
              :x="pieceAbsoluteOffset"
              :y="pieceAbsoluteOffset"
              :width="pieceAbsoluteSize"
              :height="pieceAbsoluteSize"
              :type="piece.type"
              :color="piece.color"
              :set="pieceSet"
              :style="{
                filter:
                  ((piece.color === PieceColor.White && isWhiteInCheck) ||
                    (piece.color === PieceColor.Black && isBlackInCheck)) &&
                  piece.type === PieceType.King &&
                  showCheck
                    ? 'drop-shadow(-4px -4px 1px rgba(239, 68, 68, 0.4)) \n' +
                      'drop-shadow(4px -4px 1px rgba(239, 68, 68, 0.4)) \n' +
                      'drop-shadow(4px 4px 1px rgba(239, 68, 68, 0.4))\n' +
                      'drop-shadow(-4px 4px 1px rgba(239, 68, 68, 0.4))'
                    : '',
              }"
              style="transform: translate(300px, 0)"
            />
          </g>
        </g>
      </g>
      <g>
        <use href="#selected-piece" v-if="selectedPiece" />
      </g>
      <g id="arrows">
        <template v-for="(arrow, index) in arrows" :key="index">
          <BoardArrowRenderer
            :arrow="arrow"
            :square-size="squareAbsoluteWidth"
            :reverse="reverse"
          />
        </template>
      </g>
    </svg>
  </svg>
</template>

<script setup lang="ts">
import PieceRenderer from "@/components/pieces/PieceRenderer.vue";
import type {
  BoardArrow,
  BoardHighlightSquare,
  Piece,
  PieceMovedEvent,
  PieceSelectedEvent,
  Square,
  Vector2,
} from "@/lib/types";
import {
  AnimationDuration,
  ChessBoardBorder,
  ChessBoardColor,
  HighlightColor,
  HighlightShape,
  MoveStyle,
  PieceColor,
  PiecesDisplaySize,
  PieceType,
} from "@/lib/types";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/stores/settings";
import { computed, nextTick, ref, toRef, watch } from "vue";
import { get, set, useMouse, useRefHistory } from "@vueuse/core";
import { getFileName, getRankName } from "@/lib/chessNotation";
import { getPieceAtSquare, getPieceSquare } from "@/lib/chess";
import objectHash from "object-hash";
import { gsap } from "gsap";
import BoardArrowRenderer from "@/components/board/BoardArrowRenderer.vue";

const props = defineProps<{
  pieces: Piece[];
  reverse: boolean;
  isWhiteInCheck: boolean;
  isBlackInCheck: boolean;
  allowInteractionWithWhite: boolean;
  allowInteractionWithBlack: boolean;
  highlightSquares: BoardHighlightSquare[];
}>();

const emit = defineEmits<{
  (event: "pieceSelected", payload: PieceSelectedEvent): void;
  (event: "pieceDeselected"): void;
  (event: "pieceMoved", payload: PieceMovedEvent): void;
}>();

const {
  preferredMoveStyle,
  clickDuration,
  boardColor,
  boardBorder,
  showCoordinates,
  pieceSet,
  piecesDisplaySize,
  animationDuration,
  showCheck,
  userHighlightColor,
  userArrowColor,
  selectedSquareHighlightColor,
} = storeToRefs(useSettingsStore());

const squareAbsoluteWidth = 100;
const squareAbsoluteHeight = 100;

const borderAbsoluteSize = computed(() => {
  switch (get(boardBorder)) {
    case ChessBoardBorder.None:
      return 0;
    case ChessBoardBorder.Thin:
      return 33;
    case ChessBoardBorder.Thick:
      return 48;
    default:
      return 0;
  }
});

// we make a reactive "copy" of the pieces from the props, so we can better watch for changes
const pieces = toRef(props, "pieces");

const { history: piecesHistory } = useRefHistory(pieces, {
  deep: true,
});

const outerSvg = ref<SVGSVGElement>();
const innerSvg = ref<SVGSVGElement>();

const pieceElements = ref<SVGElement[]>([]);

const dragMouseStart = ref<Vector2>({ x: 0, y: 0 });
const selectedPiece = ref<Piece | null>(null);
const isDragging = ref(false);
const mouseDownTime = ref(Date.now());

const lastMoveWasDragged = ref(false);
const lastSelectedPiece = ref<Piece | null>(null);

const highlightSelectedSquare = ref<Square | null>(null);

const userArrows = ref<BoardArrow[]>([]);
const userHighlights = ref<BoardHighlightSquare[]>([]);

const { x: mouseX, y: mouseY } = useMouse();

/***
 * watch for changes in pieces and animate them
 */
watch(
  pieces,
  async (newValue) => {
    if (get(animationDuration) === AnimationDuration.None) {
      return;
    }

    // we need to wait for the next tick to make sure the pieceElements are updated
    await nextTick();

    // get the old value from the history
    const oldValue = get(piecesHistory)[1].snapshot;

    // find the pieces that were added
    // we are looking for pieces in the new value that are not in the old value
    const addedPieces: Piece[] = newValue.filter((piece) => {
      return !oldValue.find((oldPiece) => {
        return objectHash(piece) === objectHash(oldPiece);
      });
    });

    // find pieces that were removed
    // we are looking for pieces in the old value that are not in the new value
    const removedPieces: Piece[] = oldValue.filter((piece) => {
      return !newValue.find((newPiece) => {
        return objectHash(piece) === objectHash(newPiece);
      });
    });

    if (!addedPieces || !removedPieces) {
      return;
    }

    // find out what piece moved from where to where
    // this is more guessing than actually knowing what happened,
    // but it works well enough if only 1 piece of same type and color moved
    addedPieces.forEach((addedPiece) => {
      removedPieces.forEach((removedPiece) => {
        if (
          addedPiece.type !== removedPiece.type ||
          addedPiece.color !== removedPiece.color
        ) {
          return;
        }

        // if the piece was just dragged, don't animate it
        if (
          get(lastSelectedPiece)?.x === addedPiece.x &&
          get(lastSelectedPiece)?.y === addedPiece.y &&
          get(lastMoveWasDragged)
        ) {
          return;
        }

        animatePiece(removedPiece, addedPiece);
      });
    });

    // reset the last move
    set(lastMoveWasDragged, false);
    set(lastSelectedPiece, null);
  },
  { deep: true }
);

const animatePiece = (from: Piece, to: Piece) => {
  // find the piece that was moved in pieceElements
  const movedPieceElement = get(pieceElements).find((pieceElement) => {
    return (
      pieceElement.attributes.getNamedItem("data-x")?.value ===
        to.x.toString() &&
      pieceElement.attributes.getNamedItem("data-y")?.value ===
        to.y.toString() &&
      pieceElement.attributes.getNamedItem("data-type")?.value ===
        to.type.toString() &&
      pieceElement.attributes.getNamedItem("data-color")?.value ===
        to.color.toString()
    );
  });

  if (!movedPieceElement) {
    return;
  }

  const diffX = to.x - from.x;
  const diffY = to.y - from.y;

  let absoluteOriginX = -diffX * squareAbsoluteWidth;
  let absoluteOriginY = diffY * squareAbsoluteHeight;

  if (props.reverse) {
    absoluteOriginX *= -1;
    absoluteOriginY *= -1;
  }

  const element = movedPieceElement?.children[0] as SVGElement;

  gsap.fromTo(
    element,
    {
      translateX: absoluteOriginX,
      translateY: absoluteOriginY,
    },
    {
      translateX: 0,
      translateY: 0,
      duration: get(animationDuration) / 1000,
      delay: 0.1,
      ease: "power2.inOut",
    }
  );
};

const allowMoveByDragging = computed(() => {
  return [MoveStyle.Both, MoveStyle.DragAndDropOnly].includes(
    get(preferredMoveStyle)
  );
});

const allowMoveByClicking = computed(() => {
  return [MoveStyle.Both, MoveStyle.ClickOnly].includes(
    get(preferredMoveStyle)
  );
});

const fillClass = computed(() => {
  switch (get(boardColor)) {
    case ChessBoardColor.Neutral:
      return "fill-gray-100 data-[dark=true]:fill-gray-500";
    case ChessBoardColor.Wood:
      return "fill-brown-200 data-[dark=true]:fill-brown-500";
    case ChessBoardColor.Green:
      return "fill-green-100 data-[dark=true]:fill-green-500";
    case ChessBoardColor.Blue:
      return "fill-blue-200 data-[dark=true]:fill-blue-500";
    case ChessBoardColor.Red:
      return "fill-red-200 data-[dark=true]:fill-red-500";
    case ChessBoardColor.Orange:
      return "fill-orange-100 data-[dark=true]:fill-orange-400";
    case ChessBoardColor.Purple:
      return "fill-purple-100 data-[dark=true]:fill-purple-500";
    case ChessBoardColor.Pink:
      return "fill-pink-200 data-[dark=true]:fill-pink-400";
    case ChessBoardColor.HighContrast:
      return "fill-white data-[dark=true]:fill-gray-800";
    default:
      return "";
  }
});

const pieceAbsoluteSize = computed(() => {
  switch (get(piecesDisplaySize)) {
    case PiecesDisplaySize.Small:
      return 50;
    case PiecesDisplaySize.Medium:
      return 80;
    case PiecesDisplaySize.Large:
      return 90;
    case PiecesDisplaySize.ExtraLarge:
      return 100;
    default:
      return 80;
  }
});

const pieceAbsoluteOffset = computed(() => {
  return (squareAbsoluteWidth - get(pieceAbsoluteSize)) / 2;
});

const highlightSquares = computed((): BoardHighlightSquare[] => {
  const arr = [...props.highlightSquares];

  if (get(selectedPiece) && !get(isDragging)) {
    arr.push({
      square: getPieceSquare(get(selectedPiece)!),
      color: get(selectedSquareHighlightColor),
      shape: HighlightShape.SquareFill,
    });
  }

  if (get(hoveredSquare) && get(selectedPiece)) {
    arr.push({
      square: get(hoveredSquare)!,
      color: HighlightColor.Highlight,
      shape: HighlightShape.SquareOutline,
    });
  }

  arr.push(...get(userHighlights));

  return arr;
});

const arrows = computed(() => {
  return get(userArrows);
});

const displayXToBoardX = (x: number) => {
  if (props.reverse) {
    return 7 - x;
  } else {
    return x;
  }
};

const displayYToBoardY = (y: number) => {
  if (props.reverse) {
    return y;
  } else {
    return 7 - y;
  }
};

const boardXToDisplayX = (x: number) => {
  if (props.reverse) {
    return 7 - x;
  } else {
    return x;
  }
};

const boardYToDisplayY = (y: number) => {
  if (props.reverse) {
    return y;
  } else {
    return 7 - y;
  }
};

const displayPositionToBoardPosition = (
  x: number,
  y: number
): Square | null => {
  if (!get(innerSvg)) {
    return null;
  }

  const rect = get(innerSvg)!.getBoundingClientRect();

  const realX = x - rect.left;
  const realY = y - rect.top;

  const boardX = displayXToBoardX(Math.floor((realX / rect.width) * 8));
  const boardY = displayYToBoardY(Math.floor((realY / rect.height) * 8));

  return { x: boardX, y: boardY };
};

const handleMouseLeftDown = () => {
  set(userArrows, []);
  set(userHighlights, []);

  if (get(selectedPiece)) {
    stopMove();
    return;
  }

  if (get(allowMoveByDragging)) {
    startMove();
  }

  set(mouseDownTime, Date.now());
};

const handleMouseLeftUp = () => {
  if (Date.now() - get(mouseDownTime) < get(clickDuration)) {
    if (!get(allowMoveByClicking)) {
      deselect();
      return;
    }

    if (!get(allowMoveByDragging)) {
      startMove();
      return;
    }

    if (get(allowMoveByDragging)) {
      set(isDragging, false);
      return;
    }
  }

  stopMove();
};

const handleMouseRightDown = () => {
  if (get(selectedPiece)) {
    deselect();
    return;
  }

  startHighlighting();
};

const handleMouseRightUp = () => {
  stopHighlighting();
};

const startMove = () => {
  if (!get(allowMoveByDragging) && !get(allowMoveByClicking)) {
    return;
  }

  if (get(selectedPiece)) {
    return;
  }

  if (!get(hoveredPiece)) {
    return;
  }

  if (!get(isAllowedToInteractWithHoveredPiece)) {
    return;
  }

  set(selectedPiece, get(hoveredPiece));

  if (get(allowMoveByDragging)) {
    set(dragMouseStart, { x: get(mouseX), y: get(mouseY) });
    set(isDragging, true);
  }

  emit("pieceSelected", { piece: get(hoveredPiece)! });
};

const stopMove = () => {
  if (!get(hoveredSquare)) {
    deselect();
    return;
  }

  // if the hovered square is not the same as the selected piece, move the piece
  if (
    get(hoveredSquare)!.x !== get(selectedPiece)?.x ||
    get(hoveredSquare)!.y !== get(selectedPiece)?.y
  ) {
    emit("pieceMoved", {
      piece: get(selectedPiece)!,
      to: get(hoveredSquare)!,
    });

    set(lastSelectedPiece, get(selectedPiece));
    set(lastMoveWasDragged, get(allowMoveByDragging) && get(isDragging));

    set(dragMouseStart, { x: 0, y: 0 });
    set(isDragging, false);
    set(selectedPiece, null);

    return;
  }

  deselect();
};

const deselect = () => {
  emit("pieceDeselected");
  set(dragMouseStart, { x: 0, y: 0 });
  set(selectedPiece, null);
  set(isDragging, false);
};

const startHighlighting = () => {
  set(highlightSelectedSquare, get(hoveredSquare));
};

const stopHighlighting = () => {
  if (
    get(highlightSelectedSquare)?.x === get(hoveredSquare)?.x &&
    get(highlightSelectedSquare)?.y === get(hoveredSquare)?.y
  ) {
    // if the user already has a highlight on the hovered square, stop
    if (
      get(userHighlights).find(
        (h) =>
          h.square.x === get(hoveredSquare)?.x &&
          h.square.y === get(hoveredSquare)?.y
      )
    ) {
      return;
    }

    set(userHighlights, [
      ...get(userHighlights),
      {
        square: get(highlightSelectedSquare)!,
        color: get(userHighlightColor),
        shape: HighlightShape.SquareFill,
      },
    ]);
  } else {
    // if the user already has an arrow from the selected square to the hovered square, stop
    if (
      get(userArrows).find(
        (a) =>
          a.from.x === get(highlightSelectedSquare)?.x &&
          a.from.y === get(highlightSelectedSquare)?.y &&
          a.to.x === get(hoveredSquare)?.x &&
          a.to.y === get(hoveredSquare)?.y
      )
    ) {
      return;
    }

    set(userArrows, [
      ...get(userArrows),
      {
        from: get(highlightSelectedSquare)!,
        to: get(hoveredSquare)!,
        color: get(userArrowColor),
      },
    ]);
  }

  set(highlightSelectedSquare, null);
};

const hoveredSquare = computed(() => {
  return displayPositionToBoardPosition(get(mouseX), get(mouseY));
});

const hoveredPiece = computed(() => {
  return getPieceAtSquare(
    props.pieces,
    get(hoveredSquare)?.x ?? -1,
    get(hoveredSquare)?.y ?? -1
  );
});

const isHoveringPiece = computed(() => {
  return get(hoveredPiece) !== undefined;
});

const isAllowedToInteractWithHoveredPiece = computed(() => {
  if (!get(isHoveringPiece)) {
    return false;
  }

  return !(
    (get(hoveredPiece)!.color === PieceColor.White &&
      !props.allowInteractionWithWhite) ||
    (get(hoveredPiece)!.color === PieceColor.Black &&
      !props.allowInteractionWithBlack)
  );
});

const dragMouseDelta = computed(() => {
  if (!get(isDragging)) return { x: 0, y: 0 };

  return {
    x: get(mouseX) - get(dragMouseStart).x,
    y: get(mouseY) - get(dragMouseStart).y,
  };
});

const dragMouseDeltaScaled = computed(() => {
  const outerRect = get(outerSvg)!.getBoundingClientRect();
  const innerRect = get(innerSvg)!.getBoundingClientRect();

  const scale = (8 / 7) * (outerRect.width / innerRect.width);

  return {
    x: get(dragMouseDelta).x * scale,
    y: get(dragMouseDelta).y * scale,
  };
});
</script>
