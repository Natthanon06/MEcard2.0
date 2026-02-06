import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Card from "@/models/Card";

// ✅ 1. ฟังก์ชัน GET: สำหรับดึงข้อมูลการ์ดมาโชว์ที่หน้า Profile
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    await dbConnect();

    // ถ้าไม่ได้ส่งอีเมลมา ให้แจ้ง Error กลับไป
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // ค้นหาการ์ดทั้งหมดที่เป็นของอีเมลนี้ (เรียงจากใหม่ไปเก่า)
    const cards = await Card.find({ ownerEmail: email }).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: cards });

  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ 2. ฟังก์ชัน POST: สำหรับสร้างการ์ดใหม่ (ที่คุณมีอยู่แล้ว)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    await dbConnect();

    // สร้างการ์ดใหม่ลง Database
    const newCard = await Card.create({
      ownerEmail: body.ownerEmail,
      fullName: body.fullName,
      position: body.position,
      profileImage: body.profileImage,
      templateId: body.templateId,
      
      // ฟิลด์ช่องทางติดต่อ
      phoneNumber: body.phoneNumber,
      email: body.email,
      facebook: body.facebook,
      instagram: body.instagram,
      line: body.line,
      tiktok: body.tiktok,
      website: body.website,
    });

    return NextResponse.json({ success: true, data: newCard });

  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "บันทึกไม่สำเร็จ" }, { status: 500 });
  }
}