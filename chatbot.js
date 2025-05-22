const GEMINI_API_KEY = "AIzaSyC_5YoIudQ8EQ9KGXh7mVzA5DgT30rYe4I";  // Replace with your real key

const COHERE_API_KEY = "2UBTVU7lzz7SpLILH3DgxO4BQU0BVMdAQHqoYYzn";

let qaData = [];
let chatHistory = [];

// 🔁 Load file JSON chứa vector embedding cho câu hỏi
async function loadQAData() {
  const res = await fetch("./qa-embedding.json");
  qaData = await res.json();
}

// ✅ Gọi Cohere để tạo embedding cho câu hỏi người dùng
async function getUserEmbedding(userInput) {
  const res = await fetch("https://api.cohere.ai/v1/embed", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${COHERE_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "embed-english-v3.0",
      texts: [userInput],
      input_type: "search_query"
    })
  });
  const data = await res.json();
  return data.embeddings?.[0];
}

// 🎯 Hàm tính cosine similarity
function cosineSim(vecA, vecB) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dot / (magA * magB);
}

// 🔍 Truy xuất QA gần nhất
function getTopRelevantQA(userVec, topK = 2) {
  return qaData
    .map(item => ({
      ...item,
      score: cosineSim(userVec, item.embedding)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

// 🔧 Tạo prompt cho Gemini
async function buildPrompt(userInput) {
  const userVec = await getUserEmbedding(userInput);
  const topQA = getTopRelevantQA(userVec);
  const context = topQA.map((item, i) => `Q${i + 1}: ${item.question}\nA${i + 1}: ${item.answer}`).join("\n\n");
  const history = chatHistory.slice(-5).map((msg, i) => `Lịch sử ${i + 1}: ${msg}`).join("\n");

  return `
Bạn là một **giáo viên người Việt** dạy tiếng Nhật (N5–N3).

Trả lời bằng **tiếng Việt dễ hiểu**, có ví dụ tiếng Nhật, dịch nghĩa rõ ràng.

${history ? "Lịch sử hội thoại:\n" + history + "\n\n" : ""}
Dữ kiện tham khảo:
${context}

**Câu hỏi của người dùng:** ${userInput}
`;
}

// 🎯 Gửi prompt đến Gemini
async function askGemini() {
  const input = document.getElementById("question");
  const userInput = input.value.trim();
  if (!userInput) return;

  appendMessage(userInput, "user");
  chatHistory.push(`Người dùng: ${userInput}`);
  input.value = "";
  input.disabled = true;

  try {
    const prompt = await buildPrompt(userInput);
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
    appendMessage(reply, "bot");
    chatHistory.push(`Bot: ${reply}`);
  } catch (err) {
    appendMessage("❌ Lỗi khi gọi Gemini.", "bot");
    console.error(err);
  } finally {
    input.disabled = false;
    input.focus();
  }
}

// UI hiển thị chat
function appendMessage(text, sender) {
  const chatBox = document.getElementById("chat-box");
  const message = document.createElement("div");
  message.className = `message ${sender}-message`;
  message.innerHTML = marked.parse(text);
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Khởi tạo trang
document.addEventListener("DOMContentLoaded", async () => {
  const input = document.getElementById("question");
  const chatBox = document.getElementById("chat-box");

  const savedHistory = localStorage.getItem("chatHistory");
  if (savedHistory) {
    chatBox.innerHTML = savedHistory;
    chatBox.scrollTop = chatBox.scrollHeight;
  } else {
    appendMessage(
      `👋 Xin chào! Tôi là trợ lý học tiếng Nhật 🇯🇵<br><br>
      Gõ một câu hoặc cụm từ tiếng Nhật bạn cần giải thích nhé.`,
      "bot"
    );
  }

  await loadQAData(); // ✅ Tải file embedding
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      askGemini();
    }
  });
});





//test để luyện ai

// let qaData = [];
// let chatHistory = [];

// // 🔁 Hàm gọi Cohere để lấy vector embedding
// async function getEmbedding(text) {
//   const res = await fetch("https://api.cohere.ai/v1/embed", {
//     method: "POST",
//     headers: {
//       "Authorization": `Bearer ${COHERE_API_KEY}`,
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       model: "embed-english-v3.0",
//       texts: [text],
//       input_type: "search_query"
//     })
//   });
//   const data = await res.json();
//   return data.embeddings?.[0];
// }

// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// // 🔁 Gọi 1 lần để tạo embedding cho QA
// async function initEmbeddings() {
//   for (const item of qaData) {
//     if (!item.embedding) {
//       item.embedding = await getEmbedding(item.question);
//       await sleep(500); // ⏱ chờ 500ms giữa mỗi request

//     }
//   }
// }

// // 🎯 Tính cosine similarity
// function cosineSim(vecA, vecB) {
//   const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
//   const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
//   const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
//   return dot / (magA * magB);
// }

// // 🎯 Truy xuất câu hỏi gần nhất
// async function getTopRelevantQA_Cohere(userInput, topK = 2) {
//   const userVec = await getEmbedding(userInput);
//   // return qaData
//   //   .map(item => ({
//   //     ...item,
//   //     score: cosineSim(userVec, item.embedding)
//   //   }))
//   //   .sort((a, b) => b.score - a.score)
//   //   .slice(0, topK);
//   // Gọi getEmbedding() cho câu hỏi trong bộ dữ liệu nếu thiếu
//   for (const item of qaData) {
//     if (!item.embedding) {
//       item.embedding = await getEmbedding(item.question);
//       await sleep(500); // chờ mỗi lần 500ms
//     }
//   }

//   return qaData
//     .map(item => ({
//       ...item,
//       score: cosineSim(userVec, item.embedding)
//     }))
//     .sort((a, b) => b.score - a.score)
//     .slice(0, topK);
// }

// // 🔧 Tạo prompt dựa trên câu hỏi gần nhất
// async function buildPrompt(userInput) {
//   const topQA = await getTopRelevantQA_Cohere(userInput);
//   const context = topQA.map((item, i) => `Q${i + 1}: ${item.question}\nA${i + 1}: ${item.answer}`).join("\n\n");
//   const history = chatHistory.slice(-5).map((msg, i) => `Lịch sử ${i + 1}: ${msg}`).join("\n");

//   return `
// Bạn là một **giáo viên người Việt** giàu kinh nghiệm, chuyên dạy tiếng Nhật cho người học từ **trình độ sơ cấp đến trung cấp** (JLPT N5–N3).

// Bạn cần trả lời câu hỏi của người học **hoàn toàn bằng tiếng Việt**, sử dụng tiếng Nhật chỉ khi trích dẫn từ vựng, cấu trúc ngữ pháp hoặc ví dụ minh họa.

//  Lưu ý:
// - Trình bày câu trả lời **rõ ràng**, **dễ hiểu**, thân thiện như đang giảng bài trực tiếp.
// - Câu trả lời nên có cấu trúc:
//   1. Định nghĩa hoặc giải thích ngắn gọn
//   2. Diễn giải hoặc ví dụ minh họa bằng tiếng Nhật kèm **phiên âm và dịch nghĩa**
//   3. Mẹo học hoặc lưu ý thêm nếu có

// Nếu bạn không có thông tin phù hợp, hãy nói:
// "**Xin lỗi, tôi chưa có đủ thông tin chính xác để trả lời câu hỏi này.**"
// ${history ? "Lịch sử hội thoại:\n" + history + "\n\n" : ""}
// Dữ kiện tham khảo:
// ${context}

// **Câu hỏi của người dùng:** ${userInput}
//   `;
// }

// // 🎯 Gửi prompt đến Gemini
// async function askGemini() {
//   const input = document.getElementById("question");
//   const userInput = input.value.trim();
//   if (!userInput) return;

//   appendMessage(userInput, "user");
//   chatHistory.push(`Người dùng: ${userInput}`);
//   input.value = "";
//   input.disabled = true;

//   try {
//     const prompt = await buildPrompt(userInput);
//     const res = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
//       }
//     );

//     const data = await res.json();
//     const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
//     appendMessage(reply, "bot");
//     chatHistory.push(`Bot: ${reply}`);
//   } catch (err) {
//     appendMessage("❌ Có lỗi khi gửi yêu cầu đến Gemini.", "bot");
//     console.error(err);
//   } finally {
//     input.disabled = false;
//     input.focus();
//   }
// }

// // UI chat
// function appendMessage(text, sender) {
//   const chatBox = document.getElementById("chat-box");
//   const message = document.createElement("div");
//   message.className = `message ${sender}-message`;
//   message.innerHTML = marked.parse(text);
//   chatBox.appendChild(message);
//   chatBox.scrollTop = chatBox.scrollHeight;
// }

// // Khởi tạo sự kiện khi load trang
// document.addEventListener("DOMContentLoaded", async () => {
//   const input = document.getElementById("question");
//   const chatBox = document.getElementById("chat-box");

//   const savedHistory = localStorage.getItem("chatHistory");
//   if (savedHistory) {
//     chatBox.innerHTML = savedHistory;
//     chatBox.scrollTop = chatBox.scrollHeight;
//   } else {
//     appendMessage(
//       `👋 Xin chào! Chào mừng bạn đến với chatbot luyện tiếng Nhật 🇯🇵<br><br>
// Tôi có thể giúp bạn:<br>
// - Giải thích nghĩa của các cụm từ, câu tiếng Nhật bằng tiếng Việt 🧠<br>
// - Trả lời các câu hỏi về ngữ pháp, từ vựng, JLPT<br>
// - Gợi ý cách học tiếng Nhật hiệu quả<br><br>
// Hãy gõ một câu hoặc cụm từ tiếng Nhật mà bạn muốn tôi giải thích nhé!`,
//       "bot"
//     );
//   }

//   await initEmbeddings(); // ✅ load embedding trước

//   input.addEventListener("keydown", (event) => {
//     if (event.key === "Enter") {
//       askGemini();
//     }
//   });
// });