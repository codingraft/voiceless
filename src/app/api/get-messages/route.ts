import { getServerSession, User } from "next-auth";
import UserModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/option";
import mongoose from "mongoose";

// function createResponse(success: boolean, message: string, status = 200) {
//   return new Response(JSON.stringify({ success, message }), { status });
// }
export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !user) {
    return Response.json({ success: false, message: "User not found", status: 404 });
  }
  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { 'messages.createdAt': -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]).exec();
    if (!user || user.length === 0) {
      return Response.json({ success: false, message: "User not found", status: 404 });
    }
    if(user[0].messages.length === 0) return Response.json({ success: true, messages: [] }, { status: 200 });
    return Response.json({ success: true, messages: user[0].messages }, { status: 200 });
  } catch (error) {
    console.log("Error in getting messages", error);
    return Response.json({ success: false, message: "Error in getting messages", status: 500 });
  }
}
