"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false); // ✅ เพิ่มตัวแปรเช็คสถานะการส่ง
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setIsSent(false);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาด");
      }

      // ✅ ถ้าสำเร็จ ให้เปลี่ยนสถานะเป็นส่งแล้ว (หน้าจอจะเปลี่ยนเอง)
      setIsSent(true);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {/* Background สวยๆ */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100 blur-3xl opacity-30"></div>
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-100 blur-3xl opacity-30"></div>
      </div>

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300">
        
        {/* --- ส่วน Header --- */}
        <div className="px-8 pt-8 pb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isSent ? "ตรวจสอบอีเมลของคุณ" : "ลืมรหัสผ่าน?"}
          </h1>
          {!isSent && (
            <p className="text-gray-500 text-sm">
              กรอกอีเมลของคุณเพื่อรับลิงก์ตั้งรหัสผ่านใหม่
            </p>
          )}
        </div>

        {/* --- ส่วนเนื้อหา (จะเปลี่ยนไปตามสถานะ isSent) --- */}
        {isSent ? (
            // ✅ 1. ถ้าส่งเสร็จแล้ว โชว์หน้านี้
            <div className="px-8 pb-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    {/* ไอคอนจดหมาย */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">ส่งลิงก์เรียบร้อยแล้ว!</h3>
                <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                    เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปให้แล้ว<br/>
                    กรุณาตรวจสอบในกล่องจดหมาย <b>(Inbox)</b><br/>
                </p>
                
                <div className="space-y-3">
                  <a 
                      href="https://mail.google.com" 
                      target="_blank"
                      className="block w-full py-3 px-4 bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-semibold rounded-lg transition-colors"
                  >
                      เปิด Gmail
                  </a>
                  <Link 
                      href="/login"
                      className="block w-full py-3 px-4 text-gray-500 hover:text-gray-900 hover:bg-gray-50 text-sm font-medium rounded-lg transition-colors"
                  >
                      กลับไปหน้าเข้าสู่ระบบ
                  </Link>
                </div>
            </div>
        ) : (
            // ✅ 2. ถ้ายังไม่ส่ง โชว์ฟอร์มปกติ
            <form onSubmit={onSubmit} className="px-8 pb-8 space-y-5">
                {error && (
                    <div className="bg-red-50 text-red-600 text-sm py-3 px-4 rounded-lg border border-red-100 flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                )}
                
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700 block">อีเมล</label>
                    <input 
                        id="email" 
                        name="email" 
                        type="email" 
                        placeholder="example@domain.com"
                        required 
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" 
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full py-3 px-4 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        กำลังส่ง...
                      </>
                    ) : "ส่งลิงก์รีเซ็ตรหัสผ่าน"}
                </button>

                <div className="text-center pt-2">
                   <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">
                      ยกเลิก
                   </Link>
                </div>
            </form>
        )}
      </div>
    </div>
  );
}