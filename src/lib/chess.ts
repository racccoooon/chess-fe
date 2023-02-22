import { KingStatus, MoveType, PieceColor, PieceType } from "@/lib/types";
import type { Move, MoveItem, Piece, Square } from "@/lib/types";
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

export const charToPiece = (
  char: string,
  x: number,
  y: number
): Piece | null => {
  switch (char) {
    case "p":
      return { type: PieceType.Pawn, color: PieceColor.Black, x, y };
    case "P":
      return { type: PieceType.Pawn, color: PieceColor.White, x, y };
    case "n":
      return { type: PieceType.Knight, color: PieceColor.Black, x, y };
    case "N":
      return { type: PieceType.Knight, color: PieceColor.White, x, y };
    case "b":
      return { type: PieceType.Bishop, color: PieceColor.Black, x, y };
    case "B":
      return { type: PieceType.Bishop, color: PieceColor.White, x, y };
    case "r":
      return { type: PieceType.Rook, color: PieceColor.Black, x, y };
    case "R":
      return { type: PieceType.Rook, color: PieceColor.White, x, y };
    case "q":
      return { type: PieceType.Queen, color: PieceColor.Black, x, y };
    case "Q":
      return { type: PieceType.Queen, color: PieceColor.White, x, y };
    case "k":
      return { type: PieceType.King, color: PieceColor.Black, x, y };
    case "K":
      return { type: PieceType.King, color: PieceColor.White, x, y };
    default:
      return null;
  }
};

export const fenToPieces = (fen: string): Piece[] => {
  const pieces: Piece[] = [];
  const rows = fen.split("/");
  let y = 7;
  for (const row of rows) {
    let x = 0;
    for (const char of row) {
      const piece = charToPiece(char, x, y);
      if (piece) {
        pieces.push(piece);
      }
      if (isNaN(parseInt(char))) {
        x++;
      } else {
        x += parseInt(char);
      }
    }
    y--;
  }
  return pieces;
};

