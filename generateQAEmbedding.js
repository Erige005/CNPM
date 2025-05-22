const fs = require("fs");

// Hàm tạo embedding vector giả (768 chiều như của Cohere)
function randomVector(dim = 768) {
  return Array.from({ length: dim }, () => parseFloat((Math.random() * 2 - 1).toFixed(6)));
}


const qaData = [
    { question: "Lý do nên học tiếng Nhật là gì?", answer: "Có nhiều lý do, ví dụ như yêu thích văn hoá Nhật Bản, muốn xem anime không cần phụ đề, hoặc chuẩn bị đi du học hay làm việc tại Nhật Bản." },
    { question: "Tiếng Nhật có bao nhiêu bảng chữ cái?", answer: "Có 3 bảng chữ: ひらがな (hiragana), カタカナ (katakana), và 漢字 (kanji - Hán tự)." },
    { question: "Từ vựng JLPT N5 bao gồm những gì?", answer: "JLPT N5 có khoảng 800 từ cơ bản, ví dụ như 学校 (がっこう – trường học), 水 (みず – nước), và 食べる (たべる – ăn)." },
    { question: "Nói 'cảm ơn' trong tiếng Nhật như thế nào?", answer: "Bạn có thể nói 'ありがとう' trong tình huống thân mật, hoặc 'ありがとうございます' trong cách nói lịch sự." },
    { question: "Ngữ pháp N5 quan trọng nhất là gì?", answer: "Một số mẫu rất thường gặp là ～です (khẳng định), ～ません (phủ định), ～ましょう (rủ rê), và ～たい (muốn làm gì đó)." },
    { question: "Hỏi đường trong tiếng Nhật như thế nào?", answer: "Bạn có thể hỏi: 駅はどこですか？(えきはどこですか – Ga ở đâu vậy?)." },
    { question: "Từ 'đắt quá' nói thế nào?", answer: "Bạn có thể nói: 高すぎます (たかすぎます – đắt quá mức)." },
    { question: "Tôi muốn đặt món ăn bằng tiếng Nhật thì nói sao?", answer: "Bạn có thể nói: これをください (Cho tôi món này), hoặc おすすめは何ですか？ (Có món nào được gợi ý không?)." },
    { question: "Làm sao học từ vựng hiệu quả?", answer: "Bạn nên dùng flashcards (thẻ ghi nhớ), ví dụ như dùng Anki, và lặp lại từ mới mỗi ngày." },
    { question: "Luyện nghe tiếng Nhật thế nào?", answer: "Nghe anime, podcast, và xem phim có phụ đề tiếng Nhật giúp tai bạn quen dần. Shadowing cũng là kỹ thuật hiệu quả." },
  
    { question: "Làm sao phân biệt 見る, 見せる và 見える?", answer: "見る là nhìn, 見せる là cho người khác xem, còn 見える là nhìn thấy một cách tự nhiên." },
    { question: "Kanji học sao không quên?", answer: "Học theo bộ, theo từ gốc và đặt câu ví dụ giúp nhớ lâu. Ví dụ: 山 (やま – núi) => 火山 (かざん – núi lửa)." },
    { question: "Chữ này đọc sao: 学校?", answer: "Đọc là がっこう (gakkou), nghĩa là trường học." },
    { question: "Muốn xin phép đi đâu đó thì nói sao?", answer: "Bạn dùng mẫu ～てもいいですか. Ví dụ: トイレに行ってもいいですか？ (Tôi đi vệ sinh có được không?)." },
    { question: "Khác nhau giữa する và やる?", answer: "Cả hai đều là 'làm', nhưng やる thường thân mật, する thì chuẩn mực hơn." },
    { question: "Thì hiện tại trong tiếng Nhật là gì?", answer: "Thì hiện tại là động từ dạng ます. Ví dụ: 食べます (ăn), 飲みます (uống)." },
    { question: "Làm sao để nói 'Tôi không hiểu'?", answer: "Bạn có thể nói: わかりません (wakarimasen)." },
    { question: "Mẫu câu thể hiện mong muốn?", answer: "Bạn dùng ～たい. Ví dụ: 日本へ行きたいです (Tôi muốn đến Nhật Bản)." },
    { question: "Hỏi giờ trong tiếng Nhật thế nào?", answer: "Bạn có thể hỏi: 今何時ですか？ (いまなんじですか – Bây giờ là mấy giờ?)." },
    { question: "Nói 'Tôi là sinh viên' như thế nào?", answer: "私は学生です (わたしはがくせいです – Tôi là sinh viên)." },
  
    // Tiếp tục với mẫu tương tự
    { question: "Muốn nói lịch sự thì làm thế nào?", answer: "Sử dụng thể ます và kính ngữ như お〜します hoặc ご〜します sẽ giúp câu văn lịch sự hơn." },
    { question: "Tôi muốn đặt phòng khách sạn?", answer: "Bạn có thể nói: 部屋を予約したいです (へやをよやくしたいです – Tôi muốn đặt phòng)." },
    { question: "Làm sao để hỏi giá tiền?", answer: "Câu đơn giản là: これはいくらですか？ (Cái này bao nhiêu tiền?)." },
    { question: "Học giao tiếp tiếng Nhật bắt đầu từ đâu?", answer: "Học những mẫu câu đơn giản như 自己紹介 (じこしょうかい – giới thiệu bản thân) là bước đầu tốt." },
    { question: "Từ đồng âm trong tiếng Nhật xử lý ra sao?", answer: "Nhờ vào Kanji để phân biệt. Ví dụ: はし có thể là 橋 (cầu) hoặc 箸 (đũa)." },
    { question: "Hỏi ai đó làm nghề gì?", answer: "Bạn có thể nói: お仕事は何ですか？ (Công việc của bạn là gì?)." },
    { question: "Tôi bị lạc đường rồi thì nói sao?", answer: "Bạn có thể nói: 道に迷いました (みちにまよいました – Tôi bị lạc đường)." },
    { question: "Cách nói 'không sao đâu'?", answer: "Bạn có thể nói: 大丈夫です (だいじょうぶです)." },
    { question: "Tôi bị ốm thì nên nói sao?", answer: "Bạn nói: 病気です (びょうきです – Tôi bị bệnh) hoặc 頭が痛いです (đau đầu)." },
    { question: "Làm sao để học tốt ngữ pháp?", answer: "Học từng mẫu nhỏ, đặt câu, và sử dụng chúng khi nói chuyện. Dùng sách như 'みんなの日本語' rất hiệu quả." },
  
    // Thêm các mẫu JLPT
    { question: "JLPT N5 kiểm tra những gì?", answer: "Chủ yếu là từ vựng, kanji cơ bản, nghe và ngữ pháp đơn giản như ～です, ～ます, ～てください." },
    { question: "Thi JLPT có phần nói không?", answer: "Không, JLPT chỉ có từ vựng, đọc hiểu, ngữ pháp và nghe hiểu." },
    { question: "Làm sao đăng ký thi JLPT?", answer: "Bạn vào trang web của Japan Foundation hoặc đơn vị tổ chức tại Việt Nam như JVTA." },
    { question: "Một số ngữ pháp JLPT N3 cần nhớ?", answer: "Ví dụ: ～ように, ～ことにする, ～たばかり, ～てしまう, ～そうです." },
    { question: "Sự khác biệt giữa JLPT N3 và N4?", answer: "N3 khó hơn nhiều, đòi hỏi hiểu đoạn văn dài, ngữ pháp phức tạp hơn như bị động (受け身), sai khiến (使役)." }
  ];
  
  // Gắn embedding giả lập vào từng câu hỏi
qaData.forEach(item => {
    item.embedding = randomVector();
  });
  
  // Ghi ra file JSON
  fs.writeFileSync("qa-embedding.json", JSON.stringify(qaData, null, 2), "utf-8");
  
  console.log("✅ Đã tạo file 'qa-embedding.json' thành công!");