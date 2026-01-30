// src/app/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// ✅ 1. นำเข้า TEXT และ Hook
import { TEXT } from "@/constants/text";
import { useLanguage } from "@/context/LanguageContext";

export default function LandingPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // ✅ 2. ดึงค่า lang และ toggleLanguage มาใช้
  const { lang, toggleLanguage } = useLanguage();

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (confirm(TEXT.nav_logout_confirm[lang])) { // ✅ ใช้ TEXT
      localStorage.removeItem("currentUser");
      setCurrentUser(null);
      setIsMenuOpen(false);
      window.location.reload(); 
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* Navbar */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <div className="text-3xl font-black tracking-tighter bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent cursor-default">
            MEcard
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* ✅ 3. ปุ่มเปลี่ยนภาษา (TH/EN) */}
            <button 
              onClick={toggleLanguage}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 hover:bg-gray-100 transition shadow-sm"
            >
              {lang === 'th' ? 'EN' : 'TH'}
            </button>

            {currentUser ? (
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-black transition bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-full"
                >
                  <span>{currentUser.name}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 origin-top-right">
                    <div className="py-2">
                      {/* ... ส่วนหัว User Profile เดิม ... */}
                      
                      <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition" onClick={() => setIsMenuOpen(false)}>
                        <span>👤</span> {TEXT.nav_profile[lang]}
                      </Link>
                      
                      <Link href="/exchange" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition" onClick={() => setIsMenuOpen(false)}>
                        <span>📇</span> {TEXT.nav_exchange[lang]}
                      </Link>

                      {/* ✅ เพิ่มปุ่มนัดหมายประชุมตรงนี้ครับ */}
                      <Link href="/meeting" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition" onClick={() => setIsMenuOpen(false)}>
                        <span>📅</span> นัดหมายการประชุม
                      </Link>
                      
                      <div className="border-t border-gray-50 my-1"></div>
                      
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition text-left">
                        <span>🚪</span> {TEXT.nav_logout[lang]}
                      </button>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition">
                {TEXT.nav_login[lang]}
              </Link>
            )}

            <Link href="/create" className="px-6 py-2.5 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-800 transition transform hover:scale-105 shadow-lg">
              {TEXT.nav_create[lang]}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden">
        <div className="lg:w-1/2 text-center lg:text-left space-y-8 z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-sm font-bold tracking-wide mb-4">
            {TEXT.hero_tag[lang]}
          </div>
          <h1 className="text-6xl lg:text-8xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
            Connect.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400">
              Share. Grow.
            </span>
          </h1>
          <p className="text-xl text-gray-500 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            {TEXT.hero_desc[lang]}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6">
            <Link href="/create" className="px-10 py-4 bg-purple-600 text-white text-lg font-bold rounded-full shadow-xl shadow-purple-200 hover:shadow-2xl hover:bg-purple-700 transition-all transform hover:-translate-y-1">
              {TEXT.btn_start[lang]}
            </Link>
            {currentUser && (
              <Link href="/profile" className="px-10 py-4 bg-white text-gray-700 border-2 border-gray-100 text-lg font-bold rounded-full hover:border-gray-300 hover:bg-gray-50 transition-all">
                {TEXT.btn_mycard[lang]}
              </Link>
            )}
          </div>
        </div>

        {/* Hero Image */}
        <div className="lg:w-1/2 relative z-10 flex justify-center">
           <div className="absolute top-10 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
           <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse animation-delay-2000"></div>
           <div className="relative w-[320px] h-[640px] bg-gray-900 rounded-[3rem] border-[8px] border-gray-800 shadow-2xl flex flex-col overflow-hidden transform rotate-[-6deg] hover:rotate-0 transition-all duration-700 ease-out">
              <div className="flex-1 bg-gradient-to-br from-slate-800 to-black p-6 flex flex-col items-center pt-14">
                 <div className="w-24 h-24 rounded-full border-4 border-white/10 mb-4 bg-gradient-to-tr from-yellow-400 to-orange-500 shadow-lg"></div>
                 <div className="h-6 w-32 bg-white/20 rounded-full mb-2"></div>
                 <div className="h-4 w-20 bg-white/10 rounded-full mb-8"></div>
                 <div className="w-full space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-14 w-full bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm"></div>
                    ))}
                 </div>
              </div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl"></div>
           </div>
        </div>
      </div>

      <footer className="border-t border-gray-100 py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
          <p>{TEXT.footer_rights[lang]}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-600">{TEXT.footer_privacy[lang]}</a>
            <a href="#" className="hover:text-gray-600">{TEXT.footer_terms[lang]}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}