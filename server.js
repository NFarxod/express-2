const express = require('express');
const app = express();
const PORT = 3000;


let users = ['Ali', 'Vali', 'Abbos'];

app.use(express.urlencoded({ extended: true }));


const renderHTML = (message = '', error = '') => {
    const listItems = users.map(user => `<li>${user}</li>`).join('');
    
    return `
    <!DOCTYPE html>
    <html lang="uz">
    <head>
        <meta charset="UTF-8">
        <title>Foydalanuvchilar</title>
        <style>
            body { font-family: sans-serif; margin: 40px; }
            .error { color: red; }
            .success { color: green; }
            ul { margin-bottom: 20px; }
        </style>
    </head>
    <body>
        <h2>Foydalanuvchilar ro'yxati</h2>
        <ul>${listItems}</ul>
        
        <button onclick="location.reload()">Yangilash</button>
        <hr>

        <h3>Foydalanuvchi qo'shish</h3>
        ${error ? `<p class="error">${error}</p>` : ''}
        ${message ? `<script>alert("${message}");</script>` : ''}

        <form action="/users" method="POST">
            <input type="text" name="name" placeholder="Ism kiriting">
            <button type="submit">Yuborish</button>
        </form>
    </body>
    </html>
    `;
};


app.get('/users', (req, res) => {
    res.send(renderHTML());
});


app.post('/users', (req, res) => {
    const { name } = req.body;

 
    if (!name || name.trim() === "") {
        return res.status(400).send(renderHTML('', '400: Name required'));
    }
    if (name.length < 3) {
        return res.status(400).send(renderHTML('', '400: Min 3 chars'));
    }
    if (users.includes(name)) {
        return res.status(400).send(renderHTML('', '400: Already exists'));
    }

    users.push(name);
    

    res.send(renderHTML(`✅ Qo'shildi: ${name}`));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/users`);
});