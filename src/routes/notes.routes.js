// src/routes/notes.routes.js
import { Router } from "express";
import * as notes from "../controllers/notes.controller.js";
import { validate } from "../middleware/validate.js";
import {
  createNoteSchema,
  listNotesSchema,
  noteIdSchema,
  updateNoteSchema,
} from "../schemas/notes.schema.js";

const router = Router();

router.get("/", validate({ query: listNotesSchema }), notes.listNotes);
router.post("/", validate({ body: createNoteSchema }), notes.createNote);
router.get("/:id", validate({ params: noteIdSchema }), notes.getNote);
router.patch(
  "/:id",
  validate({ params: noteIdSchema, body: updateNoteSchema }),
  notes.updateNote,
);
router.delete("/:id", validate({ params: noteIdSchema }), notes.deleteNote);

export default router;
