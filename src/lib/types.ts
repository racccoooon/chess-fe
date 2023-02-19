// @ts-ignore
import { v4 as uuidv4 } from "uuid";

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

export enum HighlightColor {
  Green = "green",
  Yellow = "yellow",
  Red = "red",
  Blue = "blue",
  Purple = "purple",
  Highlight = "highlight",
}

export enum HighlightShape {
  SquareFill = "squareFill",
  SquareOutline = "squareOutline",
  Dot = "dot",
}

export enum PieceSet {
  Modern = "modern",
  Raccoon = "raccoon",
  Classic = "classic",
  Blindfold = "blindfold",
}

export enum PiecesDisplaySize {
  Small = "small",
  Medium = "medium",
  Large = "large",
  ExtraLarge = "extraLarge",
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

export interface BoardHighlightSquare {
  cell: Cell;
  color: HighlightColor;
  shape: HighlightShape;
}

export enum MoveType {
  NonSpecial = "nonSpecialMove",
  EnPassant = "enPassant",
  Castling = "castling",
  Promotion = "promotion",
}

export enum KingStatus {
  IsNoCheck = "isNoCheck",
  IsCheck = "isCheck",
  IsCheckmate = "isCheckmate",
  IsStalemate = "isStalemate",
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
  captures: boolean;
  promoteToType: PieceType | null;
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

export interface PieceSelectedEvent {
  piece: Piece;
}

export interface PieceMovedEvent {
  piece: Piece;
  to: { x: number; y: number };
}

export interface PromotionSelectedEvent {
  type: PieceType;
}

export enum ChessBoardBorder {
  None = "none",
  Thin = "thin",
  Thick = "thick",
}

export enum ChessBoardColor {
  Neutral = "neutral",
  Wood = "wood",
  Green = "green",
  Blue = "blue",
  Red = "red",
  Orange = "orange",
  Purple = "purple",
  Pink = "pink",
  HighContrast = "highContrast",
}

export enum ModalType {
  None = "none",
  Promotion = "promotion",
}
