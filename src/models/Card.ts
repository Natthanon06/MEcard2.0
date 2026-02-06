import mongoose from "mongoose";

const CardSchema = new mongoose.Schema({

  ownerEmail: { type: String, required: true }, // ของใคร?
  fullName: { type: String, required: true },   // ชื่อบนการ์ด
  profileImage: { type: String },               // รูป (Base64)
  position: { type: String },                   // ตำแหน่ง
  templateId: { type: String },                 // ธีมสี

 
  phoneNumber: { type: String },
  email: { type: String },      
  facebook: { type: String },
  instagram: { type: String },
  line: { type: String },
  tiktok: { type: String },
  website: { type: String },

 
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Card || mongoose.model("Card", CardSchema);