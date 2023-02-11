import { KingStatus, Piece, PieceColor, PieceType } from "@/lib/types";
import type { MoveItem } from "@/lib/types";

export const invertColor = (color: PieceColor) => {
  return color === PieceColor.White ? PieceColor.Black : PieceColor.White;
};

export const isInCheck = (lastMove: MoveItem, color: PieceColor) => {
  return (
    lastMove.color === invertColor(color) &&
    lastMove.status === KingStatus.IsCheck
  );
};

export const getPieceMaterialValue = (type: PieceType) => {
  switch (type) {
    case PieceType.Pawn:
      return 1;
    case PieceType.Knight:
    case PieceType.Bishop:
      return 3;
    case PieceType.Rook:
      return 5;
    case PieceType.Queen:
      return 9;
    case PieceType.King:
      return 0;
  }
};

export const getPiecesByColor = (pieces: Piece[], color: PieceColor) => {
  return pieces.filter((piece) => piece.color === color);
};

export const getMaterialValue = (pieces: Piece[]) => {
  return pieces.reduce((sum, piece) => {
    return sum + getPieceMaterialValue(piece.type);
  }, 0);
};

export const getMaterialValueByColor = (pieces: Piece[], color: PieceColor) => {
  return getMaterialValue(getPiecesByColor(pieces, color));
};
