import mongoose from "mongoose";

const SavedCardSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  cardData: { type: Object, required: true },
  savedAt: { type: Date, default: Date.now },
});

export default mongoose.models.SavedCard || mongoose.model("SavedCard", SavedCardSchema);