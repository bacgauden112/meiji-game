import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meiji - Thử Tài Pha Sữa",
  description: "Game sự kiện Meiji - Trả lời câu hỏi về công thức pha sữa Meiji cho bé",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
