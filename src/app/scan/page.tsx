// src/app/scan/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ScanPage() {
  const router = useRouter();
  const [scannedCard, setScannedCard] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // เช็ค Login
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleScan = (result: any) => {
    if (result && result[0]?.rawValue) {
      try {
        const data = JSON.parse(result[0].rawValue);
        // เช็คว่าเป็นนามบัตรของ MEcard หรือไม่
        if (data.type === "mecard_contact") {
          if (navigator.vibrate) navigator.vibrate(200); // สั่นเมื่อเจอ
          setScannedCard(data); // โชว์ Modal
        }
      } catch (e) {
        // QR ไม่ถูกต้อง (ไม่ใช่ JSON)
      }
    }
  };

  const saveCard = () => {
    if (!currentUser) return;

    // 1. เตรียมข้อมูลที่จะบันทึก
    const newCard = {
      ...scannedCard,
      id: Date.now(), // สร้าง ID ใหม่ใน Inbox เรา
      fullName: scannedCard.name,
      position: scannedCard.pos,
      phoneNumber: scannedCard.tel,
      profileImage: scannedCard.img,
      templateId: scannedCard.tpl,
      receivedDate: new Date().toISOString(),
      receivedFrom: "QR Scan"
    };

    // 2. ดึง Inbox เก่ามา
    const inboxKey = `inbox_${currentUser.email}`;
    const oldInbox = JSON.parse(localStorage.getItem(inboxKey) || "[]");

    // 3. กันซ้ำ (ถ้ามีอีเมลเดียวกันอยู่แล้ว)
    const isExist = oldInbox.some((c: any) => c.email === newCard.email);
    
    if (isExist) {
      alert("คุณมีนามบัตรใบนี้อยู่แล้ว!");
    } else {
      localStorage.setItem(inboxKey, JSON.stringify([...oldInbox, newCard]));
      alert("บันทึกเรียบร้อย!");
    }

    // 4. กลับไปหน้า Inbox
    router.push("/exchange?tab=inbox");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative">
      
      {/* HEADER */}
      <div className="absolute top-10 w-full text-center z-10">
        <h1 className="text-2xl font-bold">สแกน QR Code</h1>
        <p className="text-gray-400 text-sm">ส่องไปที่นามบัตรของเพื่อน</p>
      </div>

      {/* SCANNER */}
      {!scannedCard && (
        <div className="w-full max-w-sm aspect-square bg-gray-900 rounded-3xl overflow-hidden border-2 border-gray-700 relative">
          <Scanner 
            onScan={handleScan}
            components={{ audio: false, finder: false }}
            styles={{ container: { width: '100%', height: '100%' } }}
          />
          {/* Overlay เส้นสแกน */}
          <div className="absolute top-0 left-0 w-full h-1 bg-green-500 shadow-[0_0_20px_#22c55e] animate-[scan_2s_linear_infinite] opacity-80 z-20"></div>
          
          {/* กรอบเล็ง */}
          <div className="absolute inset-10 border-2 border-white/20 rounded-xl z-10 pointer-events-none"></div>
        </div>
      )}

      {/* MODAL PREVIEW (เด้งขึ้นมาเมื่อสแกนเจอ) */}
      {scannedCard && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in zoom-in-95">
          <div className="bg-white text-black w-full max-w-xs rounded-3xl p-6 text-center shadow-2xl relative">
            <button onClick={() => setScannedCard(null)} className="absolute top-3 right-3 text-gray-400 hover:text-black">✕</button>
            
            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white shadow">
               {scannedCard.img ? <img src={scannedCard.img} className="w-full h-full object-cover"/> : <span className="flex items-center justify-center h-full text-2xl font-bold">{scannedCard.name.charAt(0)}</span>}
            </div>

            <h2 className="text-xl font-bold">{scannedCard.name}</h2>
            <p className="text-gray-500 text-sm mb-6">{scannedCard.pos}</p>

            <button onClick={saveCard} className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition">
              บันทึกเก็บไว้ 📥
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="absolute bottom-10 z-10">
        <Link href="/exchange" className="px-6 py-3 bg-white/10 rounded-full text-sm hover:bg-white/20 transition">
          ยกเลิก / กลับ
        </Link>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}