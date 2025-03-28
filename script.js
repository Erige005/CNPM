function navigate(page) {
    window.location.href = page;
}

function login() {
    // Giả lập đăng nhập (ở thực tế sẽ có hệ thống đăng nhập)
    let userAvatar = document.getElementById("user-avatar");
    let loginBtn = document.getElementById("login-btn");

    // Kiểm tra nếu đã đăng nhập rồi thì không làm gì
    if (userAvatar.style.display === "inline-block") return;

    // Khi bấm đăng nhập, ẩn nút và hiển thị avatar
    loginBtn.style.display = "none";
    userAvatar.src = "user-avatar.png"; // Ảnh đại diện người dùng
    userAvatar.style.display = "inline-block";
}
