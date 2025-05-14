
// let currentTestFile = ''; // To keep track of the current test file
// let currentData = [];

// function loadTest(filename) {
//     currentTestFile = filename;
  
//     fetch(`test/${filename}`)
//       .then(res => res.json())
//       .then(data => {
//         currentData = data;
//         renderTest(data);
//         showTimerAndSubmit();         // ⏱️ Show + start timer AFTER test loaded
//         startTimer(75 * 60);          // 1h15m
//       })
//       .catch(err => {
//         console.error("Lỗi khi tải đề:", err);
//       });
//   }
  
//   function showTimerAndSubmit() {
//     const testContainer = document.getElementById("test-container");
  
//     // If timer & button aren't already inserted, add them
//     if (!document.getElementById("timer")) {
//       const timer = document.createElement("span");
//       timer.id = "timer";
//       timer.style = "font-size: 20px; font-weight: bold;";
//       timer.textContent = "1:15:00";
//       testContainer.prepend(timer); // Add on top

//       const submitBtn = document.createElement("button");
//       submitBtn.id = "submit-btn";
//       submitBtn.textContent = "Nộp bài";
//       //submitBtn.style = "margin-left: 20px; background-color: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;";
//       submitBtn.addEventListener("click", () => {
//         clearInterval(timerInterval);
//         submitTest();
//       });
//       testContainer.appendChild(submitBtn);
//     }
//   }
  

  
//   function renderTest(data) {
//     const container = document.getElementById('test-container');
//     container.innerHTML = ''; // Clear old content
  
//     let questionNumber = 1; // Use this to number actual questions only
  
//     data.forEach(item => {
//       // Nếu chỉ có đoạn văn (không có câu hỏi)
//       if (item.paragraph && !item.question) {
//         const paraBlock = document.createElement('div');
//         paraBlock.className = 'paragraph-block';
//         paraBlock.innerHTML = `<strong>Đoạn văn:</strong><br>${item.paragraph}`;
//         container.appendChild(paraBlock);
//         return; // skip the rest
//       }
  
//       // Nếu có đoạn văn kèm câu hỏi
//       if (item.paragraph && item.question) {
//         const paraBlock = document.createElement('div');
//         paraBlock.className = 'paragraph-block';
//         paraBlock.innerHTML = `<strong>Đoạn văn:</strong><br>${item.paragraph}`;
//         container.appendChild(paraBlock);
//       }
  
//       // Hiển thị câu hỏi + đáp án
//       if (item.question && item.choices) {
//         const qBlock = document.createElement('div');
//         qBlock.className = 'question-block';
//         qBlock.innerHTML = `
//   <p><strong>Câu ${questionNumber}:</strong> ${item.question}</p>
//   ${item.choices.map((choice, i) => `
//     <label data-q="${questionNumber}">
//       <input type="radio" name="q${questionNumber}" value="${choice}">
//       ${String.fromCharCode(65 + i)}. ${choice}
//     </label><br>
//   `).join('')}
// `;
//         container.appendChild(qBlock);
//         questionNumber++;
//       }
//     });
//   }

// let interval = null; // To keep track of the timer interval
//   // Countdown logic
// function startTimer(durationInSeconds) {
//     let timer = durationInSeconds;
//     const display = document.getElementById("timer");
  
//      interval = setInterval(() => {
//       const hours = Math.floor(timer / 3600);
//       const minutes = Math.floor((timer % 3600) / 60);
//       const seconds = timer % 60;
  
//       display.textContent = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
//       if (--timer < 0) {
//         clearInterval(interval);
//         submitTest(); // Auto submit when time ends
//       }
//     }, 1000);
  
//     // Stop if user submits early
//     document.getElementById("submit-btn").addEventListener("click", () => {
//       clearInterval(interval);
//       submitTest();
//     });
//   }
  
//   // Call it after loading the test
//   // startTimer(75 * 60); // 1h15m in seconds

//   function submitTest() {
//     let correctCount = 0;
//     let questionNumber = 1;
  
//     currentData.forEach(item => {
//       if (item.question && item.choices) {
//         const selected = document.querySelector(`input[name="q${questionNumber}"]:checked`);
//         const correctAnswer = item.correct;
  
//         // Mark correct / incorrect
//         const labels = document.querySelectorAll(`[data-q="${questionNumber}"]`);
  
