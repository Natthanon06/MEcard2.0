"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function GuestPage() {
  const [scannedData, setScannedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/guest/get-scans")
      .then((res) => res.json())
      .then((result) => {
        if (result.success && result.data) {
          // เก็บข้อมูลใบเดียวล่าสุดที่ได้จาก API
          setScannedData(result.data.cardData);
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans">
      
      {/* ส่วนบน: Marketing */}
      <div className="bg-gradient-to-br from-blue-900 via-gray-900 to-black text-white p-10 pt-16 pb-20 rounded-b-[3rem] border-b border-white/10 shadow-2xl">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight">
            <span className="text-blue-400">MEcard</span> Guest
          </h1>
          <p className="text-gray-400 mb-10 text-sm leading-relaxed">
            นามบัตรใบที่คุณเพิ่งแสกนถูกเก็บไว้ให้ชั่วคราวแล้วที่นี่
          </p>
          <Link 
            href="/login?redirect=/create" 
            className="block w-full bg-white text-black py-4 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-all active:scale-95"
          >
            สร้างนามบัตรของคุณเอง ✨
          </Link>
        </div>
      </div>

      {/* ส่วนแสดงผล: บัตรใบเดียวที่เพิ่งแสกนมา */}
      <div className="flex-1 p-6 -mt-12 relative z-20">
        <div className="max-w-md mx-auto">
          {isLoading ? (
            <div className="bg-gray-900 border border-gray-800 p-10 rounded-[2.5rem] text-center text-gray-500 shadow-2xl">
              กำลังค้นหาประวัติแสกน...
            </div>
          ) : scannedData ? (
            <div className="bg-gray-900 border border-gray-800 p-8 rounded-[2.5rem] shadow-2xl">
              <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                <h2 className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em]">
                  Scanned Card
                </h2>
                <span className="text-[10px] text-gray-600 font-bold uppercase">7 Days Mode</span>
              </div>

              {/* ข้อมูลในบัตร */}
              <div className="flex items-center gap-5 mb-8">
                {scannedData.profileImage ? (
                  <img src={scannedData.profileImage} className="w-16 h-16 rounded-full object-cover border-2 border-gray-800" alt="Profile" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-500/10 border-2 border-blue-500/20 flex items-center justify-center text-2xl font-bold text-blue-400">
                    {(scannedData.fullName || "U").charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-xl text-white">{scannedData.fullName}</h3>
                  <p className="text-blue-400 text-xs font-medium uppercase tracking-wider mt-1">
                    {scannedData.position}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <a 
                  href={`tel:${scannedData.phoneNumber}`} 
                  className="flex items-center justify-center gap-3 w-full bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-bold text-sm border border-white/10 transition-all"
                >
                  📞 โทรติดต่อ {scannedData.fullName}
                </a>

                {/* ป้ายเตือน 7 วัน */}
                <div className="p-5 bg-amber-500/5 rounded-[1.5rem] border border-amber-500/20 flex items-start gap-4">
                  <span className="text-xl">⏱️</span>
                  <div>
                    <p className="text-xs text-amber-500 font-bold mb-1">จะถูกลบใน 7 วัน</p>
                    <p className="text-[10px] text-amber-200/60 leading-relaxed">
                      รีบ <Link href="/login" className="text-white underline font-bold">เข้าสู่ระบบ</Link> เพื่อบันทึกนามบัตรนี้ลงกระเป๋าถาวรของคุณ
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 p-10 rounded-[2.5rem] text-center">
              <p className="text-gray-500 text-sm">ไม่พบประวัติการแสกนล่าสุด</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}