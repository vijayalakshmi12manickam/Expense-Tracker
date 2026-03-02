// models/Budget.js
import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["category", "tag"],
    required: true,
  },
  name: {
    type: String, // e.g. "Food" or "Paris0226"
    required: true,
  },
  limit: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  currency: {
    type: String,
    default: "GBP",
  },
  //   notes: {
  //     type: String,
  //   },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  //   userId: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "User",
  //   },
});

export default mongoose.model("Budget", budgetSchema);
