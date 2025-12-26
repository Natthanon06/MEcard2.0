// src/app/create/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // ใช้ State เพื่อรอให้ Client โหลดเสร็จก่อน ค่อยคำนวณ Progress (แก้ Hydration Error)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // คำนวณ Step และ Progress
  let step = 1;
  let progress = "20%";

  if (pathname.includes("/platforms")) { step = 2; progress = "40%"; }
  else if (pathname.includes("/links")) { step = 3; progress = "60%"; }
  else if (pathname.includes("/profile")) { step = 4; progress = "80%"; }
  else if (pathname.includes("/preview")) { step = 5; progress = "100%"; }

  // ถ้ายังไม่ Mount ให้แสดง Default ไปก่อน (กัน Error)
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[420px] bg-white rounded-[2rem] shadow-xl overflow-hidden flex flex-col h-[85vh] max-h-[900px] relative border border-white">
        
        {/* --- Progress Bar (สมูท ไม่กระพริบ) --- */}
        <div className="h-1.5 w-full bg-gray-100 relative">
            <div 
                className="absolute top-0 left-0 h-full bg-purple-600 rounded-r-full transition-all duration-700 ease-in-out"
                style={{ width: progress }}
            ></div>
        </div>

        {/* Header */}
        <div className="px-6 py-4 flex justify-between items-center shrink-0">
            <Link href="/" className="text-gray-400 text-sm hover:text-red-500 flex items-center gap-1 transition-colors">
                ✕ <span className="text-xs font-medium">ยกเลิก</span>
            </Link>
            <span className="text-[10px] font-bold text-purple-600 tracking-widest bg-purple-50 px-2 py-1 rounded-full">
                STEP {step} / 5
            </span>
        </div>

        {/* เนื้อหาแต่ละหน้า (จะถูกส่งมาใส่ตรงนี้) */}
        {children}

      </div>
    </div>
  );
}