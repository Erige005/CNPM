document.addEventListener("DOMContentLoaded", function () {
  loadFlashcardCount();
  loadFlashcardLearn();
  loadExamCount();
  loadUsername();
});

function loadFlashcardCount() {
  fetch("/flashcards/count")
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const count = data.count;
        document.getElementById("voca-count").textContent = count;
      } else {
        document.getElementById("voca-count").textContent = "0";
        console.error("Không thể lấy số lượng flashcard.");
      }
    })
    .catch(err => {
      console.error("Lỗi khi lấy số lượng flashcard:", err);
      document.getElementById("voca-count").textContent = "0";
    });
}

function loadFlashcardLearn() {
  fetch("/flashcards/count/learn")
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const count = data.count;
        document.getElementById("learn").textContent = count;
      } else {
        document.getElementById("learn").textContent = "0";
        console.error("Không thể lấy số lượng flashcard.");
      }
    })
    .catch(err => {
      console.error("Lỗi khi lấy số lượng flashcard:", err);
      document.getElementById("learn").textContent = "0";
    });
}

function loadExamCount() {
  fetch("/get-user-scores/count")
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const count = data.count;
        document.getElementById("exam-count").textContent = count;
      } else {
        document.getElementById("exam-count").textContent = "0";
        console.error("Không thể lấy số lượng đề đã làm.");
      }
    })
    .catch(err => {
      console.error("Lỗi khi lấy số lượng đề đã làm:", err);
      document.getElementById("exam-count").textContent = "0";
    });
}

function loadUsername() {
    fetch("/user-info")
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        document.getElementById("username-display").textContent = data.username;
      } else {
        console.error("Chưa đăng nhập hoặc không thể lấy thông tin người dùng.");
      }
    })
    .catch(err => {
      console.error("Lỗi khi lấy thông tin người dùng:", err);
    });
}