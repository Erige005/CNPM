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

INSERT INTO users (username, password) VALUES ('admin', '123456');

