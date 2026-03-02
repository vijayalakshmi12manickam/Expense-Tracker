import connectDB from "@/app/lib/mongodb";
import Budget from "@/app/models/Budget";

export async function POST(request) {
  try {
    await connectDB(); //conect to db
    const data = await request.json(); //parse the request body

    const budget = await Budget.create({
      type: data.type,
      name: data.name,
      limit: data.limit,
      startDate: data.startDate,
      endDate: data.endDate,
      currency: data.currency,
    });
    return new Response(JSON.stringify(budget), { status: 201 }); //Return created expense
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to create budget" }), {
      status: 500,
    });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");

  await connectDB();
  const startOfYear = `${year}-01-01T00:00:00.000Z`;
  const endOfYear = `${year}-12-31T23:59:59.999Z`;

  console.log("sdfgh", startOfYear, endOfYear);
  const budgets = await Budget.find({
    $or: [
      {
        startDate: {
          $gte: "2026-01-01T00:00:00.000Z",
          $lte: "2026-12-31T23:59:59.999Z",
        },
      },
      {
        endDate: {
          $gte: "2026-01-01T00:00:00.000Z",
          $lte: "2026-12-31T23:59:59.999Z",
        },
      },
    ],
  });
  return new Response(
    JSON.stringify({
      budgets,
    }),
    { status: 200 },
  );
}
