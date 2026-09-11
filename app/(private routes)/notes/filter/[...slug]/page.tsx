import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { FIRST_PAGE } from "@/lib/api/clientApi";
import { fetchNotes } from "@/lib/api/serverApi";

type NotesProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({
  params,
}: NotesProps): Promise<Metadata> {
  const { slug } = await params;
  const filter = slug?.[0] ?? "all";
  const tagLabel = filter === "all" ? "All Tags" : filter;

  return {
    title: `Notes - ${tagLabel}`,
    description: `Browse ${tagLabel} in NoteHub and keep your ideas organized by topic.`,
    openGraph: {
      title: `Notes - ${tagLabel}`,
      description: `Browse ${tagLabel} in NoteHub and keep your ideas organized by topic.`,
      url: `https://notehub.com/notes/filter/${filter}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub notes filter preview",
        },
      ],
    },
  };
}

export default async function Notes({ params }: NotesProps) {
  const { slug } = await params;
  const tag = slug[0] === "all" ? undefined : slug[0];
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", tag, "", FIRST_PAGE],
    queryFn: () => fetchNotes(tag, "", FIRST_PAGE),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
