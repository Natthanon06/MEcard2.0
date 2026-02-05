"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // ดึง Token แทน Email

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const newPassword = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
        setIsLoading(false);
        setError("รหัสผ่านไม่ตรงกัน");
        return;
    }

    try {
        // ส่ง Token + รหัสใหม่ไปที่ API
        const res = await fetch("/api/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, password: newPassword }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "เปลี่ยนรหัสผ่านไม่สำเร็จ");
        }

        alert("เปลี่ยนรหัสผ่านสำเร็จ! กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่");
        router.push("/login");

    } catch (err: any) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
  }

  if (!token) {
      return <div className="text-center p-8 text-red-500">ลิงก์ไม่ถูกต้อง (ไม่พบ Token)</div>;
  }

  return (
    <form onSubmit={onSubmit} className="px-8 pb-8 space-y-5">
        <div className="bg-green-50 text-green-800 text-sm px-4 py-3 rounded-lg border border-green-100 text-center">
            ยืนยันตัวตนเรียบร้อย<br/>ตั้งรหัสผ่านใหม่ได้เลย
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm py-2 px-4 rounded-lg border border-red-100">{error}</div>}

        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">รหัสผ่านใหม่</label>
            <input name="password" type="password" required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900" />
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">ยืนยันรหัสผ่านใหม่</label>
            <input name="confirmPassword" type="password" required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900" />
        </div>

        <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-lg shadow-md">
            {isLoading ? "กำลังบันทึก..." : "ยืนยันการเปลี่ยนรหัสผ่าน"}
        </button>
    </form>
  );
}

// Main Component
export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="px-8 pt-8 pb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ตั้งรหัสผ่านใหม่</h1>
        </div>
        <Suspense fallback={<div className="text-center p-8">กำลังโหลด...</div>}>
            <ResetForm />
        </Suspense>
      </div>
    </div>
  );
}