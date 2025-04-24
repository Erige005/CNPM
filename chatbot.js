const GEMINI_API_KEY = "AIzaSyC_5YoIudQ8EQ9KGXh7mVzA5DgT30rYe4I";  // Replace with your real key
//test để luyện ai
const qaData = [
  {
    question: "かわいい",
    answer: "Từ này thường được dùng để miêu tả những thứ có vẻ ngoài dễ chịu, đáng yêu, hay thu hút sự chú ý theo cách tích cực.彼女はとても可愛いです。 - Cô ấy rất dễ thương. その犬は可愛いですね。 - Con chó đó thật dễ thương nhỉ. このドレスは可愛いです。 - Chiếc váy này thật dễ thương."
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