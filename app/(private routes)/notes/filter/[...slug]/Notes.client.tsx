"use client";

import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { useDebouncedCallback } from "use-debounce";
import css from "./Notes.client.module.css";
import NoteList from "@/components/NoteList/NoteList";
import Loader from "@/components/Loader/Loader";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import { fetchNotes, FIRST_PAGE } from "@/lib/api/clientApi";

const DEBOUNCE_DELAY_MS = 300;

interface NotesClientProps {
  tag: string | undefined;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(FIRST_PAGE);
  const [search, setSearch] = useState<string>("");
  const debounced = useDebouncedCallback((value) => {
    setCurrentPage(FIRST_PAGE);
    setSearch(value);
  }, DEBOUNCE_DELAY_MS);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", tag, search, currentPage],
    queryFn: () => fetchNotes(tag, search, currentPage),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  return (
    <>
      <Toaster />
      <section>
        <div className={css.app}>
          <header className={css.toolbar}>
            <SearchBox onChange={debounced} />
            {!!data?.totalPages && data.totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={data.totalPages}
              />
            )}
            <Link className={css.button} href="/notes/action/create">
              Create note +
            </Link>
          </header>
          {isLoading && <Loader />}
          {isError && <ErrorMessage />}
          {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
        </div>
      </section>
    </>
  );
}
