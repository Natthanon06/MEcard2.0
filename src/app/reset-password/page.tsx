// src/app/reset-password/page.tsx
"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// แยก Component Form ออกมาเพื่อให้ใช้ useSearchParams ได้โดยไม่ติด Error ในบางเวอร์ชัน
function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email"); // ดึงอีเมลจาก URL

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const newPassword = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // 1. ตรวจสอบรหัสผ่าน
    if (newPassword !== confirmPassword) {
        setIsLoading(false);
        setError("รหัสผ่านไม่ตรงกัน");
        return;
    }

    if (!email) {
        setIsLoading(false);
        setError("เกิดข้อผิดพลาด: ไม่พบข้อมูลอีเมล");
        return;
    }

    // 2. จำลองการบันทึก
    setTimeout(() => {
        // ดึงข้อมูลเก่า
        const allUsersStr = localStorage.getItem("registeredUsers");
        const allUsers = allUsersStr ? JSON.parse(allUsersStr) : [];

        // หา Index ของคนที่จะแก้
        const userIndex = allUsers.findIndex((u: any) => u.email === email);

        if (userIndex !== -1) {
            // อัปเดตรหัสผ่านใหม่ให้คนนั้น
            allUsers[userIndex].password = newPassword;
            
            // บันทึกกลับลง Local Storage
            localStorage.setItem("registeredUsers", JSON.stringify(allUsers));

            alert("เปลี่ยนรหัสผ่านสำเร็จ! กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่");
            router.push("/login"); // เด้งไปหน้า Login
        } else {
            setError("ไม่พบข้อมูลผู้ใช้นี้ในระบบ");
        }
        
        setIsLoading(false);
    }, 1500);
  }

  if (!email) {
      return (
          <div className="text-center p-8">
              <p className="text-red-500">ลิงก์ไม่ถูกต้อง (ไม่พบอีเมล)</p>
              <Link href="/forgot-password" className="text-blue-600 hover:underline mt-4 block">กลับไปลองใหม่</Link>
          </div>
      );
  }

  return (
    <form onSubmit={onSubmit} className="px-8 pb-8 space-y-5">
        <div className="bg-blue-50 text-blue-800 text-sm px-4 py-3 rounded-lg border border-blue-100">
            ตั้งรหัสผ่านใหม่สำหรับ: <span className="font-bold">{email}</span>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 text-sm py-2 px-4 rounded-lg border border-red-100">
                {error}
            </div>
        )}

        <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 block">รหัสผ่านใหม่</label>
            <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
        </div>

        <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 block">ยืนยันรหัสผ่านใหม่</label>
            <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
        </div>

        <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-lg shadow-md transition-all"
        >
            {isLoading ? "กำลังบันทึก..." : "ยืนยันการเปลี่ยนรหัสผ่าน"}
        </button>
    </form>
  );
}

// Main Page Component
export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100 blur-3xl opacity-30"></div>
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-100 blur-3xl opacity-30"></div>
      </div>

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="px-8 pt-8 pb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ตั้งรหัสผ่านใหม่</h1>
          <p className="text-gray-500 text-sm">กรุณาระบุรหัสผ่านใหม่ที่คุณต้องการใช้งาน</p>
        </div>
        
        {/* ใช้ Suspense หุ้ม component ที่มีการใช้ searchParams */}
        <Suspense fallback={<div className="text-center p-8">กำลังโหลด...</div>}>
            <ResetForm />
        </Suspense>
      </div>
    </div>
  );
}