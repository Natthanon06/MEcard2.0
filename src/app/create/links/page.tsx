"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { TEXT } from "@/constants/text";

const PLATFORM_CONFIG: any = {
  phoneNumber: { labelKey: 'plat_phone', icon: '📞', phKey: 'ph_phone' },
  email: { labelKey: 'plat_email', icon: '✉️', phKey: 'ph_email' },
  facebook: { labelKey: 'plat_facebook', icon: '📘', phKey: 'ph_fb' },
  instagram: { labelKey: 'plat_instagram', icon: '📸', phKey: 'ph_ig' },
  line: { labelKey: 'plat_line', icon: '💬', phKey: 'ph_line' },
  tiktok: { labelKey: 'plat_tiktok', icon: '🎵', phKey: 'ph_tiktok' },
  website: { labelKey: 'plat_website', icon: '🌐', phKey: 'ph_web' },
};

export default function Step3Links() {
  const router = useRouter();
  const { lang } = useLanguage(); 
  const [data, setData] = useState<any>({});
  const [platforms, setPlatforms] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("draftCard");
    if (saved) {
      const parsed = JSON.parse(saved);
      setData(parsed);
      setPlatforms(parsed.selectedPlatforms || []);
    }
  }, []);

  const handleChange = (id: string, value: string) => {
    setData((prev: any) => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    const saved = JSON.parse(localStorage.getItem("draftCard") || "{}");
    localStorage.setItem("draftCard", JSON.stringify({ ...saved, ...data }));
    router.push("/create/profile");
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{TEXT.create_header_step3[lang]}</h2>
              <p className="text-gray-500 text-sm mt-1">{TEXT.create_desc_step3[lang]}</p>
          </div>
          <div className="space-y-4 pb-6">
              {platforms.map((pid) => {
              const config = PLATFORM_CONFIG[pid];
              // @ts-ignore
              const placeholder = TEXT[config.phKey][lang];

              return (
                  <div key={pid} className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xl opacity-70">{config.icon}</div>
                  <input 
                      type="text" 
                      value={data[pid] || ""} 
                      onChange={(e) => handleChange(pid, e.target.value)} 
                      placeholder={placeholder} 
                      className="block w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-purple-500 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 font-medium" 
                  />
                  </div>
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