import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Card from "@/models/Card";

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
    return NextResponse.json({ error: "บันทึกไม่สำเร็จ" }, { status: 500 });
  }
}