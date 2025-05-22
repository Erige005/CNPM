const GEMINI_API_KEY = "AIzaSyC_5YoIudQ8EQ9KGXh7mVzA5DgT30rYe4I";  // Replace with your real key

const COHERE_API_KEY = "T53nwKNikuug3T6v8YnLw37b4v1mjofRUU812pLo";

//test để luyện ai
const qaData = [
  { question: "日本の正月の習慣は何ですか？", answer: "Mọi người đi chùa (初詣), ăn món truyền thống như おせち料理 và trao nhau lì xì (お年玉).",
    embedding: null },
  { question: "日本語で「chúc mừng sinh nhật」nói như thế nào？", answer: "お誕生日おめでとうございます (Otanjoubi omedetou gozaimasu)." ,
    embedding: null},
  { question: "Làm thế nào để nói 'xin lỗi' lịch sự trong tiếng Nhật?", answer: "Bạn có thể nói 申し訳ありません hoặc 恐れ入ります để lịch sự hơn." ,
    embedding: null},
  { question: "日本語の文法で「てもいいですか」は何ですか？", answer: "Đó là mẫu câu xin phép, ví dụ: トイレに行ってもいいですか？ (Tôi có thể đi vệ sinh không?)." ,
    embedding: null},
  { question: "Cách phân biệt '見る', '見える' và '見せる'?", answer: "'見る' là nhìn, '見える' là nhìn thấy (một cách tự nhiên), '見せる' là cho xem." ,
    embedding: null},
  { question: "日本語で「いただきます」と「ごちそうさま」の意味は？", answer: "'いただきます' nói trước khi ăn, 'ごちそうさまでした' nói sau khi ăn để cảm ơn." ,
    embedding: null},
  { question: "Từ vựng tiếng Nhật về phương tiện giao thông?", answer: "車 (xe ô tô), 自転車 (xe đạp), 電車 (tàu điện), 飛行機 (máy bay)." ,
    embedding: null},
  { question: "Ngữ pháp N5 phổ biến là gì?", answer: "です (dùng để khẳng định), ません (phủ định), ましょう (rủ rê)." },
  { question: "Cách hỏi giá bằng tiếng Nhật?", answer: "いくらですか？ (Giá bao nhiêu vậy?)." ,
    embedding: null},
  { question: "日本語で「hẹn gặp lại」nói như thế nào？", answer: "また会いましょう hoặc またね dùng cho bạn bè." ,
    embedding: null},
  {
    question: "日本語の助詞「は」と「が」の違いは？",
    answer: "「は」は主題を示し、「が」は主語や新しい情報を強調します。",
    embedding: null
  },
  {
    question: "敬語とは何ですか？",
    answer: "敬語は丁寧に話すための表現で、尊敬語、謙譲語、丁寧語があります。",
    embedding: null
  },
  {
    question: "日本語の単語をどうやって覚えますか？",
    answer: "フラッシュカードや文脈の中で単語を使って覚えると良いです。",
    embedding: null
  },
  {
    question: "JLPTのN3に合格するにはどのくらい勉強が必要ですか？",
    answer: "通常は300〜600時間の勉強が必要だと言われています。",
    embedding: null
  },
  {
    question: "日本語のリスニングを上達させるには？",
    answer: "毎日アニメやポッドキャストを聴くことで耳を慣らすのが効果的です。",
    embedding: null
  },
  {
    question: "日本語と中国語は似ていますか？",
    answer: "漢字は似ていますが、発音や文法は大きく異なります。",
    embedding: null
  },
  {
    question: "日本語の「です」と「ます」の違いは？",
    answer: "「です」は名詞の丁寧形、「ます」は動詞の丁寧形です。",
    embedding: null
  },
  { question: "Làm thế nào để cải thiện kỹ năng nghe tiếng Nhật?", answer: "Nghe podcast, xem anime, phim Nhật có phụ đề và luyện shadowing (lặp lại ngay khi nghe)." ,
    embedding: null},
  { question: "Những app nào học tiếng Nhật tốt?", answer: "Anki, Duolingo, LingoDeer, và Memrise là các ứng dụng phổ biến." ,
    embedding: null},
  { question: "Học bảng chữ cái tiếng Nhật như thế nào hiệu quả?", answer: "Học Hiragana và Katakana bằng flashcards, luyện viết và nhớ theo nhóm từ có âm giống nhau." ,
    embedding: null},
  { question: "Mất bao lâu để đạt N5 nếu học chăm chỉ?", answer: "Khoảng 150–300 giờ học là có thể đạt N5." ,
    embedding: null},
  { question: "Khi gặp người Nhật lần đầu nên chào hỏi như thế nào?", answer: "Nên cúi chào và nói 'はじめまして、よろしくお願いします'." ,
    embedding: null},
  { question: "Học từ vựng tiếng Nhật có cần học Kanji không?", answer: "Nên học để hiểu sâu ý nghĩa từ, vì nhiều từ có cách đọc giống nhưng Kanji khác nhau." ,
    embedding: null},
  { question: "Cách nói lời chúc mừng đám cưới bằng tiếng Nhật?", answer: "'ご結婚おめでとうございます' là câu chúc phổ biến." ,
    embedding: null},
  { question: "Đi du lịch Nhật Bản cần biết những câu gì?", answer: "いくらですか？ (Bao nhiêu tiền?), トイレはどこですか？ (Nhà vệ sinh ở đâu?)." ,
    embedding: null},
  { question: "Làm sao phân biệt từ đồng âm trong tiếng Nhật?", answer: "Dùng Kanji để phân biệt hoặc dựa vào ngữ cảnh câu." ,
    embedding: null},
  { question: "Tôi muốn tìm hiểu về văn hóa Nhật, nên bắt đầu từ đâu?", answer: "Bạn có thể tìm hiểu qua trà đạo, Kimono, lễ hội hoa anh đào, và phong tục Tết Nhật (正月)." ,
    embedding: null},

  // JLPT và học thuật
  { question: "Mẫu ngữ pháp N3 quan trọng là gì?", answer: "Ví dụ: 〜わけではない (không hẳn là), 〜に違いない (chắc chắn là)." ,
    embedding: null},
  { question: "Có nên học ngữ pháp trước hay từ vựng trước?", answer: "Bạn nên học song song, ưu tiên ngữ pháp căn bản trước để hiểu câu." ,
    embedding: null},
  { question: "日本語の「やる気がない」はどういう意味ですか？", answer: "Có nghĩa là không có động lực hoặc không muốn làm việc gì đó." ,
    embedding: null},
  { question: "Tiếng Nhật có bao nhiêu bộ chữ?", answer: "Có 3 bộ: Hiragana, Katakana và Kanji." ,
    embedding: null},
  { question: "Làm sao để giao tiếp trôi chảy với người Nhật?", answer: "Nên học các câu chào hỏi cơ bản, luyện nghe nói hàng ngày, và không sợ mắc lỗi." ,
    embedding: null},
  { question: "Lý do nên học tiếng Nhật là gì?", answer: "Có nhiều lý do, ví dụ như yêu thích văn hoá Nhật Bản, muốn xem anime không cần phụ đề, hoặc chuẩn bị đi du học hay làm việc tại Nhật Bản." ,
    embedding: null},
  { question: "Tiếng Nhật có bao nhiêu bảng chữ cái?", answer: "Có 3 bảng chữ: ひらがな (hiragana), カタカナ (katakana), và 漢字 (kanji - Hán tự)." ,
    embedding: null},
  { question: "Từ vựng JLPT N5 bao gồm những gì?", answer: "JLPT N5 có khoảng 800 từ cơ bản, ví dụ như 学校 (がっこう – trường học), 水 (みず – nước), và 食べる (たべる – ăn)." ,
    embedding: null},
  { question: "Nói 'cảm ơn' trong tiếng Nhật như thế nào?", answer: "Bạn có thể nói 'ありがとう' trong tình huống thân mật, hoặc 'ありがとうございます' trong cách nói lịch sự." ,
    embedding: null},
  { question: "Ngữ pháp N5 quan trọng nhất là gì?", answer: "Một số mẫu rất thường gặp là ～です (khẳng định), ～ません (phủ định), ～ましょう (rủ rê), và ～たい (muốn làm gì đó)." ,
    embedding: null},
  { question: "Hỏi đường trong tiếng Nhật như thế nào?", answer: "Bạn có thể hỏi: 駅はどこですか？(えきはどこですか – Ga ở đâu vậy?)." ,
    embedding: null},
  { question: "Từ 'đắt quá' nói thế nào?", answer: "Bạn có thể nói: 高すぎます (たかすぎます – đắt quá mức)." ,
    embedding: null},
  { question: "Tôi muốn đặt món ăn bằng tiếng Nhật thì nói sao?", answer: "Bạn có thể nói: これをください (Cho tôi món này), hoặc おすすめは何ですか？ (Có món nào được gợi ý không?)." ,
    embedding: null},
  { question: "Làm sao học từ vựng hiệu quả?", answer: "Bạn nên dùng flashcards (thẻ ghi nhớ), ví dụ như dùng Anki, và lặp lại từ mới mỗi ngày." ,
    embedding: null},
  { question: "Luyện nghe tiếng Nhật thế nào?", answer: "Nghe anime, podcast, và xem phim có phụ đề tiếng Nhật giúp tai bạn quen dần. Shadowing cũng là kỹ thuật hiệu quả." ,
    embedding: null},

  { question: "Làm sao phân biệt 見る, 見せる và 見える?", answer: "見る là nhìn, 見せる là cho người khác xem, còn 見える là nhìn thấy một cách tự nhiên." ,
    embedding: null},
  { question: "Kanji học sao không quên?", answer: "Học theo bộ, theo từ gốc và đặt câu ví dụ giúp nhớ lâu. Ví dụ: 山 (やま – núi) => 火山 (かざん – núi lửa)." ,
    embedding: null},
  { question: "Chữ này đọc sao: 学校?", answer: "Đọc là がっこう (gakkou), nghĩa là trường học." ,
    embedding: null},
  { question: "Muốn xin phép đi đâu đó thì nói sao?", answer: "Bạn dùng mẫu ～てもいいですか. Ví dụ: トイレに行ってもいいですか？ (Tôi đi vệ sinh có được không?)." ,
    embedding: null},
  { question: "Khác nhau giữa する và やる?", answer: "Cả hai đều là 'làm', nhưng やる thường thân mật, する thì chuẩn mực hơn." ,
    embedding: null},
  { question: "Thì hiện tại trong tiếng Nhật là gì?", answer: "Thì hiện tại là động từ dạng ます. Ví dụ: 食べます (ăn), 飲みます (uống)." ,
    embedding: null},
  { question: "Làm sao để nói 'Tôi không hiểu'?", answer: "Bạn có thể nói: わかりません (wakarimasen)." ,
    embedding: null},
  { question: "Mẫu câu thể hiện mong muốn?", answer: "Bạn dùng ～たい. Ví dụ: 日本へ行きたいです (Tôi muốn đến Nhật Bản)." ,
    embedding: null},
  { question: "Hỏi giờ trong tiếng Nhật thế nào?", answer: "Bạn có thể hỏi: 今何時ですか？ (いまなんじですか – Bây giờ là mấy giờ?)." ,
    embedding: null},
  { question: "Nói 'Tôi là sinh viên' như thế nào?", answer: "私は学生です (わたしはがくせいです – Tôi là sinh viên)." ,
    embedding: null},

  // Tiếp tục với mẫu tương tự
  { question: "Muốn nói lịch sự thì làm thế nào?", answer: "Sử dụng thể ます và kính ngữ như お〜します hoặc ご〜します sẽ giúp câu văn lịch sự hơn." ,
    embedding: null},
  { question: "Tôi muốn đặt phòng khách sạn?", answer: "Bạn có thể nói: 部屋を予約したいです (へやをよやくしたいです – Tôi muốn đặt phòng)." ,
    embedding: null},
  { question: "Làm sao để hỏi giá tiền?", answer: "Câu đơn giản là: これはいくらですか？ (Cái này bao nhiêu tiền?)." ,
    embedding: null},
  { question: "Học giao tiếp tiếng Nhật bắt đầu từ đâu?", answer: "Học những mẫu câu đơn giản như 自己紹介 (じこしょうかい – giới thiệu bản thân) là bước đầu tốt." ,
    embedding: null},
  { question: "Từ đồng âm trong tiếng Nhật xử lý ra sao?", answer: "Nhờ vào Kanji để phân biệt. Ví dụ: はし có thể là 橋 (cầu) hoặc 箸 (đũa)." ,
    embedding: null},
  { question: "Hỏi ai đó làm nghề gì?", answer: "Bạn có thể nói: お仕事は何ですか？ (Công việc của bạn là gì?)." ,
    embedding: null},
  { question: "Tôi bị lạc đường rồi thì nói sao?", answer: "Bạn có thể nói: 道に迷いました (みちにまよいました – Tôi bị lạc đường)." ,
    embedding: null},
  { question: "Cách nói 'không sao đâu'?", answer: "Bạn có thể nói: 大丈夫です (だいじょうぶです)." ,
    embedding: null},
  { question: "Tôi bị ốm thì nên nói sao?", answer: "Bạn nói: 病気です (びょうきです – Tôi bị bệnh) hoặc 頭が痛いです (đau đầu)." ,
    embedding: null},
  { question: "Làm sao để học tốt ngữ pháp?", answer: "Học từng mẫu nhỏ, đặt câu, và sử dụng chúng khi nói chuyện. Dùng sách như 'みんなの日本語' rất hiệu quả." ,
    embedding: null},

  // Thêm các mẫu JLPT
  { question: "JLPT N5 kiểm tra những gì?", answer: "Chủ yếu là từ vựng, kanji cơ bản, nghe và ngữ pháp đơn giản như ～です, ～ます, ～てください." ,
    embedding: null},
  { question: "Thi JLPT có phần nói không?", answer: "Không, JLPT chỉ có từ vựng, đọc hiểu, ngữ pháp và nghe hiểu." ,
    embedding: null},
  { question: "Làm sao đăng ký thi JLPT?", answer: "Bạn vào trang web của Japan Foundation hoặc đơn vị tổ chức tại Việt Nam như JVTA." ,
    embedding: null},
  { question: "Một số ngữ pháp JLPT N3 cần nhớ?", answer: "Ví dụ: ～ように, ～ことにする, ～たばかり, ～てしまう, ～そうです." ,
    embedding: null},
  { question: "Sự khác biệt giữa JLPT N3 và N4?", answer: "N3 khó hơn nhiều, đòi hỏi hiểu đoạn văn dài, ngữ pháp phức tạp hơn như bị động (受け身), sai khiến (使役)." ,
    embedding: null}
];

