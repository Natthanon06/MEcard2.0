import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema({
  userEmail: { type: String, required: true }, // เจ้าของนัดหมาย
  title: { type: String, required: true },
  partnerName: { type: String, required: true },
  partnerEmail: { type: String }, // เผื่อไว้ส่งเมลในอนาคต
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, default: 'upcoming' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Meeting || mongoose.model("Meeting", MeetingSchema);