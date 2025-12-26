"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { TEXT } from "@/constants/text";

export default function Step4Profile() {
  const router = useRouter();
  const { lang } = useLanguage(); 
  const [fullName, setFullName] = useState("");
  const [position, setPosition] = useState("");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("draftCard");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.fullName) setFullName(parsed.fullName);
      if (parsed.position) setPosition(parsed.position);
      if (parsed.profileImage) setProfileImage(parsed.profileImage);
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) {
        alert("❌ Image too large! Please use image < 500KB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    const saved = JSON.parse(localStorage.getItem("draftCard") || "{}");
    localStorage.setItem("draftCard", JSON.stringify({ ...saved, fullName, position, profileImage }));
    router.push("/create/preview");
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{TEXT.create_header_step4[lang]}</h2>
              <p className="text-gray-500 text-sm mt-1">{TEXT.create_desc_step4[lang]}</p>
          </div>
          <div className="flex flex-col items-center gap-6 pb-6">
              <div className="relative group">
                  <div className="w-28 h-28 rounded-full bg-gray-100 overflow-hidden border-4 border-white shadow-md flex items-center justify-center">
                  {profileImage ? <img src={profileImage} className="w-full h-full object-cover" /> : <span className="text-3xl text-gray-300">👤</span>}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
              </div>

              <div className="w-full space-y-4">
                  <div>
                  <label className="text-xs font-bold text-gray-700 ml-1 uppercase">{TEXT.label_fullname[lang]}</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={TEXT.placeholder_fullname[lang]} className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-purple-500 outline-none text-sm text-gray-900 placeholder-gray-400 font-medium" />
                  </div>

                  <div>
                  <label className="text-xs font-bold text-gray-700 ml-1 uppercase">{TEXT.label_position[lang]}</label>
                  <textarea value={position} onChange={(e) => setPosition(e.target.value)} placeholder={TEXT.placeholder_position[lang]} maxLength={100} className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-purple-500 outline-none resize-none h-24 text-sm text-gray-900 placeholder-gray-400 font-medium" />
                  </div>
              </div>
          </div>
      </div>
      <div className="p-6 bg-white border-t border-gray-50 flex gap-3 mt-auto">
          <button onClick={() => router.back()} className="w-14 h-14 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition active:scale-95">←</button>
          <button onClick={handleNext} className="flex-1 h-14 bg-black text-white rounded-2xl font-bold text-lg hover:bg-gray-900 transition-all active:scale-[0.98] shadow-lg shadow-gray-200">{TEXT.btn_next[lang]} </button>
      </div>
    </>
  );
}