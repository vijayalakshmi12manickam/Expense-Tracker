import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
  item: { type: String, required: true },
  bank: { type: String, required: true },
  txnType: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  tags: [String],

  // Shared expense fields
  isShared: { type: Boolean },
  paidBy: { type: String, default: "You" },
  splitType: {
    type: String,
    enum: ["equal", "custom", "shares"],
    default: "equal",
  },
  participants: [
    {
      name: String, // participant name
      amount: Number, // share of amount
      share: Number, //number of share
    },
  ],
  totalAmount: { type: Number },
});

export default mongoose.models.Expense ||
  mongoose.model("Expense", ExpenseSchema);
