// File: public/search.js
document.addEventListener("DOMContentLoaded", function() {
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const resultsContainer = document.getElementById("results");
  const modeJpViBtn = document.getElementById("modeJpVi");
  const modeViJpBtn = document.getElementById("modeViJp");

  // Chế độ mặc định: Nhật → Việt
  let mode = 'jpvi';

  // Chuyển mode khi click
  modeJpViBtn.addEventListener("click", () => {
    mode = 'jpvi';
    modeJpViBtn.classList.add("active");
    modeViJpBtn.classList.remove("active");
    searchInput.placeholder = "Nhập từ tiếng Nhật (ví dụ: 青い)";
    resultsContainer.innerHTML = "";
  });
  modeViJpBtn.addEventListener("click", () => {
    mode = 'vijp';
    modeViJpBtn.classList.add("active");
    modeJpViBtn.classList.remove("active");
    searchInput.placeholder = "Nhập từ tiếng Việt (ví dụ: xanh)";
    resultsContainer.innerHTML = "";
  });

  // Hàm gọi API Nhật→Việt
  function fetchJap(query) {
    resultsContainer.innerHTML = "<p>Đang tìm kiếm...</p>";
    const apiUrl = `https://backend-production-278881502558.asia-northeast1.run.app/v1/lexemes/search/${encodeURIComponent(query)}`;
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error("Lỗi mạng hoặc không tìm thấy dữ liệu");
        }
        return response.json();
      })
      .then(data => displayJapaneseResults(data))
      .catch(error => {
        resultsContainer.innerHTML = `<p style="color: red;">${error.message}</p>`;
      });
  }

  // Hàm gọi API Việt→Nhật
  function fetchVi(query) {
    resultsContainer.innerHTML = "<p>Đang tìm kiếm...</p>";
    const apiUrl = `https://backend-production-278881502558.asia-northeast1.run.app/v1/lexemes/vietnamese/${encodeURIComponent(query)}`;
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error("Lỗi mạng hoặc không tìm thấy dữ liệu");
        }
        return response.json();
      })
      .then(data => displayVietnameseResults(data, query))
      .catch(error => {
        resultsContainer.innerHTML = `<p style="color: red;">${error.message}</p>`;
      });
  }

  // Hiển thị kết quả Nhật→Việt
  function displayJapaneseResults(responseData) {
    if (
      responseData &&
      responseData.message === "OK" &&
      responseData.data
    ) {
      const data = responseData.data;
      resultsContainer.innerHTML = `
        <h2>${data.lexeme} (${data.hanviet})</h2>
        <p><strong>Hiragana:</strong> ${data.hiragana}</p>
        <p><strong>JLPT level:</strong> ${data.Jlptlevel}</p>
        <p><strong>Từ tương tự:</strong> ${data.similars.join(", ")}</p>
        <button id="addFlashcardBtn">Thêm vào flashcard</button>
      `;
      if (Array.isArray(data.meaning) && data.meaning.length > 0) {
        const list = document.createElement("ul");
        data.meaning.forEach(item => {
          const li = document.createElement("li");
          li.innerHTML = `
            <h4>${item.meaning}</h4>
            <p>${item.explaination}</p>
            <pre>${item.example}</pre>
          `;
          list.appendChild(li);
        });
        resultsContainer.appendChild(list);

        // Lưu từ vào CSDL khi tra xong
        fetch('/search/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            word: data.lexeme,
            meaning: Array.isArray(data.meaning)
              ? data.meaning.map(m => m.meaning).join("; ")
              : data.meaning
          })
        }).catch(err => console.error("Lỗi khi lưu từ:", err));
      } else {
        resultsContainer.innerHTML += "<p>Không tìm thấy nghĩa.</p>";
      }
      document.getElementById("addFlashcardBtn").addEventListener("click", function() {
        const flashcardData = {
          front: data.lexeme,
          back: Array.isArray(data.meaning)
            ? data.meaning.map(m => m.meaning).join("; ")
            : data.meaning
        };
        fetch("/flashcard/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(flashcardData)
        })
        .then(response => response.json())
        .then(result => showCustomAlert(result.message))
        .catch(() => alert("Lỗi khi thêm flashcard"));
      });
    } else {
      resultsContainer.innerHTML = "<p>Không tìm thấy kết quả.</p>";
    }
  }

  // Hiển thị kết quả Việt→Nhật
  function displayVietnameseResults(responseData, originalQuery) {
    if (
      responseData &&
      responseData.message === "OK" &&
      Array.isArray(responseData.data) &&
      responseData.data.length > 0
    ) {
      resultsContainer.innerHTML = `<h3>Kết quả cho "${originalQuery}":</h3>`;
      responseData.data.forEach(lexeme => {
        const card = document.createElement("div");
        card.classList.add("result-card");
        card.innerHTML = `
          <h4>${lexeme}</h4>
          <button class="addBtn">Thêm flashcard</button>
        `;
        card.querySelector(".addBtn").addEventListener("click", () => {
          const flashcardData = {
            front: originalQuery,
            back: lexeme
          };
          fetch("/flashcard/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(flashcardData)
          })
          .then(res => res.json())
          .then(r => showCustomAlert(r.message))
          .catch(() => alert("Lỗi khi thêm flashcard"));
        });
        resultsContainer.appendChild(card);
      });
    } else {
      resultsContainer.innerHTML = "<p>Không tìm thấy kết quả.</p>";
    }
  }

  // Sự kiện khi click nút tìm kiếm
  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (!query) return;
    mode === 'jpvi' ? fetchJap(query) : fetchVi(query);
  });

  // Cho phép nhấn Enter để tìm kiếm
  searchInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      const query = searchInput.value.trim();
      if (!query) return;
      mode === 'jpvi' ? fetchJap(query) : fetchVi(query);
    }
  });
});
