// server.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt'); // ✅ import bcrypt

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Kết nối MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',          // Thay bằng user của bạn
  password: '123456',          // Thay bằng mật khẩu của bạn
  database: 'app'       // Tên database đã tạo
});

db.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối MySQL: ', err);
    return;
  }
  console.log('Kết nối MySQL thành công!');
});

// 2. Cấu hình middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cho phép truy cập các file tĩnh
app.use(express.static(__dirname));

// 3. Route GET /login: trả về file login.html
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// 4. Route GET /search: trả về file search.html
app.get('/search', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// 5. Route gốc /: hiển thị index.html

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Các route cho các file HTML khác nằm cùng thư mục
app.get('/dictionary.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'dictionary.html'));
});
app.get('/flashcard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'flashcard.html'));
});
app.get('/jlpt.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'jlpt.html'));
});
app.get('/chatbot.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'chatbot.html'));
});

// 6. Route POST /login: Xử lý đăng nhập
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], async (err, results) => {
    if (err) {
      console.error('Lỗi truy vấn MySQL:', err);
      return res.json({ success: false, message: 'Có lỗi xảy ra.' });
    }

    if (results.length === 0) {
      return res.json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
    }

    const user = results[0];
    // So sánh password với hash trong database
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      // Sau khi đăng nhập thành công, chuyển hướng đến /index.html
      return res.redirect('/index.html');
    } else {
      return res.json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
    }
  });
});


// 7. Route POST /signup: Xử lý đăng ký
app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  // Kiểm tra xem username đã tồn tại chưa
  const checkUserSql = 'SELECT * FROM users WHERE username = ?';
  db.query(checkUserSql, [username], (err, results) => {
    if (err) {
      console.error('Lỗi truy vấn MySQL:', err);
      return res.json({ success: false, message: 'Có lỗi xảy ra.' });
    }

    if (results.length > 0) {
      return res.json({ success: false, message: 'Tên đăng nhập đã tồn tại' });
    }

    // Hash password trước khi lưu
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Lỗi hash mật khẩu:', err);
        return res.json({ success: false, message: 'Có lỗi xảy ra.' });
      }

      // Thêm user vào database
      const insertSql = 'INSERT INTO users (username, password) VALUES (?, ?)';
      db.query(insertSql, [username, hashedPassword], (err, result) => {
        if (err) {
          console.error('Lỗi thêm user:', err);
          return res.json({ success: false, message: 'Có lỗi xảy ra.' });
        }
        return res.redirect('/login');
      });
    });
  });
});

// 8. Khởi chạy server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
