import connectDB from "@/app/lib/mongodb";
import Expense from "@/app/models/Expense";

export async function GET() {
  await connectDB();

  const expenses = await Expense.aggregate([
    {
      $match: {
        isShared: true,
      },
    },

    // Compute settlement for ALL participants
    {
      $addFields: {
        settlement: {
          $map: {
            input: {
              $filter: {
                input: "$participants",
                as: "p",
                cond: { $ne: ["$$p.name", "$paidBy"] },
              },
            },
            as: "p",
            in: {
              person: "$$p.name",
              owes: "$paidBy",
              amount: "$$p.amount",
            },
          },
        },
      },
    },

    {
      $project: {
        item: 1,
        category: 1,
        date: 1,
        totalAmount: 1,
        splitType: 1,
        paidBy: 1,
        participants: 1,
        settlement: 1,
      },
    },

    {
      $sort: { date: -1 },
    },
  ]);

  return new Response(
    JSON.stringify({
      expenses,
      count: expenses.length,
    }),
    { status: 200 },
  );
}
