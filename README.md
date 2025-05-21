# CNPM
# cấu trúc thư mục
D: ungdung
├── package.json
├── server.js
└── public
    ├── login.html
    ├── login.js
    └── styles.css
# mẫu csdl
CREATE DATABASE app;
USE app;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

#mẫu csdl flash card
CREATE TABLE flashcards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    front VARCHAR(255) NOT NULL,  -- Ví dụ: "青い"
    back VARCHAR(255) NOT NULL,   -- Ví dụ: "màu xanh"
    pass_count INT DEFAULT 0      -- Số lần pass liên tục
);

ALTER TABLE flashcards ADD COLUMN is_active TINYINT(1) DEFAULT 1;
ALTER TABLE flashcards ADD COLUMN sort_order INT DEFAULT 0;
ALTER TABLE flashcards ADD COLUMN fail_count INT DEFAULT 0;
DELETE FROM flashcards;
#update logic flash card cho mỗi user
ALTER TABLE flashcards
  ADD COLUMN user_id INT NULL AFTER id;
DELETE FROM flashcards;
ALTER TABLE flashcards

  MODIFY COLUMN user_id INT NOT NULL,
  ADD CONSTRAINT fk_fc_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
thêm
npm install express-session express-mysql-session




#thêm 2 bảng điểm
-CREATE TABLE `07_24` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `score` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_07_user` (`user_id`),
  CONSTRAINT `07_24_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_07_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
<br>

-CREATE TABLE `12_23` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `score` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_12_user` (`user_id`),
  CONSTRAINT `12_23_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_12_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE test_scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    test_name VARCHAR(255) NOT NULL,
    score INT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    KEY `fk_user` (`user_id`),
    CONSTRAINT `ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
);
