// src/app/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// 1. กำหนดรูปแบบธีมต่างๆ (Templates)
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
    previewColor: "bg-slate-800"
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
    previewColor: "bg-white border border-gray-300"
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
    previewColor: "bg-blue-700"
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
    previewColor: "bg-stone-800 border border-amber-500/50"
  }
];

export default function HomePage() {
  const router = useRouter();
  
  // State เก็บข้อมูลผู้ใช้
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // State สำหรับ Dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // State เก็บข้อมูลนามบัตร
  const [cardData, setCardData] = useState({
    fullName: "",
    position: "",
    birthDate: "",
    phoneNumber: "",
    email: "",
    profileImage: "",
  });

  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0].id);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. ดึงข้อมูล User
    const currentUserStr = localStorage.getItem("currentUser");
    if (currentUserStr) {
      const user = JSON.parse(currentUserStr);
      setCurrentUser(user);

      // 2. เติมข้อมูลลงฟอร์มอัตโนมัติ
      setCardData((prev) => ({
        ...prev,
        fullName: user.name || "",
        email: user.email || "",
      }));
    }

    // ปิด Dropdown เมื่อคลิกข้างนอก
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ฟังก์ชัน Logout
  const handleLogout = () => {
    if (confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
      localStorage.removeItem("currentUser");
      setCurrentUser(null);
      setIsDropdownOpen(false);
      window.location.reload();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCardData((prev) => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateAge = (dateString: string) => {
    if (!dateString) return "";
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `(${age} ปี)`;
  };

  // --- ส่วนที่อัปเดต: บันทึกลง Local Storage จริงๆ ---
  const handleSave = () => {
    // 1. เช็คความถูกต้อง
    if (!cardData.fullName) {
      alert("กรุณากรอกชื่อ-นามสกุล");
      return;
    }

    // 2. เช็คว่าล็อกอินหรือยัง?
    const currentUserStr = localStorage.getItem("currentUser");
    if (!currentUserStr) {
      alert("กรุณาเข้าสู่ระบบก่อนบันทึกนามบัตร");
      // router.push("/login"); // ถ้าอยากให้เด้งไปหน้า login เลยให้เปิดบรรทัดนี้
      return;
    }
    const currentUser = JSON.parse(currentUserStr);

    // 3. เตรียมข้อมูลที่จะบันทึก
    const newCard = {
      id: Date.now(), // สร้าง ID ไม่ซ้ำ
      ownerEmail: currentUser.email, // ระบุเจ้าของบัตร
      templateId: selectedTemplate, // บันทึกธีมที่เลือกด้วย
      ...cardData, // ข้อมูลบัตรทั้งหมด
      createdAt: new Date().toISOString(),
    };

    // 4. ดึงข้อมูลเก่ามา + เพิ่มอันใหม่เข้าไป
    const savedCardsStr = localStorage.getItem("savedCards");
    const savedCards = savedCardsStr ? JSON.parse(savedCardsStr) : [];
    const updatedCards = [...savedCards, newCard];

    // 5. บันทึกลง Local Storage
    localStorage.setItem("savedCards", JSON.stringify(updatedCards));

    alert("✅ บันทึกนามบัตรลงในหน้าโปรไฟล์เรียบร้อยแล้ว!");
  };
  // ------------------------------------------------

  const currentTheme = TEMPLATES.find(t => t.id === selectedTemplate) || TEMPLATES[0];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      
      {/* --- Navbar / User Menu --- */}
      <div className="absolute top-6 right-6 z-50" ref={dropdownRef}>
        {currentUser ? (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md border border-gray-200 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700 max-w-[150px] truncate">
                {currentUser.name}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                  <p className="text-xs text-gray-500">เข้าสู่ระบบเป็น</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{currentUser.email}</p>
                </div>

                <Link 
                  href="/profile" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors flex items-center"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  หน้าผู้ใช้ (Profile)
                </Link>
                <Link 
                  href="/exchange" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors flex items-center"
                  onClick={() => setIsDropdownOpen(false)}
>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  แลกเปลี่ยนนามบัตร
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  ออกจากระบบ
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link 
            href="/login" 
            className="flex items-center space-x-2 bg-white px-5 py-2.5 rounded-full shadow-md border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:shadow-lg hover:text-blue-600 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>เข้าสู่ระบบ</span>
          </Link>
        )}
      </div>

      <div className="max-w-6xl mx-auto pt-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">สร้างนามบัตรดิจิทัลของคุณ</h1>
          <p className="mt-2 text-gray-600">กรอกข้อมูล แล้วบันทึกไปใช้ได้เลย</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          
          {/* --- ฝั่งซ้าย: ฟอร์มกรอกข้อมูล --- */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
              ออกแบบ & ข้อมูล
            </h2>
            
            <div className="space-y-6">
              
              {/* เลือกธีม */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">เลือกสไตล์นามบัตร</label>
                <div className="grid grid-cols-4 gap-3">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTemplate(t.id)}
                      className={`
                        relative h-16 rounded-lg border-2 transition-all overflow-hidden group
                        ${selectedTemplate === t.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}
                      `}
                    >
                      <div className={`w-full h-full ${t.previewColor}`}></div>
                      <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] py-1 opacity-0 group-hover:opacity-100 transition-opacity truncate px-1">
                        {t.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4"></div>

              {/* ช่องอัปโหลดรูปภาพ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">รูปโปรไฟล์</label>
                <div className="flex items-center space-x-4">
                  {cardData.profileImage && (
                    <img src={cardData.profileImage} alt="Preview" className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                  )}
                  <label className="cursor-pointer">
                    <span className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm flex items-center">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        เปลี่ยนรูป...
                    </span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </div>

              {/* ฟอร์มข้อมูล */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ - นามสกุล</label>
                  <input
                    type="text"
                    name="fullName"
                    value={cardData.fullName}
                    onChange={handleChange}
                    placeholder="เช่น สมชาย ใจดี"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ตำแหน่งงาน</label>
                  <input
                    type="text"
                    name="position"
                    value={cardData.position}
                    onChange={handleChange}
                    placeholder="เช่น Software Engineer"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
                     <input
                      type="tel"
                      name="phoneNumber"
                      value={cardData.phoneNumber}
                      onChange={handleChange}
                      placeholder="08X-XXX-XXXX"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">วันเกิด</label>
                    <input
                      type="date"
                      name="birthDate"
                      value={cardData.birthDate}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                  <input
                    type="email"
                    name="email"
                    value={cardData.email}
                    onChange={handleChange}
                    placeholder="example@domain.com"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* --- ฝั่งขวา: Live Preview --- */}
          <div className="flex flex-col items-center sticky top-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="bg-purple-100 text-purple-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
              ตัวอย่างนามบัตร
            </h2>

            {/* การ์ดนามบัตร */}
            <div className={`
              w-full max-w-[400px] aspect-[1.58/1] rounded-2xl shadow-2xl p-8 relative overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-xl
              ${currentTheme.bgClass}
              ${currentTheme.textClass}
            `}>
              
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -mr-10 -mt-10 opacity-20 bg-white`}></div>
              <div className={`absolute bottom-0 left-0 w-24 h-24 rounded-full blur-xl -ml-5 -mb-5 opacity-20 bg-white`}></div>

              <div className="relative z-10 h-full flex flex-col justify-between">
                
                <div className="pr-28"> 
                  <h3 className="text-2xl font-bold tracking-wide break-words leading-tight">
                    {cardData.fullName || "ชื่อ นามสกุล"}
                  </h3>
                  <p className={`font-medium mt-2 uppercase tracking-wider text-sm break-words ${currentTheme.accentClass}`}>
                    {cardData.position || "ตำแหน่งงาน"}
                  </p>
                </div>

                <div className={`space-y-2 text-sm z-20 relative ${currentTheme.subTextClass}`}>
                  
                  <div className="flex items-center gap-3">
                    <svg className={`w-4 h-4 shrink-0 ${currentTheme.iconClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="truncate">
                      {cardData.birthDate ? new Date(cardData.birthDate).toLocaleDateString('th-TH') : "วว/ดด/ปปปป"}
                      {" "}
                      <span className="opacity-70 text-xs">
                        {calculateAge(cardData.birthDate)}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <svg className={`w-4 h-4 shrink-0 ${currentTheme.iconClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="truncate">{cardData.phoneNumber || "08X-XXX-XXXX"}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <svg className={`w-4 h-4 shrink-0 ${currentTheme.iconClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v9a2 2 0 002 2z" />
                    </svg>
                    <span className="truncate">{cardData.email || "email@example.com"}</span>
                  </div>
                </div>

                <div className="absolute bottom-6 right-6 z-10">
                  {cardData.profileImage ? (
                    <img
                      src={cardData.profileImage}
                      alt="Profile"
                      className={`w-24 h-24 rounded-full object-cover border-4 shadow-lg ${currentTheme.borderClass}`}
                    />
                  ) : (
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 backdrop-blur-sm ${currentTheme.borderClass} bg-white/10`}>
                       <svg className={`w-10 h-10 opacity-50 ${currentTheme.textClass}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

              </div>
            </div>

            <button 
              onClick={handleSave}
              className="mt-8 bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              บันทึกนามบัตร
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
}