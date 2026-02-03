import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";

// 👇 แก้ตรงนี้ครับ: ถอยหลัง 3 ก้าว (../../../) เพื่อกลับไปที่ src แล้วค่อยเข้า models
import User from "@/models/User"; 
// (หมายเหตุ: ถ้าไฟล์คุณชื่อ User.ts ให้แก้เป็น ../../../models/User นะครับ)

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    await dbConnect();

    // เช็คว่าอีเมลซ้ำไหม
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "อีเมลนี้มีคนใช้แล้ว" }, { status: 400 });
    }

    // สร้าง User ใหม่
    await User.create({ name, email, password });

    return NextResponse.json({ success: true, message: "สมัครสมาชิกสำเร็จ!" });
  } catch (error) {
    console.error("Register Error:", error); // เพิ่มบรรทัดนี้เพื่อดู Error ใน Terminal
    return NextResponse.json({ error: "ระบบขัดข้อง กรุณาลองใหม่" }, { status: 500 });
  }
}