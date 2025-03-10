document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const resultsContainer = document.getElementById("results");
  
    // Hàm gọi API
    function fetchWords(query) {
      // Hiển thị thông báo đang tìm kiếm
      resultsContainer.innerHTML = "<p>Đang tìm kiếm...</p>";
  
      // Tạo URL API với từ khóa nhập vào
      const apiUrl = `https://backend-production-278881502558.asia-northeast1.run.app/v1/lexemes/search/${encodeURIComponent(query)}`;
  
      fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error("Lỗi mạng hoặc không tìm thấy dữ liệu");
          }
          return response.json();
        })
        .then(data => {
          displayResults(data);
        })
        .catch(error => {
          resultsContainer.innerHTML = `<p style="color: red;">${error.message}</p>`;
        });
    }
  
    function displayResults(responseData) {
        // Kiểm tra xem responseData có dạng {"message":"OK","data":{...}} hay không
        if (
          responseData && 
          responseData.message === "OK" && 
          responseData.data
        ) {
          const data = responseData.data; // chứa id, lexeme, meaning,...
      
          // Ví dụ: hiển thị thông tin cơ bản
          // resultsContainer là một phần tử HTML nơi bạn muốn đổ dữ liệu vào
          resultsContainer.innerHTML = `
            <h2>${data.lexeme} (${data.hanviet})</h2>
            <p><strong>Hiragana:</strong> ${data.hiragana}</p>
            <p><strong>JLPT level:</strong> ${data.Jlptlevel}</p>
            <p><strong>Từ tương tự:</strong> ${data.similars.join(", ")}</p>
          `;
      
          // Giả sử bạn muốn hiển thị danh sách các nghĩa (meaning) bên dưới
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
      
            // Thêm danh sách meaning vào bên dưới khối kết quả
            resultsContainer.appendChild(list);
          } else {
            // Trường hợp không có meaning
            resultsContainer.innerHTML += "<p>Không tìm thấy nghĩa.</p>";
          }
      
        } else {
          // Trường hợp không đúng cấu trúc hoặc message không phải "OK"
          resultsContainer.innerHTML = "<p>Không tìm thấy kết quả.</p>";
        }
      }
      
  
    // Sự kiện khi click vào nút tìm kiếm
    searchBtn.addEventListener("click", () => {
      const query = searchInput.value.trim();
      if (query) {
        fetchWords(query);
      }
    });
  
    // Cho phép nhấn Enter để tìm kiếm
    searchInput.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        const query = searchInput.value.trim();
        if (query) {
          fetchWords(query);
        }
      }
    });
  });
  