import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import GuestSavedCard from "../../../../models/GuestSavedCard";
// import connectMongoDB from "../../../../lib/mongodb";

export async function GET() {
  try {
    // await connectMongoDB(); 
    
    // 🌟 ใส่ await ตรงนี้ด้วยครับ
    const cookieStore = await cookies();
    const guestId = cookieStore.get("mecard_guest_id")?.value;

    if (!guestId) {
      return NextResponse.json({ success: true, data: null });
    }

    const scannedCard = await GuestSavedCard.findOne({ guestId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: scannedCard });
  } catch (error) {
    console.error("Get scan error:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}