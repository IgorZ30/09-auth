import type { Metadata } from "next";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";

interface Props {
  params: Promise<{ id: string }>;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNoteById(id);

  return {
    title: `${note.title} | NoteHub`,
    description: note.content,
    openGraph: {
      title: `${note.title} | NoteHub`,
      description: note.content,
      url: `https://08-zustand-gamma-gold.vercel.app/notes/${id}`,
      images: [
        { url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg" },
      ],
    },
  };
}

export default async function NoteDetailsPage({ params }: Props) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