export const getInitialBoard = (): Piece[] => {
  return fenToPieces("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
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

export const getBoardAtHistoryIndex = (
  history: MoveItem[],
  index: number
): Piece[] => {
  let board = getInitialBoard();

  for (let i = 0; i < index; i++) {
    board = applyMove(board, history[i]);
  }

  return board;
};

export const hasPieceMoved = (piece: Piece, history: MoveItem[]): boolean => {
  for (const move of history) {
    if (move.to.x === piece.x && move.to.y === piece.y) {
      return true;
    }
  }
  return false;
};

/***
 * Returns true if the there is a piece between the from and to squares
 * @param pieces
 * @param move
 */
export const pieceIsBlocking = (
  pieces: Piece[],
  move: Move
): false | Square => {
  const xDiff = move.to.x - move.from.x;
  const yDiff = move.to.y - move.from.y;

  const normalizedXDiff = xDiff === 0 ? 0 : xDiff / Math.abs(xDiff);
  const normalizedYDiff = yDiff === 0 ? 0 : yDiff / Math.abs(yDiff);

  // check if provided move is horizontal, vertical or diagonal
  if (!(xDiff === 0 || yDiff === 0 || Math.abs(xDiff) === Math.abs(yDiff))) {
    throw new Error("Move is not horizontal, vertical or diagonal");
  }

  // get all the squares between the from and to squares
  const squares = [];
  let x = move.from.x;
  let y = move.from.y;
  while (x !== move.to.x || y !== move.to.y) {
    x += normalizedXDiff;
    y += normalizedYDiff;
    squares.push({ x, y });
  }

  // check if any of the squares has a piece
  for (const square of squares) {
    if (getPieceAtSquare(pieces, square.x, square.y)) {
      return square;
    }
  }

  return false;
};

export const isValidMove = (
  pieces: Piece[],
  move: Move,
  history: MoveItem[]
): boolean => {
  const pieceToMove = getPieceAtSquare(pieces, move.from.x, move.from.y);

  if (!pieceToMove) {
    return false;
  }

  const xDiff = Math.abs(move.to.x - move.from.x);
  const yDiff = Math.abs(move.to.y - move.from.y);

  if (xDiff === 0 && yDiff === 0) {
    return false;
  }

  if (pieceToMove.type === PieceType.Pawn) {
    return isValidPawnMove(pieces, move, history);
  } else if (pieceToMove.type === PieceType.Knight) {
    return isValidKnightMove(pieces, move);
  } else if (pieceToMove.type === PieceType.Bishop) {
    return isValidBishopMove(pieces, move);
  } else if (pieceToMove.type === PieceType.Rook) {
    return isValidRookMove(pieces, move);
  } else if (pieceToMove.type === PieceType.Queen) {
    return isValidQueenMove(pieces, move);
  } else if (pieceToMove.type === PieceType.King) {
    return isValidKingMove(pieces, move, history);
  }

  return false;
};

export const isValidPawnMove = (
  pieces: Piece[],
  move: Move,
  history: MoveItem[]
): boolean => {
  const pieceToMove = getPieceAtSquare(pieces, move.from.x, move.from.y);

  if (!pieceToMove) {
    return false;
  }

  const pieceToCapture = getPieceAtSquare(pieces, move.to.x, move.to.y);

  if (pieceToCapture && pieceToCapture.color === pieceToMove.color) {
    return false;
  }

  const yDiff = move.to.y - move.from.y;

  if (pieceToMove.color === PieceColor.White) {
    if (yDiff < 0) {
      return false;
    }
  } else {
    if (yDiff > 0) {
      return false;
    }
  }

  if (Math.abs(yDiff) === 1) {
    if (move.to.x === move.from.x) {
      return !pieceToCapture;
    } else if (Math.abs(move.to.x - move.from.x) === 1) {
      return !!pieceToCapture;
    }
  } else if (Math.abs(yDiff) === 2) {
    if (move.to.x !== move.from.x) {
      return false;
    }

    if (hasPieceMoved(pieceToMove, history)) {
      return false;
    }

    if (pieceIsBlocking(pieces, move)) {
      return false;
    }

    return true;
  }

  return false;
};

export const isValidQueenMove = (pieces: Piece[], move: Move): boolean => {
  const xDiff = Math.abs(move.to.x - move.from.x);
  const yDiff = Math.abs(move.to.y - move.from.y);

  // check if provided move is horizontal, vertical or diagonal
  if (!(xDiff === 0 || yDiff === 0 || Math.abs(xDiff) === Math.abs(yDiff))) {
    return false;
  }

  const pieceToMove = getPieceAtSquare(pieces, move.from.x, move.from.y);

  if (!pieceToMove) {
    return false;
  }

  const blockingSquare = pieceIsBlocking(pieces, move);

  if (!blockingSquare) {
    return true;
  }

  if (blockingSquare.x === move.to.x && blockingSquare.y === move.to.y) {
    const pieceToCapture = getPieceAtSquare(
      pieces,
      blockingSquare.x,
      blockingSquare.y
    );

    return !(pieceToCapture && pieceToCapture.color === pieceToMove.color);
  }

  return false;
};

export const isValidKingMove = (
  pieces: Piece[],
  move: Move,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  history: MoveItem[]
): boolean => {
  const pieceToMove = getPieceAtSquare(pieces, move.from.x, move.from.y);

  if (!pieceToMove) {
    return false;
  }

  const xDiff = Math.abs(move.to.x - move.from.x);
  const yDiff = Math.abs(move.to.y - move.from.y);

  if (xDiff > 1 || yDiff > 1) {
    return false;
  }

  const pieceToCapture = getPieceAtSquare(pieces, move.to.x, move.to.y);

  if (pieceToCapture && pieceToCapture.color === pieceToMove.color) {
    return false;
  }

  return true;
};

export const isValidRookMove = (pieces: Piece[], move: Move): boolean => {
  // check if provided move is horizontal or vertical
  if (move.from.x !== move.to.x && move.from.y !== move.to.y) {
    return false;
  }

  return isValidQueenMove(pieces, move);
};

export const isValidBishopMove = (pieces: Piece[], move: Move): boolean => {
  // check if provided move is diagonal
  if (Math.abs(move.from.x - move.to.x) !== Math.abs(move.from.y - move.to.y)) {
    return false;
  }

  return isValidQueenMove(pieces, move);
};

export const isValidKnightMove = (pieces: Piece[], move: Move): boolean => {
  const pieceToMove = getPieceAtSquare(pieces, move.from.x, move.from.y);

  if (!pieceToMove) {
    return false;
  }

  const pieceToCapture = getPieceAtSquare(pieces, move.to.x, move.to.y);

  if (pieceToCapture && pieceToCapture.color === pieceToMove.color) {
    return false;
  }

  const xDiff = Math.abs(move.to.x - move.from.x);
  const yDiff = Math.abs(move.to.y - move.from.y);

  if (xDiff === 1 && yDiff === 2) {
    return true;
  }

  if (xDiff === 2 && yDiff === 1) {
    return true;
  }

  return false;
};

export const getValidSquaresForPiece = (
  pieces: Piece[],
  piece: Piece,
  history: MoveItem[]
): Square[] => {
  const squares: Square[] = [];

  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      const move: Move = {
        from: { x: piece.x, y: piece.y },
        to: { x, y },
      };

      if (isValidMove(pieces, move, history)) {
        squares.push({ x, y });
      }
    }
  }

  return squares;
};

export const getPiecesThatCanMoveToSquare = (
  pieces: Piece[],
  square: Square,
  history: MoveItem[]
): Piece[] => {
  const piecesThatCanMove: Piece[] = [];

  for (const piece of pieces) {
    const move: Move = {
      from: { x: piece.x, y: piece.y },
      to: { x: square.x, y: square.y },
    };

    if (isValidMove(pieces, move, history)) {
      piecesThatCanMove.push(piece);
    }
  }

  return piecesThatCanMove;
};

export const getHistoryUntilIndex = (
  history: MoveItem[],
  index: number
): MoveItem[] => {
  const historyUntilIndex: MoveItem[] = [...history];

  historyUntilIndex.length = index;

  return historyUntilIndex;
};

export const getPieceSquare = (piece: Piece): Square => {
  return { x: piece.x, y: piece.y };
};
