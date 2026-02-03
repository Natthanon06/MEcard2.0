"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation"; // 1. เพิ่มตัวช่วยเปลี่ยนหน้า

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // 2. ประกาศตัวแปร router

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // --- 1. ตรวจสอบ Password ---
    if (password !== confirmPassword) {
      setIsLoading(false);
      setError("รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง");
      return;
    }

    try {
      // --- 2. ส่งข้อมูลไปที่ API (MongoDB) ---
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // ถ้า API ตอบกลับมาว่า error (เช่น อีเมลซ้ำ)
        throw new Error(data.error || "สมัครสมาชิกไม่สำเร็จ");
      }

      // --- 3. ถ้าสำเร็จ ---
      alert("สมัครสมาชิกสำเร็จ! 🎉 กรุณาเข้าสู่ระบบ");
      router.push("/login"); // ส่งไปหน้า Login

    } catch (err: any) {
      // แสดง Error ที่ได้จาก Server
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100 blur-3xl opacity-30"></div>
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-100 blur-3xl opacity-30"></div>
      </div>

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        <div className="px-8 pt-8 pb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">สร้างบัญชีผู้ใช้</h1>
          <p className="text-gray-500 text-sm">
            กรอกข้อมูลด้านล่างเพื่อเริ่มต้นใช้งาน
          </p>
        </div>

        <form onSubmit={onSubmit} className="px-8 pb-8 space-y-5">
          
          {error && (
            <div className="bg-red-50 text-red-600 text-sm py-2 px-4 rounded-lg border border-red-100 flex items-center animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700 block">
              ชื่อ - นามสกุล
            </label>
            <input
              id="name"
              name="name" 
              type="text"
              placeholder="name"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
              อีเมล
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="example@domain.com"
              required
              onChange={() => setError(null)}
              className={`w-full px-4 py-2.5 rounded-lg border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                error && error.includes("อีเมล") 
                ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
              }`}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
              รหัสผ่าน
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700 block">
              ยืนยันรหัสผ่าน
            </label>
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              onChange={() => setError(null)} 
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
              />
            </div>
            <label htmlFor="terms" className="ml-2 text-sm text-gray-500 cursor-pointer">
              ฉันยอมรับ <a href="#" className="text-blue-600 hover:underline">เงื่อนไขการใช้งาน</a> และ <a href="#" className="text-blue-600 hover:underline">นโยบายความเป็นส่วนตัว</a>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                กำลังตรวจสอบ...
              </>
            ) : (
              "สมัครสมาชิก"
            )}
          </button>
        </form>

        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600">
            มีบัญชีอยู่แล้วใช่ไหม?{" "}
            <Link href="/login" className="text-blue-600 font-medium hover:underline hover:text-blue-700 transition-colors">
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}