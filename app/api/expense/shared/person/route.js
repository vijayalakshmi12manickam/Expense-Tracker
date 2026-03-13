import connectDB from "@/app/lib/mongodb";
import Expense from "@/app/models/Expense";

export async function GET(request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const person = searchParams.get("name");

  const transactions = await Expense.aggregate([
    { $match: { isShared: true } },

    { $unwind: "$participants" },

    {
      $match: {
        "participants.name": person,
      },
    },

    {
      $project: {
        type: { $literal: "expense" },
        item: 1,
        date: 1,
        amount: "$participants.amount",
        paidBy: 1,
        otherParticipant: {
          $cond: [
            { $eq: ["$paidBy", person] },
            "$participants.name",
            "$paidBy",
          ],
        },
      },
    },

    {
      $unionWith: {
        coll: "settlements",
        pipeline: [
          {
            $match: {
              $or: [{ from: person }, { to: person }],
            },
          },
          {
            $project: {
              type: { $literal: "settlement" },
              item: { $literal: "Settlement" },
              date: 1,
              amount: 1,
              otherParticipant: {
                $cond: [{ $eq: ["$from", person] }, "$to", "$from"],
              },
              direction: {
                $cond: [{ $eq: ["$from", person] }, "paid", "received"],
              },
            },
          },
        ],
      },
    },

    {
      $sort: { date: -1 },
    },
  ]);

  return new Response(
    JSON.stringify({
      transactions,
      count: transactions.length,
    }),
    { status: 200 },
  );
}
