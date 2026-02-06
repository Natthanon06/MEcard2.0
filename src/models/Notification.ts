// src/models/Notification.ts
import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  recipientEmail: { type: String, required: true }, // ส่งถึงใคร
  message: { type: String, required: true },        // ข้อความ
  type: { type: String, default: 'meeting' },       // ประเภท (เผื่ออนาคต)
  isRead: { type: Boolean, default: false },        // อ่านยัง?
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);