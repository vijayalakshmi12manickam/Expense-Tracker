import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
  item: String,
  bank: String,
  txnType: String,
  category: String,
  date: Date,
  amount: Number,
  tags: [String],
});

export default mongoose.models.Expense ||
  mongoose.model("Expense", ExpenseSchema);
