"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function CardViewer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [card, setCard] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [viewMode, setViewMode] = useState('work'); 
  const [isSaving, setIsSaving] = useState(false);

  // 1️⃣ โหลดข้อมูลการ์ดและ User จาก LocalStorage
  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) setCurrentUser(JSON.parse(userStr));

    const mode = searchParams.get("mode") || "work";
    setViewMode(mode);

    const data = {
      id: searchParams.get("id") || searchParams.get("n") || "unknown-id", // ใช้ชื่อเป็น ID สำรองถ้าไม่มี id ส่งมา
      fullName: searchParams.get("n") || "",
      position: searchParams.get("p") || "",
      email: searchParams.get("e") || "",
      phoneNumber: searchParams.get("t") || "",
      facebook: searchParams.get("f") || "",
      instagram: searchParams.get("i") || "",
      line: searchParams.get("line") || "",
      tiktok: searchParams.get("tiktok") || "",
      website: searchParams.get("website") || "",
      profileImage: searchParams.get("img") || "", 
      templateId: searchParams.get("tpl") || "modern-dark",
      receivedDate: new Date().toISOString()
    };

    if (data.fullName && !data.profileImage) {
        const savedCards = JSON.parse(localStorage.getItem("savedCards") || "[]");
        const localMatch = savedCards.find((c: any) => c.fullName === data.fullName);
        if (localMatch && localMatch.profileImage) {
          data.profileImage = localMatch.profileImage; 
        }
    }
    
    setCard(data);
  }, [searchParams]);

  // 2️⃣ 🌟 ระบบ Guest: แอบบันทึกข้อมูลอัตโนมัติลง DB 7 วัน (ทำเมื่อโหลกข้อมูลการ์ดเสร็จและเป็น Guest)
  useEffect(() => {
    if (card && !currentUser) {
      const autoSaveGuest = async () => {
        try {
          await fetch("/api/guest/save-scan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              cardId: card.id, 
              cardData: card 
            })
          });
          console.log("บันทึกข้อมูล Guest 7 วันสำเร็จ!");
        } catch (error) {
          console.error("บันทึก Guest ไม่สำเร็จ:", error);
        }
      };
      autoSaveGuest();
    }
  }, [card, currentUser]);

  // 3️⃣ ฟังก์ชันบันทึกเข้า Database ถาวร (สำหรับ User ที่ล็อกอินแล้วเท่านั้น)
  const handleSave = async () => {
    setIsSaving(true);
    try {
        const res = await fetch("/api/inbox", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userEmail: currentUser.email, 
                cardData: card 
            })
        });

        const result = await res.json();

        if (res.ok) {
            alert("บันทึกสำเร็จ! ✅");
            router.push("/exchange?tab=inbox");
        } else {
            alert(result.error || "บันทึกไม่สำเร็จ");
        }
    } catch (error) {
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อ Server");
    } finally {
        setIsSaving(false);
    }
  };

  if (!card) return <div className="min-h-screen bg-black text-white flex items-center justify-center">กำลังอ่านข้อมูล...</div>;

  return (
    // 🌟 เพิ่ม pb-24 (padding-bottom) เพื่อไม่ให้เนื้อหาโดนเมนูด้านล่างบัง
    <div className={`min-h-screen pb-24 flex flex-col items-center justify-center p-6 transition-colors duration-500 ${viewMode === 'party' ? 'bg-gradient-to-br from-purple-900 via-gray-900 to-black' : 'bg-black'}`}>
      
      <div className={`w-full max-w-sm border rounded-[2.5rem] p-8 text-center shadow-2xl relative overflow-hidden ${viewMode === 'party' ? 'bg-black/40 border-pink-500/30 backdrop-blur-md' : 'bg-gray-900 border-gray-800'}`}>
        
        {/* รูปโปรไฟล์ */}
        <div className="relative mx-auto w-28 h-28 mb-4">
           {card.profileImage ? (
             <img src={card.profileImage} className={`w-full h-full rounded-full object-cover border-4 shadow-2xl ${viewMode === 'party' ? 'border-pink-500' : 'border-gray-800'}`} alt="Profile" />
           ) : (
             <div className="w-full h-full rounded-full bg-gray-800 border-4 border-gray-700 flex items-center justify-center text-4xl font-bold text-gray-400">
               {card.fullName?.charAt(0)}
             </div>
           )}
        </div>

        {/* ชื่อ */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">{card.fullName}</h1>
          <p className={`font-medium uppercase tracking-wider text-xs mt-2 ${viewMode === 'party' ? 'text-pink-400' : 'text-blue-400'}`}>
            {card.position}
          </p>
        </div>

        {/* ข้อมูลติดต่อ */}
        <div className="bg-white/5 rounded-2xl p-2 space-y-1 mb-8 min-h-[150px]">
          
          {card.phoneNumber && (
            <a href={`tel:${card.phoneNumber}`} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors group">
              <span className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-lg">📞</span>
              <span className="text-sm font-medium text-gray-200">{card.phoneNumber}</span>
            </a>
          )}
          {card.email && (
            <a href={`mailto:${card.email}`} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors group">
              <span className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-lg">✉️</span>
              <span className="text-sm font-medium text-gray-200 truncate">{card.email}</span>
            </a>
          )}
          {card.website && (
            <a href={card.website.startsWith('http') ? card.website : `https://${card.website}`} target="_blank" className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors group">
              <span className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-lg">🌐</span>
              <span className="text-sm font-medium text-gray-200 truncate">{card.website}</span>
            </a>
          )}
          {card.instagram && (
            <a href={`https://instagram.com/${card.instagram}`} target="_blank" className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors group">
              <span className="w-10 h-10 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center text-lg">📸</span>
              <span className="text-sm font-medium text-gray-200">{card.instagram}</span>
            </a>
          )}
          {card.line && (
            <div className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors group">
              <span className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-lg">💬</span>
              <span className="text-sm font-medium text-gray-200">LINE: {card.line}</span>
            </div>
          )}
          {card.facebook && (
            <a href={card.facebook.startsWith('http') ? card.facebook : `https://facebook.com/${card.facebook}`} target="_blank" className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors group">
              <span className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-lg">📘</span>
              <span className="text-sm font-medium text-gray-200 truncate">Facebook</span>
            </a>
          )}
          {card.tiktok && (
            <a href={`https://tiktok.com/@${card.tiktok}`} target="_blank" className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors group">
              <span className="w-10 h-10 rounded-full bg-gray-700 text-white flex items-center justify-center text-lg">🎵</span>
              <span className="text-sm font-medium text-gray-200">{card.tiktok}</span>
            </a>
          )}
        </div>

        {/* 🌟 ปุ่มเซฟ (โชว์เฉพาะ User ที่ล็อกอินแล้ว เพราะ Guest เรา auto-save ให้แล้ว) */}
        {currentUser && (
          <button 
              onClick={handleSave} 
              disabled={isSaving}
              className={`w-full text-white py-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 mb-4 ${viewMode === 'party' ? 'bg-pink-600 hover:bg-pink-500' : 'bg-blue-600 hover:bg-blue-500'} ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>กำลังบันทึก...</span>
                </>
            ) : (
                <span>บันทึกเข้ากระเป๋าถาวร 📥</span>
            )}
          </button>
        )}
        
        <Link href="/" className="block text-gray-500 text-xs hover:text-white transition mt-2">MEcard Platform</Link>
      </div>

      {/* 🚀 เมนูด้านล่างสุด (Sticky Bottom) สำหรับชี้ทางผู้ใช้งาน */}
      <div className="fixed bottom-0 left-0 w-full bg-[#111] p-4 border-t border-gray-800 flex gap-3 justify-center z-50">
        {currentUser ? (
          /* 🟢 เมนูสำหรับคนที่ Login แล้ว (User) */
          <>
            <Link 
              href="/dashboard" 
              className="flex-1 bg-gray-800 text-gray-200 text-center py-3.5 rounded-xl font-bold hover:bg-gray-700 transition"
            >
              นามบัตรของฉัน
            </Link>
            <Link 
              href="/exchange?tab=inbox" 
              className="flex-1 bg-blue-600 text-white text-center py-3.5 rounded-xl font-bold hover:bg-blue-500 transition"
            >
              เปิดกระเป๋า (Wallet)
            </Link>
          </>
        ) : (
          /* 🟡 เมนูสำหรับคนยังไม่ Login (Guest) */
          <>
            <Link 
              href="/login?redirect=/create" 
              className="flex-1 bg-white text-black text-center py-3.5 rounded-xl font-bold hover:bg-gray-200 transition"
            >
              สร้างนามบัตรของคุณ
            </Link>
            <Link 
              href="/guest" 
              className="flex-1 bg-gray-800 text-blue-400 border border-blue-900/50 text-center py-3.5 rounded-xl font-bold hover:bg-gray-700 transition"
            >
              ไปหน้า Guest
            </Link>
          </>
        )}
      </div>

    </div>
  );
}

export default function ViewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>}>
      <CardViewer />
    </Suspense>
  );
}