// File: server.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const session = require('express-session');            // <-- thêm
const MySQLStore = require('express-mysql-session')(session); // <-- thêm

const app = express();
const PORT = process.env.PORT || 3000;

// ===== 0. Session store cấu hình cho MySQL =====
const sessionStore = new MySQLStore({
  host: 'localhost',
  user: 'root',
  password: '123456',

  database: 'app',
  clearExpired: true,
  checkExpirationInterval: 900000,
  expiration: 86400000
});

// ===== 1. Kết nối MySQL =====
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',

  database: 'app'
});

db.connect(err => {
  if (err) {
    console.error('Lỗi kết nối MySQL: ', err);
    return;
  }
  console.log('Kết nối MySQL thành công!');
});

// ===== 2. Cấu hình middleware =====
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// Session middleware
app.use(session({
  key: 'session_cookie_name',
  secret: 'your_secret_key',      // <-- thay bằng chuỗi bí mật của bạn
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000   // 1 ngày
  }
}));

// Tạo middleware kiểm tra đã login
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: 'Chưa đăng nhập.' });
  }
  next();
}

// ===== 3. Các route HTML cơ bản =====
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.use(express.static(__dirname));
app.use('/css', express.static(path.join(__dirname, 'css')));

app.get('/login',     (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/search',    (req, res) => res.sendFile(path.join(__dirname, 'public', 'search.html')));
app.get('/signup',    (req, res) => res.sendFile(path.join(__dirname, 'public', 'signup.html')));
app.get('/index.html',(req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/dictionary.html',(req, res) => res.sendFile(path.join(__dirname, 'dictionary.html')));
app.get('/flashcard.html',  (req, res) => res.sendFile(path.join(__dirname, 'flashcard.html')));
app.get('/jlpt.html',       (req, res) => res.sendFile(path.join(__dirname, 'jlpt.html')));
app.get('/chatbot.html',    (req, res) => res.sendFile(path.join(__dirname, 'chatbot.html')));



// Session middleware
app.use(session({
  key: 'session_cookie_name',
  secret: 'your_secret_key',      // <-- thay bằng chuỗi bí mật của bạn
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000   // 1 ngày
  }
}));

// Tạo middleware kiểm tra đã login
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: 'Chưa đăng nhập.' });
  }
  next();
}

// ===== 3. Các route HTML cơ bản =====
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.use(express.static(__dirname));
app.use('/css', express.static(path.join(__dirname, 'css')));

app.get('/login',     (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/search',    (req, res) => res.sendFile(path.join(__dirname, 'public', 'search.html')));
app.get('/signup',    (req, res) => res.sendFile(path.join(__dirname, 'public', 'signup.html')));
app.get('/index.html',(req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/dictionary.html',(req, res) => res.sendFile(path.join(__dirname, 'dictionary.html')));
app.get('/flashcard.html',  (req, res) => res.sendFile(path.join(__dirname, 'flashcard.html')));
app.get('/jlpt.html',       (req, res) => res.sendFile(path.join(__dirname, 'jlpt.html')));
app.get('/chatbot.html',    (req, res) => res.sendFile(path.join(__dirname, 'chatbot.html')));

// ===== 4. Route POST /login =====
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
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      // lưu userId vào session
      req.session.userId = user.id;
      return res.json({ success: true, redirect: '/index.html' }); 

    } else {
      return res.json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
    }
  });
});




// Hỗ trợ cả POST '/' cho login (nếu bạn vẫn giữ)
app.post('/', (req, res) => {
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
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      req.session.userId = user.id;
      return res.json({ success: true, redirect: '/index.html' }); 

    } else {
      return res.json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
    }
  });
});

