document.addEventListener("DOMContentLoaded", function () {
  loadFlashcardCount();
  loadWordCount()
  loadExamCount();
  loadUsername();
  // loadRecentWords();
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

function loadWordCount() {
  fetch("/search/count")
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const count = data.count;
        document.getElementById("learn").textContent = count;
      } else {
        document.getElementById("learn").textContent = "0";
        console.error("Không thể lấy số lượng từ.");
      }
    })
    .catch(err => {
      console.error("Lỗi khi lấy số lượng từ:", err);
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

function loadRecentWords() {
  fetch('/search')
    .then(response => response.json())
    .then(data => {
      if (!data.success) {
        console.error('Không lấy được dữ liệu.');
        return;
      }
      const words = data.search;
      const list = document.querySelector('.recent-word__list');
      list.innerHTML = '';

      words.forEach(word => {
        const card = document.createElement('div');
        card.className = 'word-card';
        card.innerHTML = `
          <h3 class="word-card__char">${word.word}</h3>
          <h3 class="word-card__meaning">${word.meaning}</h3>
        `;
        list.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Lỗi khi fetch:', error);
    });

}

window.addEventListener('DOMContentLoaded', function () {
    loadRecentWords();
});