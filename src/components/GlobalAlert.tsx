// src/components/GlobalAlert.tsx
"use client";

import { useState, useEffect, useRef } from "react";
// ไม่ต้องใช้ useRouter แล้วก็ได้ครับ เพราะเราจะเช็คแบบ Real-time แทน

export default function GlobalAlert() {
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const [showNotiBox, setShowNotiBox] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const notifiedHistory = useRef<Set<number>>(new Set());
  
  // State สำหรับเก็บ User ปัจจุบัน
  const [currentUser, setCurrentUser] = useState<any>(null);

  // ✅ แก้ไขจุดที่ 1: เช็คสถานะ Login ตลอดเวลา (ทุก 1 วินาที)
  // เพื่อให้เวลากด Login/Logout ปุ่มจะมา/หายทันที โดยไม่ต้องรีเฟรช
  useEffect(() => {
    const checkLoginStatus = () => {
        const userStr = localStorage.getItem("currentUser");
        
        if (userStr) {
            const user = JSON.parse(userStr);
            // เช็คว่า User เปลี่ยนคนไหม? หรือเพิ่ง Login เข้ามา?
            setCurrentUser((prev: any) => {
                if (prev?.email !== user.email) return user;
                return prev;
            });
        } else {
            // ถ้าไม่มี User ใน LocalStorage (คือ Logout แล้ว) ให้เคลียร์ค่า
            setCurrentUser(null);
            setActiveAlerts([]); // เคลียร์การแจ้งเตือนด้วย
        }
    };

    // เช็คทันทีตอนเริ่ม
    checkLoginStatus();

    // และเช็คซ้ำทุกๆ 1 วินาที
    const interval = setInterval(checkLoginStatus, 1000);
    
    // สร้างเสียงรอไว้
    audioRef.current = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");

    return () => clearInterval(interval);
  }, []);

  // ✅ แก้ไขจุดที่ 2: โหลดประวัติการแจ้งเตือน (ทำงานเมื่อ currentUser เปลี่ยน)
  useEffect(() => {
    if (!currentUser) return;

    const alertsKey = `meeting_alerts_${currentUser.email}`;
    const savedAlerts = JSON.parse(localStorage.getItem(alertsKey) || "[]");
    
    if (savedAlerts.length > 0) {
        setActiveAlerts(savedAlerts);
        savedAlerts.forEach((a: any) => notifiedHistory.current.add(a.id));
    }
  }, [currentUser]);

  // ✅ แก้ไขจุดที่ 3: บันทึกเมื่อมีการเปลี่ยนแปลง (เหมือนเดิม)
  useEffect(() => {
    if (currentUser) {
        localStorage.setItem(`meeting_alerts_${currentUser.email}`, JSON.stringify(activeAlerts));
    }
  }, [activeAlerts, currentUser]);

  // ✅ แก้ไขจุดที่ 4: เช็คเวลานัดหมาย (เหมือนเดิม)
  useEffect(() => {
    const checkTime = () => {
        if (!currentUser) return; // ถ้าไม่ได้ Login ก็ไม่ต้องเช็ค

        const meetingKey = `meetings_${currentUser.email}`;
        const savedMeetings = JSON.parse(localStorage.getItem(meetingKey) || "[]");
        if (savedMeetings.length === 0) return;

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
        const currentDay = String(now.getDate()).padStart(2, '0');
        const currentDate = `${currentYear}-${currentMonth}-${currentDay}`;

        const currentHour = String(now.getHours()).padStart(2, '0');
        const currentMinute = String(now.getMinutes()).padStart(2, '0');
        const currentTime = `${currentHour}:${currentMinute}`;

        // หานัดหมายที่ถึงเวลา + ยังไม่ได้รับทราบ
        const dueMeetings = savedMeetings.filter((m: any) => 
            m.date === currentDate && 
            m.time === currentTime && 
            !m.acknowledged
        );

        if (dueMeetings.length > 0) {
            const newAlerts = dueMeetings.filter((dm: any) => !notifiedHistory.current.has(dm.id));
            
            if (newAlerts.length > 0) {
                newAlerts.forEach((a: any) => notifiedHistory.current.add(a.id));
                setActiveAlerts(prev => [...prev, ...newAlerts]);
                setShowNotiBox(true); // เปิดกล่องอัตโนมัติ
                try { audioRef.current?.play(); } catch(e) {}
            }
        }
    };

    const interval = setInterval(checkTime, 2000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // ฟังก์ชันจัดการ (เหมือนเดิม)
  const removeHistory = (id: number) => {
    setActiveAlerts(prev => prev.filter(a => a.id !== id));
    if (activeAlerts.length <= 1) setShowNotiBox(false);
  };

  const acknowledgeMeeting = (id: number) => {
    if (!currentUser) return;
    
    // อัปเดตใน meetings หลัก
    const meetingKey = `meetings_${currentUser.email}`;
    const allMeetings = JSON.parse(localStorage.getItem(meetingKey) || "[]");
    const updatedMeetings = allMeetings.map((m: any) => m.id === id ? { ...m, acknowledged: true } : m);
    localStorage.setItem(meetingKey, JSON.stringify(updatedMeetings));

    // อัปเดตใน alerts
    setActiveAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  // ⚠️ สำคัญ: ถ้าไม่มี User ให้ return null (ซ่อนปุ่ม)
  if (!currentUser) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
        {/* ปุ่มกระดิ่งลอย */}
        <div className="relative">
            <button 
                onClick={() => setShowNotiBox(!showNotiBox)}
                className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all border-4 border-white ${activeAlerts.some(a => !a.acknowledged) ? 'bg-red-500 text-white animate-bounce' : 'bg-gray-800 text-white hover:bg-black'}`}
            >
                <span className="text-2xl">🔔</span>
                {activeAlerts.filter(a => !a.acknowledged).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
                        {activeAlerts.filter(a => !a.acknowledged).length}
                    </span>
                )}
            </button>

            {/* กล่องข้อความ */}
            {showNotiBox && (
                <div className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-5 fade-in">
                    <div className="px-4 py-3 bg-gray-900 text-white flex justify-between items-center">
                        <span className="font-bold">การแจ้งเตือน</span>
                        <button onClick={() => setShowNotiBox(false)} className="text-gray-400 hover:text-white">✕</button>
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto bg-gray-50">
                        {activeAlerts.length > 0 ? (
                            activeAlerts.map((alert) => (
                                <div key={alert.id} className={`p-4 border-b border-gray-100 ${alert.acknowledged ? 'bg-white opacity-60' : 'bg-red-50'}`}>
                                    <h4 className="font-bold text-gray-900 text-sm">
                                        {alert.acknowledged ? '✅ รับทราบแล้ว' : '⏰ ถึงเวลานัดหมาย!'}
                                    </h4>
                                    <p className="text-gray-800 text-sm mt-1">{alert.title}</p>
                                    <p className="text-gray-500 text-xs mt-1">เวลา: {alert.time} น. กับ {alert.partnerName}</p>

                                    {!alert.acknowledged ? (
                                        <button onClick={() => acknowledgeMeeting(alert.id)} className="mt-2 w-full py-1.5 bg-blue-600 text-white text-xs rounded shadow-sm hover:bg-blue-700">✓ รับทราบ</button>
                                    ) : (
                                        <button onClick={() => removeHistory(alert.id)} className="mt-2 w-full py-1.5 bg-gray-200 text-gray-600 text-xs rounded hover:bg-red-100 hover:text-red-500">🗑 ลบประวัติ</button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="p-6 text-center text-gray-400 text-sm">ไม่มีการแจ้งเตือน</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}