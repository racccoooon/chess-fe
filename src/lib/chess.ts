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

export const getPiecesByType = (
  pieces: Piece[],
  type: PieceType,
  color: PieceColor
) => {
  return pieces.filter((piece) => piece.type === type && piece.color === color);
};

export const getPieceAtSquare = (
  pieces: Piece[],
  x: number,
  y: number
): Piece | undefined => {
  return pieces.find((piece) => piece.x === x && piece.y === y);
};

/***
 * Returns the number of pieces of each type that have been captured by the given color
 * @param pieces
 * @param capturedBy The color of the player whose opponents pieces we want to count
 */
export const getCapturedPieces = (
  pieces: Piece[],
  capturedBy: PieceColor
): Record<PieceType, number> => {
  const normalValues: Record<PieceType, number> = {
    [PieceType.Pawn]: 8,
    [PieceType.Knight]: 2,
    [PieceType.Bishop]: 2,
    [PieceType.Rook]: 2,
    [PieceType.Queen]: 1,
    [PieceType.King]: 1,
  };

  const result: Record<PieceType, number> = {
    [PieceType.Pawn]: 0,
    [PieceType.Knight]: 0,
    [PieceType.Bishop]: 0,
    [PieceType.Rook]: 0,
    [PieceType.Queen]: 0,
    [PieceType.King]: 0,
  };

  for (const type of Object.keys(normalValues)) {
    const remaining = getPiecesByType(
      pieces,
      type as PieceType,
      invertColor(capturedBy)
    ).length;
    result[type as PieceType] = normalValues[type as PieceType] - remaining;
  }

  return result;
};
