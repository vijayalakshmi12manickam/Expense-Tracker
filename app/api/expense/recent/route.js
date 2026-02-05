"use server";

import connectDB from "@/app/lib/mongodb";
import Expense from "@/app/models/Expense";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const recent = await Expense.find().sort({ date: -1 }).limit(5);
    return NextResponse.json(recent);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
