const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Dumbu@21',
  database: 'chat_db'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

app.get('/messages', (req, res) => {
  const sql = 'SELECT * FROM messages';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.post('/messages', (req, res) => {
  const message = { user: req.body.user, text: req.body.text };
  const sql = 'INSERT INTO messages SET ?';
  db.query(sql, message, (err, result) => {
    if (err) throw err;
    const newMessage = { id: result.insertId, ...message };
    io.emit('message', newMessage); // Emit the message to all connected clients
    res.send(newMessage);
  });
});

io.on('connection', socket => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});
