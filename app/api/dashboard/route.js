import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/app/lib/mongodb";
import Expense from "@/app/models/Expense";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    // const userId = searchParams.get("userId");

    // if (!userId) {
    //   return NextResponse.json(
    //     { success: false, message: "userId is required" },
    //     { status: 400 },
    //   );
    // }

    // const objectUserId = new mongoose.Types.ObjectId(userId);

    const pipeline = [
      //   {
      //     $match: {
      //       userId: objectUserId,
      //     },
      //   },
      {
        $facet: {
          totalAmount: [
            {
              $group: {
                _id: null,
                total: { $sum: "$amount" },
                count: { $sum: 1 },
              },
            },
            { $project: { _id: 0, total: 1, count: 1 } },
          ],

          categoryBreakdown: [
            {
              $group: {
                _id: "$category",
                total: { $sum: "$amount" },
                count: { $sum: 1 },
              },
            },
            { $sort: { total: -1 } },
            {
              $project: {
                _id: 0,
                category: "$_id",
                total: 1,
                count: 1,
              },
            },
          ],

          bankBreakdown: [
            {
              $group: {
                _id: "$bank",
                total: { $sum: "$amount" },
                count: { $sum: 1 },
              },
            },
            { $sort: { total: -1 } },
            {
              $project: {
                _id: 0,
                bank: "$_id",
                total: 1,
                count: 1,
              },
            },
          ],

          monthlyTrend: [
            {
              $group: {
                _id: {
                  year: { $year: "$date" },
                  month: { $month: "$date" },
                },
                total: { $sum: "$amount" },
                count: { $sum: 1 },
              },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            {
              $project: {
                _id: 0,
                year: "$_id.year",
                month: "$_id.month",
                total: 1,
                count: 1,
              },
            },
          ],

          tagBreakdown: [
            { $unwind: "$tags" },
            {
              $group: {
                _id: "$tags",
                total: { $sum: "$amount" },
                count: { $sum: 1 },
              },
            },
            { $sort: { total: -1 } },
            {
              $project: {
                _id: 0,
                tag: "$_id",
                total: 1,
                count: 1,
              },
            },
          ],

          recentTransactions: [
            { $sort: { date: -1 } },
            { $limit: 5 },
            {
              $project: {
                _id: 1,
                item: 1,
                bank: 1,
                txnType: 1,
                category: 1,
                date: 1,
                amount: 1,
                tags: 1,
              },
            },
          ],
        },
      },
    ];

    const [result] = await Expense.aggregate(pipeline);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
