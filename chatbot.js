const GEMINI_API_KEY = "AIzaSyC_5YoIudQ8EQ9KGXh7mVzA5DgT30rYe4I";  // Replace with your real key
//test để luyện ai
const qaData = [
  {
    question: "日本語を勉強する理由は何ですか？",
    answer: "多くの人はアニメ、文化、仕事のために日本語を勉強します。"
  },
  {
    question: "JLPTにはどんなレベルがありますか？",
    answer: "JLPTにはN5からN1までの5つのレベルがあります。N5が最も易しく、N1が最も難しいです。"
  },
  {
    question: "漢字の覚え方を教えてください。",
    answer: "毎日書いたり、単語と一緒に覚えたり、アプリを使うのが効果的です。"
  },
  {
    question: "日本語の助詞「は」と「が」の違いは？",
    answer: "「は」は主題を示し、「が」は主語や新しい情報を強調します。"
  },
  {
    question: "敬語とは何ですか？",
    answer: "敬語は丁寧に話すための表現で、尊敬語、謙譲語、丁寧語があります。"
  },
  {
    question: "日本語の単語をどうやって覚えますか？",
    answer: "フラッシュカードや文脈の中で単語を使って覚えると良いです。"
  },
  {
    question: "JLPTのN3に合格するにはどのくらい勉強が必要ですか？",
    answer: "通常は300〜600時間の勉強が必要だと言われています。"
  },
  {
    question: "日本語のリスニングを上達させるには？",
    answer: "毎日アニメやポッドキャストを聴くことで耳を慣らすのが効果的です。"
  },
  {
    question: "日本語と中国語は似ていますか？",
    answer: "漢字は似ていますが、発音や文法は大きく異なります。"
  },
  {
    question: "日本語の「です」と「ます」の違いは？",
    answer: "「です」は名詞の丁寧形、「ます」は動詞の丁寧形です。"
  }
];
// Tính độ tương đồng đơn giản giữa hai chuỗi
function stringSimilarity(str1, str2) {
  const a = str1.toLowerCase().split(" ");
  const b = str2.toLowerCase().split(" ");
  const common = a.filter(word => b.includes(word));
  return common.length / Math.max(a.length, b.length);
}

// Lấy ra các QA liên quan nhất
function getTopRelevantQA(userInput, topK = 2) {
  return qaData
    .map(item => ({
      ...item,
      score: stringSimilarity(userInput, item.question)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

// Tạo prompt RAG
function buildPrompt(userInput) {
  const topQA = getTopRelevantQA(userInput);

  const context = topQA.map((item, i) =>
    `Q${i + 1}: ${item.question}\nA${i + 1}: ${item.answer}`
  ).join("\n\n");

  return `
Bạn là một AI dạy tiếng Nhật, **vui lòng trả lời hoàn toàn bằng tiếng Việt**. Dưới đây là một số hỏi-đáp mẫu:

${context}

Hãy sử dụng những thông tin trên (nếu phù hợp) để trả lời chi tiết và thân thiện bằng tiếng Việt:

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
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        askGemini();
      }
    });
  });