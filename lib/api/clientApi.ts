import { Note, NoteId } from "@/types/note";
import { nextServer } from "./api";
import { User } from "@/types/user";

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const FIRST_PAGE = 1;

export const fetchNotes = async (
  tag: string | undefined,
  search: string,
  page: number,
  perPage: number = 12,
): Promise<FetchNotesResponse> => {
  const { data } = await nextServer.get<FetchNotesResponse>("/notes", {
    params: { tag, search, page, perPage },
  });

  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await nextServer.get<Note>(`/notes/${id}`, {});

  return data;
};

export const createNote = async (
  note: Pick<Note, "title" | "content" | "tag">,
): Promise<Note> => {
  const { data } = await nextServer.post<Note>("/notes", note, {});

  return data;
};

export const deleteNote = async (id: NoteId): Promise<Note> => {
  const { data } = await nextServer.delete<Note>(`/notes/${id}`, {});

  return data;
};

export interface RegisterRequest {
  email: string;
  password: string;
}

export async function register(request: RegisterRequest) {
  const response = await nextServer.post<User>("/auth/register", request);

  return response.data;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export async function login(request: LoginRequest) {
  const response = await nextServer.post<User>("/auth/login", request);

  return response.data;
}

export async function logout() {
  await nextServer.post("/auth/logout");
}

export interface CheckSessionResponse {
  success: boolean;
}

export async function checkSession() {
  const { data } = await nextServer.get<CheckSessionResponse>(`/auth/session`);

  return data;
}

export async function getMe() {
  const { data } = await nextServer.get<User>(`/users/me`);

  return data;
}

export interface UpdateMeRequest {
  email: string;
  username: string;
}

export async function updateMe(request: UpdateMeRequest) {
  const { data } = await nextServer.patch<User>(`/users/me`, request);

  return data;
}
