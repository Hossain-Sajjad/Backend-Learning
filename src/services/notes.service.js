// src/services/notes.service.js
import { pool } from "../db.js";
import { AppError } from "../utils/AppError.js";

export async function listNotes({ search, pinned } = {}) {
  const conditions = [];
  const values = [];

  if (search) {
    values.push(`%${search}%`);
    conditions.push(`title ILIKE $${values.length}`);
  }
  if (pinned !== undefined) {
    values.push(pinned);
    conditions.push(`pinned = $${values.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const { rows } = await pool.query(
    `SELECT * FROM notes ${where} ORDER BY id`,
    values,
  );
  return rows;
}

export async function getNote(id) {
  const { rows } = await pool.query("SELECT * FROM notes WHERE id = $1", [id]);
  if (rows.length === 0) {
    throw new AppError(404, "Note not found");
  }
  return rows[0];
}

export async function createNote({ title, content, pinned }) {
  const { rows } = await pool.query(
    "INSERT INTO notes (title, content, pinned) VALUES ($1, $2, $3) RETURNING *",
    [title, content, pinned],
  );
  return rows[0];
}

export async function updateNote(id, changes) {
  const note = await getNote(id);
  const updated = { ...note, ...changes };
  const { rows } = await pool.query(
    "UPDATE notes SET title = $1, content = $2, pinned = $3 WHERE id = $4 RETURNING *",
    [updated.title, updated.content, updated.pinned, id],
  );
  return rows[0];
}

export async function deleteNote(id) {
  const { rowCount } = await pool.query("DELETE FROM notes WHERE id = $1", [
    id,
  ]);
  if (rowCount === 0) {
    throw new AppError(404, "Note not found");
  }
}
