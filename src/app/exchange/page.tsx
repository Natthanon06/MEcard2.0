// src/app/exchange/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Template เหมือนเดิมเพื่อใช้แสดง Preview
const TEMPLATES = [
  { id: "modern-dark", name: "Modern Dark", bgClass: "bg-gradient-to-br from-slate-800 via-gray-900 to-black", textClass: "text-white", subTextClass: "text-gray-300", accentClass: "text-blue-400", iconClass: "text-gray-400", borderClass: "border-white/20" },
  { id: "minimal-white", name: "Minimal White", bgClass: "bg-white border border-gray-200", textClass: "text-gray-900", subTextClass: "text-gray-600", accentClass: "text-blue-600", iconClass: "text-gray-500", borderClass: "border-gray-200" },
  { id: "corporate-blue", name: "Corporate Blue", bgClass: "bg-gradient-to-r from-blue-700 to-blue-900", textClass: "text-white", subTextClass: "text-blue-100", accentClass: "text-yellow-400", iconClass: "text-blue-300", borderClass: "border-blue-400/30" },
  { id: "luxury-gold", name: "Luxury Gold", bgClass: "bg-gradient-to-br from-neutral-900 via-stone-800 to-stone-900", textClass: "text-amber-50", subTextClass: "text-stone-300", accentClass: "text-amber-400", iconClass: "text-amber-600/70", borderClass: "border-amber-500/50" }
];

