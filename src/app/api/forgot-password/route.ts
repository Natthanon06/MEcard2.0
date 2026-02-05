import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User"; // หรือ models/UserModel เช็คชื่อไฟล์ให้ตรงนะครับ
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"; // พระเอกของเรา

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    await dbConnect();

    // 1. เช็คว่ามีอีเมลนี้ในระบบไหม
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "ไม่พบอีเมลนี้ในระบบ" }, { status: 404 });
    }

    // 2. สร้าง Token (ตั๋วสำหรับเปลี่ยนรหัส) มีอายุ 15 นาที
    const resetToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    // สร้างลิงก์ที่จะส่งไปในอีเมล
    // ถ้ารันในเครื่องตัวเองจะเป็น http://localhost:3000
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

    // 3. ตั้งค่าคนส่งจดหมาย (Transporter)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // ดึงจาก .env.local
        pass: process.env.EMAIL_PASS, // ดึงจาก .env.local
      },
    });

    // 4. ส่งอีเมลจริงๆ ออกไป 🚀
    await transporter.sendMail({
      from: `"Mecard Support" <${process.env.EMAIL_USER}>`, // ชื่อคนส่ง
      to: email, // ส่งหาใคร (คนที่กรอกมา)
      subject: "รีเซ็ตรหัสผ่าน Mecard (มีอายุ 15 นาที)", // หัวข้ออีเมล
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #333;">🔒 ขอตั้งรหัสผ่านใหม่</h2>
          <p style="color: #555;">เราได้รับคำขอให้รีเซ็ตรหัสผ่านสำหรับบัญชี Mecard ของคุณ</p>
          <p style="color: #555;">กดปุ่มด้านล่างเพื่อตั้งรหัสผ่านใหม่ได้เลยครับ:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              ตั้งรหัสผ่านใหม่
            </a>
          </div>

          <p style="font-size: 12px; color: #999; margin-top: 30px;">
            หากคุณไม่ได้เป็นคนกดลืมรหัสผ่าน โปรดเพิกเฉยต่ออีเมลฉบับนี้ บัญชีของคุณยังปลอดภัยครับ
          </p>
        </div>
      `,
    });

    // 5. ส่งผลลัพธ์กลับไปบอกหน้าเว็บว่า "สำเร็จ"
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Email Error:", error);
    return NextResponse.json({ error: "ส่งอีเมลไม่ผ่าน กรุณาลองใหม่" }, { status: 500 });
  }
}