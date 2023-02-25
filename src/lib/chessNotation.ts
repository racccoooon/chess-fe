import type { MoveItem, Piece, Square } from "@/lib/types";
import { KingStatus, MoveType, PieceColor, PieceType } from "@/lib/types";
import {
  applyMove,
  getPieceSquare,
  getPiecesThatCanMoveToSquare,
  invertColor,
} from "@/lib/chess";

export enum NotationType {
  Algebraic = "algebraic",
  LongAlgebraic = "longAlgebraic",
  Spoken = "spoken",
}

export const pieceStandardChar: Record<PieceType, string> = {
  [PieceType.Pawn]: "",
  [PieceType.Rook]: "R",
  [PieceType.Knight]: "N",
  [PieceType.Bishop]: "B",
  [PieceType.Queen]: "Q",
  [PieceType.King]: "K",
};

export const pieceUnicodeChar: Record<PieceType, string> = {
  [PieceType.Pawn]: "",
  [PieceType.Rook]: "♜",
  [PieceType.Knight]: "♞",
  [PieceType.Bishop]: "♝",
  [PieceType.Queen]: "♛",
  [PieceType.King]: "♚",
};

export const pieceName: Record<PieceType, string> = {
  [PieceType.Pawn]: "pawn",
  [PieceType.Rook]: "rook",
  [PieceType.Knight]: "knight",
  [PieceType.Bishop]: "bishop",
  [PieceType.Queen]: "queen",
  [PieceType.King]: "king",
};

export const getPieceNotation = (type: PieceType, useUnicodeIcons: boolean) => {
  if (useUnicodeIcons) {
    return pieceUnicodeChar[type];
  } else {
    return pieceStandardChar[type];
  }
};

export const getPieceName = (type: PieceType) => {
  return pieceName[type];
};

export const notationToPieceType = (notation: string): PieceType => {
  const type = Object.keys(pieceStandardChar).find(
    (key) => pieceStandardChar[key as PieceType] === notation
  );

  if (type) {
    return type as PieceType;
  }

  return PieceType.Pawn;
};

export const getFileName = (x: number): string => {
  return String.fromCharCode(97 + x);
};

export const getRankName = (y: number): string => {
  return `${y + 1}`;
};

export const getSquareName = (x: number, y: number): string => {
  return `${getFileName(x)}${getRankName(y)}`;
};

export const getXFromFileName = (fileName: string): number => {
  return fileName.charCodeAt(0) - 97;
};

export const getYFromRankName = (rankName: string): number => {
  return parseInt(rankName) - 1;
};

export const getSquareFromName = (name: string): Square => {
  return {
    x: getXFromFileName(name[0]),
    y: getYFromRankName(name[1]),
  };
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
  const piece = getPieceNotation(move.type, useUnicodeIcons);

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
    suffix = `=${getPieceNotation(move.promoteToType, useUnicodeIcons)}`;
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

export const notationToMove = (
  notation: string,
  activeColor: PieceColor,
  pieces: Piece[],
  history: MoveItem[]
) => {
  const move: MoveItem = {
    from: { x: -1, y: -1 },
    to: { x: -1, y: -1 },
    type: PieceType.Pawn,
    color: activeColor,
    captures: false,
    kind: MoveType.NonSpecial,
    status: KingStatus.IsNoCheck,
    promoteToType: null,
  };

  // check if move is castling
  if (notation === "O-O") {
    move.kind = MoveType.Castling;
    move.from = { x: 4, y: activeColor === PieceColor.White ? 0 : 7 };
    move.to = { x: 6, y: activeColor === PieceColor.White ? 0 : 7 };
    return move;
  } else if (notation === "O-O-O") {
    move.kind = MoveType.Castling;
    move.from = { x: 4, y: activeColor === PieceColor.White ? 0 : 7 };
    move.to = { x: 2, y: activeColor === PieceColor.White ? 0 : 7 };
    return move;
  }

  // check if move is en passant
  if (notation.includes("e.p.")) {
    move.kind = MoveType.EnPassant;
    move.captures = true;
  }

  // check if move is promotion
  if (notation.includes("=")) {
    move.kind = MoveType.Promotion;
    move.promoteToType = notationToPieceType(notation.split("=")[1]);
  }

  // check if move is check or checkmate
  if (notation.includes("#")) {
    move.status = KingStatus.IsCheckmate;
  } else if (notation.includes("+")) {
    move.status = KingStatus.IsCheck;
  }

  // check if move is capture
  if (notation.includes("x")) {
    move.captures = true;
  }

  // find piece type
  const pieceTypeRegex = /[RNBQK]/;
  if (pieceTypeRegex.test(notation[0])) {
    move.type = notationToPieceType(notation[0]);
  } else {
    move.type = PieceType.Pawn;
  }

  // find to square
  const toSquareRegex = /[a-h][1-8]/;
  const toSquare = notation.match(toSquareRegex);
  if (toSquare) {
    move.to = getSquareFromName(toSquare[0]);
  }

  // find from square
  let possiblePieces = getPiecesThatCanMoveToSquare(pieces, move.to, history);

  possiblePieces = possiblePieces.filter((piece) => {
    return piece.color === activeColor && piece.type === move.type;
  });

  if (possiblePieces.length === 0) {
    console.log(move, possiblePieces, activeColor);
    throw new Error(`No piece can move to this square ${notation}`);
  }

  if (possiblePieces.length === 1) {
    move.from = getPieceSquare(possiblePieces[0]);
  }

  if (possiblePieces.length > 1) {
    // if there are multiple pieces that can move to the square, we need to find the correct one
    // first we need to find the piece that is moving from the correct file

    const fromFileRegex = /[a-h]/;
    const fromFile = notation.match(fromFileRegex);
    if (fromFile) {
      const x = getXFromFileName(fromFile[0]);
      possiblePieces = possiblePieces.filter((piece) => {
        return getPieceSquare(piece).x === x;
      });

      if (possiblePieces.length === 1) {
        move.from = getPieceSquare(possiblePieces[0]);
      } else if (possiblePieces.length > 1) {
        // if there are still multiple pieces that can move to the square
        // we need to find the piece that is moving from the correct rank

        const fromRankRegex = /[1-8]/;
        const fromRank = notation.match(fromRankRegex);
        if (fromRank) {
          const y = getYFromRankName(fromRank[0]);
          possiblePieces = possiblePieces.filter((piece) => {
            return getPieceSquare(piece).y === y;
          });

          if (possiblePieces.length === 1) {
            move.from = getPieceSquare(possiblePieces[0]);
          } else {
            console.log(move, possiblePieces, activeColor);
            throw new Error(
              `Multiple pieces can move to this square ${notation}`
            );
          }
        }
      }
    }
  }

  return move;
};

export const notationToMoves = (
  notation: string,
  startingPieces: Piece[],
  onProgress?: (pieces: Piece[], moves: MoveItem[]) => void
) => {
  const moves: MoveItem[] = [];
  let activeColor = PieceColor.White;
  let pieces = [...startingPieces];

  const turnNumberRegex = /[0-9]+\./;
  const notationArray = notation.split(" ").filter((item) => {
    return !turnNumberRegex.test(item);
  });

  notationArray.forEach((notation) => {
    const move = notationToMove(notation, activeColor, pieces, moves);
    moves.push(move);
    pieces = applyMove(pieces, move);
    activeColor = invertColor(activeColor);
    if (onProgress) onProgress(pieces, moves);
  });

  console.log(pieces, moves);

  return { pieces, moves };
};
