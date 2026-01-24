import connectDB from "@/app/lib/mongodb";

export async function GET(){
    try {
        await connectDB();
        return new Response(JSON.stringify({message: "DB connected successfully"}),{status: 200})
    } catch (err) {
        console.log("error");
        return new Response(JSON.stringify({error: "Database connection failed"},{status: 500}))
    }
}