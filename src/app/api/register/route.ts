import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User"; // เช็คชื่อไฟล์ Model ให้ตรง (User หรือ UserModel)
// import bcrypt ไม่ต้องใช้แล้ว ลบออกได้เลย

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    await dbConnect();

    // 1. เช็คข้อมูลครบไหม
    if (!name || !email || !password) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
    }

    // 2. เช็คว่ามี User อยู่แล้วไหม
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "อีเมลนี้ถูกใช้งานแล้ว" }, { status: 400 });
    }

    // 3. บันทึกเลย! (ไม่ต้อง Hash แล้ว)
    await User.create({ 
        name, 
        email, 
        password: password // เก็บ 1234 ลงไปตรงๆ
    });

    return NextResponse.json({ success: true, message: "สมัครสมาชิกสำเร็จ" });

  } catch (error) {
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการสมัครสมาชิก" }, { status: 500 });
  }
}