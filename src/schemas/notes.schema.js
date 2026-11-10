// src/schemas/notes.schema.js
import { z } from "zod";

const title = z
  .string()
  .trim()
  .min(1, "Title is required")
  .max(100, "Title is too long");
const content = z.string().trim().max(1000, "Content is too long");
const pinned = z.boolean();

export const createNoteSchema = z.object({
  title,
  content: content.default(""),
  pinned: pinned.default(false),
});

export const updateNoteSchema = z
  .object({ title, content, pinned })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Send at least one field to update",
  });

export const noteIdSchema = z.object({
  id: z.coerce.number().int().positive("ID must be a positive number"),
});

export const listNotesSchema = z.object({
  search: z.string().trim().optional(),
  pinned: z.stringbool().optional(),
});
