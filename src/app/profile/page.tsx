"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// ✅ 1. นำเข้า TEXT และ Hook
import { TEXT } from "@/constants/text";
import { useLanguage } from "@/context/LanguageContext";

const TEMPLATES = [
  { id: "modern-dark", name: "Modern Dark", bgClass: "bg-gradient-to-br from-slate-800 via-gray-900 to-black", textClass: "text-white", subTextClass: "text-gray-300", accentClass: "text-blue-400", iconClass: "text-gray-400", borderClass: "border-white/20" },
  { id: "minimal-white", name: "Minimal White", bgClass: "bg-white border border-gray-200", textClass: "text-gray-900", subTextClass: "text-gray-600", accentClass: "text-blue-600", iconClass: "text-gray-500", borderClass: "border-gray-200" },
  { id: "corporate-blue", name: "Corporate Blue", bgClass: "bg-gradient-to-r from-blue-700 to-blue-900", textClass: "text-white", subTextClass: "text-blue-100", accentClass: "text-yellow-400", iconClass: "text-blue-300", borderClass: "border-blue-400/30" },
  { id: "luxury-gold", name: "Luxury Gold", bgClass: "bg-gradient-to-br from-neutral-900 via-stone-800 to-stone-900", textClass: "text-amber-50", subTextClass: "text-stone-300", accentClass: "text-amber-400", iconClass: "text-amber-600/70", borderClass: "border-amber-500/50" }
];

