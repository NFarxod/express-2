const express = require('express');
const app = express();
const PORT = 3000;

// Мидлвар для работы с JSON
app.use(express.json());

// 1. Исходные данные (на сервере)
let users = [
    { id: 1, name: "Ali", age: 25 },
    { id: 2, name: "Vali", age: 30 },
    { id: 3, name: "Abbos", age: 22 }
];

// --- МАРШРУТЫ (ROUTES) ---

// 2. GET /users — Получить всех пользователей (с фильтрацией)
app.get('/users', (req, res) => {
    let filteredUsers = [...users];
    const { minAge, maxAge } = req.query;

    if (minAge) {
        filteredUsers = filteredUsers.filter(u => u.age >= Number(minAge));
    }
    if (maxAge) {
        filteredUsers = filteredUsers.filter(u => u.age <= Number(maxAge));
    }

    res.json(filteredUsers);
});

// 3. GET /users/:id — Получить одного пользователя по ID
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
});

// 4. POST /users — Добавить нового пользователя
app.post('/users', (req, res) => {
    const { name, age } = req.body;

    // Валидация
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({ error: "Invalid name" });
    }
    if (!age || typeof age !== 'number' || age <= 0) {
        return res.status(400).json({ error: "Invalid age (must be a positive number)" });
    }

    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        name,
        age
    };

    users.push(newUser);
    res.status(201).json(newUser);
});

// 5. PUT /users/:id — Обновить данные пользователя по ID
app.put('/users/:id', (req, res) => {
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex === -1) return res.status(404).json({ message: "User not found" });

    const { name, age } = req.body;

    // Валидация
    if (name && (typeof name !== 'string' || name.trim().length < 2)) {
        return res.status(400).json({ error: "Invalid name" });
    }
    if (age && (typeof age !== 'number' || age <= 0)) {
        return res.status(400).json({ error: "Invalid age" });
    }

    // Обновляем только те поля, которые прислали
    users[userIndex] = {
        ...users[userIndex],
        ...(name && { name }),
        ...(age && { age })
    };

    res.json(users[userIndex]);
});

// 6. DELETE /users/:id — Удалить пользователя по ID
app.delete('/users/:id', (req, res) => {
    const initialLength = users.length;
    users = users.filter(u => u.id !== parseInt(req.params.id));

    if (users.length === initialLength) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
});

app.listen(PORT, () => {
    console.log(`API running at http://localhost:${PORT}/users`);
});