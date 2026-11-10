// src/services/notes.service.js
import { AppError } from "../utils/AppError.js";

let nextId = 3;
let notes = [
  {
    id: 1,
    title: "Learn HTTP",
    content: "Methods and status codes",
    pinned: false,
  },
  {
    id: 2,
    title: "Learn Express",
    content: "Routes and middleware",
    pinned: true,
  },
];

export async function listNotes({ search, pinned } = {}) {
  let result = notes;
  if (search) {
    const term = search.toLowerCase();
    result = result.filter((note) => note.title.toLowerCase().includes(term));
  }
  if (pinned !== undefined) {
    result = result.filter((note) => note.pinned === pinned);
  }
  return result;
}

export async function getNote(id) {
  const note = notes.find((n) => n.id === id);
  if (!note) {
    throw new AppError(404, "Note not found");
  }
  return note;
}

export async function createNote({ title, content = "", pinned = false }) {
  const note = { id: nextId++, title, content, pinned };
  notes.push(note);
  return note;
}

export async function updateNote(id, changes) {
  const note = await getNote(id);
  return Object.assign(note, changes);
}

export async function deleteNote(id) {
  await getNote(id);
  notes = notes.filter((n) => n.id !== id);
}
