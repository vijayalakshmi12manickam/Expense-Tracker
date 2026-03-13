import mongoose from "mongoose";

const SettlementSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  note: String,
});

export default mongoose.models.Settlement ||
  mongoose.model("Settlement", SettlementSchema);
