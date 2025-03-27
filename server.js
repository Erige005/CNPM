// server.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt'); // ✅ Move bcrypt import to the top

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
app.use(express.static(path.join(__dirname, 'public')));

// 3. Route GET /login: trả về file login.html
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// 4. Route GET /search: Trả về file search.html
app.get('/search', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

// 5. Route gốc /
app.get('/', (req, res) => {
  res.redirect('/login');
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

    // So sánh mật khẩu với hash trong database
    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      return res.json({ success: true, redirect: '/search' });
    } else {
      return res.json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
    }
  });
});

// 7. Route POST /signup: Xử lý đăng ký
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  // Kiểm tra xem username đã tồn tại chưa
  const checkUserSql = 'SELECT * FROM users WHERE username = ?';
  db.query(checkUserSql, [username], (err, results) => {  // ✅ Removed unnecessary async
    if (err) {
      console.error('Lỗi truy vấn MySQL:', err);
      return res.json({ success: false, message: 'Có lỗi xảy ra.' });
    }

    if (results.length > 0) {
      return res.json({ success: false, message: 'Tên đăng nhập đã tồn tại' });
    }

    // Hash password trước khi lưu vào database
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Lỗi hash mật khẩu:', err);
        return res.json({ success: false, message: 'Có lỗi xảy ra.' });
      }

      // Chèn tài khoản mới vào MySQL
      const insertSql = 'INSERT INTO users (username, password) VALUES (?, ?)';
      db.query(insertSql, [username, hashedPassword], (err, result) => {
        if (err) {
          console.error('Lỗi thêm user:', err);
          return res.json({ success: false, message: 'Có lỗi xảy ra.' });
        }
        return res.json({ success: true });
      });
    });
  });
});

// 8. Khởi chạy server ✅ Move app.listen to the bottom
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