let chatHistory = [];

// 🔁 Hàm gọi Cohere để lấy vector embedding
async function getEmbedding(text) {
  const res = await fetch("https://api.cohere.ai/v1/embed", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${COHERE_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "embed-english-v3.0",
      texts: [text],
      input_type: "search_query"
    })
  });
  const data = await res.json();
  return data.embeddings?.[0];
}

// 🔁 Gọi 1 lần để tạo embedding cho QA
async function initEmbeddings() {
  for (const item of qaData) {
    if (!item.embedding) {
      item.embedding = await getEmbedding(item.question);
    }
  }
}

// 🎯 Tính cosine similarity
function cosineSim(vecA, vecB) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dot / (magA * magB);
}

// 🎯 Truy xuất câu hỏi gần nhất
async function getTopRelevantQA_Cohere(userInput, topK = 2) {
  const userVec = await getEmbedding(userInput);
  return qaData
    .map(item => ({
      ...item,
      score: cosineSim(userVec, item.embedding)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

// 🔧 Tạo prompt dựa trên câu hỏi gần nhất
async function buildPrompt(userInput) {
  const topQA = await getTopRelevantQA_Cohere(userInput);
  const context = topQA.map((item, i) => `Q${i + 1}: ${item.question}\nA${i + 1}: ${item.answer}`).join("\n\n");
  const history = chatHistory.slice(-5).map((msg, i) => `Lịch sử ${i + 1}: ${msg}`).join("\n");

  return `
Bạn là một **giáo viên người Việt** giàu kinh nghiệm, chuyên dạy tiếng Nhật cho người học từ **trình độ sơ cấp đến trung cấp** (JLPT N5–N3).

Bạn cần trả lời câu hỏi của người học **hoàn toàn bằng tiếng Việt**, sử dụng tiếng Nhật chỉ khi trích dẫn từ vựng, cấu trúc ngữ pháp hoặc ví dụ minh họa.

 Lưu ý:
- Trình bày câu trả lời **rõ ràng**, **dễ hiểu**, thân thiện như đang giảng bài trực tiếp.
- Câu trả lời nên có cấu trúc:
  1. Định nghĩa hoặc giải thích ngắn gọn
  2. Diễn giải hoặc ví dụ minh họa bằng tiếng Nhật kèm **phiên âm và dịch nghĩa**
  3. Mẹo học hoặc lưu ý thêm nếu có

Nếu bạn không có thông tin phù hợp, hãy nói:
"**Xin lỗi, tôi chưa có đủ thông tin chính xác để trả lời câu hỏi này.**"
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
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      }
    );

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
    appendMessage(reply, "bot");
    chatHistory.push(`Bot: ${reply}`);
  } catch (err) {
    appendMessage("❌ Có lỗi khi gửi yêu cầu đến Gemini.", "bot");
    console.error(err);
  } finally {
    input.disabled = false;
    input.focus();
  }
}

// UI chat
function appendMessage(text, sender) {
  const chatBox = document.getElementById("chat-box");
  const message = document.createElement("div");
  message.className = `message ${sender}-message`;
  message.innerHTML = marked.parse(text);
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Khởi tạo sự kiện khi load trang
document.addEventListener("DOMContentLoaded", async () => {
  const input = document.getElementById("question");
  const chatBox = document.getElementById("chat-box");

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

  await initEmbeddings(); // ✅ load embedding trước

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      askGemini();
    }
  });
});