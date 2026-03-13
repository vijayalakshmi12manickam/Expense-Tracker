import Settlement from "@/app/models/Settlement";
import connectDB from "@/app/lib/mongodb";

export async function POST(req) {
  await connectDB();

  const body = await req.json();

  const settlement = await Settlement.create({
    from: body.from,
    to: body.to,
    amount: body.amount,
    date: new Date(body.date),
    note: body.note,
  });

  return Response.json(settlement);
}
