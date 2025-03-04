// public/login.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');
  
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Ngăn submit form truyền thống
  
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
  
      try {
        // Gửi request POST đến server
        const response = await fetch('/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });
  
        const result = await response.json();
  
        if (result.success) {
          // Đăng nhập thành công -> chuyển hướng sang /search
        window.location.href = result.redirect; // => '/search'
        } else {
          // Hiển thị thông báo lỗi
          errorMessage.textContent = result.message;
        }
      } catch (error) {
        errorMessage.textContent = 'Có lỗi xảy ra. Vui lòng thử lại.';
      }
    });
  });
  