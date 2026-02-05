import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User"
import jwt from "jsonwebtoken"; // 1. นำเข้า jwt

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    await dbConnect();

    const user = await User.findOne({ email }); //findOne ดึงชื่อแรกชื่อเดียว

    // เช็ค User และ Password
    if (!user || user.password !== password) {
      return NextResponse.json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    // --- 2. สร้าง Token (ส่วนใหม่) ---
    // ข้อมูลที่จะฝังใน Token (Payload)
    const tokenData = {
      userId: user._id,
      email: user.email,
      name: user.name,
    };

    // สร้าง Token (หมดอายุใน 1 วัน)
    const token = jwt.sign(tokenData, process.env.JWT_SECRET!, {
      expiresIn: "30d",
    });

    // 3. ส่ง Token กลับไปพร้อมข้อมูล User
    return NextResponse.json({
      success: true,
      token: token, // ส่งกุญแจไปให้หน้าเว็บ
      user: { name: user.name, email: user.email },
    });

  } catch (error) {
    return NextResponse.json({ error: "เข้าสู่ระบบไม่สำเร็จ" }, { status: 500 });
  }
}