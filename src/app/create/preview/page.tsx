"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { TEXT } from "@/constants/text";

// ธีมการ์ด (Templates)
const TEMPLATES: any = {
  "modern-dark": { bgClass: "bg-gradient-to-br from-slate-800 via-gray-900 to-black", textColor: "text-white" },
  "minimal-white": { bgClass: "bg-white border border-gray-200", textColor: "text-gray-900" },
  "corporate-blue": { bgClass: "bg-gradient-to-r from-blue-700 to-blue-900", textColor: "text-white" },
  "luxury-gold": { bgClass: "bg-gradient-to-br from-neutral-900 via-stone-800 to-stone-900", textColor: "text-amber-50" }
};

// ไอคอน (Icons)
const ICONS: any = { 
  phoneNumber: '📞', 
  email: '✉️', 
  facebook: '📘', 
  instagram: '📸', 
  line: '💬', 
  tiktok: '🎵', 
  website: '🌐' 
};

export default function Step5Preview() {
  const router = useRouter();
  const { lang } = useLanguage(); 
  const [data, setData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false); // เพิ่มสถานะกำลังบันทึก

  useEffect(() => {
    // ดึงข้อมูล Draft จากขั้นตอนก่อนหน้ามาแสดงตัวอย่าง
    const saved = localStorage.getItem("draftCard");
    if (saved) setData(JSON.parse(saved));
  }, []);

  const handleSave = async () => {
    // 1. ตรวจสอบข้อมูลเบื้องต้น
    if (!data?.fullName) return alert(TEXT.alert_incomplete[lang]);

    // 2. ตรวจสอบสถานะการ Login
    const userStr = localStorage.getItem("currentUser");
    if (!userStr) { 
        if(confirm(TEXT.alert_login_save[lang])) router.push("/login"); 
        return; 
    }
    const currentUser = JSON.parse(userStr);

    setIsSaving(true); // เริ่มโหลด

    // 3. เตรียมข้อมูลที่จะส่งไป MongoDB
    const cardPayload = {
        ownerEmail: currentUser.email, // ผูกกับ User คนนี้
        fullName: data.fullName,
        position: data.position,
        profileImage: data.profileImage, // Base64 หรือ URL
        templateId: data.templateId || "modern-dark",

        // ข้อมูลช่องทางติดต่อ (ถ้าไม่มีให้ส่งเป็นค่าว่าง หรือ null)
        phoneNumber: data.phoneNumber || "",
        email: data.email || "", // อีเมลที่โชว์บนการ์ด
        facebook: data.facebook || "",
        instagram: data.instagram || "",
        line: data.line || "",
        tiktok: data.tiktok || "",
        website: data.website || ""
    };

    try {
        // 4. ส่งข้อมูลไปที่ API (MongoDB) 🚀
        const res = await fetch("/api/cards", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cardPayload),
        });

        const result = await res.json();

        if (res.ok) {
            // ✅ บันทึกสำเร็จ
            localStorage.removeItem("draftCard"); // ลบแบบร่างทิ้ง
            alert(TEXT.alert_success[lang]); // แจ้งเตือน
            router.push("/profile"); // ไปหน้า Profile
        } else {
            // ❌ บันทึกไม่ผ่าน
            alert(`Error: ${result.error || "บันทึกไม่สำเร็จ"}`);
        }

    } catch (error) {
        console.error("Save Error:", error);
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อ Server");
    } finally {
        setIsSaving(false); // หยุดโหลด
    }
  };

  if (!data) return <div className="p-10 text-center">กำลังโหลดข้อมูล...</div>;

  const theme = TEMPLATES[data.templateId] || TEMPLATES["modern-dark"];
  const platforms = data.selectedPlatforms || [];

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 pb-6 flex justify-center items-center bg-gray-50/30">
          
          <div className="text-center w-full mb-2 lg:hidden">
                <h2 className="text-2xl font-bold text-gray-900">{TEXT.create_header_step5[lang]}</h2>
                <p className="text-gray-500 text-sm mt-1 mb-4">{TEXT.create_desc_step5[lang]}</p>
          </div>

          {/* --- ตัวอย่างการ์ด --- */}
          <div className={`w-full max-w-[280px] aspect-[9/16] rounded-3xl shadow-2xl overflow-hidden relative flex flex-col items-center pt-10 pb-6 px-5 ${theme.bgClass} ${theme.textColor}`}>
              
              {/* รูปโปรไฟล์ */}
              <div className="w-20 h-20 rounded-full border-2 border-white/20 shadow-xl overflow-hidden mb-3 shrink-0">
                  {data.profileImage ? (
                    <img src={data.profileImage} className="w-full h-full object-cover" alt="Profile" />
                  ) : (
                    <div className="w-full h-full bg-white/10 flex items-center justify-center text-2xl font-bold">
                        {data.fullName?.charAt(0)}
                    </div>
                  )}
              </div>

              {/* ชื่อและตำแหน่ง */}
              <div className="text-center mb-6 w-full">
                  <h3 className="text-xl font-bold truncate">{data.fullName || TEXT.default_name[lang]}</h3>
                  <p className="text-xs opacity-80 mt-1 truncate">{data.position || TEXT.default_bio[lang]}</p>
              </div>

              {/* รายการ Social Media */}
              <div className="w-full space-y-2 overflow-y-auto no-scrollbar flex-1">
                  {platforms.map((pid: string) => {
                    if (!data[pid]) return null;
                    return (
                        <div key={pid} className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm py-2.5 px-3 rounded-lg flex items-center gap-3 transition-all cursor-default">
                            <span className="text-lg">{ICONS[pid]}</span>
                            <span className="text-xs font-medium truncate">{data[pid]}</span>
                        </div>
                    )
                  })}
              </div>

          </div>
      </div>

      {/* --- ปุ่ม Action ด้านล่าง --- */}
      <div className="p-6 bg-white border-t border-gray-50 flex gap-3 mt-auto">
          <button 
            onClick={() => router.back()} 
            disabled={isSaving}
            className="w-14 h-14 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition active:scale-95 disabled:opacity-50"
          >
            ←
          </button>
          
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="flex-1 h-14 bg-purple-600 text-white rounded-2xl font-bold text-lg hover:bg-purple-700 transition-all active:scale-[0.98] shadow-lg shadow-purple-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
             {isSaving ? (
               <>
                 <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                 กำลังบันทึก...
               </>
             ) : (
               TEXT.btn_save[lang]
             )}
          </button>
      </div>
    </>
  );
}