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