export default function ExchangePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  
  // State สำหรับการค้นหาและส่ง
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]); // ผลการค้นหาคน
  const [targetUser, setTargetUser] = useState<any>(null); // คนที่เราเลือกจะส่งให้
  const [myCards, setMyCards] = useState<any[]>([]); // นามบัตรของเราที่มี
  const [activeTab, setActiveTab] = useState<'send' | 'inbox'>('send');
  const [inboxCards, setInboxCards] = useState<any[]>([]); // นามบัตรที่คนอื่นส่งมา

  useEffect(() => {
    // 1. เช็ค Login
    const currentUserStr = localStorage.getItem("currentUser");
    if (!currentUserStr) {
      router.push("/login");
      return;
    }
    const currentUser = JSON.parse(currentUserStr);
    setUser(currentUser);

    // 2. โหลดนามบัตร "ของเราเอง" เตรียมไว้ส่ง
    const savedCardsStr = localStorage.getItem("savedCards");
    if (savedCardsStr) {
      const allCards = JSON.parse(savedCardsStr);
      const mine = allCards.filter((c: any) => c.ownerEmail === currentUser.email);
      setMyCards(mine);
    }

    // 3. โหลด "กล่องจดหมาย" (Inbox) ว่ามีใครส่งมาให้เราไหม
    const inboxKey = `inbox_${currentUser.email}`;
    const myInbox = JSON.parse(localStorage.getItem(inboxKey) || "[]");
    setInboxCards(myInbox.reverse());

  }, [router]);

  // --- ฟังก์ชันค้นหาผู้ใช้ ---
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // ดึง User ทั้งหมดมาค้นหา
    const allUsersStr = localStorage.getItem("registeredUsers");
    const allUsers = allUsersStr ? JSON.parse(allUsersStr) : [];

    // กรองหาคนที่มีชื่อหรืออีเมลตรงกับคำค้นหา (และไม่ใช่ตัวเราเอง)
    const results = allUsers.filter((u: any) => 
      (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       u.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
      u.email !== user.email
    );

    setSearchResults(results);
    setTargetUser(null); // รีเซ็ตคนที่จะส่ง
  };

  // --- ฟังก์ชันส่งนามบัตร ---
  const handleSendCard = (cardToSend: any) => {
    if (!targetUser) return;

    if (confirm(`ยืนยันการส่งนามบัตรให้คุณ "${targetUser.name}" ?`)) {
      // 1. สร้าง key inbox ของปลายทาง
      const targetInboxKey = `inbox_${targetUser.email}`;
      
      // 2. ดึง inbox เก่าเขามา
      const targetInbox = JSON.parse(localStorage.getItem(targetInboxKey) || "[]");

      // 3. สร้าง Object การส่ง (เพิ่มข้อมูลว่าใครส่งมา)
      const sentCard = {
        ...cardToSend,
        receivedFrom: user.name, // ระบุว่าใครส่ง
        receivedDate: new Date().toISOString(),
        id: Date.now() // สร้าง ID ใหม่สำหรับการส่งครั้งนี้
      };

      // 4. ยัดใส่ inbox เขา
      localStorage.setItem(targetInboxKey, JSON.stringify([...targetInbox, sentCard]));

      alert("ส่งนามบัตรเรียบร้อยแล้ว!");
      setTargetUser(null); // ปิดหน้าต่างเลือก
      setSearchQuery(""); // เคลียร์ช่องค้นหา
      setSearchResults([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Navbar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900 flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
             หน้าหลัก
          </Link>
          <div className="flex gap-4 text-sm font-medium">
            <button 
              onClick={() => setActiveTab('send')}
              className={`px-4 py-2 rounded-full transition-colors ${activeTab === 'send' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-900'}`}
            >
              ค้นหา & ส่ง
            </button>
            <button 
              onClick={() => setActiveTab('inbox')}
              className={`px-4 py-2 rounded-full transition-colors flex items-center gap-2 ${activeTab === 'inbox' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-900'}`}
            >
              กล่องรับนามบัตร
              {inboxCards.length > 0 && <span className="bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">{inboxCards.length}</span>}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        
        {/* --- TAB 1: SEARCH & SEND --- */}
        {activeTab === 'send' && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">ส่งนามบัตร</h1>
              <p className="mt-2 text-gray-600">ค้นหาเพื่อนของคุณ แล้วเลือกนามบัตรที่จะส่งให้เขา</p>
            </div>

            {/* ช่องค้นหา */}
            <form onSubmit={handleSearch} className="relative max-w-lg mx-auto">
              <input
                type="text"
                placeholder="พิมพ์ อีเมล เพื่อค้นหา..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-lg pl-14 text-gray-900 bg-white placeholder-gray-400"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-5 top-5 h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button type="submit" className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-6 rounded-full font-medium hover:bg-blue-700 transition-colors">
                ค้นหา
              </button>
            </form>

            {/* ผลลัพธ์การค้นหา */}
            {searchResults.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-500">ผลการค้นหา ({searchResults.length})</p>
                </div>
                <ul className="divide-y divide-gray-100">
                  {searchResults.map((result) => (
                    <li key={result.email} className="p-4 flex items-center justify-between hover:bg-blue-50/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                          {result.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{result.name}</p>
                          <p className="text-sm text-gray-500">{result.email}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setTargetUser(result)}
                        className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all text-sm font-medium"
                      >
                        ส่งนามบัตร
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ส่วนเลือกนามบัตรที่จะส่ง (แสดงเมื่อกดเลือกคน) */}
            {targetUser && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                  
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">เลือกนามบัตรที่จะส่ง</h2>
                      <p className="text-sm text-gray-500">ส่งให้คุณ: <span className="text-blue-600 font-bold">{targetUser.name}</span></p>
                    </div>
                    <button onClick={() => setTargetUser(null)} className="text-gray-400 hover:text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>

                  <div className="p-6 overflow-y-auto space-y-4">
                    {myCards.length === 0 ? (
                      <div className="text-center py-10 text-gray-400">
                        คุณยังไม่มีนามบัตรให้ส่ง <Link href="/" className="text-blue-600 hover:underline">ไปสร้างก่อน</Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {myCards.map((card) => {
                          const theme = TEMPLATES.find(t => t.id === card.templateId) || TEMPLATES[0];
                          return (
                            <div key={card.id} className="cursor-pointer group" onClick={() => handleSendCard(card)}>
                              {/* Preview Card Mini */}
                              <div className={`
                                w-full aspect-[1.58/1] rounded-lg shadow-md p-4 relative overflow-hidden transition-all group-hover:ring-4 ring-blue-500/30 transform group-hover:scale-[1.02]
                                ${theme.bgClass} ${theme.textClass}
                              `}>
                                <div className="relative z-10 flex flex-col justify-between h-full">
                                  <div>
                                    <h3 className="font-bold text-sm truncate">{card.fullName}</h3>
                                    <p className={`text-[10px] ${theme.accentClass}`}>{card.position}</p>
                                  </div>
                                  <div className={`text-[10px] opacity-80 ${theme.subTextClass}`}>
                                    {card.phoneNumber}
                                  </div>
                                </div>
                              </div>
                              <p className="text-center text-xs mt-2 text-gray-500 group-hover:text-blue-600 font-medium">กดเพื่อส่งใบนี้</p>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}
          </div>
        )}

        {/* --- TAB 2: INBOX (กล่องรับนามบัตร) --- */}
        {activeTab === 'inbox' && (
          <div className="space-y-6">
             <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">กล่องรับนามบัตร</h1>
              <p className="mt-2 text-gray-600">นามบัตรที่เพื่อนๆ ส่งมาให้คุณ</p>
            </div>

            {inboxCards.length === 0 ? (
               <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                  </div>
                  <p className="text-gray-500">ยังไม่มีใครส่งนามบัตรมาให้คุณ</p>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {inboxCards.map((card) => {
                  const theme = TEMPLATES.find(t => t.id === card.templateId) || TEMPLATES[0];
                  return (
                    <div key={card.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-3 text-sm">
                        <div className="flex items-center gap-2">
                           <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">ได้รับจาก</span>
                           <span className="font-bold text-gray-800">{card.receivedFrom}</span>
                        </div>
                        <span className="text-gray-400 text-xs">{new Date(card.receivedDate).toLocaleDateString()}</span>
                      </div>

                      {/* Display Card */}
                      <div className={`
                        w-full aspect-[1.58/1] rounded-lg shadow-inner p-4 relative overflow-hidden
                        ${theme.bgClass} ${theme.textClass}
                      `}>
                         <div className="relative z-10 flex flex-col justify-between h-full">
                            <div>
                              <h3 className="font-bold text-lg truncate">{card.fullName}</h3>
                              <p className={`text-xs ${theme.accentClass}`}>{card.position}</p>
                            </div>
                            <div className={`text-xs opacity-90 space-y-1 ${theme.subTextClass}`}>
                               <div>{card.email}</div>
                               <div>{card.phoneNumber}</div>
                            </div>
                         </div>
                         {card.profileImage && (
                           <img src={card.profileImage} className={`absolute bottom-3 right-3 w-12 h-12 rounded-full border-2 ${theme.borderClass}`} />
                         )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}