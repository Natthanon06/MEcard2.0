import mongoose from "mongoose";

const GuestSavedCardSchema = new mongoose.Schema({
  guestId: { type: String, required: true, index: true },
  cardId: { type: String, required: true },
  cardData: {
    name: String,
    company: String,
    phone: String,
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    expires: '7d' 
  }
});

export default mongoose.models.GuestSavedCard || mongoose.model("GuestSavedCard", GuestSavedCardSchema);