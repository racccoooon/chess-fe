import axios from "axios";
import type { GameStartColor, Piece, Square, PieceColor } from "@/lib/types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const createGame = async (
  color: GameStartColor,
  startingPieces: Piece[],
  startingColor: PieceColor
): Promise<{
  gameId: string;
}> => {
  const response = await api.post("/games/", {
    color,
    startingPieces,
    startingColor,
  });
  return response.data;
};

export const getValidMoves = async (
  gameId: string,
  token: string,
  square: Square
): Promise<Square[]> => {
  const response = await api.get(
    `/games/${gameId}/validmoves/${square.x}/${square.y}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.data?.validMoves) return [];

  return response.data.validMoves.map((s: { toX: number; toY: number }) => ({
    x: s.toX,
    y: s.toY,
  }));
};
