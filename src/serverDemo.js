import express from "express";

const app = express();
const PORT = 3000;

// A middleware that runs for every request
const logger = (req, res, next) => {
  const start = Date.now();

  // Runs after the response has been sent
  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
  });

  next();
};

app.use(logger);

const requireApiKey = (req, res, next) => {
  if (req.headers["x-api-key"] !== "my-secret-key") {
    return res.status(401).json({ error: { message: "Invalid API key" } });
  }
  next();
};

// Read JSON bodies into req.body
app.use(express.json());

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

app.get("/", (req, res) => {
  res.json({ message: "Hello!!" });
});

// READ all, with an optional search
app.get("/notes", (req, res) => {
  const { search } = req.query;
  const result = search
    ? notes.filter((note) =>
        note.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
      )
    : notes;
  res.json({ data: result });
});

// READ one
app.get("/notes/:id", (req, res) => {
  const note = notes.find((n) => n.id === Number(req.params.id));
  if (!note) {
    return res.status(404).json({ error: { message: "Note not found" } });
  }
  res.json({ data: note });
});

// CREATE
app.post("/notes", (req, res) => {
  const { title, content = "", pinned = false } = req.body;
  if (!title) {
    return res.status(400).json({ error: { message: "Title is required" } });
  }
  const note = { id: nextId++, title, content, pinned };
  notes.push(note);
  res.status(201).json({ data: note });
});

// UPDATE part of a note
app.patch("/notes/:id", (req, res) => {
  const note = notes.find((n) => n.id === Number(req.params.id));
  if (!note) {
    return res.status(404).json({ error: { message: "Note not found" } });
  }
  Object.assign(note, req.body);
  res.json({ data: note });
});

// DELETE
app.delete("/notes/:id", requireApiKey, (req, res) => {
  const exists = notes.some((n) => n.id === Number(req.params.id));
  if (!exists) {
    return res.status(404).json({ error: { message: "Note not found" } });
  }
  notes = notes.filter((n) => n.id !== Number(req.params.id));
  res.sendStatus(204);
});

app.get("/boom", (req, res) => {
  throw new Error("Secret database password is 1234");
});

app.get("/async-boom", async (req, res) => {
  throw new Error("This also reaches the error handler");
});

// No route matched: turn it into a 404
app.use((req, res) => {
  res.status(404).json({ error: { message: "Route not found" } });
});

// Any error ends up here. The four arguments are required
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: { message: "Something went wrong" } });
});

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server running on http://localhost:${PORT}`);
});
