import type { MoveItem } from "@/lib/types";
import { KingStatus, MoveType, PieceColor, PieceType } from "@/lib/types";

export const getStandardPieceNotation = (type: PieceType) => {
  switch (type) {
    case PieceType.Pawn:
      return "";
    case PieceType.Rook:
      return "R";
    case PieceType.Knight:
      return "N";
    case PieceType.Bishop:
      return "B";
    case PieceType.Queen:
      return "Q";
    case PieceType.King:
      return "K";
  }
};

export const getUnicodePieceNotation = (
  type: PieceType,
  pieceColor: PieceColor
) => {
  switch (type) {
    case PieceType.Pawn:
      return pieceColor === PieceColor.White ? "♙" : "♟";
    case PieceType.Rook:
      return pieceColor === PieceColor.White ? "♖" : "♜";
    case PieceType.Knight:
      return pieceColor === PieceColor.White ? "♘" : "♞";
    case PieceType.Bishop:
      return pieceColor === PieceColor.White ? "♗" : "♝";
    case PieceType.Queen:
      return pieceColor === PieceColor.White ? "♕" : "♛";
    case PieceType.King:
      return pieceColor === PieceColor.White ? "♔" : "♚";
  }
};

export const getPieceNotation = (
  type: PieceType,
  useUnicodeIcons: boolean,
  pieceColor: PieceColor
) => {
  if (useUnicodeIcons) {
    return getUnicodePieceNotation(type, pieceColor);
  } else {
    return getStandardPieceNotation(type);
  }
};

export const getFileName = (x: number) => {
  return String.fromCharCode(97 + x);
};

export const getRankName = (y: number) => {
  return 8 - y;
};

export const getSquareName = (x: number, y: number) => {
  return `${getFileName(x)}${getRankName(y)}`;
};

export const getMoveNotation = (move: MoveItem, useUnicodeIcons: boolean) => {
  const from = getSquareName(move.from.x, move.from.y);
  const to = getSquareName(move.to.x, move.to.y);
  const piece = getPieceNotation(move.type, useUnicodeIcons, move.color);

  let suffix = "";
  if (move.kind === MoveType.EnPassant) {
    suffix = " e.p.";
  } else if (move.kind === MoveType.Promotion && move.promoteToType) {
    suffix = `=${getPieceNotation(
      move.promoteToType,
      useUnicodeIcons,
      move.color
    )}`;
  } else if (move.status === KingStatus.IsCheck) {
    suffix = "+";
  } else if (move.status === KingStatus.IsCheckmate) {
    suffix = "#";
  }

  // if move is castling return O-O or O-O-O notation
  // we can ignore everything else because it is not possible to perform a castle that results in a check
  if (move.kind === MoveType.Castling) {
    if (move.from.x === 4) {
      if (move.to.x === 6) {
        return "O-O";
      } else if (move.to.x === 2) {
        return "O-O-O";
      }
    }
  }

  if (move.captures) {
    return `${piece}${from}x${to}${suffix}`;
  }

  return `${piece}${from}-${to}${suffix}`;
};
