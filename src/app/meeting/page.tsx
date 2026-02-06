"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MeetingPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [contacts, setContacts] = useState<any[]>([]); 
  const [meetings, setMeetings] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]); // 🔔 State แจ้งเตือน
  const [showNotifDropdown, setShowNotifDropdown] = useState(false); // 🔔 State เปิด/ปิด Dropdown
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // ✅ 1. โหลดข้อมูลเมื่อเปิดหน้าเว็บ
  useEffect(() => {
    const initData = async () => {
      const userStr = localStorage.getItem("currentUser");
      if (!userStr) { router.push("/login"); return; }
      const user = JSON.parse(userStr);
      setCurrentUser(user);

      try {
        // 1.1 ดึงรายชื่อเพื่อน
        const inboxRes = await fetch(`/api/inbox?email=${user.email}`);
        const inboxData = await inboxRes.json();
        if (inboxData.success) {
            const mappedContacts = inboxData.data.map((item: any) => item.cardData);
            setContacts(mappedContacts);
        }

        // 1.2 ดึงรายการนัดหมาย
        fetchMeetings(user.email);

        // 🔔 1.3 ดึงการแจ้งเตือน
        const notifRes = await fetch(`/api/notifications?email=${user.email}`);
        const notifData = await notifRes.json();
        if (notifData.success) {
            setNotifications(notifData.data);
        }

      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initData();
  }, [router]);

  // ฟังก์ชันดึงนัดหมาย
  const fetchMeetings = async (email: string) => {
    const res = await fetch(`/api/meetings?email=${email}`);
    const data = await res.json();
    if (data.success) setMeetings(data.data);
  };

  // 🔔 ฟังก์ชันลบแจ้งเตือน
  const clearNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // กันไม่ให้ Dropdown ปิด
    try {
        // ลบใน Database
        await fetch(`/api/notifications?id=${id}`, { method: 'DELETE' });
        // อัปเดตหน้าจอทันที
        setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (error) {
        console.error("Delete notification failed");
    }
  };

  // ✅ 2. ฟังก์ชันสร้างนัดหมาย
  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time) return alert("กรุณากรอกข้อมูลให้ครบ");

    setIsSubmitting(true);

    const partner = contacts.find(c => c.email === partnerEmail) || { fullName: "ไม่ระบุ / นัดส่วนตัว" };
    
    try {
        const res = await fetch("/api/meetings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userEmail: currentUser.email,
                title,
                partnerName: partner.fullName || partner.name,
                partnerEmail,
                date,
                time
            })
        });

        if (res.ok) {
            alert("✅ สร้างนัดหมายสำเร็จ!");
            setIsOpen(false);
            setTitle(""); setDate(""); setTime(""); setPartnerEmail("");
            fetchMeetings(currentUser.email);
        } else {
            alert("สร้างนัดหมายไม่สำเร็จ");
        }
    } catch (error) {
        alert("เกิดข้อผิดพลาด");
    } finally {
        setIsSubmitting(false);
    }
  };

  // ✅ 3. ฟังก์ชันลบนัดหมาย
  const deleteMeeting = async (id: string) => {
    if(!confirm("ต้องการยกเลิกนัดหมายนี้ใช่ไหม?")) return;
    
    try {
        const res = await fetch(`/api/meetings?id=${id}`, { method: "DELETE" });
        if (res.ok) {
            setMeetings(prev => prev.filter(m => m._id !== id));
        } else {
            alert("ลบไม่สำเร็จ");
        }
    } catch (error) {
        alert("เกิดข้อผิดพลาด");
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-600 border-t-transparent"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      
      {/* Header (ปรับปรุงใหม่: มีปุ่มแจ้งเตือน) */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl hover:bg-gray-100 w-10 h-10 flex items-center justify-center rounded-full transition">⬅</Link>
            <h1 className="text-xl font-bold text-gray-800">📅 นัดหมาย</h1>
        </div>

        {/* 🔔 ส่วนแจ้งเตือน */}
        <div className="relative">
            <button onClick={() => setShowNotifDropdown(!showNotifDropdown)} className="relative p-2 rounded-full hover:bg-gray-100 transition">
                <span className="text-2xl">🔔</span>
                {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                        {notifications.length}
                    </span>
                )}
            </button>

            {/* Dropdown แจ้งเตือน */}
            {showNotifDropdown && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifDropdown(false)}></div> {/* Overlay ปิดเมื่อกดข้างนอก */}
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                            <span className="font-bold text-sm text-gray-700">การแจ้งเตือน</span>
                            <span className="text-xs text-gray-400">{notifications.length} รายการ</span>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-6 text-center text-gray-400 text-sm">
                                    <p>🔕 ไม่มีแจนเตือนใหม่</p>
                                </div>
                            ) : (
                                notifications.map((n) => (
                                    <div key={n._id} className="p-4 border-b border-gray-50 hover:bg-blue-50 flex justify-between items-start gap-3 transition-colors">
                                        <div className="text-sm text-gray-600 leading-snug">
                                            {n.message}
                                            <div className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString('th-TH')}</div>
                                        </div>
                                        <button onClick={(e) => clearNotification(n._id, e)} className="text-gray-300 hover:text-red-500 p-1">
                                            ✕
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
      </nav>

      <div className="max-w-xl mx-auto p-6">
        <button onClick={() => setIsOpen(true)} className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-purple-700 transition-all flex items-center justify-center gap-2 mb-8">
            <span>+</span> สร้างนัดหมายใหม่
        </button>

        <h2 className="font-bold text-gray-600 mb-4">นัดหมายที่กำลังจะถึง</h2>
        <div className="space-y-4">
            {meetings.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                    <p>ยังไม่มีนัดหมายเร็วๆ นี้</p>
                </div>
            )}
            
            {meetings.map((m) => (
                <div key={m._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center group hover:shadow-md transition-shadow">
                    <div>
                        <div className="text-xs font-bold mb-1 px-2 py-0.5 rounded-md inline-block bg-purple-50 text-purple-600">
                            {new Date(m.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })} • {m.time} น.
                        </div>
                        <h3 className="font-bold text-lg text-gray-800">{m.title}</h3>
                        <p className="text-sm text-gray-500">กับ: {m.partnerName}</p>
                    </div>
                    {/* ปุ่มลบจะโชว์เฉพาะคนสร้าง (เช็คจาก userEmail) */}
                    {m.userEmail === currentUser?.email && (
                        <button onClick={() => deleteMeeting(m._id)} className="text-gray-300 hover:text-red-500 p-2 transition-colors">🗑️</button>
                    )}
                </div>
            ))}
        </div>
      </div>

      {/* Modal สร้างนัดหมาย */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
            <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 animate-in slide-in-from-bottom-10 fade-in shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-extrabold text-black">นัดหมายใหม่ ✨</h3>
                    <button onClick={() => setIsOpen(false)} className="bg-gray-100 w-8 h-8 rounded-full text-gray-500 hover:bg-gray-200 transition">✕</button>
                </div>
                <form onSubmit={handleCreateMeeting} className="space-y-4">
                    <div>
                        <label className="text-sm font-bold text-black">หัวข้อการประชุม</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="เช่น คุยเรื่องโปรเจกต์ A" required className="w-full mt-1 p-3 bg-gray-50 rounded-xl border border-gray-200 text-black font-medium placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-black">นัดกับใคร? (เลือกจาก Inbox)</label>
                        <select value={partnerEmail} onChange={e => setPartnerEmail(e.target.value)} className="w-full mt-1 p-3 bg-gray-50 rounded-xl border border-gray-200 text-black font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors">
                            <option value="">-- เลือกเพื่อน (หรือเว้นว่างไว้) --</option>
                            {contacts.map((c, i) => <option key={i} value={c.email}>{c.fullName} ({c.position || 'No Position'})</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-sm font-bold text-black">วันที่</label><input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full mt-1 p-3 bg-gray-50 rounded-xl border border-gray-200 text-black font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" /></div>
                        <div><label className="text-sm font-bold text-black">เวลา</label><input type="time" value={time} onChange={e => setTime(e.target.value)} required className="w-full mt-1 p-3 bg-gray-50 rounded-xl border border-gray-200 text-black font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" /></div>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg mt-4 hover:bg-gray-800 transition-transform active:scale-[0.98] shadow-lg flex justify-center items-center gap-2">
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                <span>กำลังบันทึก...</span>
                            </>
                        ) : "บันทึกนัดหมาย"}
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}