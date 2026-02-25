import mongoose from "mongoose";

const GuestSavedCardSchema = new mongoose.Schema({
  guestId: { type: String, required: true, index: true },
  cardId: { type: String, required: true },
  
  // 🌟 จุดที่แก้: เปลี่ยนจากกำหนดชื่อฟิลด์ตายตัว เป็น type: Object 
  // เพื่อให้มันรับข้อมูลได้อิสระ ไม่ว่าจะมีกี่โซเชียลก็เก็บได้หมดครับ!
  cardData: { 
    type: Object, 
    required: true 
  },
  
  createdAt: { 
    type: Date, 
    default: Date.now,
    expires: '7d' 
  }
});

export default mongoose.models.GuestSavedCard || mongoose.model("GuestSavedCard", GuestSavedCardSchema);