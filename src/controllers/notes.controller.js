// src/controllers/notes.controller.js
import * as notesService from "../services/notes.service.js";

export async function listNotes(req, res) {
  const notes = await notesService.listNotes(req.validated.query);
  res.json({ data: notes });
}

export async function getNote(req, res) {
  const note = await notesService.getNote(req.validated.params.id);
  res.json({ data: note });
}

export async function createNote(req, res) {
  const note = await notesService.createNote(req.validated.body);
  res.status(201).json({ data: note });
}

export async function updateNote(req, res) {
  const { id } = req.validated.params;
  const note = await notesService.updateNote(id, req.validated.body);
  res.json({ data: note });
}

export async function deleteNote(req, res) {
  await notesService.deleteNote(req.validated.params.id);
  res.sendStatus(204);
}
