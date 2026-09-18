const API_URL = "http://localhost:4000/api";

function getToken() {
  return localStorage.getItem("token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Ошибка сети" }));
    throw new Error(err.message || "Ошибка запроса");
  }
  return res.json();
}

export interface User {
  id: string;
  username: string;
  role: "user" | "admin";
}

export interface CharacterStats {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface Character {
  id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  description: string;
  stats?: CharacterStats;
}

export interface AdminCharacter extends Character {
  ownerName: string;
}

export interface AdminUser {
  id: string;
  username: string;
  role: string;
  characterCount: number;
}

export const api = {
  register: (username: string, password: string) =>
    request<{ token: string; user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  login: (username: string, password: string) =>
    request<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  getCharacters: () => request<Character[]>("/characters"),
  getCharacter: (id: string) => request<Character>(`/characters/${id}`),
  createCharacter: (data: Omit<Character, "id">) =>
    request<Character>("/characters", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateCharacter: (id: string, data: Partial<Character>) =>
    request<Character>(`/characters/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteCharacter: (id: string) =>
    request<{ success: boolean }>(`/characters/${id}`, { method: "DELETE" }),

  // Admin
  getAllCharacters: () => request<AdminCharacter[]>("/admin/characters"),
  getAllUsers: () => request<AdminUser[]>("/admin/users"),
};