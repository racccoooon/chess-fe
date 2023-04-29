<template>
  <svg
    class="board aspect-square select-none"
    :class="{
      'cursor-grab': isAllowedToInteractWithHoveredPiece && allowMoveByDragging,
      'cursor-pointer':
        (!isDragging && selectedPiece !== null) ||
        (isAllowedToInteractWithHoveredPiece &&
          allowMoveByClicking &&
          !allowMoveByDragging) ||
        pointerMode === BoardPointerMode.Paint ||
        pointerMode === BoardPointerMode.Erase,
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
            :class="getHighlightFillClass(highlight.color)"
            :data-dark="!((highlight.square.x + highlight.square.y) % 2)"
            opacity="0.8"
          >
            <rect
              v-if="highlight.shape === HighlightShape.SquareFill"
              :width="squareAbsoluteWidth"
              :height="squareAbsoluteHeight"
            />
            <path
              v-else-if="highlight.shape === HighlightShape.SquareOutline"
              d="M89,5C90.591,5 92.117,5.632 93.243,6.757C94.368,7.883 95,9.409 95,11L95,89C95,90.591 94.368,92.117 93.243,93.243C92.117,94.368 90.591,95 89,95L11,95C9.409,95 7.883,94.368 6.757,93.243C5.632,92.117 5,90.591 5,89L5,11C5,9.409 5.632,7.883 6.757,6.757C7.883,5.632 9.409,5 11,5L89,5ZM87.5,15.5C87.5,14.704 87.184,13.941 86.621,13.379C86.059,12.816 85.296,12.5 84.5,12.5L15.5,12.5C14.704,12.5 13.941,12.816 13.379,13.379C12.816,13.941 12.5,14.704 12.5,15.5L12.5,84.5C12.5,85.296 12.816,86.059 13.379,86.621C13.941,87.184 14.704,87.5 15.5,87.5L84.5,87.5C85.296,87.5 86.059,87.184 86.621,86.621C87.184,86.059 87.5,85.296 87.5,84.5L87.5,15.5Z"
            />
            <circle
              v-if="highlight.shape === HighlightShape.Dot"
              cx="50"
              cy="50"
              r="18"
            />
            <path
              v-else-if="highlight.shape === HighlightShape.CircleOutline"
              d="M50,5C74.853,5 95,25.147 95,50C95,50 95,50 95,50C95,74.853 74.853,95 50,95C50,95 50,95 50,95C25.147,95 5,74.853 5,50C5,50 5,50 5,50C5,25.147 25.147,5 50,5L50,5ZM87.5,49.998C87.5,40.053 83.549,30.515 76.517,23.483C69.485,16.451 59.947,12.5 50.002,12.5L49.998,12.5C40.053,12.5 30.515,16.451 23.483,23.483C16.451,30.515 12.5,40.053 12.5,49.998L12.5,50.002C12.5,59.947 16.451,69.485 23.483,76.517C30.515,83.549 40.053,87.5 49.998,87.5L50.002,87.5C59.947,87.5 69.485,83.549 76.517,76.517C83.549,69.485 87.5,59.947 87.5,50.002L87.5,49.998Z"
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
          :key="idPiece(piece)"
          :transform="`
            translate(
              ${
                idPiece(piece) === idPiece(selectedPiece)
                  ? mouseDragAbsolutePosition.x
                  : boardXToDisplayX(piece.x) * squareAbsoluteWidth
              },
              ${
                idPiece(piece) === idPiece(selectedPiece)
                  ? mouseDragAbsolutePosition.y
                  : boardYToDisplayY(piece.y) * squareAbsoluteHeight
              }
            )
          `"
          :data-x="piece.x"
          :data-y="piece.y"
          :data-type="piece.type"
          :data-color="piece.color"
          :id="
            idPiece(piece) === idPiece(selectedPiece) ? 'selected-piece' : ''
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
            />
          </g>
        </g>
      </g>
      <g>
        <use href="#selected-piece" v-if="selectedPiece" />
      </g>
      <g id="arrows" opacity="0.8">
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
  PieceErasedEvent,
  PieceMovedEvent,
  PiecePaintedEvent,
  PieceSelectedEvent,
  Square,
  Vector2,
} from "@/lib/types";
import {
  AnimationDuration,
  BoardPointerMode,
  ChessBoardBorder,
  HighlightColor,
  HighlightShape,
  MoveStyle,
  PieceColor,
  PieceType,
} from "@/lib/types";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/stores/settings";
import { computed, nextTick, ref, toRef, watch } from "vue";
import { clamp, get, set, useMouse, useRefHistory } from "@vueuse/core";
import { getFileName, getRankName } from "@/lib/chessNotation";
import { getPieceAtSquare, getPieceSquare } from "@/lib/chess";
import objectHash from "object-hash";
import { gsap } from "gsap";
import BoardArrowRenderer from "@/components/board/BoardArrowRenderer.vue";
import { getHighlightFillClass, getSquareColorClass } from "@/lib/chessBoard";

const props = defineProps<{
  pieces: Piece[];
  reverse: boolean;
  isWhiteInCheck: boolean;
  isBlackInCheck: boolean;
  allowInteractionWithWhite: boolean;
  allowInteractionWithBlack: boolean;
  highlightSquares: BoardHighlightSquare[];
  pointerMode: BoardPointerMode;
  paintPieceType: PieceType;
  paintPieceColor: PieceColor;
}>();

const emit = defineEmits<{
  (event: "pieceSelected", payload: PieceSelectedEvent): void;
  (event: "pieceDeselected"): void;
  (event: "pieceMoved", payload: PieceMovedEvent): void;
  (event: "piecePainted", payload: PiecePaintedEvent): void;
  (event: "pieceErased", payload: PieceErasedEvent): void;
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

const userHighlightsByBoardPosition = ref<
  Record<string, { arrows: BoardArrow[]; squares: BoardHighlightSquare[] }>
>({});

const { x: mouseX, y: mouseY } = useMouse({
  type: "client",
});

watch(
  pieces,
  (newValue, oldValue) => {
    const newHash = objectHash(newValue);
    const oldHash = objectHash(oldValue);

    get(userHighlightsByBoardPosition)[oldHash] = {
      arrows: get(userArrows),
      squares: get(userHighlights),
    };

    set(userArrows, []);
    set(userHighlights, []);

    const storedHighlights = get(userHighlightsByBoardPosition)[newHash];

    if (storedHighlights) {
      set(userArrows, storedHighlights.arrows);
      set(userHighlights, storedHighlights.squares);
    }
  },
  { deep: true }
);

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
        return (
          piece.type === oldPiece.type &&
          piece.color === oldPiece.color &&
          piece.x === oldPiece.x &&
          piece.y === oldPiece.y
        );
      });
    });

    // find pieces that were removed
    // we are looking for pieces in the old value that are not in the new value
    const removedPieces: Piece[] = oldValue.filter((piece) => {
      return !newValue.find((newPiece) => {
        return (
          piece.type === newPiece.type &&
          piece.color === newPiece.color &&
          piece.x === newPiece.x &&
          piece.y === newPiece.y
        );
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
      ease: "power2.inOut",
    }
  );
};

const idPiece = (piece: Piece | null | undefined) => {
  if (!piece) {
    return "";
  }
  return `${piece.type}-${piece.color}-${piece.x}-${piece.y}`;
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
  return getSquareColorClass(get(boardColor));
});

const pieceAbsoluteSize = computed(() => {
  return clamp(get(piecesDisplaySize) as number, 10, 200) || 80;
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
      color: HighlightColor.White,
      shape: HighlightShape.SquareOutline,
    });
  }

  arr.push(...get(userHighlights));

  return arr;
});

const arrows = computed(() => {
  const arr = [...get(userArrows)];

  if (
    get(highlightSelectedSquare) &&
    get(hoveredSquare) &&
    !(
      get(highlightSelectedSquare)!.x === get(hoveredSquare)!.x &&
      get(highlightSelectedSquare)!.y === get(hoveredSquare)!.y
    )
  ) {
    arr.push({
      from: get(highlightSelectedSquare)!,
      to: get(hoveredSquare)!,
      color: get(userArrowColor),
    });
  }

  return arr;
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

  if (get(allowMoveByDragging) && props.pointerMode === BoardPointerMode.Move) {
    startMove();
  }

  set(mouseDownTime, Date.now());
};

const handleMouseLeftUp = () => {
  if (props.pointerMode === BoardPointerMode.Paint) {
    paintPiece();
    return;
  }

  if (props.pointerMode === BoardPointerMode.Erase) {
    erasePiece();
    return;
  }

  if (Date.now() - get(mouseDownTime) < get(clickDuration)) {
    if (!get(allowMoveByClicking)) {
      deselect();
      return;
    }

    if (
      !get(allowMoveByDragging) &&
      props.pointerMode === BoardPointerMode.Move
    ) {
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

  if (props.pointerMode === BoardPointerMode.Move) {
    startHighlighting();
  }
};

const handleMouseRightUp = () => {
  if (props.pointerMode === BoardPointerMode.Paint) {
    erasePiece();
    return;
  }

  stopHighlighting();
};

const paintPiece = () => {
  if (!get(hoveredSquare)) {
    return;
  }

  emit("piecePainted", {
    type: props.paintPieceType!,
    color: props.paintPieceColor!,
    square: get(hoveredSquare)!,
  });
};

const erasePiece = () => {
  if (!get(hoveredSquare)) {
    return;
  }

  emit("pieceErased", {
    square: get(hoveredSquare)!,
  });
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
  if (!get(hoveredSquare)) {
    set(highlightSelectedSquare, null);
    return;
  }

  if (!get(highlightSelectedSquare)) {
    set(highlightSelectedSquare, null);
    return;
  }

  if (
    get(highlightSelectedSquare)!.x === get(hoveredSquare)!.x &&
    get(highlightSelectedSquare)!.y === get(hoveredSquare)!.y
  ) {
    // if the user already has a highlight on the hovered square, remove it
    if (
      get(userHighlights).find(
        (h) =>
          h.square.x === get(hoveredSquare)!.x &&
          h.square.y === get(hoveredSquare)!.y
      )
    ) {
      set(
        userHighlights,
        get(userHighlights).filter(
          (h) =>
            !(
              h.square.x === get(hoveredSquare)!.x &&
              h.square.y === get(hoveredSquare)!.y
            )
        )
      );
      return;
    } else {
      set(userHighlights, [
        ...get(userHighlights),
        {
          square: get(highlightSelectedSquare)!,
          color: get(userHighlightColor),
          shape: HighlightShape.SquareFill,
        },
      ]);
    }
  } else {
    // if the user already has an arrow from the selected square to the hovered square, remove it
    if (
      get(userArrows).find(
        (a) =>
          a.from.x === get(highlightSelectedSquare)!.x &&
          a.from.y === get(highlightSelectedSquare)!.y &&
          a.to.x === get(hoveredSquare)!.x &&
          a.to.y === get(hoveredSquare)!.y
      )
    ) {
      set(
        userArrows,
        get(userArrows).filter(
          (a) =>
            a.from.x !== get(highlightSelectedSquare)!.x ||
            a.from.y !== get(highlightSelectedSquare)!.y ||
            a.to.x !== get(hoveredSquare)!.x ||
            a.to.y !== get(hoveredSquare)!.y
        )
      );
    } else {
      set(userArrows, [
        ...get(userArrows),
        {
          from: get(highlightSelectedSquare)!,
          to: get(hoveredSquare)!,
          color: get(userArrowColor),
        },
      ]);
    }
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

/***
 * position of piece being dragged, does not produce a value when no piece is being dragged
 */
const mouseDragAbsolutePosition = computed(() => {
  if (get(selectedPiece) && !get(innerSvg)) {
    return { x: -1, y: -1 };
  }

  const rect = get(innerSvg)!.getBoundingClientRect();

  const realX = get(mouseX) - rect.left;
  const realY = get(mouseY) - rect.top;

  const boardX = displayXToBoardX((realX / rect.width) * 8);
  const boardY = displayYToBoardY((realY / rect.height) * 8);

  // mirror depending on orientation
  const displayX = boardXToDisplayX(boardX);
  const displayY = boardYToDisplayY(boardY);

  // scale to display size
  const scaledX = displayX * get(squareAbsoluteWidth);
  const scaledY = displayY * get(squareAbsoluteHeight);

  // move to center of mouse
  const offsetX = scaledX - get(squareAbsoluteWidth) / 2;
  const offsetY = scaledY - get(squareAbsoluteHeight) / 2;

  return { x: offsetX, y: offsetY };
});

defineExpose({
  hoveredSquare,
  selectedPiece,
});
</script>

<style>
svg.board {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
