import axios from "axios";
import type { Board } from "@/lib/types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const createGame = async () => {
  const response = await api.post('/games/');
  return response.data;
}

export const getGame = async (id: string) => {
  const response = await api.get(`/games/${id}/`);
  return response.data as Partial<Board>;
}