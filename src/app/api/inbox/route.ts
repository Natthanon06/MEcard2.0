import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import SavedCard from "@/models/SavedCard";

// ✅ 1. GET: ดึง Inbox ของฉัน
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    await dbConnect();
    
    // ดึงข้อมูลทั้งหมดที่ userEmail นี้เป็นคนบันทึกไว้
    const list = await SavedCard.find({ userEmail: email }).sort({ savedAt: -1 });
    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch inbox" }, { status: 500 });
  }
}

// ✅ 2. POST: บันทึกการ์ดลง Inbox (อันนี้แหละที่ขาดไป!)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    await dbConnect();
    
    // เช็คว่าเคยบันทึกคนนี้ไปหรือยัง (กันซ้ำ)
    const exists = await SavedCard.findOne({ 
        userEmail: body.userEmail, 
        "cardData.fullName": body.cardData.fullName 
    });
    
    if (exists) {
        return NextResponse.json({ error: "คุณมีรายชื่อนี้ใน Inbox แล้ว" }, { status: 400 });
    }

    // บันทึกลง Database
    const newItem = await SavedCard.create({
        userEmail: body.userEmail,
        cardData: body.cardData
    });

    return NextResponse.json({ success: true, data: newItem });
  } catch (error) {
    console.error("Inbox Save Error:", error);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}

// ✅ 3. DELETE: ลบออกจาก Inbox
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // รับ _id ของ SavedCard

    await dbConnect();
    await SavedCard.findByIdAndDelete(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}