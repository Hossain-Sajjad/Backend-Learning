// zod-basics.js
import { z } from "zod";

const titleSchema = z.string();

// console.log(titleSchema.parse("Learn Zod"));
// console.log(titleSchema.parse(42));

const good = titleSchema.safeParse("Learn Zod");
console.log(good);

const bad = titleSchema.safeParse(42);
console.log(bad);
console.log(bad.success);
console.log(bad.error.issues[0].message);

const nameSchema = z.string().trim().min(2, "Name is too short");

console.log(nameSchema.safeParse("  Sara  "));
console.log(nameSchema.safeParse(" S ").error.issues[0].message);

const noteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  pinned: z.boolean(),
});

console.log(
  noteSchema.safeParse({ title: "Learn Zod", pinned: true, id: 500 }),
);

const result = noteSchema.safeParse({ title: "", pinned: "yes" });
console.log(
  result.error.issues.map((issue) => `${issue.path}: ${issue.message}`),
);
