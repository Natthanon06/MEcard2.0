// src/app/forgot-password/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [successEmail, setSuccessEmail] = useState<string | null>(null); // เปลี่ยนจากเก็บ message เป็นเก็บ email
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessEmail(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;

    setTimeout(() => {
        const allUsersStr = localStorage.getItem("registeredUsers");
        const allUsers = allUsersStr ? JSON.parse(allUsersStr) : [];
        const userExists = allUsers.some((u: any) => u.email === email);

        if (userExists) {
            setSuccessEmail(email); // เก็บอีเมลไว้ส่งต่อไปหน้า Reset
        } else {
            setError("ไม่พบอีเมลนี้ในระบบ กรุณาตรวจสอบความถูกต้อง");
        }
        setIsLoading(false);
    }, 1000);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100 blur-3xl opacity-30"></div>
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-100 blur-3xl opacity-30"></div>
      </div>

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        <div className="px-8 pt-8 pb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ลืมรหัสผ่าน?</h1>
          {!successEmail && (
            <p className="text-gray-500 text-sm">
                กรอกอีเมลของคุณเพื่อค้นหาบัญชี
            </p>
          )}
        </div>

        {successEmail ? (
            // --- ส่วนที่แก้: แสดงปุ่มจำลองการกดลิงก์จากอีเมล ---
            <div className="px-8 pb-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">พบบัญชีผู้ใช้!</h3>
                <p className="text-sm text-gray-500 mb-6">
                    ในระบบจริง เราจะส่งลิงก์ไปทางอีเมล<br/>
                    แต่นี่คือ Demo คุณสามารถกดปุ่มด้านล่างได้เลย
                </p>
                
                {/* ลิงก์นี้จะส่ง email ไปด้วยผ่าน URL Query Params */}
                <Link 
                    href={`/reset-password?email=${successEmail}`}
                    className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all mb-3"
                >
                     ตั้งรหัสผ่านใหม่
                </Link>

                <Link 
                    href="/login"
                    className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
                >
                    ยกเลิก / กลับหน้าเข้าสู่ระบบ
                </Link>
            </div>
        ) : (
            <form onSubmit={onSubmit} className="px-8 pb-8 space-y-5">
                {error && (
                    <div className="bg-red-50 text-red-600 text-sm py-2 px-4 rounded-lg border border-red-100 flex items-center">
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
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-lg shadow-md disabled:opacity-70"
                >
                    {isLoading ? "กำลังค้นหา..." : "ค้นหาบัญชี"}
                </button>
            </form>
        )}
      </div>
    </div>
  );
}