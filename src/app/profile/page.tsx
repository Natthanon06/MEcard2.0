// src/app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ก๊อปปี้ TEMPLATES มาวางเพื่อให้หน้านี้รู้จักธีมสีต่างๆ
const TEMPLATES = [
  {
    id: "modern-dark",
    name: "Modern Dark",
    bgClass: "bg-gradient-to-br from-slate-800 via-gray-900 to-black",
    textClass: "text-white",
    subTextClass: "text-gray-300",
    accentClass: "text-blue-400",
    iconClass: "text-gray-400",
    borderClass: "border-white/20",
  },
  {
    id: "minimal-white",
    name: "Minimal White",
    bgClass: "bg-white border border-gray-200",
    textClass: "text-gray-900",
    subTextClass: "text-gray-600",
    accentClass: "text-blue-600",
    iconClass: "text-gray-500",
    borderClass: "border-gray-200",
  },
  {
    id: "corporate-blue",
    name: "Corporate Blue",
    bgClass: "bg-gradient-to-r from-blue-700 to-blue-900",
    textClass: "text-white",
    subTextClass: "text-blue-100",
    accentClass: "text-yellow-400",
    iconClass: "text-blue-300",
    borderClass: "border-blue-400/30",
  },
  {
    id: "luxury-gold",
    name: "Luxury Gold",
    bgClass: "bg-gradient-to-br from-neutral-900 via-stone-800 to-stone-900",
    textClass: "text-amber-50",
    subTextClass: "text-stone-300",
    accentClass: "text-amber-400",
    iconClass: "text-amber-600/70",
    borderClass: "border-amber-500/50",
  }
];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [myCards, setMyCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. ตรวจสอบการ Login
    const currentUserStr = localStorage.getItem("currentUser");
    if (!currentUserStr) {
      router.push("/login"); // ถ้าไม่ได้ล็อกอิน ดีดกลับไปหน้า Login
      return;
    }

    const currentUser = JSON.parse(currentUserStr);
    setUser(currentUser);

    // 2. ดึงข้อมูลการ์ดทั้งหมด
    const savedCardsStr = localStorage.getItem("savedCards");
    if (savedCardsStr) {
      const allCards = JSON.parse(savedCardsStr);
      // 3. กรองเฉพาะการ์ดที่เป็นของ User คนนี้ (เช็คจาก ownerEmail)
      const userCards = allCards.filter((card: any) => card.ownerEmail === currentUser.email);
      // เรียงลำดับจากใหม่ไปเก่า
      setMyCards(userCards.reverse());
    }
    
    setIsLoading(false);
  }, [router]);

  // ฟังก์ชันลบการ์ด
  const handleDeleteCard = (cardId: number) => {
    if (confirm("คุณต้องการลบนามบัตรใบนี้ใช่หรือไม่?")) {
      // ดึงข้อมูลทั้งหมดมา
      const savedCardsStr = localStorage.getItem("savedCards");
      const allCards = savedCardsStr ? JSON.parse(savedCardsStr) : [];
      
      // กรองเอาใบที่จะลบออก
      const updatedAllCards = allCards.filter((c: any) => c.id !== cardId);
      
      // บันทึกกลับลง LocalStorage
      localStorage.setItem("savedCards", JSON.stringify(updatedAllCards));
      
      // อัปเดตหน้าจอ
      setMyCards((prev) => prev.filter((c) => c.id !== cardId));
    }
  };

  const calculateAge = (dateString: string) => {
    if (!dateString) return "";
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `(${age} ปี)`;
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* --- Navbar --- */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900 flex items-center gap-2 hover:opacity-80">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            กลับหน้าหลัก
          </Link>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
               {user?.name?.charAt(0) || "U"}
             </div>
             <span className="text-sm font-medium text-gray-700">{user?.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* --- Header Profile --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl text-white font-bold shadow-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
            <p className="text-gray-500 mb-4">{user?.email}</p>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
              สมาชิก (Member)
            </div>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-sm text-gray-500">นามบัตรทั้งหมด</p>
            <p className="text-3xl font-bold text-gray-900">{myCards.length}</p>
          </div>
        </div>

        {/* --- Saved Cards Section --- */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            คลังนามบัตรของฉัน
          </h2>
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            + สร้างใบใหม่
          </Link>
        </div>

        {myCards.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 mb-4">ยังไม่มีนามบัตรที่บันทึกไว้</p>
            <Link href="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              ไปสร้างนามบัตรใบแรกกันเถอะ
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {myCards.map((card) => {
              // หา Theme object จาก ID ที่บันทึกไว้
              const theme = TEMPLATES.find(t => t.id === card.templateId) || TEMPLATES[0];

              return (
                <div key={card.id} className="group relative">
                  {/* ปุ่มลบ (จะโผล่มาเมื่อเอาเมาส์ชี้) */}
                  <button 
                    onClick={() => handleDeleteCard(card.id)}
                    className="absolute -top-3 -right-3 z-30 bg-red-500 text-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    title="ลบนามบัตร"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  {/* ตัวการ์ด (Logic เดียวกับหน้า Home แต่ย่อส่วนลงมา) */}
                  <div className={`
                    w-full aspect-[1.58/1] rounded-xl shadow-lg p-6 relative overflow-hidden transform transition-all hover:scale-[1.01] hover:shadow-2xl
                    ${theme.bgClass}
                    ${theme.textClass}
                  `}>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl -mr-8 -mt-8 opacity-20 bg-white"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full blur-xl -ml-4 -mb-4 opacity-20 bg-white"></div>

                    <div className="relative z-10 h-full flex flex-col justify-between">
                      <div className="pr-20">
                        <h3 className="text-xl font-bold tracking-wide break-words leading-tight">{card.fullName}</h3>
                        <p className={`font-medium mt-1 uppercase tracking-wider text-xs ${theme.accentClass}`}>{card.position}</p>
                      </div>

                      <div className={`space-y-1.5 text-xs z-20 relative ${theme.subTextClass}`}>
                        <div className="flex items-center gap-2">
                           <svg className={`w-3 h-3 shrink-0 ${theme.iconClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                           <span className="truncate">
                             {card.birthDate ? new Date(card.birthDate).toLocaleDateString('th-TH') : "-"} 
                             {" "}<span className="opacity-70">{calculateAge(card.birthDate)}</span>
                           </span>
                        </div>
                        <div className="flex items-center gap-2">
                           <svg className={`w-3 h-3 shrink-0 ${theme.iconClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                           <span className="truncate">{card.phoneNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <svg className={`w-3 h-3 shrink-0 ${theme.iconClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v9a2 2 0 002 2z" /></svg>
                           <span className="truncate">{card.email}</span>
                        </div>
                      </div>

                      <div className="absolute bottom-4 right-4 z-10">
                        {card.profileImage ? (
                          <img src={card.profileImage} alt="Profile" className={`w-16 h-16 rounded-full object-cover border-2 shadow-sm ${theme.borderClass}`} />
                        ) : (
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 backdrop-blur-sm ${theme.borderClass} bg-white/10`}>
                             <svg className={`w-6 h-6 opacity-50 ${theme.textClass}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* วันที่สร้าง */}
                  <p className="text-xs text-gray-400 mt-2 text-right">
                    สร้างเมื่อ: {new Date(card.createdAt).toLocaleDateString('th-TH')}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}