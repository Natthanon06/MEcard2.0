"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function GuestPage() {
  const [scannedData, setScannedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/guest/get-scans")
      .then(res => res.json())
      .then(result => {
        if (result.success && result.data) {
          setScannedData(result.data.cardData);
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      
      {/* ครึ่งบน: Marketing */}
      <div className="bg-gradient-to-br from-blue-900 via-black to-gray-900 text-white p-8 pt-12 pb-14 rounded-b-3xl shadow-xl z-10">
        <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-white/10 rounded-2xl mx-auto flex items-center justify-center mb-6">
                <span className="text-3xl">🚀</span>
            </div>
            <h1 className="text-3xl font-bold mb-3">ยกระดับตัวตนของคุณ<br/>ด้วย MEcard</h1>
            <p className="text-gray-300 mb-8 text-sm leading-relaxed">
                บอกลานามบัตรกระดาษ สร้างนามบัตรดิจิทัลของคุณเองฟรี แชร์ง่าย สแกนไว อัปเดตข้อมูลได้ตลอดเวลา
            </p>
            <Link 
                href="/login?redirect=/create" 
                className="block w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition"
            >
                สร้างนามบัตรฟรี ทันที ✨
            </Link>
        </div>
      </div>

      {/* ครึ่งล่าง: ข้อมูลเพื่อนที่สแกนไปเมื่อกี้ */}
      <div className="flex-1 p-6 -mt-8 relative z-20">
        <div className="max-w-md mx-auto">
            {isLoading ? (
                <div className="bg-white p-6 rounded-2xl shadow-sm text-center text-gray-400">กำลังโหลดข้อมูล...</div>
            ) : scannedData ? (
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                    <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-4 border-b border-gray-50 pb-4">
                        <span>📋</span> นามบัตรที่คุณเพิ่งสแกน
                    </h2>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold text-gray-400">
                            {scannedData.name?.charAt(0) || "U"}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-900">{scannedData.name}</h3>
                            <p className="text-gray-500 text-sm">{scannedData.company}</p>
                        </div>
                    </div>
                    
                    <a href={`tel:${scannedData.phone}`} className="block w-full bg-green-50 text-green-600 text-center py-3.5 rounded-xl font-bold text-sm border border-green-100 mb-5">
                        📞 โทรออก ({scannedData.phone})
                    </a>

                    {/* แจ้งเตือน 7 วัน */}
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 flex items-start gap-3">
                        <span className="text-amber-500 text-lg mt-0.5">⏱️</span>
                        <div>
                            <p className="text-xs text-amber-800 font-semibold">ข้อมูลนี้จะถูกเก็บชั่วคราว 7 วัน</p>
                            <p className="text-[10px] text-amber-600 mt-1">
                                กรุณา <Link href="/login" className="underline font-bold">เข้าสู่ระบบ</Link> เพื่อบันทึกนามบัตรนี้ลงในกระเป๋าของคุณถาวร
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-2xl shadow-sm text-center text-gray-400">ไม่พบข้อมูลการสแกนล่าสุด</div>
            )}
        </div>
      </div>
    </div>
  );
}