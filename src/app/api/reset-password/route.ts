// src/app/api/reset-password/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json(); // รับ Token แทน Email
    await dbConnect();

    // 1. ตรวจสอบ Token (แกะกล่องดู)
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ error: "ลิงก์หมดอายุหรือใม่ถูกต้อง กรุณาทำรายการใหม่" }, { status: 400 });
    }

    // 2. ค้นหา User จาก ID ที่อยู่ใน Token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "ไม่พบผู้ใช้" }, { status: 404 });
    }

    // 3. เปลี่ยนรหัสผ่าน
    user.password = password;
    await user.save();

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ error: "เปลี่ยนรหัสผ่านไม่สำเร็จ" }, { status: 500 });
  }
}