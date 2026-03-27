const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

// Подключение к базе данных
const db = new Database('./tasks.db');

// Создание таблицы задач
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER DEFAULT 0
  )
`);

// Получить все задачи
app.get('/tasks', (req, res) => {
  const rows = db.prepare('SELECT * FROM tasks').all();
  res.json(rows);
});

// Добавить задачу
app.post('/tasks', (req, res) => {
  const { title } = req.body;
  const stmt = db.prepare('INSERT INTO tasks (title) VALUES (?)');
  const info = stmt.run(title);
  res.json({ id: info.lastInsertRowid, title, completed: 0 });
});

// Обновить задачу (отметить выполненной)
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const stmt = db.prepare('UPDATE tasks SET completed = ? WHERE id = ?');
  stmt.run(completed, id);
  res.json({ message: 'updated' });
});

// Удалить задачу
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
  stmt.run(id);
  res.json({ message: 'deleted' });
});

// Очистить все задачи (для тестов)
app.delete('/tasks/clear', (req, res) => {
  db.prepare('DELETE FROM tasks').run();
  res.json({ message: 'cleared' });
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});