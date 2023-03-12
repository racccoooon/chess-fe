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
  None = "none",
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
  Flat = "flat",
  Classic = "classic",
  Obfuscated = "obfuscated",
  Blindfold = "blindfold",
}

export enum PiecesDisplaySize {
  VerySmall = "verySmall",
  Small = "small",
  Medium = "medium",
  Large = "large",
  ExtraLarge = "extraLarge",
  TooLarge = "tooLarge",
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

export enum GameResult {
  Unknown = "unknown",
  InProgress = "inProgress",
  WhiteWins = "whiteWins",
  BlackWins = "blackWins",
  Draw = "draw",
}

export interface JoinGameResponse {
  moves: MoveItem[];
  board: {
    color: PieceColor;
    type: PieceType;
    position: Square;
  }[];
  initialBoard: {
    color: PieceColor;
    type: PieceType;
    position: Square;
  }[];
  activeColor: PieceColor;
  playerColor: PlayerColor;
  whitePlayerName: string;
  blackPlayerName: string;
}

export interface GameStartedResponse {
  whitePlayerName: string;
  blackPlayerName: string;
}

export interface PlayerNameChangedResponse {
  name: string;
  color: PieceColor;
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

export interface ImportGameEvent {
  san: string;
  fen: string;
}

export interface PiecePaintedEvent {
  square: Square;
  color: PieceColor;
  type: PieceType;
}

export interface PieceErasedEvent {
  square: Square;
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

export enum ChessBoardOrientation {
  WhiteBottom = "whiteBottom",
  BlackBottom = "blackBottom",
  PlayerBottom = "playerBottom",
  OpponentBottom = "opponentBottom",
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
  Loading = "loading",
}

export interface Vector2 {
  x: number;
  y: number;
}

export enum GameInfoTab {
  Game = "game",
  Analysis = "analysis",
  Edit = "edit",
  GameSetup = "gameSetup",
  Share = "share",
  Settings = "settings",
}

export enum BoardPointerMode {
  None = "none",
  Move = "move",
  Paint = "paint",
  Erase = "erase",
}

export enum ChessVariation {
  Standard = "standard",
  Chess960 = "chess960",
  Horde = "horde",
  Atheist = "atheist",
  FogOfWar = "fogOfWar",
  Custom = "custom",
}

export interface Toast {
  title?: string;
  message: string;
}

export interface ToastKeyed extends Toast {
  id: string;
}
