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
  { question: "日本の正月の習慣は何ですか？", answer: "Mọi người đi chùa (初詣), ăn món truyền thống như おせち料理 và trao nhau lì xì (お年玉)." },
  { question: "日本語で「chúc mừng sinh nhật」nói như thế nào？", answer: "お誕生日おめでとうございます (Otanjoubi omedetou gozaimasu)." },
  { question: "Làm thế nào để nói 'xin lỗi' lịch sự trong tiếng Nhật?", answer: "Bạn có thể nói 申し訳ありません hoặc 恐れ入ります để lịch sự hơn." },
  { question: "日本語の文法で「てもいいですか」は何ですか？", answer: "Đó là mẫu câu xin phép, ví dụ: トイレに行ってもいいですか？ (Tôi có thể đi vệ sinh không?)." },
  { question: "Cách phân biệt '見る', '見える' và '見せる'?", answer: "'見る' là nhìn, '見える' là nhìn thấy (một cách tự nhiên), '見せる' là cho xem." },
  { question: "日本語で「いただきます」と「ごちそうさま」の意味は？", answer: "'いただきます' nói trước khi ăn, 'ごちそうさまでした' nói sau khi ăn để cảm ơn." },
  { question: "Từ vựng tiếng Nhật về phương tiện giao thông?", answer: "車 (xe ô tô), 自転車 (xe đạp), 電車 (tàu điện), 飛行機 (máy bay)." },
  { question: "Ngữ pháp N5 phổ biến là gì?", answer: "です (dùng để khẳng định), ません (phủ định), ましょう (rủ rê)." },
  { question: "Cách hỏi giá bằng tiếng Nhật?", answer: "いくらですか？ (Giá bao nhiêu vậy?)." },
  { question: "日本語で「hẹn gặp lại」nói như thế nào？", answer: "また会いましょう hoặc またね dùng cho bạn bè." },
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
  { question: "Làm thế nào để cải thiện kỹ năng nghe tiếng Nhật?", answer: "Nghe podcast, xem anime, phim Nhật có phụ đề và luyện shadowing (lặp lại ngay khi nghe)." },
  { question: "Những app nào học tiếng Nhật tốt?", answer: "Anki, Duolingo, LingoDeer, và Memrise là các ứng dụng phổ biến." },
  { question: "Học bảng chữ cái tiếng Nhật như thế nào hiệu quả?", answer: "Học Hiragana và Katakana bằng flashcards, luyện viết và nhớ theo nhóm từ có âm giống nhau." },
  { question: "Mất bao lâu để đạt N5 nếu học chăm chỉ?", answer: "Khoảng 150–300 giờ học là có thể đạt N5." },
  { question: "Khi gặp người Nhật lần đầu nên chào hỏi như thế nào?", answer: "Nên cúi chào và nói 'はじめまして、よろしくお願いします'." },
  { question: "Học từ vựng tiếng Nhật có cần học Kanji không?", answer: "Nên học để hiểu sâu ý nghĩa từ, vì nhiều từ có cách đọc giống nhưng Kanji khác nhau." },
  { question: "Cách nói lời chúc mừng đám cưới bằng tiếng Nhật?", answer: "'ご結婚おめでとうございます' là câu chúc phổ biến." },
  { question: "Đi du lịch Nhật Bản cần biết những câu gì?", answer: "いくらですか？ (Bao nhiêu tiền?), トイレはどこですか？ (Nhà vệ sinh ở đâu?)." },
  { question: "Làm sao phân biệt từ đồng âm trong tiếng Nhật?", answer: "Dùng Kanji để phân biệt hoặc dựa vào ngữ cảnh câu." },
  { question: "Tôi muốn tìm hiểu về văn hóa Nhật, nên bắt đầu từ đâu?", answer: "Bạn có thể tìm hiểu qua trà đạo, Kimono, lễ hội hoa anh đào, và phong tục Tết Nhật (正月)." },

  // JLPT và học thuật
  { question: "Mẫu ngữ pháp N3 quan trọng là gì?", answer: "Ví dụ: 〜わけではない (không hẳn là), 〜に違いない (chắc chắn là)." },
  { question: "Có nên học ngữ pháp trước hay từ vựng trước?", answer: "Bạn nên học song song, ưu tiên ngữ pháp căn bản trước để hiểu câu." },
  { question: "日本語の「やる気がない」はどういう意味ですか？", answer: "Có nghĩa là không có động lực hoặc không muốn làm việc gì đó." },
  { question: "Tiếng Nhật có bao nhiêu bộ chữ?", answer: "Có 3 bộ: Hiragana, Katakana và Kanji." },
  { question: "Làm sao để giao tiếp trôi chảy với người Nhật?", answer: "Nên học các câu chào hỏi cơ bản, luyện nghe nói hàng ngày, và không sợ mắc lỗi." }
];

let chatHistory = [];



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
  const context = topQA.map((item, i) => `Q${i + 1}: ${item.question}\nA${i + 1}: ${item.answer}`).join("\n\n");
  
  const history = chatHistory.slice(-5).map((msg, i) => `Lịch sử ${i + 1}: ${msg}`).join("\n");

  return `
Bạn là AI hỗ trợ học tiếng Nhật. Vui lòng **trả lời hoàn toàn bằng tiếng Việt**, chính xác, dễ hiểu và cung cấp ví dụ minh họa nếu có thể.

Nếu không có thông tin chính xác, hãy trả lời: "**Xin lỗi, tôi chưa có đủ thông tin chính xác để trả lời câu hỏi này.**"

${history ? "Lịch sử hội thoại:\n" + history + "\n\n" : ""}

Dữ kiện tham khảo:
${context}

**Câu hỏi của người dùng:** ${userInput}
`;
}


  async function askGemini() {
    const input = document.getElementById("question");
    const userInput = input.value.trim();
  
    if (!userInput) return;
  
    appendMessage(userInput, "user");
    chatHistory.push(`Người dùng: ${userInput}`);
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
      chatHistory.push(`Bot: ${reply}`);
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
    const chatBox = document.getElementById("chat-box");

    // ⚡ Khôi phục lịch sử trò chuyện nếu có
    const savedHistory = localStorage.getItem("chatHistory");
    if (savedHistory) {
      chatBox.innerHTML = savedHistory;
      chatBox.scrollTop = chatBox.scrollHeight;
    } else {
      appendMessage(
        `👋 Xin chào! Chào mừng bạn đến với chatbot luyện tiếng Nhật 🇯🇵<br><br>
    Tôi có thể giúp bạn:<br>
    - Giải thích nghĩa của các cụm từ, câu tiếng Nhật bằng tiếng Việt 🧠<br>
    - Trả lời các câu hỏi về ngữ pháp, từ vựng, JLPT<br>
    - Gợi ý cách học tiếng Nhật hiệu quả<br><br>
    Hãy gõ một câu hoặc cụm từ tiếng Nhật mà bạn muốn tôi giải thích nhé!`,
        "bot"
      );
    }

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        askGemini();
 }
    });
  });