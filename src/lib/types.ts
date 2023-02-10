// @ts-ignore
import { v4 as uuidv4 } from "uuid";
import type { Ref } from "vue";

export enum PieceType {
  Pawn = "pawn",
  Rook = "rook",
  Knight = "knight",
  Bishop = "bishop",
  Queen = "queen",
  King = "king",
}

export enum PieceColor {
  White = "white",
  Black = "black",
}

export enum GameStartColor {
  White = "white",
  Black = "black",
  Random = "randomColor",
}

export class Piece {
  type: PieceType;
  color: PieceColor;
  id: string;
  x: number;
  y: number;

  constructor(type: PieceType, color: PieceColor, x: number, y: number) {
    this.type = type;
    this.color = color;
    this.id = uuidv4();
    this.x = x;
    this.y = y;
  }
}

export interface Board {
  pieces: Piece[];
}

export interface Cell {
  x: number;
  y: number;
}

export enum MoveType {
  NonSpecial = "nonSpecialMove",
  EnPassant = "enPassant",
  Castling = "castling",
  Promotion = "promotion",
}

export enum KingStatus {
  IsNoCheck = "isNoCheck",
  ICheck = "iCheck",
  ICheckmate = "iCheckmate",
  IStalemate = "iStalemate",
}

export interface Move {
  from: Cell;
  to: Cell;
}

export interface PartialMove {
  from: Cell | null;
  to: Cell | null;
}

export interface MoveItem {
  from: Cell;
  to: Cell;
  color: PieceColor;
  type: PieceType;
  kind: MoveType;
  status: KingStatus;
}

export interface Player {
  name: string | Ref<string>;
  color: PieceColor;
}

export interface JoinGameResponse {
  moves: MoveItem[];
  board: {
    color: PieceColor;
    type: PieceType;
    position: Cell;
  }[];
  activeColor: PieceColor;
  playerColor: PieceColor;
  opponentName: string;
}

export interface GameStartedResponse {
  whitePlayerName: string;
  blackPlayerName: string;
}
