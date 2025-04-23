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

function buildPrompt(userInput) {
  const context = qaData.map((item, i) => 
    `Q${i + 1}: ${item.question}\nA${i + 1}: ${item.answer}`
  ).join('\n\n');

  return `
あなたは日本語を教えるAIです。以下はよくある質問と回答です：

${context}

次の質問にこれらの情報を活用して丁寧に答えてください：

ユーザーの質問：${userInput}
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