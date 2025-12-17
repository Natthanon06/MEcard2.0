// src/app/exchange/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import QRCode from "react-qr-code";

// ธีมสำหรับแสดงผลการ์ด
const TEMPLATES: any = {
  "modern-dark": { bg: "bg-slate-900", text: "text-white", sub: "text-gray-400" },
  "minimal-white": { bg: "bg-white border border-gray-200", text: "text-gray-900", sub: "text-gray-500" },
  "corporate-blue": { bg: "bg-blue-900", text: "text-white", sub: "text-blue-200" },
  "luxury-gold": { bg: "bg-stone-900", text: "text-amber-50", sub: "text-stone-400" }
};

export default function ExchangePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [activeTab, setActiveTab] = useState<'myqr' | 'inbox'>('myqr');
  const [myCards, setMyCards] = useState<any[]>([]);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [inboxCards, setInboxCards] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // 1. ตรวจสอบ Login
    const userStr = localStorage.getItem("currentUser");
    if (!userStr) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(userStr);
    setCurrentUser(user);

    // 2. ดึงนามบัตร "ของเรา" มาแสดง
    const savedCards = JSON.parse(localStorage.getItem("savedCards") || "[]");
    const mine = savedCards.filter((c: any) => c.ownerEmail === user.email);
    setMyCards(mine);
    if (mine.length > 0) setSelectedCard(mine[0]);

    // 3. ดึงนามบัตรใน "Inbox" (ที่สแกนมา)
    const inboxKey = `inbox_${user.email}`;
    const inbox = JSON.parse(localStorage.getItem(inboxKey) || "[]");
    setInboxCards(inbox.reverse()); // เอาล่าสุดขึ้นก่อน

    // 4. เช็คว่ามีคำสั่งให้เปิด Inbox ไหม (เช่นกลับมาจากหน้า Scan)
    if (searchParams.get('tab') === 'inbox') {
      setActiveTab('inbox');
    }
  }, [router, searchParams]);

  // สร้างข้อมูล JSON สำหรับ QR Code
  const getQRData = (card: any) => {
    const data = {
      type: "mecard_contact", // รหัสลับบอกว่านี่คือ QR ของแอปเรา
      id: card.id,
      name: card.fullName,
      pos: card.position,
      email: card.email,
      tel: card.phoneNumber,
      img: card.profileImage,
      tpl: card.templateId || 'modern-dark'
    };
    return JSON.stringify(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Header */}
      <div className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">MEcard Exchange</h1>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('myqr')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'myqr' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
          >
            My QR
          </button>
          <button 
            onClick={() => setActiveTab('inbox')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'inbox' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
          >
            Inbox
            {inboxCards.length > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">{inboxCards.length}</span>}
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        
        {/* --- TAB 1: MY QR (โชว์ QR ให้เพื่อนสแกน) --- */}
        {activeTab === 'myqr' && (
          <div className="flex flex-col items-center space-y-6 animate-in fade-in">
            {myCards.length > 0 && selectedCard ? (
              <>
                <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 text-center w-full">
                  <h2 className="text-2xl font-bold text-gray-800">{selectedCard.fullName}</h2>
                  <p className="text-gray-500 mb-6">{selectedCard.position}</p>
                  
                  <div className="bg-white p-2 rounded-xl border-2 border-dashed border-gray-200 inline-block mb-4">
                    <QRCode value={getQRData(selectedCard)} size={200} />
                  </div>
                  <p className="text-xs text-gray-400">ให้เพื่อนสแกนเพื่อรับนามบัตรใบนี้</p>
                </div>

                {/* ตัวเลือกเปลี่ยนใบ (ถ้ามีหลายใบ) */}
                <div className="w-full space-y-2">
                  <p className="text-sm font-medium text-gray-500 ml-2">เลือกนามบัตรที่จะส่ง:</p>
                  {myCards.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => setSelectedCard(card)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${selectedCard.id === card.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                        {card.fullName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-800">{card.fullName}</div>
                        <div className="text-xs text-gray-500">{card.position}</div>
                      </div>
                      {selectedCard.id === card.id && <span className="text-blue-500">✓</span>}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">คุณยังไม่มีนามบัตร</p>
                <Link href="/profile" className="text-blue-600 underline">สร้างนามบัตรก่อน</Link>
              </div>
            )}
          </div>
        )}

        {/* --- TAB 2: INBOX (นามบัตรที่เก็บมา) --- */}
        {activeTab === 'inbox' && (
          <div className="space-y-4 animate-in fade-in">
            {inboxCards.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <div className="text-4xl mb-2">📭</div>
                <p>ยังไม่มีนามบัตรในกระเป๋า</p>
                <Link href="/scan" className="text-blue-500 mt-2 inline-block">ไปสแกนเลย</Link>
              </div>
            ) : (
              inboxCards.map((card: any, idx: number) => {
                const theme = TEMPLATES[card.templateId] || TEMPLATES['modern-dark'];
                return (
                  <div key={idx} className={`p-4 rounded-2xl shadow-sm relative overflow-hidden ${theme.bg} ${theme.text}`}>
                    <div className="flex justify-between items-start relative z-10">
                      <div>
                        <h3 className="text-lg font-bold">{card.fullName}</h3>
                        <p className={`text-sm ${theme.sub}`}>{card.position}</p>
                      </div>
                      {card.profileImage && (
                        <img src={card.profileImage} className="w-10 h-10 rounded-full border-2 border-white/20" />
                      )}
                    </div>
                    
                    <div className={`mt-4 pt-4 border-t border-white/10 text-sm space-y-1 ${theme.sub}`}>
                      <p>📞 {card.phoneNumber}</p>
                      <p>✉️ {card.email}</p>
                    </div>

                    <div className="absolute top-0 right-0 p-2 opacity-50 text-[10px]">
                      {new Date(card.receivedDate).toLocaleDateString()}
                    </div>
                    
                    {/* Action Bar */}
                    <div className="mt-4 flex gap-2">
                       <a href={`tel:${card.phoneNumber}`} className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded-lg text-center text-sm transition">โทร</a>
                       <a href={`mailto:${card.email}`} className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded-lg text-center text-sm transition">เมล</a>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>

      {/* Floating Action Button (Scan) */}
      <Link href="/scan" className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center gap-2 z-50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
        <span className="font-bold pr-1">สแกน</span>
      </Link>

    </div>
  );
}