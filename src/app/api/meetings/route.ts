import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Meeting from "@/models/Meeting";

// 1. GET: ดึงรายการนัดหมาย
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    await dbConnect();
    
    // เรียงตามวันที่ (ใหม่สุดขึ้นก่อน หรือจะเรียงตามวันที่นัดก็ได้)
    const meetings = await Meeting.find({ userEmail: email }).sort({ date: 1, time: 1 });
    return NextResponse.json({ success: true, data: meetings });
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

// 2. POST: สร้างนัดหมายใหม่
export async function POST(req: Request) {
  try {
    const body = await req.json();
    await dbConnect();
    
    const newMeeting = await Meeting.create(body);
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