import eco from "@/assets/eco.json";
import { getGameNotation, NotationType } from "@/lib/chessNotation";
import type { MoveItem } from "@/lib/types";

export const getChessOpening = (moves: MoveItem[]) => {
  const notation = getGameNotation(moves, NotationType.Algebraic);

  // sort by longest moves first
  eco.sort((a, b) => {
    return b.moves.length - a.moves.length;
  });

  return eco.find((eco) => {
    return notation.startsWith(eco.moves);
  });
};
