// src/app/scan/page.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import jsQR from 'jsqr'; 

export default function ScanPage() {
  const router = useRouter();
  const [scannedCard, setScannedCard] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const lastScanTime = useRef<number>(0);
  const isProcessing = useRef<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    } else {
      router.push("/login");
    }
  }, [router]);

  const processResult = (rawData: string) => {
    const now = Date.now();
    if (isProcessing.current || (now - lastScanTime.current < 2000)) return;

    // ถ้าเป็น Link ให้ดีดไปหน้า View
    if (rawData && rawData.includes("/view?")) {
        lastScanTime.current = now;
        isProcessing.current = true;
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]); 
        window.location.href = rawData;
        return;
    }

    // ถ้าเป็น JSON (แบบเก่า) ให้โชว์ Modal
    try {
       if (rawData.includes("{")) {
         const data = JSON.parse(rawData);
         if (data.n || data.fullName) {
            lastScanTime.current = now;
            isProcessing.current = true;
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]); 
            setScannedCard(data); 
            isProcessing.current = false;
         }
       }
    } catch (e) {}
  };

  const handleCameraScan = (result: IDetectedBarcode[]) => {
    if (result && result.length > 0 && result[0].rawValue) {
      processResult(result[0].rawValue);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (context) {
          canvas.width = image.width;
          canvas.height = image.height;
          context.drawImage(image, 0, 0);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);

          if (code) {
            processResult(code.data); 
          } else {
            alert("❌ ไม่พบ QR Code หรือรูปไม่ชัดเจน");
          }
        }
      };
      image.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const closeModal = () => {
    setScannedCard(null);
    lastScanTime.current = 0;
  };

  const saveCard = () => {
    if (!currentUser) return;

    // ✨ สูตรลับ: เช็คว่ามีรูปต้นฉบับในเครื่องไหม
    let recoveredImage = scannedCard.img || "";
    if (!recoveredImage) {
        const savedCards = JSON.parse(localStorage.getItem("savedCards") || "[]");
        const nameToCheck = scannedCard.n || scannedCard.fullName;
        const localMatch = savedCards.find((c: any) => c.fullName === nameToCheck);
        if (localMatch && localMatch.profileImage) {
            recoveredImage = localMatch.profileImage;
        }
    }

    const newCard = {
      id: Date.now(), 
      fullName: scannedCard.n || scannedCard.fullName,
      position: scannedCard.p || scannedCard.position,
      phoneNumber: scannedCard.t || scannedCard.phoneNumber,
      email: scannedCard.e || scannedCard.email,
      facebook: scannedCard.f || scannedCard.facebook || "",
      instagram: scannedCard.i || scannedCard.instagram || "",
      
      profileImage: recoveredImage, // ใช้รูปที่กู้มาได้
      templateId: scannedCard.tpl || 'modern-dark',
      
      receivedDate: new Date().toISOString(),
      receivedFrom: "QR Scan"
    };

    const inboxKey = `inbox_${currentUser.email}`;
    let oldInbox = JSON.parse(localStorage.getItem(inboxKey) || "[]");

    // บันทึกต่อท้ายเสมอ
    localStorage.setItem(inboxKey, JSON.stringify([...oldInbox, newCard]));
    
    // alert("บันทึกเรียบร้อย!");
    window.location.href = "/exchange?tab=inbox";
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative">
      <div className="absolute top-10 w-full text-center z-10 px-4">
        <h1 className="text-2xl font-bold">สแกน QR Code</h1>
        <p className="text-gray-400 text-sm">ส่องกล้อง หรือ อัปโหลดรูปภาพ</p>
      </div>

      {!scannedCard && (
        <div className="flex flex-col items-center gap-6 w-full max-w-sm px-4">
          <div className="w-full aspect-square bg-gray-900 rounded-3xl overflow-hidden border-2 border-gray-700 relative z-0 shadow-2xl">
            <Scanner 
              onScan={handleCameraScan}
              scanDelay={500}
              formats={['qr_code']}
              components={{ audio: false, finder: false }}
              constraints={{ facingMode: 'environment' }}
            />
            <div className="absolute top-0 left-0 w-full h-1 bg-green-500 shadow-[0_0_20px_#22c55e] animate-[scan_2s_linear_infinite] opacity-80 z-20"></div>
            <div className="absolute inset-10 border-2 border-white/20 rounded-xl z-10 pointer-events-none"></div>
          </div>

          <div className="w-full">
            <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileUpload} className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="w-full bg-white/10 hover:bg-white/20 border border-white/20 py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span className="font-medium">เลือกรูปจากอัลบั้ม</span>
            </button>
          </div>
        </div>
      )}

      {scannedCard && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in zoom-in-95">
          <div className="bg-white text-black w-full max-w-xs rounded-3xl p-6 text-center shadow-2xl relative">
            <button onClick={closeModal} className="absolute top-3 right-3 text-gray-400 hover:text-black">✕</button>
            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white shadow">
               <span className="flex items-center justify-center h-full text-2xl font-bold">{(scannedCard.n || scannedCard.fullName || "?").charAt(0)}</span>
            </div>
            <h2 className="text-xl font-bold">{scannedCard.n || scannedCard.fullName}</h2>
            <p className="text-gray-500 text-sm mb-6">{scannedCard.p || scannedCard.position}</p>
            <button onClick={saveCard} className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition">
              บันทึก / อัปเดต 📥
            </button>
          </div>
        </div>
      )}

      <div className="absolute bottom-10 z-10">
        <Link href="/exchange" className="px-6 py-3 bg-white/10 rounded-full text-sm hover:bg-white/20 transition">ยกเลิก / กลับ</Link>
      </div>
      <style jsx>{`@keyframes scan { 0% { top: 0%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; } }`}</style>
    </div>
  );
}