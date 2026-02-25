import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

// 1️⃣ แก้ Path ให้ย้อนแค่ 4 ชั้น (เป๊ะแน่นอน)
import GuestSavedCard from "../../../../models/GuestSavedCard";
 import connectMongoDB from "../../../../lib/mongodb"; // เอาคอมเมนต์ออกเมื่อพร้อมต่อ DB

export async function POST(req: Request) {
  try {
     await connectMongoDB(); 
    
    const body = await req.json();
    const { cardId, cardData } = body;

    // 2️⃣ ใส่ await หน้า cookies() (แก้กฎใหม่ของ Next.js 15)
    const cookieStore = await cookies();
    let guestId = cookieStore.get("mecard_guest_id")?.value;

    if (!guestId) {
      guestId = `guest_${uuidv4()}`;
      cookieStore.set("mecard_guest_id", guestId, {
        maxAge: 7 * 24 * 60 * 60,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
    }

    await GuestSavedCard.updateOne(
      { guestId, cardId }, 
      { $set: { guestId, cardId, cardData, createdAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: "Saved to Guest DB" });
  } catch (error) {
    console.error("Save scan error:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}