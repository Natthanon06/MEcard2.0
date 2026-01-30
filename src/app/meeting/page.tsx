// src/app/meetings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MeetingPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [contacts, setContacts] = useState<any[]>([]); 
  const [meetings, setMeetings] = useState<any[]>([]);
  
  // Form State
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (!userStr) { router.push("/login"); return; }
    const user = JSON.parse(userStr);
    setCurrentUser(user);

    const inboxKey = `inbox_${user.email}`;
    setContacts(JSON.parse(localStorage.getItem(inboxKey) || "[]"));

    const meetingKey = `meetings_${user.email}`;
    const savedMeetings = JSON.parse(localStorage.getItem(meetingKey) || "[]");
    // Migration
    const cleanMeetings = savedMeetings.map((m: any) => ({ ...m, acknowledged: m.acknowledged || false }));
    setMeetings(cleanMeetings);
  }, [router]);

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time) return alert("กรุณากรอกข้อมูลให้ครบ");

    const partner = contacts.find(c => c.email === partnerEmail) || { fullName: "ไม่ระบุ / นัดส่วนตัว" };
    const newMeeting = {
        id: Date.now(),
        title,
        partnerName: partner.fullName || partner.name,
        partnerEmail,
        date,
        time,
        status: 'upcoming',
        acknowledged: false
    };

    const updatedMeetings = [...meetings, newMeeting];
    setMeetings(updatedMeetings);
    localStorage.setItem(`meetings_${currentUser.email}`, JSON.stringify(updatedMeetings));

    setIsOpen(false);
    setTitle("");
    setDate("");
    setTime("");
    alert("✅ สร้างนัดหมายสำเร็จ!");
  };

  const deleteMeeting = (id: number) => {
    if(!confirm("ต้องการยกเลิกนัดหมายนี้ใช่ไหม?")) return;
    const updated = meetings.filter(m => m.id !== id);
    setMeetings(updated);
    localStorage.setItem(`meetings_${currentUser.email}`, JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      
      {/* Header (เอาปุ่มกระดิ่งออก เพราะมี Global แล้ว) */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-30 shadow-sm">
        <Link href="/" className="text-2xl hover:bg-gray-100 w-10 h-10 flex items-center justify-center rounded-full transition">⬅</Link>
        <h1 className="text-xl font-bold text-gray-800">📅 นัดหมายการประชุม</h1>
      </nav>

      <div className="max-w-xl mx-auto p-6">
        <button onClick={() => setIsOpen(true)} className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-purple-700 transition-all flex items-center justify-center gap-2 mb-8">
            <span>+</span> สร้างนัดหมายใหม่
        </button>

        <h2 className="font-bold text-gray-600 mb-4">นัดหมายที่กำลังจะถึง</h2>
        <div className="space-y-4">
            {meetings.filter(m => !m.acknowledged).length === 0 && <p className="text-center text-gray-400 py-10">ไม่มีนัดหมายใหม่</p>}
            
            {meetings
                .filter(m => !m.acknowledged) 
                .sort((a,b) => (a.date + a.time).localeCompare(b.date + b.time))
                .map((m) => (
                <div key={m.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center group">
                    <div>
                        <div className="text-xs font-bold mb-1 px-2 py-0.5 rounded-md inline-block bg-purple-50 text-purple-600">
                            {m.date} • {m.time} น.
                        </div>
                        <h3 className="font-bold text-lg text-gray-800">{m.title}</h3>
                        <p className="text-sm text-gray-500">กับ: {m.partnerName}</p>
                    </div>
                    <button onClick={() => deleteMeeting(m.id)} className="text-gray-300 hover:text-red-500 p-2 transition-colors">🗑️</button>
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
                            <option value="">-- เลือกเพื่อน --</option>
                            {contacts.map((c, i) => <option key={i} value={c.email}>{c.fullName || c.name} ({c.position})</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-sm font-bold text-black">วันที่</label><input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full mt-1 p-3 bg-gray-50 rounded-xl border border-gray-200 text-black font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" /></div>
                        <div><label className="text-sm font-bold text-black">เวลา</label><input type="time" value={time} onChange={e => setTime(e.target.value)} required className="w-full mt-1 p-3 bg-gray-50 rounded-xl border border-gray-200 text-black font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" /></div>
                    </div>
                    <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg mt-4 hover:bg-gray-800 transition-transform active:scale-[0.98] shadow-lg">บันทึกนัดหมาย</button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}