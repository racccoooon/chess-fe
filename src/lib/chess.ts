import { PieceColor } from "@/lib/types";

export const invertColor = (color: PieceColor) => {
  return color === PieceColor.White ? PieceColor.Black : PieceColor.White;
};
