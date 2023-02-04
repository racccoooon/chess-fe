import axios from "axios";
import type { Board, Move } from "@/lib/types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const createGame = async (): Promise<{gameId: string; token: string; playerName: string}> => {
  const response = await api.post('/games/');
  return response.data;
}

export const getGame = async (gameId: string, token: string): Promise<Partial<Board>> => {
  const response = await api.get(`/games/${gameId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return response.data as Partial<Board>;
}

export const movePiece = async (gameId: string, token: string, move: Move): Promise<void> => {
  await api.post(
    `/games/${gameId}/moves/`,
    {
      fromCell: move.fromCell,
      toCell: move.toCell,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
  );
}