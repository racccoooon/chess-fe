import {
  KingStatus,
  MoveType,
  Piece,
  PieceColor,
  PieceType,
} from "@/lib/types";
import type { MoveItem } from "@/lib/types";
import { getSquareName } from "@/lib/chessNotation";

export const invertColor = (color: PieceColor) => {
  return color === PieceColor.White ? PieceColor.Black : PieceColor.White;
};

export const isInCheck = (lastMove: MoveItem, color: PieceColor) => {
  return (
    lastMove.color === invertColor(color) &&
    (lastMove.status === KingStatus.IsCheck ||
      lastMove.status === KingStatus.IsCheckmate)
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

export const applyMove = (pieces: Piece[], move: MoveItem) => {
  // get the piece at the form cell
  const pieceToMove = getPieceAtSquare(pieces, move.from.x, move.from.y);

  // get the piece at the to cell
  let pieceToCapture = getPieceAtSquare(pieces, move.to.x, move.to.y);

  if (move.kind === MoveType.EnPassant) {
    pieceToCapture = getPieceAtSquare(pieces, move.to.x, move.from.y);
  }

  if (!pieceToMove) {
    throw new Error(
      `Cannot move piece that does not exist! ${move.color} ${
        move.type
      } at ${getSquareName(move.from.x, move.from.y)} to ${getSquareName(
        move.to.x,
        move.to.y
      )} (${move.kind})`
    );
  }

  // if there is a piece to capture, remove it from the pieces
  if (pieceToCapture) {
    pieces = pieces.filter((p) => p !== pieceToCapture);
  }

  // move the piece to its new position
  pieceToMove.x = move.to.x;
  pieceToMove.y = move.to.y;

  // if it's a castling move, move the rook
  if (move.kind === MoveType.Castling) {
    if (move.to.x === 2) {
      const rook = getPieceAtSquare(pieces, 0, move.to.y);
      if (rook) {
        rook.x = 3;
      }
    } else if (move.to.x === 6) {
      const rook = getPieceAtSquare(pieces, 7, move.to.y);
      if (rook) {
        rook.x = 5;
      }
    }
  }

  // if it's a promotion move, change the piece type
  if (move.kind === MoveType.Promotion) {
    pieceToMove.type = move.promoteToType as PieceType;
  }

  return pieces;
};
