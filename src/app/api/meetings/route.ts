import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Meeting from "@/models/Meeting";
import Notification from "@/models/Notification"; // ✅ อย่าลืม Import Model แจ้งเตือน

// 1. GET: ดึงรายการนัดหมาย (ของทั้งคนนัด และคนถูกนัด)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    await dbConnect();
    
    // 🔍 ใช้ $or เพื่อหาว่า อีเมลนี้ เป็น "คนสร้าง" หรือ "คนถูกเชิญ" ก็ได้
    const meetings = await Meeting.find({ 
      $or: [
        { userEmail: email },    // ฉันเป็นคนนัด
        { partnerEmail: email }  // ฉันถูกเขานัด
      ]
    }).sort({ date: 1, time: 1 });

    return NextResponse.json({ success: true, data: meetings });
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

// 2. POST: สร้างนัดหมายใหม่ + สร้างแจ้งเตือน
export async function POST(req: Request) {
  try {
    const body = await req.json();
    await dbConnect();
    
    // 2.1 สร้างนัดหมาย
    const newMeeting = await Meeting.create(body);

    // 🔔 2.2 สร้างแจ้งเตือนส่งให้เพื่อน (ถ้ามีอีเมลเพื่อน)
    if (body.partnerEmail) {
      await Notification.create({
        recipientEmail: body.partnerEmail,
        message: `📅 มีนัดหมายใหม่: "${body.title}" จากคุณ ${body.userEmail}`,
        type: 'meeting'
      });
    }

    return NextResponse.json({ success: true, data: newMeeting });
  } catch (error) {
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}

// 3. DELETE: ลบนัดหมาย
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await dbConnect();
    
    await Meeting.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}