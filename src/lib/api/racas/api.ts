import { API_BASE_URL } from "../config";
import { RacaData } from "./types";
import { getAuthHeaders } from "../auth";

export async function listarRacas(): Promise<RacaData[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/racas`, {
    headers: await getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Erro ao buscar raças");
  return response.json();
}
