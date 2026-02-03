"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // 1. ส่ง Email/Pass ไปขอ Token จาก Server
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "เข้าสู่ระบบไม่สำเร็จ");
      }

      // --- จุดสำคัญ: เมื่อ Login ผ่าน Server จะส่ง Token มาให้ ---
      
      // 2. เก็บ Token ลง LocalStorage (เปรียบเสมือนบัตรผ่าน)
      localStorage.setItem("token", data.token);
      
      // 3. เก็บข้อมูลผู้ใช้ทั่วไป (เผื่อเอาไปโชว์ชื่อ)
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      alert("เข้าสู่ระบบสำเร็จ! 🎉");
      
      // 4. ไปหน้าแรก
      router.push("/"); 

    } catch (err: any) {
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
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-[#F3E8FF] blur-3xl opacity-30"></div>
      </div>

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="px-8 pt-8 pb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Login</h1>
          <p className="text-gray-500 text-sm">
            กรอกอีเมลและรหัสผ่านเพื่อเข้าสู่ระบบ
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={onSubmit} className="px-8 pb-8 space-y-5">
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm py-2 px-4 rounded-lg border border-red-100 flex items-center animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

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
                error 
                ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
              }`}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                รหัสผ่าน
              </label>
              <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline">
               ลืมรหัสผ่าน?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              onChange={() => setError(null)}
              className={`w-full px-4 py-2.5 rounded-lg border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                error 
                ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
              }`}
            />
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
              "เข้าสู่ระบบ"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600">
            ยังไม่มีบัญชีใช่ไหม?{" "}
            <Link href="/register" className="text-blue-600 font-medium hover:underline hover:text-blue-700 transition-colors">
              สมัครสมาชิก
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}