document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginErrorMessage = document.getElementById('login-error-message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        try {
            const res = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const result = await res.json();

            if (result.success) {
                console.log("✅ Login thành công, chuyển trang...");
                window.location.href = result.redirect || '/index.html';
            } else {
                loginErrorMessage.textContent = result.message || 'Đăng nhập thất bại.';
            }
        } catch (err) {
            loginErrorMessage.textContent = 'Lỗi kết nối. Vui lòng thử lại.';
        }
    });
});




