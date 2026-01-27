import connectDB from "@/app/lib/mongodb";
import Expense from "@/app/models/Expense";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  console.log("request payload", params);
  try {
    await connectDB();
    const { id } = await params;
    const expense = await Expense.findById(id);
    if (!expense) {
      return NextResponse.json({ message: "Expense not found", status: 404 });
    }

    return new Response(JSON.stringify(expense), { status: 200 });
  } catch (err) {
    console.log("edi expense errror", err);
    return NextResponse.json({ message: "Server Error", status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const deleted = await Expense.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { message: "Expense not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting expense:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
