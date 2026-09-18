import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JSONFilePreset } from "lowdb/node";
import fs from "node:fs";

const app = express();
const PORT = 4000;
const JWT_SECRET = "dnd-secret-key-change-me";
const DB_PATH = "db.json";

// Гарантируем, что файл БД существует и не пустой
if (!fs.existsSync(DB_PATH) || fs.statSync(DB_PATH).size === 0) {
  fs.writeFileSync(
    DB_PATH,
    JSON.stringify({ users: [], characters: [] }, null, 2)
  );
}

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

const db = await JSONFilePreset(DB_PATH, { users: [], characters: [] });

// --- Middleware авторизации ---
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "Нет токена" });
  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch {
    res.status(401).json({ message: "Невалидный токен" });
  }
}

// --- Middleware админа ---
function adminOnly(req, res, next) {
  const user = db.data.users.find((u) => u.id === req.userId);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Доступ только для Мастера" });
  }
  next();
}

// --- AUTH ---
app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Заполните все поля" });
  if (username.length < 3)
    return res.status(400).json({ message: "Имя минимум 3 символа" });
  if (password.length < 4)
    return res.status(400).json({ message: "Пароль минимум 4 символа" });

  const exists = db.data.users.find((u) => u.username === username);
  if (exists)
    return res.status(400).json({ message: "Пользователь уже существует" });

  const hash = await bcrypt.hash(password, 10);
  const user = {
    id: Date.now().toString(),
    username,
    password: hash,
    role: username === "admin" ? "admin" : "user",
  };
  db.data.users.push(user);
  await db.write();

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({
    token,
    user: { id: user.id, username: user.username, role: user.role },
  });
});

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  const user = db.data.users.find((u) => u.username === username);
  if (!user) return res.status(400).json({ message: "Неверные данные" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: "Неверные данные" });

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({
    token,
    user: { id: user.id, username: user.username, role: user.role },
  });
});

// --- CHARACTERS (protected) ---
app.get("/api/characters", auth, (req, res) => {
  const list = db.data.characters.filter((c) => c.ownerId === req.userId);
  res.json(list);
});

app.get("/api/characters/:id", auth, (req, res) => {
  const char = db.data.characters.find(
    (c) => c.id === req.params.id && c.ownerId === req.userId
  );
  if (!char) return res.status(404).json({ message: "Персонаж не найден" });
  res.json(char);
});

app.post("/api/characters", auth, async (req, res) => {
  const { name, race, class: cls, level, description } = req.body;
  if (!name) return res.status(400).json({ message: "Имя обязательно" });

  const character = {
    id: Date.now().toString(),
    ownerId: req.userId,
    name,
    race: race || "Человек",
    class: cls || "Воин",
    level: Number(level) || 1,
    description: description || "",
  };
  db.data.characters.push(character);
  await db.write();
  res.status(201).json(character);
});

app.put("/api/characters/:id", auth, async (req, res) => {
  const idx = db.data.characters.findIndex(
    (c) => c.id === req.params.id && c.ownerId === req.userId
  );
  if (idx === -1) return res.status(404).json({ message: "Не найдено" });

  db.data.characters[idx] = {
    ...db.data.characters[idx],
    ...req.body,
    id: req.params.id,
    ownerId: req.userId,
  };
  await db.write();
  res.json(db.data.characters[idx]);
});

app.delete("/api/characters/:id", auth, async (req, res) => {
  const before = db.data.characters.length;
  db.data.characters = db.data.characters.filter(
    (c) => !(c.id === req.params.id && c.ownerId === req.userId)
  );
  if (db.data.characters.length === before)
    return res.status(404).json({ message: "Не найдено" });
  await db.write();
  res.json({ success: true });
});

// --- ADMIN ---
app.get("/api/admin/characters", auth, adminOnly, (req, res) => {
  const list = db.data.characters.map((c) => {
    const owner = db.data.users.find((u) => u.id === c.ownerId);
    return { ...c, ownerName: owner?.username || "Неизвестный" };
  });
  res.json(list);
});

app.get("/api/admin/users", auth, adminOnly, (req, res) => {
  const list = db.data.users.map((u) => ({
    id: u.id,
    username: u.username,
    role: u.role,
    characterCount: db.data.characters.filter((c) => c.ownerId === u.id).length,
  }));
  res.json(list);
});

app.listen(PORT, () =>
  console.log(`🐉 D&D backend на http://localhost:${PORT}`)
);