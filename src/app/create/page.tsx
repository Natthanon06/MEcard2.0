"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { TEXT } from "@/constants/text";

const TEMPLATES = [
  { id: "modern-dark", name: "Modern Dark", bgClass: "bg-gradient-to-br from-slate-800 via-gray-900 to-black", previewColor: "bg-slate-900" },
  { id: "minimal-white", name: "Minimal White", bgClass: "bg-white border border-gray-200", previewColor: "bg-white border border-gray-200" },
  { id: "corporate-blue", name: "Corporate Blue", bgClass: "bg-gradient-to-r from-blue-700 to-blue-900", previewColor: "bg-blue-800" },
  { id: "luxury-gold", name: "Luxury Gold", bgClass: "bg-gradient-to-br from-neutral-900 via-stone-800 to-stone-900", previewColor: "bg-stone-900 border border-amber-500/30" }
];

export default function Step1Theme() {
  const router = useRouter();
  const { lang } = useLanguage(); 
  const [templateId, setTemplateId] = useState("modern-dark");

  useEffect(() => {
    const saved = localStorage.getItem("draftCard");
    if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.templateId) setTemplateId(parsed.templateId);
    }
  }, []);  //ดูเพิ่ม

  const handleNext = () => {
    const saved = JSON.parse(localStorage.getItem("draftCard") || "{}");
    localStorage.setItem("draftCard", JSON.stringify({ ...saved, templateId }));
    router.push("/create/platforms");
  };

  return (
    <> {/* ✅ ไม่ต้องมี div ครอบ หรือใช้ div class="flex flex-col h-full" ก็ได้ */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{TEXT.create_header_step1[lang]}</h2>
              <p className="text-gray-500 text-sm mt-1">{TEXT.create_desc_step1[lang]}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
          {TEMPLATES.map((t) => (
              <button 
                  key={t.id} 
                  onClick={() => setTemplateId(t.id)} 
                  className={`relative aspect-[9/16] rounded-2xl border-4 transition-all duration-300 overflow-hidden group shadow-sm ${templateId === t.id ? 'border-purple-600 ring-2 ring-purple-100 scale-[1.02] z-10' : 'border-transparent hover:border-gray-100 bg-gray-50'}`}
              >
              <div className={`w-full h-full ${t.previewColor} flex flex-col items-center justify-center p-2 opacity-90 transition-opacity group-hover:opacity-100`}>
                  <div className="w-10 h-10 rounded-full bg-white/20 mb-2 backdrop-blur-sm"></div>
                  <div className="w-14 h-1.5 rounded-full bg-white/10 backdrop-blur-sm"></div>
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-white py-2 text-center text-[10px] font-bold text-gray-600 border-t border-gray-100">{t.name}</div>
              {templateId === t.id && (
                  <div className="absolute top-2 right-2 bg-purple-600 text-white rounded-full p-1 shadow-md animate-in zoom-in">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
              )}
              </button>
          ))}
          </div>
      </div>
      <div className="p-6 bg-white border-t border-gray-50 flex gap-3 mt-auto">
           <button disabled className="w-14 h-14 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-300 cursor-not-allowed">←</button>
          <button onClick={handleNext} className="flex-1 h-14 bg-black text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg shadow-gray-200">{TEXT.btn_next[lang]} </button>
      </div>
    </>
  );
}