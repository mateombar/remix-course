import { json, redirect } from "@remix-run/node";
import NewNote, { links as newNoteLinks } from "../components/NewNote";
import { getStoredNotes, storeNotes } from "../data/notes";
import NoteList, { links as noteListLinks } from "../components/NoteList";
import { useLoaderData } from "@remix-run/react";

export default function NotesPage() {
  const notes = useLoaderData();

  return (
    <main>
      <NewNote />
      <NoteList notes={notes}/>
    </main>
  );
}

export async function loader() {
  const notes = await getStoredNotes();
  // return notes
  // return new Response(JSON.stringify(notes), {
  //   headers: { "Content-Type": "application/json" },
  // });
  return json(notes);
}

export async function action(data) {
  const formData = await data.request.formData();
  //   Using the get method
  //   const noteData = {
  //     title: formData.get('title'),
  //     content: formData.get('content')
  //   }

  const noteData = Object.fromEntries(formData);
  const existingNotes = await getStoredNotes();
  noteData.id = new Date().toISOString();
  const updatedNotes = existingNotes.concat(noteData);
  await storeNotes(updatedNotes);

  // You normally return a redirect function here (Remeber this is server side)
  return redirect("/notes");
}

export function links() {
  return [...newNoteLinks(), ...noteListLinks()];
}
