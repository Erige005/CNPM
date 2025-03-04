// server.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Kết nối MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',          // Thay bằng user của bạn
  password: 'chitogeABVs32',          // Thay bằng mật khẩu của bạn
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

// 4. Route POST /login: xử lý đăng nhập
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Truy vấn bảng users trong MySQL
  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error('Lỗi truy vấn MySQL: ', err);
      return res.json({ success: false, message: 'Có lỗi xảy ra.' });
    }

    if (results.length > 0) {
        // Đăng nhập thành công
      // => Ở đây ta trả về success: true, kèm theo URL trang search
      return res.json({ success: true, redirect: '/search' });
    } else {
      // Sai thông tin
      return res.json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
    }
  });
});

// 5. Route gốc /: chuyển hướng sang /login hoặc file index.html
app.get('/', (req, res) => {
  // Ví dụ, chuyển hướng thẳng đến /login
  res.redirect('/login');
});

app.get('/search', (req, res) => {
  // Gửi về file search.html (tạo sẵn trong thư mục public)
  res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

// 6. Khởi chạy server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
