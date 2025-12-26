"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { TEXT } from "@/constants/text";

const AVAILABLE_PLATFORMS = [
  { id: 'phoneNumber', labelKey: 'plat_phone', icon: '📞' },
  { id: 'email', labelKey: 'plat_email', icon: '✉️' },
  { id: 'facebook', labelKey: 'plat_facebook', icon: '📘' },
  { id: 'instagram', labelKey: 'plat_instagram', icon: '📸' },
  { id: 'line', labelKey: 'plat_line', icon: '💬' },
  { id: 'tiktok', labelKey: 'plat_tiktok', icon: '🎵' },
  { id: 'website', labelKey: 'plat_website', icon: '🌐' },
];

export default function Step2Platforms() {
  const router = useRouter();
  const { lang } = useLanguage(); 
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['phoneNumber', 'email']);

  useEffect(() => {
    const saved = localStorage.getItem("draftCard");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.selectedPlatforms) setSelectedPlatforms(parsed.selectedPlatforms);
    }
  }, []);

  const togglePlatform = (id: string) => {
    if (selectedPlatforms.includes(id)) {
      setSelectedPlatforms(prev => prev.filter(p => p !== id));
    } else {
      setSelectedPlatforms(prev => [...prev, id]);
    }
  };

  const handleNext = () => {
    const saved = JSON.parse(localStorage.getItem("draftCard") || "{}");
    localStorage.setItem("draftCard", JSON.stringify({ ...saved, selectedPlatforms }));
    router.push("/create/links");
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{TEXT.create_header_step2[lang]}</h2>
              <p className="text-gray-500 text-sm mt-1">{TEXT.create_desc_step2[lang]}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
          {AVAILABLE_PLATFORMS.map((p) => {
              const isSelected = selectedPlatforms.includes(p.id);
              // @ts-ignore
              const label = TEXT[p.labelKey][lang];
              return (
              <button key={p.id} onClick={() => togglePlatform(p.id)} className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all active:scale-95 duration-200 ${isSelected ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-md' : 'border-gray-100 bg-white text-gray-400 hover:bg-gray-50'}`}>
                  <span className={`text-3xl mb-2 transition-transform ${isSelected ? 'scale-110 drop-shadow-sm' : ''}`}>{p.icon}</span>
                  <span className="font-bold text-xs">{label}</span>
              </button>
              )
          })}
          </div>
      </div>
      <div className="p-6 bg-white border-t border-gray-50 flex gap-3 mt-auto">
          <button onClick={() => router.back()} className="w-14 h-14 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition active:scale-95">←</button>
          <button onClick={handleNext} className="flex-1 h-14 bg-black text-white rounded-2xl font-bold text-lg hover:bg-gray-900 transition-all active:scale-[0.98] shadow-lg shadow-gray-200">{TEXT.btn_next[lang]} </button>
      </div>
    </>
  );
}