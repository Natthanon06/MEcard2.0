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
  const [isSaving, setIsSaving] = useState(false); // เพิ่มสถานะกำลังบันทึก

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) setCurrentUser(JSON.parse(userStr));

    const mode = searchParams.get("mode") || "work";
    setViewMode(mode);

    // สร้างข้อมูลการ์ดจาก URL Params
    const data = {
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

    // (Optional) Logic เดิม: พยายามหารูปจากเครื่องตัวเองเผื่อ URL ไม่มี
    // แต่ในระบบจริงควรส่ง URL รูปมาใน QR Code ให้ครบถ้วน
    if (data.fullName && !data.profileImage) {
        const savedCards = JSON.parse(localStorage.getItem("savedCards") || "[]");
        const localMatch = savedCards.find((c: any) => c.fullName === data.fullName);
        if (localMatch && localMatch.profileImage) {
          data.profileImage = localMatch.profileImage; 
        }
    }
    
    setCard(data);
  }, [searchParams]);

  // 🚀 ฟังก์ชันบันทึกเข้า Database (API)
  const handleSave = async () => {
    if (!currentUser) {
      if(confirm("กรุณาเข้าสู่ระบบก่อนบันทึกนามบัตร")) router.push("/login");
      return;
    }

    setIsSaving(true);

    try {
        const res = await fetch("/api/inbox", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userEmail: currentUser.email, // บันทึกเข้า Inbox ของเรา
                cardData: card // ข้อมูลการ์ดทั้งหมด
            })
        });

        const result = await res.json();

        if (res.ok) {
            alert("บันทึกสำเร็จ! ✅");
            router.push("/exchange?tab=inbox"); // เด้งไปหน้า Inbox
        } else {
            // ถ้า Error (เช่น ซ้ำ) ให้แจ้งเตือน
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
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-500 ${viewMode === 'party' ? 'bg-gradient-to-br from-purple-900 via-gray-900 to-black' : 'bg-black'}`}>
      
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

          {/* ข้อมูล Party */}
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

        <button 
            onClick={handleSave} 
            disabled={isSaving}
            className={`w-full text-white py-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${viewMode === 'party' ? 'bg-pink-600 hover:bg-pink-500' : 'bg-blue-600 hover:bg-blue-500'} ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>กำลังบันทึก...</span>
              </>
          ) : (
              <span>บันทึกเก็บไว้ 📥</span>
          )}
        </button>
        
        <Link href="/" className="block text-gray-500 text-xs hover:text-white transition mt-6">MEcard Platform</Link>
      </div>
    </div>
  );
}

export default function ViewPage() {
  return (
    <Suspense fallback={<div className="text-white text-center pt-20">Loading...</div>}>
      <CardViewer />
    </Suspense>
  );
}