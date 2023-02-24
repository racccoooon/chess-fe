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

export enum PlayerColor {
  White = "white",
  Black = "black",
  Both = "both",
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
  CircleOutline = "circleOutline",
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
export interface Piece {
  type: PieceType;
  color: PieceColor;
  x: number;
  y: number;
}

export interface Board {
  pieces: Piece[];
}

export interface Square {
  x: number;
  y: number;
}

export interface BoardHighlightSquare {
  square: Square;
  color: HighlightColor;
  shape: HighlightShape;
}

export interface BoardArrow {
  from: Square;
  to: Square;
  color: HighlightColor;
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
  from: Square;
  to: Square;
}

export interface PartialMove {
  from: Square | null;
  to: Square | null;
}

export interface MoveItem {
  from: Square;
  to: Square;
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
    position: Square;
  }[];
  activeColor: PieceColor;
  playerColor: PlayerColor;
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

export enum MoveStyle {
  DragAndDropOnly = "dragAndDropOnly",
  ClickOnly = "clickOnly",
  Both = "both",
}

export enum ClickDuration {
  Short = 100,
  Medium = 200,
  Long = 400,
}

export enum AnimationDuration {
  None = 0,
  Fast = 100,
  Medium = 300,
  Slow = 600,
}

export enum ModalType {
  None = "none",
  Promotion = "promotion",
  IllegalMove = "illegalMove",
}

export interface Vector2 {
  x: number;
  y: number;
}

export enum GameInfoTab {
  Game = "game",
  Analysis = "analysis",
  Invite = "invite",
  Settings = "settings",
}
