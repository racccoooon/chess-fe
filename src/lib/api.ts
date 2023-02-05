import axios from "axios";
import type { GameStartColor } from "@/lib/types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const createGame = async (
  color: GameStartColor
): Promise<{
  gameId: string;
}> => {
  const response = await api.post("/games/", {
    color,
  });
  return response.data;
};
