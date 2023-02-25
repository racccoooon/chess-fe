import type { MoveItem, Piece } from "@/lib/types";
import { KingStatus, MoveType, PieceColor, PieceType } from "@/lib/types";
import { getPiecesThatCanMoveToSquare } from "@/lib/chess";

export enum NotationType {
  Algebraic = "algebraic",
  LongAlgebraic = "longAlgebraic",
  Spoken = "spoken",
}

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
      return "";
    case PieceType.Rook:
      return pieceColor === PieceColor.White ? "♜" : "♖";
    case PieceType.Knight:
      return pieceColor === PieceColor.White ? "♞" : "♘";
    case PieceType.Bishop:
      return pieceColor === PieceColor.White ? "♝" : "♗";
    case PieceType.Queen:
      return pieceColor === PieceColor.White ? "♛" : "♕";
    case PieceType.King:
      return pieceColor === PieceColor.White ? "♚" : "♔";
  }
};

export const getPieceName = (type: PieceType) => {
  switch (type) {
    case PieceType.Pawn:
      return "pawn";
    case PieceType.Rook:
      return "rook";
    case PieceType.Knight:
      return "knight";
    case PieceType.Bishop:
      return "bishop";
    case PieceType.Queen:
      return "queen";
    case PieceType.King:
      return "king";
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
  return y + 1;
};

export const getSquareName = (x: number, y: number) => {
  return `${getFileName(x)}${getRankName(y)}`;
};

export const getMoveNotation = (
  move: MoveItem,
  notationType: NotationType,
  useUnicodeIcons: boolean,
  pieces?: Piece[],
  history?: MoveItem[]
) => {
  if (notationType === NotationType.Spoken) {
    return getSpokenMoveNotation(move);
  }

  const from = getSquareName(move.from.x, move.from.y);
  const to = getSquareName(move.to.x, move.to.y);
  const piece = getPieceNotation(move.type, useUnicodeIcons, move.color);

  let idPiece = "";

  if (move.captures && move.type === PieceType.Pawn) {
    idPiece = getFileName(move.from.x);
  }

  if (pieces && history) {
    let pieceOnSameFile = false;
    let pieceOnSameRank = false;

    // check if there are any other pieces of same type and color that can move to the same square
    getPiecesThatCanMoveToSquare(pieces, move.to, history).forEach((piece) => {
      if (piece.type === move.type && piece.color === move.color) {
        if (piece.x !== move.from.x) {
          pieceOnSameFile = true;
        } else if (piece.y !== move.from.y) {
          pieceOnSameRank = true;
        }
      }
    });

    if (pieceOnSameFile) {
      idPiece = getFileName(move.from.x);
    }
    if (pieceOnSameRank) {
      idPiece += getRankName(move.from.y);
    }
  }

  let suffix = "";

  if (move.kind === MoveType.Promotion && move.promoteToType) {
    suffix = `=${getPieceNotation(
      move.promoteToType,
      useUnicodeIcons,
      move.color
    )}`;
  }

  if (move.status === KingStatus.IsCheck) {
    suffix += "+";
  } else if (move.status === KingStatus.IsCheckmate) {
    suffix += "#";
  }

  if (move.kind === MoveType.EnPassant && suffix.length === 0) {
    suffix += " e.p.";
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

  if (notationType === NotationType.Algebraic) {
    if (move.captures) {
      return `${piece}${idPiece}x${to}${suffix}`;
    }

    return `${piece}${idPiece}${to}${suffix}`;
  } else if (notationType === NotationType.LongAlgebraic) {
    if (move.captures) {
      return `${piece}${from}x${to}${suffix}`;
    }

    return `${piece}${from}-${to}${suffix}`;
  }

  return "";
};

export const asyncGetMoveNotation = async (
  move: MoveItem,
  notationType: NotationType,
  useUnicodeIcons: boolean,
  pieces?: Piece[],
  history?: MoveItem[]
) => {
  return new Promise<string>((resolve) => {
    const res = getMoveNotation(
      move,
      notationType,
      useUnicodeIcons,
      pieces,
      history
    );
    resolve(res);
  });
};

export const getSpokenMoveNotation = (move: MoveItem) => {
  const from = getSquareName(move.from.x, move.from.y);
  const to = getSquareName(move.to.x, move.to.y);
  const piece = getPieceName(move.type);

  let suffix = "";

  if (move.kind === MoveType.Promotion && move.promoteToType) {
    suffix += `promotes to ${getPieceName(move.promoteToType)}`;
  }

  if (move.status === KingStatus.IsCheck) {
    if (suffix !== ",") {
      suffix += " and ";
    }
    suffix += "check";
  } else if (move.status === KingStatus.IsCheckmate) {
    if (suffix.length > 0) {
      suffix += " and ";
    }
    suffix += "checkmate";
  }

  if (move.kind === MoveType.EnPassant) {
    if (suffix.length > 0) {
      suffix += " and ";
    }
    suffix += " e.p.";
  }

  // if move is castling return O-O or O-O-O notation
  // we can ignore everything else because it is not possible to perform a castle that results in a check
  if (move.kind === MoveType.Castling) {
    if (move.from.x === 4) {
      if (move.to.x === 6) {
        return "king-side castle";
      } else if (move.to.x === 2) {
        return "queen-side castle";
      }
    }
  }

  if (move.captures) {
    return `${piece} ${from} captures ${to}${
      suffix.length > 0 ? ", " : ""
    }${suffix}`;
  }

  return `${piece} ${from} to ${to}${suffix.length > 0 ? "," : ""}${suffix}`;
};

export const getGameNotation = (
  moves: MoveItem[],
  notationType: NotationType
) => {
  const gameNotation: string[] = [];
  let moveNumber = 1;

  moves.forEach((move, index) => {
    if (index % 2 === 0) {
      gameNotation.push(`${moveNumber}.`);
      moveNumber++;
    }

    gameNotation.push(getMoveNotation(move, notationType, false) as string);
  });

  return gameNotation.join(" ");
};
