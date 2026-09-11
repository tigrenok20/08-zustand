import { Note } from "@/types/note";
import { cookies } from "next/headers";
import { nextServer } from "./api";
import { User } from "@/types/user";

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  tag: string | undefined,
  search: string,
  page: number,
  perPage: number = 12,
): Promise<FetchNotesResponse> => {
  const cookieStore = await cookies();
  const { data } = await nextServer.get<FetchNotesResponse>("/notes", {
    params: { tag, search, page, perPage },
    headers: {
      Cookies: cookieStore.toString(),
    },
  });

  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await nextServer.get<Note>(`/notes/${id}`, {
    headers: {
      Cookies: cookieStore.toString(),
    },
  });

  return data;
};

export interface CheckSessionResponse {
  message: string;
}

export async function checkSession() {
  const cookieStore = await cookies();
  const response = await nextServer.get<CheckSessionResponse>(`/auth/session`, {
    headers: {
      Cookies: cookieStore.toString(),
    },
  });

  return response;
}

export async function getMe() {
  const cookieStore = await cookies();
  const { data } = await nextServer.get<User>(`/users/me`, {
    headers: {
      Cookies: cookieStore.toString(),
    },
  });

  return data;
}
