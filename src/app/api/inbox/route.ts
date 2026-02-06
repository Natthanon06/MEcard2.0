import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import SavedCard from "@/models/SavedCard";

// GET: ดึง Inbox
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    await dbConnect();
    const list = await SavedCard.find({ userEmail: email }).sort({ savedAt: -1 });
    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch inbox" }, { status: 500 });
  }
}

// DELETE: ลบจาก Inbox
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await dbConnect();
    await SavedCard.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}