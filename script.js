function showContent(sectionId) {
    // Ẩn tất cả nội dung
    document.querySelectorAll('.content section').forEach(section => {
        section.style.display = 'none';
    });

    // Hiển thị nội dung được chọn
    document.getElementById(sectionId).style.display = 'block';

    document.querySelectorAll('.sidebar ul li').forEach(item => {
        item.classList.remove('active');
    });

    // Thêm class active cho mục menu được chọn
    const activeMenuItem = document.querySelector(`.sidebar ul li[onclick="showContent('${sectionId}')"]`);
    if (activeMenuItem) {
        activeMenuItem.classList.add('active');
    }
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

