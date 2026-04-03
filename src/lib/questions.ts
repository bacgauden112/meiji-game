export interface Question {
  id: number;
  question: string;
  ingredient: string;
  ingredientIcon: string;
  options: { label: string; value: string }[];
  correctAnswer: string;
}

export const questions: Question[] = [
  {
    id: 1,
    question: "Nhiệt độ nước phù hợp để pha sữa Meiji cho bé là bao nhiêu?",
    ingredient: "Nước ấm",
    ingredientIcon: "💧",
    options: [
      { label: "A", value: "40°C - 50°C" },
      { label: "B", value: "70°C" },
      { label: "C", value: "100°C" },
    ],
    correctAnswer: "A",
  },
  {
    id: 2,
    question: "Khi pha sữa Meiji, nên cho gì vào bình trước?",
    ingredient: "Sữa bột Meiji",
    ingredientIcon: "🥛",
    options: [
      { label: "A", value: "Sữa bột trước, nước sau" },
      { label: "B", value: "Nước trước, sữa bột sau" },
      { label: "C", value: "Cho cùng lúc" },
    ],
    correctAnswer: "B",
  },
  {
    id: 3,
    question: "Dùng dụng cụ gì để đong sữa bột Meiji chính xác?",
    ingredient: "Muỗng đong",
    ingredientIcon: "🥄",
    options: [
      { label: "A", value: "Muỗng ăn thông thường" },
      { label: "B", value: "Muỗng đong kèm theo hộp sữa" },
      { label: "C", value: "Ước lượng bằng mắt" },
    ],
    correctAnswer: "B",
  },
  {
    id: 4,
    question: "Sau khi cho sữa bột vào, cần làm gì tiếp theo?",
    ingredient: "Lắc đều",
    ingredientIcon: "🔄",
    options: [
      { label: "A", value: "Khuấy mạnh bằng thìa" },
      { label: "B", value: "Lắc nhẹ nhàng cho đến khi tan đều" },
      { label: "C", value: "Đun sôi lại" },
    ],
    correctAnswer: "B",
  },
  {
    id: 5,
    question: "Trước khi cho bé uống, cần kiểm tra gì?",
    ingredient: "Kiểm tra nhiệt độ",
    ingredientIcon: "🌡️",
    options: [
      { label: "A", value: "Nhỏ vài giọt lên cổ tay kiểm tra nhiệt độ" },
      { label: "B", value: "Cho bé uống ngay" },
      { label: "C", value: "Để nguội hoàn toàn rồi mới cho uống" },
    ],
    correctAnswer: "A",
  },
];

export const fullRecipe = `
## 🍼 Công Thức Pha Sữa Meiji Chuẩn

### Bước 1: Chuẩn bị nước ấm
Đun sôi nước rồi để nguội đến **40°C - 50°C**. Không dùng nước sôi 100°C vì sẽ phá hủy dưỡng chất.

### Bước 2: Đong nước vào bình
Cho nước ấm vào bình sữa **trước** theo đúng lượng cần pha.

### Bước 3: Đong sữa bột
Dùng **muỗng đong kèm theo hộp** sữa Meiji, gạt ngang miệng muỗng để đảm bảo chính xác.

### Bước 4: Lắc đều
**Lắc nhẹ nhàng** bình sữa theo chuyển động tròn cho sữa tan đều, tránh tạo bọt khí.

### Bước 5: Kiểm tra nhiệt độ
**Nhỏ vài giọt sữa lên cổ tay** để kiểm tra nhiệt độ phù hợp trước khi cho bé uống.

> 💡 **Mẹo**: Sữa pha xong nên cho bé uống trong vòng 2 giờ. Không nên hâm nóng lại sữa đã pha.
`;
