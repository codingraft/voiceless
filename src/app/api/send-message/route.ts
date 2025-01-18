import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { Message } from "@/model/User.model";

function createResponse(success: boolean, message: string, status = 200) {
  return Response.json({ success, message }, { status });
}
export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });
    if (!user) return createResponse(false, "User not found", 404);

    if (!user.isAcceptingMessages)
      return createResponse(false, "User is not accepting messages", 403);

    const newMessage  = {
        content, createdAt: new Date()
    };
    user.messages.push(newMessage as Message);
    await user.save();
    return createResponse(true, "Message sent successfully", 200);
  } catch (error) {
    console.log("Error in sending message", error);
    return createResponse(false, "Internal server error", 500);
  }
}
