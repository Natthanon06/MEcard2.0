// src/app/layout.tsx
"use client";

import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
// 1. ✅ Import Component แจ้งเตือนส่วนกลางเข้ามา
import GlobalAlert from "@/components/GlobalAlert"; 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ❌ ลบ useEffect เดิมออกให้หมดเลยครับ! 
  // เพราะ Logic การเช็คเวลาไปอยู่ใน <GlobalAlert /> แล้ว

  return (
    <html lang="en">
      <body>
        <LanguageProvider>
           {/* 2. ✅ วาง Component ไว้ตรงนี้ (มันจะลอยอยู่เหนือทุกหน้า) */}
           <GlobalAlert /> 
           
           {children}
        </LanguageProvider>
      </body>
    </html>
  );
}