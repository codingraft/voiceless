import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";

const createResponse = (success: boolean, message: string, status = 200) => {
  return new Response(JSON.stringify({ success, message }), { status });
};

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } } // Destructure params directly here
) {
  const { messageid } = await params; // Get messageid from params
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  try {
    const updatedUser = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageid } } } // Use messageid here
    );

    if (updatedUser.modifiedCount === 0) {
      return createResponse(false, "User not found", 404);
    }
    return createResponse(true, "Message deleted successfully", 200);
  } catch (error) {
    console.log("Error in deleting message", error);
    return createResponse(false, "Error in deleting message", 500);
  }
}
