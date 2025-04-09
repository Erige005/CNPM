function navigate(page) {
    window.location.href = page;
}

const userIcon = document.getElementById("userIcon");
const dropdownMenu = document.getElementById("dropdownMenu");

userIcon.addEventListener("click", () => {
    dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
});

// Ẩn menu khi click ra ngoài
window.addEventListener("click", (e) => {
    if (!userIcon.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.style.display = "none";
    }
});

// Demo sự kiện (thay bằng logic thực tế nếu có đăng nhập)
document.getElementById("logoutBtn").addEventListener("click", () => {
    window.location.href = "public/login.html";
});


