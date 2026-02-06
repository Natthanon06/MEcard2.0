// src/app/api/notifications/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Notification from "@/models/Notification";

// GET: ดึงแจ้งเตือนของฉัน
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    await dbConnect();
    
    // เอาเฉพาะที่ยังไม่อ่าน (หรือเอาทั้งหมดก็ได้)
    const notifs = await Notification.find({ recipientEmail: email }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: notifs });
  } catch (error) {
    return NextResponse.json({ error: "Fetch error" }, { status: 500 });
  }
}

// DELETE: ลบแจ้งเตือน (หรือ Mark as read)
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        await dbConnect();
        await Notification.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Delete error" }, { status: 500 });
    }
}