// ===== 5. Route POST /signup =====
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const checkUserSql = 'SELECT * FROM users WHERE username = ?';
  db.query(checkUserSql, [username], (err, results) => {
    if (err) {
      console.error('Lỗi truy vấn MySQL:', err);
      return res.json({ success: false, message: 'Có lỗi xảy ra.' });
    }
    if (results.length > 0) {
      return res.json({ success: false, message: 'Tên đăng nhập đã tồn tại' });
    }
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Lỗi hash mật khẩu:', err);
        return res.json({ success: false, message: 'Có lỗi xảy ra.' });
      }
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

// =====================
// API cho flashcard (có requireLogin)
// =====================

// Lưu ý: trước khi chạy, cần ALTER TABLE flashcards ADD COLUMN user_id INT NOT NULL;
// và thêm FOREIGN KEY nếu muốn:
//   ALTER TABLE flashcards
//     ADD COLUMN user_id INT NOT NULL,
//     ADD CONSTRAINT fk_fc_user FOREIGN KEY(user_id) REFERENCES users(id);

// Thêm flashcard mới (user_id từ session)
app.post('/flashcard/add', requireLogin, (req, res) => {
  const { front, back } = req.body;
  const userId = req.session.userId;
  const sql = 'INSERT INTO flashcards (front, back, user_id) VALUES (?, ?, ?)';
  db.query(sql, [front, back, userId], (err, result) => {
    if (err) {
      console.error('Lỗi thêm flashcard:', err);
      return res.json({ success: false, message: "Lỗi khi thêm flashcard" });
    }
    return res.json({ success: true, message: "Flashcard đã được thêm thành công" });
  });
});

// Lấy danh sách flashcards của user hiện tại
app.get('/flashcards', requireLogin, (req, res) => {
  const userId = req.session.userId;
  const sql = 'SELECT * FROM flashcards WHERE is_active = 1 AND user_id = ? ORDER BY id ASC';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Lỗi truy vấn flashcards:', err);
      return res.json({ success: false, message: "Lỗi khi truy vấn flashcards" });
    }
    return res.json({ success: true, flashcards: results });
  });
});

// Pass flashcard (chỉ của user đó)
app.post('/flashcard/pass', requireLogin, (req, res) => {
  const { id } = req.body;
  const userId = req.session.userId;
  // Đảm bảo select trên đúng user
  db.query('SELECT pass_count FROM flashcards WHERE id = ? AND user_id = ?', [id, userId], (err, results) => {
    if (err || results.length === 0) 
      return res.json({ success: false, message: "Không tìm thấy flashcard" });

    let pass_count = results[0].pass_count + 1;
    // Tăng tổng lần pass (nếu có cột pass_total)
    db.query('UPDATE flashcards SET pass_total = pass_total + 1 WHERE id = ? AND user_id = ?', [id, userId]);

    if (pass_count >= 3) {
      const updateSql = 'UPDATE flashcards SET is_active = 0, pass_count = ? WHERE id = ? AND user_id = ?';
      db.query(updateSql, [pass_count, id, userId], err2 => {
        if (err2) return res.json({ success: false, message: "Lỗi khi ẩn flashcard" });
        return res.json({ success: true, removed: true });
      });
    } else {
      const updateSql = 'UPDATE flashcards SET pass_count = ? WHERE id = ? AND user_id = ?';
      db.query(updateSql, [pass_count, id, userId], err2 => {
        if (err2) return res.json({ success: false, message: "Lỗi khi cập nhật flashcard" });
        return res.json({ success: true, removed: false });
      });
    }
  });
});

// Fail flashcard
app.post('/flashcard/fail', requireLogin, (req, res) => {
  const { id } = req.body;
  const userId = req.session.userId;
  const updateSql = `
    UPDATE flashcards 
    SET pass_count = 0, fail_count = fail_count + 1 
    WHERE id = ? AND user_id = ?
  `;
  db.query(updateSql, [id, userId], err => {
    if (err) return res.json({ success: false, message: "Lỗi khi cập nhật flashcard" });
    return res.json({ success: true });
  });
});

// Reset tất cả flashcards của user
app.post('/flashcard/reset', requireLogin, (req, res) => {
  const userId = req.session.userId;
  const sql = `
    UPDATE flashcards 
    SET pass_count = 0, fail_count = 0, pass_total = 0, is_active = 1
    WHERE user_id = ?
  `;
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ success: false, message: "Lỗi khi reset flashcards" });
    }
    return res.json({ success: true, message: "Đã reset tất cả flashcards của bạn" });
  });
});

// Summary (chỉ tính của user)
app.get('/flashcard/summary', requireLogin, (req, res) => {
  const userId = req.session.userId;
  const checkActiveSql = `SELECT COUNT(*) AS activeCount FROM flashcards WHERE is_active = 1 AND user_id = ?`;
  db.query(checkActiveSql, [userId], (err, result) => {
    if (err) return res.json({ success: false, message: "Lỗi truy vấn kiểm tra active" });

    if (result[0].activeCount > 0) {
      return res.json({ success: false, message: "Chưa hoàn thành tất cả flashcards." });
    }

    const sql = `
      SELECT 
        front, 
        pass_total, 
        fail_count,
        ROUND(
          CASE WHEN (pass_total + fail_count) = 0 THEN 0
          ELSE pass_total / (pass_total + fail_count) * 100 END
        , 2) AS pass_rate
      FROM flashcards
      WHERE user_id = ?
      ORDER BY front ASC
    `;

    db.query(sql, [userId], (err, results) => {
      if (err) return res.json({ success: false, message: "Lỗi truy vấn summary" });
      return res.json({ success: true, summary: results });
    });
  });
});