//         labels.forEach(label => {
//           const input = label.querySelector('input');
//           const value = input.value;
  
//           if (value === correctAnswer && (!selected || selected.value !== correctAnswer)) {
//             label.style.color = 'green'; // correct, not selected
//           }
  
//           if (selected && value === selected.value) {
//             if (value === correctAnswer) {
//               label.style.color = 'blue'; // correct chosen
//             } else {
//               label.style.color = 'red'; // wrong chosen
//             }
//           }
//         });
  
//         if (selected && selected.value === correctAnswer) {
//           correctCount++;
//         }
  
//         questionNumber++;
//       }
//     });
//     showResultPopup(correctCount, questionNumber - 1);
//     document.querySelectorAll('input[type="radio"]').forEach(input => {
//       input.disabled = true;
//     });
//   }

//   function showResultPopup(correct, total) {
//     const popup = document.createElement("div");
//     popup.id = "result-popup";
//     popup.style = `
//       position: fixed;
//       top: 30%;
//       left: 50%;
//       transform: translate(-50%, -30%);
//       background: white;
//       border: 2px solid #007bff;
//       padding: 20px 30px;
//       box-shadow: 0 4px 10px rgba(0,0,0,0.3);
//       z-index: 1000;
//       text-align: center;
//     `;
  
//     popup.innerHTML = `
//       <h2>Kết quả</h2>
//       <p>Bạn làm đúng <strong>${correct}</strong> / ${total} câu.</p>
//       <button onclick="document.body.removeChild(this.parentNode)" style="margin-top: 10px; background: #007bff; color: white; padding: 6px 12px; border: none; border-radius: 5px; cursor: pointer;">
//         Đóng
//       </button>
//     `;
  
//     document.body.appendChild(popup);
//   }

let currentTestFile = '';
let currentData = [];

window.onload = function () {
    checkLoginAndLoadScores();
};

function checkLoginAndLoadScores() {
    fetch('/get-user-scores', { credentials: 'include' })
        .then(res => {
            if (res.status === 401) {
                alert("❌ Bạn chưa đăng nhập! Chuyển về trang đăng nhập.");
                window.location.href = "login";
                throw new Error("Not logged in");
            }
            return res.json();
        })
        .then(data => {
            if (data.success) {
                renderScoreTable('07_24', data.scores['07_24'] || []);
                renderScoreTable('12_23', data.scores['12_23'] || []);
                document.getElementById("score-history").style.display = "block";
            }
        })
        .catch(err => console.warn(err));
}

function loadTest(filename) {
    currentTestFile = filename;
    document.getElementById("score-history").style.display = "none";

    fetch(`test/${filename}`)
        .then(res => res.json())
        .then(data => {
            currentData = data;
            renderTest(data);
            showTimerAndSubmit();
            startTimer(75 * 60);
        })
        .catch(err => console.error("❌ Lỗi khi tải đề:", err));
}

function showTimerAndSubmit() {
    const testContainer = document.getElementById("test-container");

    if (!document.getElementById("timer")) {
        const timer = document.createElement("span");
        timer.id = "timer";
        timer.style = "font-size: 20px; font-weight: bold;";
        timer.textContent = "1:15:00";
        testContainer.prepend(timer);

        const submitBtn = document.createElement("button");
        submitBtn.id = "submit-btn";
        submitBtn.textContent = "Nộp bài";
        submitBtn.addEventListener("click", () => {
            clearInterval(interval);
            submitTest();
        });
        testContainer.appendChild(submitBtn);
    }
}

function renderTest(data) {
    const container = document.getElementById('test-container');
    container.innerHTML = '';

    let questionNumber = 1;

    data.forEach(item => {
        if (item.paragraph && !item.question) {
            container.innerHTML += `
                <div class="paragraph-block">
                    <strong>Đoạn văn:</strong><br>${item.paragraph}
                </div>`;
            return;
        }

        if (item.paragraph && item.question) {
            container.innerHTML += `
                <div class="paragraph-block">
                    <strong>Đoạn văn:</strong><br>${item.paragraph}
                </div>`;
        }

        if (item.question && item.choices) {
            const options = item.choices.map((choice, i) => `
                <label data-q="${questionNumber}">
                    <input type="radio" name="q${questionNumber}" value="${choice}">
                    ${String.fromCharCode(65 + i)}. ${choice}
                </label><br>
            `).join('');

            container.innerHTML += `
                <div class="question-block">
                    <p><strong>Câu ${questionNumber}:</strong> ${item.question}</p>
                    ${options}
                </div>`;
            questionNumber++;
        }
    });
}

