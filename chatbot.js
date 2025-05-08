const GEMINI_API_KEY = "AIzaSyC_5YoIudQ8EQ9KGXh7mVzA5DgT30rYe4I";  // Replace with your real key
//test để luyện ai
const qaData = [
  {
    question: "かわいい",
    answer: "Từ này thường được dùng để miêu tả những thứ có vẻ ngoài dễ chịu, đáng yêu, hay thu hút sự chú ý theo cách tích cực.彼女はとても可愛いです。 - Cô ấy rất dễ thương. その犬は可愛いですね。 - Con chó đó thật dễ thương nhỉ. このドレスは可愛いです。 - Chiếc váy này thật dễ thương."
  },
  {
        question: "「いただきます」 có nghĩa là gì?",
        answer: "「いただきます」 là câu nói trước khi ăn, thể hiện sự cảm ơn đến người nấu và thực phẩm."
      },
      {
        question: "「おはよう」 nghĩa là gì？",
        answer: "「おはよう」 nghĩa là 'Chào buổi sáng' trong tiếng Nhật."
      }
];

function buildPrompt(userInput) {
  const context = qaData.map((item, i) => 
    `Q${i + 1}: ${item.question}\nA${i + 1}: ${item.answer}`
  ).join('\n\n');

  return `
Bạn là một AI dạy tiếng Nhật, **vui lòng trả lời hoàn toàn bằng tiếng Việt**. Dưới đây là một số hỏi-đáp mẫu:

${context}

Hãy sử dụng những thông tin trên để trả lời một cách chi tiết và thân thiện bằng tiếng Việt:

**Câu hỏi của người dùng:** ${userInput}
`;
}


  async function askGemini() {
    const input = document.getElementById("question");
    const chatBox = document.getElementById("chat-box");
    const userInput = input.value.trim();
  
    if (!userInput) return;
  
    appendMessage(userInput, "user");
  
    input.value = ""; // Clear input
    input.disabled = true;
  
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: buildPrompt(userInput) }] }]
          })
        }
      );
  
      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
      appendMessage(reply, "bot");
  
    } catch (err) {
      appendMessage("Something went wrong.", "bot");
      console.error(err);
    } finally {
      input.disabled = false;
      input.focus();
    }
  }
  
  function appendMessage(text, sender) {
    const chatBox = document.getElementById("chat-box");
    const message = document.createElement("div");
    message.className = `message ${sender}-message`;
    message.innerHTML = marked.parse(text);
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Cho phép nhấn Enter để tìm kiếm
  document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("question");

    appendMessage(
      `👋 Xin chào! Chào mừng bạn đến với chatbot luyện tiếng Nhật 🇯🇵<br><br>
  Tôi có thể giúp bạn:<br>
  - Giải thích nghĩa của các cụm từ, câu tiếng Nhật bằng tiếng Việt 🧠<br>
  - Trả lời các câu hỏi về ngữ pháp, từ vựng, JLPT<br>
  - Gợi ý cách học tiếng Nhật hiệu quả<br><br>
  Hãy gõ một câu hoặc cụm từ tiếng Nhật mà bạn muốn tôi giải thích nhé!`,
      "bot"
    );

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        askGemini();
      }
    });
  });