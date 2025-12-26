// src/app/exchange/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import QRCode from "react-qr-code";
// ✅ Import Hook และ TEXT
import { useLanguage } from "@/context/LanguageContext";
import { TEXT } from "@/constants/text";

const TEMPLATES: any = {
  "modern-dark": { bg: "bg-slate-900", text: "text-white", sub: "text-gray-400", accent: "text-blue-400" },
  "minimal-white": { bg: "bg-white border border-gray-200", text: "text-gray-900", sub: "text-gray-500", accent: "text-blue-600" },
  "corporate-blue": { bg: "bg-blue-900", text: "text-white", sub: "text-blue-200", accent: "text-blue-300" },
  "luxury-gold": { bg: "bg-neutral-900", text: "text-amber-50", sub: "text-neutral-400", accent: "text-amber-400" }
};

export default function ExchangePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // ✅ ดึงค่าภาษา (lang) มาใช้
  const { lang } = useLanguage(); 
  
  const [activeTab, setActiveTab] = useState<'myqr' | 'inbox'>('myqr');
  const [myCards, setMyCards] = useState<any[]>([]);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [inboxCards, setInboxCards] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [shareMode, setShareMode] = useState<'work' | 'party'>('work');

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (!userStr) { router.push("/login"); return; }
    const user = JSON.parse(userStr);
    setCurrentUser(user);

    const savedCards = JSON.parse(localStorage.getItem("savedCards") || "[]");
    const mine = savedCards.filter((c: any) => c.ownerEmail === user.email);
    setMyCards(mine);
    if (mine.length > 0) setSelectedCard(mine[0]);

    const inboxKey = `inbox_${user.email}`;
    const inbox = JSON.parse(localStorage.getItem(inboxKey) || "[]");
    setInboxCards(inbox.reverse());

    if (searchParams.get('tab') === 'inbox') {
      setActiveTab('inbox');
    }
  }, [router, searchParams]);

  const deleteInboxCard = (targetId: number) => {
    if (!confirm(TEXT.confirmDelete[lang])) return; 
    const inboxKey = `inbox_${currentUser.email}`;
    const rawInbox = JSON.parse(localStorage.getItem(inboxKey) || "[]");
    const newInbox = rawInbox.filter((c: any) => c.id !== targetId);
    localStorage.setItem(inboxKey, JSON.stringify(newInbox)); 
    setInboxCards([...newInbox].reverse()); 
  };

  const getQRData = (card: any) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    
    let params: any = {
      n: card.fullName,
      img: (card.profileImage && card.profileImage.length < 500) ? card.profileImage : "", 
      tpl: card.templateId || 'modern-dark',
      mode: shareMode 
    };

    if (shareMode === 'work') {
      if (card.position) params.p = card.position;
      if (card.email) params.e = card.email;
      if (card.phoneNumber) params.t = card.phoneNumber;
      if (card.website) params.website = card.website;
    } else {
      params.p = "Let's Party! 🎉"; 
      if (card.facebook) params.f = card.facebook;
      if (card.instagram) params.i = card.instagram;
      if (card.line) params.line = card.line;
      if (card.tiktok) params.tiktok = card.tiktok;
    }

    const searchParams = new URLSearchParams(params);
    return `${baseUrl}/view?${searchParams.toString()}`;
  };

  // ✅ ฟังก์ชันแชร์ (Bluetooth / AirDrop)
  const handleNativeShare = async () => {
    if (!selectedCard) return;
    const shareUrl = getQRData(selectedCard);
    
    // ตรวจสอบว่า Browser รองรับการแชร์หรือไม่
    if (navigator.share) {
      try {
        await navigator.share({
          title: `MEcard: ${selectedCard.fullName}`,
          text: `${TEXT.share_text_prefix[lang]} (${shareMode === 'work' ? TEXT.mode_work[lang] : TEXT.mode_party[lang]})`,
          url: shareUrl,
        });
      } catch (error) {
        console.log('User cancelled or share failed:', error);
      }
    } else {
      // Fallback: ถ้าไม่รองรับให้ Copy Link แทน
      navigator.clipboard.writeText(shareUrl);
      alert(TEXT.copy_link_success[lang]);
    }
  };

  // Helper function to format URL for inbox links
  const formatUrl = (val: string, platform: string) => {
    if (!val) return "#";
    if (val.startsWith("http")) return val;
    switch (platform) {
      case "facebook": return `https://facebook.com/${val}`;
      case "instagram": return `https://instagram.com/${val}`;
      case "tiktok": return `https://tiktok.com/@${val}`;
      case "line": return `https://line.me/ti/p/~${val}`;
      case "website": return `https://${val}`;
      default: return val;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      
      {/* Header */}
      <div className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center w-full md:w-auto">
          <Link href="/profile" className="mr-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
             </svg>
          </Link>
          <h1 className="text-xl font-bold text-gray-800">{TEXT.exchange_header[lang]}</h1>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto justify-center">
          <button onClick={() => setActiveTab('myqr')} className={`flex-1 md:flex-none px-6 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'myqr' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>
            {TEXT.tab_myqr[lang]}
          </button>
          <button onClick={() => setActiveTab('inbox')} className={`flex-1 md:flex-none px-6 py-1.5 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${activeTab === 'inbox' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>
            {TEXT.tab_inbox[lang]} {inboxCards.length > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full ml-1">{inboxCards.length}</span>}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        
        {/* --- TAB 1: MY QR --- */}
        {activeTab === 'myqr' && (
          <div className="flex flex-col items-center space-y-6 animate-in fade-in">
            {myCards.length > 0 && selectedCard ? (
              <>
                <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 text-center w-full max-w-sm relative overflow-hidden transition-all duration-300">
                  
                  {/* Toggle Switch */}
                  <div className="flex justify-center mb-6">
                    <div className="bg-gray-100 p-1 rounded-full flex relative">
                      <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white shadow-sm rounded-full transition-all duration-300 ease-out ${shareMode === 'party' ? 'left-[calc(50%+2px)]' : 'left-1'}`}></div>
                      <button onClick={() => setShareMode('work')} className={`relative z-10 px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-300 flex items-center gap-1 ${shareMode === 'work' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
                        💼 {TEXT.mode_work[lang]}
                      </button>
                      <button onClick={() => setShareMode('party')} className={`relative z-10 px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-300 flex items-center gap-1 ${shareMode === 'party' ? 'text-pink-500' : 'text-gray-400 hover:text-gray-600'}`}>
                        🎉 {TEXT.mode_party[lang]}
                      </button>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-800">{selectedCard.fullName}</h2>
                  <p className={`text-sm mb-6 font-medium transition-colors ${shareMode === 'party' ? 'text-pink-500' : 'text-gray-500'}`}>
                    {shareMode === 'work' ? selectedCard.position : TEXT.card_position_party[lang]}
                  </p>
                  
                  {/* QR Code */}
                  <div className={`p-4 rounded-xl border-2 border-dashed inline-block mb-4 transition-all duration-300 ${shareMode === 'party' ? 'border-pink-200 bg-pink-50' : 'border-blue-100 bg-blue-50'}`}>
                    <QRCode value={getQRData(selectedCard)} size={220} level="M" fgColor={shareMode === 'party' ? '#db2777' : '#1e293b'} bgColor="transparent" />
                  </div>
                  
                  {/* คำอธิบาย */}
                  <p className="text-xs text-gray-400 mb-4">
                    {shareMode === 'work' ? TEXT.scan_hint_work[lang] : TEXT.scan_hint_party[lang]}
                  </p>

                  {/* ✅ ปุ่ม Share (Bluetooth / AirDrop) */}
                  <div className="w-full px-4">
                    <button 
                      onClick={handleNativeShare}
                      className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 ${shareMode === 'party' ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-pink-200' : 'bg-gray-900 shadow-gray-200 hover:bg-gray-800'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      <span>{TEXT.btn_share[lang]}</span>
                    </button>
                    <p className="text-[10px] text-gray-400 mt-2">
                        {TEXT.hint_share[lang]}
                    </p>
                  </div>

                </div>

                <div className="w-full max-w-sm space-y-2">
                  <p className="text-sm font-medium text-gray-500 ml-2">{TEXT.select_card_label[lang]}</p>
                  {myCards.map((card) => (
                    <button key={card.id} onClick={() => setSelectedCard(card)} className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${selectedCard.id === card.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">{card.fullName.charAt(0)}</div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-800">{card.fullName}</div>
                        <div className="text-xs text-gray-500">{card.position}</div>
                      </div>
                      {selectedCard.id === card.id && <span className="text-blue-500">✓</span>}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">{TEXT.no_card_title[lang]}</p>
                <Link href="/create" className="text-blue-600 underline">{TEXT.no_card_link[lang]}</Link>
              </div>
            )}
          </div>
        )}

        {/* --- TAB 2: INBOX --- */}
        {activeTab === 'inbox' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in">
            {inboxCards.length === 0 ? (
              <div className="col-span-full text-center py-20 text-gray-400">
                <div className="text-4xl mb-2">📭</div>
                <p>{TEXT.empty_inbox_title[lang]}</p>
                <Link href="/scan" className="text-blue-500 mt-2 inline-block">{TEXT.btn_scan[lang]}</Link>
              </div>
            ) : (
              inboxCards.map((card: any, idx: number) => {
                const theme = TEMPLATES[card.templateId] || TEMPLATES['modern-dark'];
                const isPartyCard = !card.phoneNumber && !card.email;

                return (
                  <div key={idx} className={`relative w-full aspect-[1.58/1] rounded-3xl shadow-lg overflow-hidden p-5 flex flex-col justify-between ${theme.bg} ${theme.text}`}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteInboxCard(card.id); }}
                      className="absolute top-3 right-3 z-20 w-7 h-7 flex items-center justify-center bg-black/20 hover:bg-red-500/80 rounded-full text-white/70 hover:text-white transition"
                    >✕</button>

                    <div className="z-10 mt-1">
                      <h3 className="text-2xl font-bold tracking-tight truncate">{card.fullName}</h3>
                      <p className={`text-xs font-semibold tracking-widest uppercase mt-0.5 ${theme.accent || 'text-blue-400'}`}>
                        {card.position || 'No Position'}
                      </p>
                    </div>

                    <div className="flex justify-between items-end z-10 mt-4">
                      {/* Action Links */}
                      <div className={`space-y-1 text-xs ${theme.sub} overflow-hidden w-full pr-14`}>
                        <div className="flex items-center gap-1.5 opacity-70">
                          <span>📅</span><span>{new Date(card.receivedDate).toLocaleDateString('th-TH')}</span>
                        </div>
                        
                        {card.phoneNumber && <a href={`tel:${card.phoneNumber}`} className="flex items-center gap-1.5 hover:underline hover:opacity-80 transition-all cursor-pointer"><span>📞</span>{card.phoneNumber}</a>}
                        {card.email && <a href={`mailto:${card.email}`} className="flex items-center gap-1.5 hover:underline hover:opacity-80 transition-all cursor-pointer"><span>✉️</span>{card.email}</a>}
                        {card.instagram && <a href={formatUrl(card.instagram, "instagram")} target="_blank" className="flex items-center gap-1.5 text-pink-400 hover:underline hover:text-pink-300 transition-all cursor-pointer"><span>📸</span>{card.instagram}</a>}
                        {card.facebook && <a href={formatUrl(card.facebook, "facebook")} target="_blank" className="flex items-center gap-1.5 text-blue-400 hover:underline hover:text-blue-300 transition-all cursor-pointer"><span>📘</span>Facebook</a>}
                        {card.line && <a href={formatUrl(card.line, "line")} target="_blank" className="flex items-center gap-1.5 text-green-400 hover:underline hover:text-green-300 transition-all cursor-pointer"><span>💬</span>LINE</a>}
                        {card.tiktok && <a href={formatUrl(card.tiktok, "tiktok")} target="_blank" className="flex items-center gap-1.5 hover:underline transition-all cursor-pointer"><span>🎵</span>TikTok</a>}
                        {card.website && <a href={formatUrl(card.website, "website")} target="_blank" className="flex items-center gap-1.5 hover:underline hover:text-white transition-all cursor-pointer"><span>🌐</span>Web</a>}
                      </div>

                      <div className="relative shrink-0 ml-2">
                        {card.profileImage ? (
                           <img src={card.profileImage} className="w-14 h-14 rounded-full border-2 border-white/10 shadow-lg object-cover" alt="Profile" />
                        ) : (
                           <div className="w-14 h-14 rounded-full bg-white/10 border-2 border-white/10 flex items-center justify-center text-xl font-bold shadow-lg">
                             {card.fullName?.charAt(0)}
                           </div>
                        )}
                        {isPartyCard && <div className="absolute -top-2 -right-2 text-[10px] bg-pink-500 text-white px-1.5 rounded-full shadow-sm">Party</div>}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>

      <Link href="/scan" className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center gap-2 z-50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
        <span className="font-bold pr-1">{TEXT.btn_scan[lang]}</span>
      </Link>
    </div>
  );
}