export default function ProfilePage() {
  const router = useRouter();
  
  // ✅ 2. ดึง lang มาใช้
  const { lang } = useLanguage(); 

  const [user, setUser] = useState<any>(null);
  const [myCards, setMyCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // ✅ 3. ใช้ TEXT[...] ในการกำหนด Label ของ Status
  const STATUS_OPTIONS = [
    { id: 'online', label: TEXT.status_online[lang], dotColor: 'bg-green-500', badgeClass: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' },
    { id: 'busy', label: TEXT.status_busy[lang], dotColor: 'bg-red-500', badgeClass: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' },
    { id: 'meeting', label: TEXT.status_meeting[lang], dotColor: 'bg-orange-500', badgeClass: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100' },
    { id: 'offline', label: TEXT.status_offline[lang], dotColor: 'bg-gray-500', badgeClass: 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100' },
  ];

  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const statusMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. ตรวจสอบ User ใน LocalStorage
    const currentUserStr = localStorage.getItem("currentUser");
    if (!currentUserStr) {
      router.push("/login");
      return;
    }

    const currentUser = JSON.parse(currentUserStr);
    if (!currentUser.status) currentUser.status = 'online';
    
    setUser(currentUser);

    // 🚀 2. (แก้ใหม่) ดึงข้อมูลการ์ดจาก API/MongoDB แทน LocalStorage
    fetchMyCards(currentUser.email);

    function handleClickOutside(event: MouseEvent) {
      if (statusMenuRef.current && !statusMenuRef.current.contains(event.target as Node)) {
        setIsStatusMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);

  }, [router]);

  // 🔥 ฟังก์ชันดึงข้อมูลจาก MongoDB
  const fetchMyCards = async (email: string) => {
    try {
      const res = await fetch(`/api/cards?email=${email}`);
      const data = await res.json();

      if (data.success) {
        setMyCards(data.data); // เอาข้อมูลจริงจาก DB ใส่ State
      } else {
        console.error("Failed to fetch cards");
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeStatus = (statusId: string) => {
    const updatedUser = { ...user, status: statusId };
    setUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser)); 
    setIsStatusMenuOpen(false);
  };

  // 🔥 ฟังก์ชันลบการ์ด (อัปเดตเฉพาะหน้าจอ)
  const handleDeleteCard = (cardId: string) => { // MongoDB ID เป็น String
    if (confirm(TEXT.confirmDelete[lang])) {
       // ลบออกจาก State ทันทีเพื่อให้ User รู้สึกว่าลบแล้ว
       setMyCards((prev) => prev.filter((c) => c._id !== cardId));
       
       // หมายเหตุ: ตรงนี้ถ้าจะให้ลบถาวรต้องยิง API DELETE ไปที่ Server เพิ่มเติมในอนาคต
       console.log("Delete UI Only for:", cardId);
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

  // ✅ ใช้ TEXT
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">{TEXT.loading[lang]}</div>;

  const currentStatus = STATUS_OPTIONS.find(s => s.id === user?.status) || STATUS_OPTIONS[0];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Navbar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <Link href="/" className="text-xl font-bold text-gray-900 flex items-center gap-2 hover:opacity-80">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">{TEXT.nav_home[lang]}</span>
          </Link>

          <div className="flex items-center gap-4">
            
            <Link href="/exchange" className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-bold shadow-md hover:bg-gray-800 transition active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span>{TEXT.nav_exchange[lang]}</span>
            </Link>

            <div className="h-6 w-px bg-gray-200"></div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold border border-blue-200">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white ${currentStatus.dotColor}`}></div>
              </div>
              <span className="text-sm font-medium text-gray-700 hidden md:block">{user?.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header Profile */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-visible">
          
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl text-white font-bold shadow-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className={`absolute bottom-1 right-1 w-6 h-6 rounded-full border-4 border-white ${currentStatus.dotColor}`}></div>
          </div>

          <div className="text-center sm:text-left flex-1 space-y-2">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                <p className="text-gray-500 text-sm">{user?.email}</p>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium border border-green-200 mt-2">
                  {TEXT.profile_member[lang]}
                </div>
            </div>

            {/* Status Dropdown */}
            <div className="relative inline-block" ref={statusMenuRef}>
                <button 
                    onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${currentStatus.badgeClass}`}
                >
                    <div className={`w-2 h-2 rounded-full ${currentStatus.dotColor}`}></div>
                    {currentStatus.label}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 opacity-50 ml-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>

                {isStatusMenuOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20 animate-in fade-in zoom-in-95">
                        <div className="p-1">
                            {STATUS_OPTIONS.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleChangeStatus(option.id)}
                                    className={`w-full text-left px-3 py-2 text-sm text-gray-900 rounded-lg flex items-center gap-3 hover:bg-gray-50 transition-colors ${user.status === option.id ? 'bg-gray-50 font-bold' : ''}`}
                                >
                                    <div className={`w-2.5 h-2.5 rounded-full ${option.dotColor}`}></div>
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
          </div>

          <div className="text-center sm:text-right">
            <p className="text-sm text-gray-500">{TEXT.profile_total_cards[lang]}</p>
            <p className="text-3xl font-bold text-gray-900">{myCards.length}</p>
          </div>
        </div>

        {/* Saved Cards */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            {TEXT.profile_collection[lang]}
          </h2>
          <Link href="/create" className="text-sm text-blue-600 hover:underline font-medium">
            {TEXT.profile_create_new[lang]}
          </Link>
        </div>

        {myCards.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 mb-4">{TEXT.profile_no_card[lang]}</p>
            <Link href="/create" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
              {TEXT.profile_create_first[lang]}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {myCards.map((card) => {
              const theme = TEMPLATES.find((t:any) => t.id === card.templateId) || TEMPLATES[0];

              return (
                <div key={card._id} className="group relative"> {/* ✅ ใช้ _id เป็น key */}
                  <button onClick={() => handleDeleteCard(card._id)} className="absolute -top-3 -right-3 z-30 bg-red-500 text-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 transform hover:scale-110" title={TEXT.confirmDelete[lang]}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>

                  {/* กดที่การ์ดแล้วไปหน้า Exchange */}
                  <div 
                    onClick={() => router.push('/exchange')} 
                    className={`cursor-pointer w-full aspect-[1.58/1] rounded-xl shadow-lg p-6 relative overflow-hidden transform transition-all hover:scale-[1.01] hover:shadow-2xl ${theme.bgClass} ${theme.textClass}`}
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl -mr-8 -mt-8 opacity-20 bg-white"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full blur-xl -ml-4 -mb-4 opacity-20 bg-white"></div>

                    <div className="relative z-10 h-full flex flex-col justify-between">
                      <div className="pr-20">
                        <h3 className="text-xl font-bold tracking-wide break-words leading-tight">{card.fullName}</h3>
                        <p className={`font-medium mt-1 uppercase tracking-wider text-xs ${theme.accentClass}`}>{card.position}</p>
                      </div>

                      <div className={`space-y-1.5 text-xs z-20 relative ${theme.subTextClass}`}>
                        {card.phoneNumber && <div className="flex items-center gap-2"><svg className={`w-3 h-3 shrink-0 ${theme.iconClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg><span className="truncate">{card.phoneNumber}</span></div>}
                        {card.email && <div className="flex items-center gap-2"><svg className={`w-3 h-3 shrink-0 ${theme.iconClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v9a2 2 0 002 2z" /></svg><span className="truncate max-w-[150px]">{card.email}</span></div>}
                        {card.facebook && <div className="flex items-center gap-2"><span className={`w-3 h-3 shrink-0 font-bold text-center leading-none ${theme.iconClass}`}>f</span><span className="truncate max-w-[150px]">{card.facebook}</span></div>}
                        {card.instagram && <div className="flex items-center gap-2"><span className={`w-3 h-3 shrink-0 font-bold text-center leading-none ${theme.iconClass}`}>ig</span><span className="truncate max-w-[150px]">{card.instagram}</span></div>}
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
                  
                  <p className="text-xs text-gray-400 mt-2 text-right">
                    {TEXT.profile_created_at[lang]} {new Date(card.createdAt).toLocaleDateString('th-TH')}
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