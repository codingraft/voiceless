import { getServerSession, User } from "next-auth";
import UserModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/option";

function createResponse(success: boolean, message: string, status = 200) {
  return Response.json({ success, message }, { status });
}

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !user) {
    return createResponse(false, "User not found", 404);
  }
  const userId = user._id;
  const { acceptMessages } = await request.json();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessages: acceptMessages,
      },
      { new: true }
    );

    if (!updatedUser) {
      return createResponse(false, "User not found", 404);
    }

    return createResponse(true, "Messages accepted successfully", 200);
  } catch (error) {
    console.log("Error in accepting messages", error);
    return createResponse(false, "Error in accepting messages", 500);
  }
}

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !user) {
    return createResponse(false, "User not found", 404);
  }
  const userId = user._id;
  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return createResponse(false, "User not found", 404);
    }

    return Response.json(
      { success: true, isAcceptingMessages: foundUser.isAcceptingMessages },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in accepting messages", error);
    return createResponse(false, "Error in getting messages", 500);
  }
}