// Lấy tất cả flashcards (admin hoặc debug) — bạn có thể loại bỏ nếu không cần
app.get('/flashcard/all', requireLogin, (req, res) => {
  const userId = req.session.userId;
  const sql = 'SELECT * FROM flashcards WHERE user_id = ? ORDER BY id ASC';
  db.query(sql, [userId], (err, results) => {
    if (err) return res.json({ success: false, message: "Lỗi truy vấn flashcards" });
    return res.json({ success: true, flashcards: results });
  });
});

// Xóa flashcard
app.post('/flashcard/delete', requireLogin, (req, res) => {
  const { id } = req.body;
  const userId = req.session.userId;
  const sql = 'DELETE FROM flashcards WHERE id = ? AND user_id = ?';
  db.query(sql, [id, userId], (err, result) => {
    if (err) return res.json({ success: false, message: "Lỗi khi xóa flashcard" });
    return res.json({ success: true });
  });
});

// Reset pass_count toàn bộ (nếu cần)
app.post("/flashcard/reset-pass", requireLogin, (req, res) => {
  const userId = req.session.userId;
  db.query("UPDATE flashcards SET pass_count = 0 WHERE user_id = ?", [userId], err => {
    if (err) return res.json({ success: false });
    return res.json({ success: true });
  });
});

// ===== 8. Khởi chạy server =====
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});


// app.post('/submit-score', requireLogin, (req, res) => {
//   const { score, table } = req.body;
//   const userId = req.session.userId;

//   if (!['07_24', '12_23'].includes(table)) {
//     return res.status(400).json({ success: false, message: 'Bảng không hợp lệ.' });
//   }

//   const sql = `INSERT INTO \`${table}\` (user_id, score) VALUES (?, ?)`;
//   db.query(sql, [userId, score], (err) => {
//     if (err) {
//       console.error('❌ Lỗi khi lưu điểm:', err);
//       return res.json({ success: false, message: 'Lỗi khi lưu điểm.' });
//     }
//     return res.json({ success: true });
//   });
// });


app.post('/flashcard/add', requireLogin, (req, res) => {
  const { front, back } = req.body;
  const userId = req.session.userId;
  const sql = 'INSERT INTO flashcards (front, back, user_id) VALUES (?, ?, ?)';
  db.query(sql, [front, back, userId], (err, result) => {
    if (err) {
      console.error('Lỗi thêm flashcard:', err);
      return res.json({ success: false, message: "Lỗi khi thêm flashcard" });
    }
    return res.json({ success: true, message: "Flashcard đã được thêm thành công" });
  });
});


app.post('/submit-score', requireLogin, (req, res) => {
  const { score, table } = req.body;
  const userId = req.session.userId;

  console.log('📌 Submitting Score:', { userId, score, table }); // Debug log

  if (!['07_24', '12_23'].includes(table)) {
    return res.status(400).json({ success: false, message: 'Bảng không hợp lệ.' });
  }

  // const sql = 'INSERT INTO \`${table}\` (user_id, score) VALUES (?, ?)';
  const sql = `INSERT INTO ${mysql.escapeId(table)} (user_id, score) VALUES (?, ?)`;

  db.query(sql, [userId, score], (err,result) => {
    if (err) {
      console.error('❌ Lỗi khi lưu điểm:', err);
      return res.json({ success: false, message: 'Lỗi khi lưu điểm.' });
    }
    return res.json({ success: true,  message: "điểm đã được thêm thành công" });
  });
});


// API để lấy lịch sử điểm số của người dùng
app.get('/get-user-scores', requireLogin, (req, res) => {
  const userId = req.session.userId;
  const result = { success: true, scores: {} };

  const queries = ['07_24', '12_23'].map(table => {
    return new Promise(resolve => {
      const sql = `SELECT score FROM \`${table}\` WHERE user_id = ?`;
      db.query(sql, [userId], (err, rows) => {
        result.scores[table] = err ? [] : rows.map(r => r.score);
        resolve();
      });
    });
  });

  Promise.all(queries).then(() => res.json(result));
});

