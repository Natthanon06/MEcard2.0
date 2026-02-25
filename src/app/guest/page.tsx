"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function GuestPage() {
  const [scannedData, setScannedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 🔍 ดึงข้อมูลล่าสุดจาก API ที่เราทำไว้
    fetch("/api/guest/get-scans")
      .then((res) => res.json())
      .then((result) => {
        if (result.success && result.data) {
          // ดึง cardData ออกมาแสดงผล
          setScannedData(result.data.cardData);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans">
      
      {/* --- ส่วนบน: Marketing (ดีไซน์เน้นความหรูหราแบบ MEcard) --- */}
      <div className="bg-gradient-to-br from-blue-900 via-gray-900 to-black text-white p-10 pt-16 pb-20 rounded-b-[3rem] shadow-2xl border-b border-white/10 relative overflow-hidden">
        {/* แสง Flare ตกแต่งเบาๆ */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full"></div>
        
        <div className="max-w-md mx-auto text-center relative z-10">
          <div className="w-20 h-20 bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] mx-auto flex items-center justify-center mb-8 shadow-2xl">
            <span className="text-4xl">🚀</span>
          </div>
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight">
            ยกระดับตัวตน<br/>ด้วย <span className="text-blue-400">MEcard</span>
          </h1>
          <p className="text-gray-400 mb-10 text-sm leading-relaxed px-4">
            บอกลานามบัตรกระดาษ สร้างนามบัตรดิจิทัลของคุณเองฟรี แชร์ง่าย สแกนไว และดูดีในทุกสไตล์ที่เป็นคุณ
          </p>
          <Link 
            href="/login?redirect=/create" 
            className="block w-full bg-white text-black py-4 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            สร้างนามบัตรฟรี ทันที ✨
          </Link>
        </div>
      </div>

      {/* --- ส่วนล่าง: ข้อมูลเพื่อนที่สแกน (Contextual Data) --- */}
      <div className="flex-1 p-6 -mt-12 relative z-20">
        <div className="max-w-md mx-auto">
          {isLoading ? (
            <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 p-8 rounded-[2.5rem] text-center text-gray-500 shadow-2xl">
              กำลังค้นหาประวัติการสแกน...
            </div>
          ) : scannedData ? (
            <div className="bg-gray-900 border border-gray-800 p-8 rounded-[2.5rem] shadow-2xl">
              <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  ล่าสุดที่คุณสแกน
                </h2>
                <span className="text-[10px] text-gray-600 font-medium">7 Days Guest Mode</span>
              </div>

              <div className="flex items-center gap-5 mb-8">
                {scannedData.profileImage ? (
                  <img src={scannedData.profileImage} className="w-16 h-16 rounded-full object-cover border-2 border-gray-800" alt="Profile" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-500/10 border-2 border-blue-500/20 flex items-center justify-center text-2xl font-bold text-blue-400">
                    {scannedData.fullName?.charAt(0) || scannedData.name?.charAt(0) || "U"}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-xl text-white">{scannedData.fullName || scannedData.name}</h3>
                  <p className="text-blue-400 text-xs font-medium uppercase tracking-wider mt-1">
                    {scannedData.position || scannedData.company}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* ปุ่มโทรออก */}
                <a 
                  href={`tel:${scannedData.phoneNumber || scannedData.phone}`} 
                  className="flex items-center justify-center gap-3 w-full bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-bold text-sm border border-white/10 transition-all active:scale-95"
                >
                  <span className="text-lg">📞</span> โทรติดต่อตอนนี้
                </a>

                {/* --- ⏱️ ป้ายเตือน FOMO 7 วัน --- */}
                <div className="p-5 bg-amber-500/5 rounded-[1.5rem] border border-amber-500/20 flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-xl shrink-0">
                    ⏱️
                  </div>
                  <div>
                    <p className="text-xs text-amber-500 font-bold mb-1">ข้อมูลจะหายไปใน 7 วัน</p>
                    <p className="text-[10px] text-amber-200/60 leading-relaxed">
                      ระบบบันทึกไว้ให้ชั่วคราว <Link href="/login" className="text-white underline font-bold">เข้าสู่ระบบ</Link> เพื่อเก็บนามบัตรของ {scannedData.fullName || scannedData.name} เข้ากระเป๋าถาวร
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 p-10 rounded-[2.5rem] text-center shadow-2xl">
              <div className="text-4xl mb-4 opacity-20">📭</div>
              <p className="text-gray-500 text-sm">ยังไม่มีประวัติการสแกนในเครื่องนี้</p>
              <Link href="/login" className="text-blue-400 text-xs mt-4 inline-block font-bold">ลองเริ่มสร้างใบแรกของคุณเลย</Link>
            </div>
          )}
          
          <div className="mt-12 text-center">
            <p className="text-gray-700 text-[10px] uppercase tracking-[0.2em] font-bold">Powered by MEcard 2.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}