let interval = null;

function startTimer(duration) {
    let timer = duration;
    const display = document.getElementById("timer");

    interval = setInterval(() => {
        const hours = Math.floor(timer / 3600);
        const minutes = Math.floor((timer % 3600) / 60);
        const seconds = timer % 60;

        display.textContent = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (--timer < 0) {
            clearInterval(interval);
            submitTest();
        }
    }, 1000);
}

function submitTest() {
    let correctCount = 0;
    let questionNumber = 1;

    // currentData.forEach(item => {
    //     if (item.question && item.choices) {
    //         const selected = document.querySelector(`input[name="q${questionNumber}"]:checked`);
    //         if (selected && selected.value === item.correct) correctCount++;
    //         questionNumber++;
    //     }

        



    // });

    currentData.forEach(item => {
              if (item.question && item.choices) {
                const selected = document.querySelector(`input[name="q${questionNumber}"]:checked`);
                const correctAnswer = item.correct;
          
                // Mark correct / incorrect
                const labels = document.querySelectorAll(`[data-q="${questionNumber}"]`);
          
                labels.forEach(label => {
                  const input = label.querySelector('input');
                  const value = input.value;
          
                  if (value === correctAnswer && (!selected || selected.value !== correctAnswer)) {
                    label.style.color = 'green'; // correct, not selected
                  }
          
                  if (selected && value === selected.value) {
                    if (value === correctAnswer) {
                      label.style.color = 'blue'; // correct chosen
                    } else {
                      label.style.color = 'red'; // wrong chosen
                    }
                  }
                });
          
                if (selected && selected.value === correctAnswer) {
                  correctCount++;
                }
          
                questionNumber++;
              }
            });



    showResultPopup(correctCount, questionNumber - 1);

    let table = null;
if (currentTestFile) {
    if (currentTestFile.includes("0724")) {
        table = "07_24";
    } else if (currentTestFile.includes("1223")) {
        table = "12_23";
    }
}
console.log("📌 Table to Submit:", table);


    if (table) {
        fetch('/submit-score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // ⭐ Ensures cookies (session) are sent

            body: JSON.stringify({ score: correctCount, table })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                console.log("✅ Điểm đã được lưu thành công.");
                checkLoginAndLoadScores();
            } else {
                console.error("❌ Không thể lưu điểm:", data.message);
            }
        })
        .catch(err => console.error("❌ Lỗi khi gửi điểm:", err));
    }
}

function renderScoreTable(tableName, scores) {
    const container = document.getElementById(`table-${tableName}`);
    if (!container) return;

    container.innerHTML = `
    <h3 style="margin-bottom: 15px; color: #333;">Bảng điểm ${tableName}</h3>

    ${scores.length > 0 ? `
        <table style="
            width: 100%;
            border-collapse: collapse;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            background-color: #fff;
        ">
            <thead style="background-color:rgb(160, 59, 218); color: white;">
                <tr>
                    <th style="padding: 12px; text-align: center;">Điểm</th>
                </tr>
            </thead>
            <tbody>
                ${scores.map(score => `
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 12px; font-size: 15px; text-align: center;">${score}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    ` : `<p style="color: #777; font-style: italic;">Chưa có dữ liệu.</p>`}
    `;
}

function showResultPopup(correct, total) {
    const popup = document.createElement("div");
    popup.id = "result-popup";
    popup.style = `
        position: fixed;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -30%);
        background: white;
        border: 2px solid #007bff;
        padding: 20px 30px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        z-index: 1000;
        text-align: center;
    `;

    popup.innerHTML = `
        <h2>Kết quả</h2>
        <p>Bạn làm đúng <strong>${correct}</strong> / ${total} câu.</p>
        <button onclick="document.body.removeChild(this.parentNode)" 
                style="margin-top: 10px; background: #007bff; color: white; padding: 6px 12px; border: none; border-radius: 5px; cursor: pointer;">
            Đóng
        </button>
    `;

    document.body.appendChild(popup);
}
