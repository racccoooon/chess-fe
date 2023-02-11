import eco from "@/assets/eco.json";
import { getGameNotation, NotationType } from "@/lib/chessNotation";
import type { MoveItem } from "@/lib/types";

export const getChessOpening = (moves: MoveItem[]) => {
  const notation = getGameNotation(moves, NotationType.Algebraic);

  return eco.find((eco) => {
    return notation.startsWith(eco.moves);
  });
};
