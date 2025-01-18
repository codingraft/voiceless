import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";

const createResponse = (success: boolean, message: string, status = 200) => {
  return new Response(JSON.stringify({ success, message }), { status });
};

export async function DELETE(
  request: Request,
  context: { params: Promise<{ messageid: string }> } // Destructure params directly here
) {
  const  messageid  = (await (context).params).messageid; // Get messageid from params

  // Connect to the database
  await dbConnect();

  // Get the session
  const session = await getServerSession(authOptions);
  
  // Ensure the session exists
  if (!session?.user) {
    return createResponse(false, "Unauthorized", 401);
  }

  const user = session.user;

  try {
    // Attempt to delete the message from the user's messages array
    const updatedUser = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageid } } }
    );

    // Check if the update was successful
    if (updatedUser.modifiedCount === 0) {
      return createResponse(false, "Message not found or already deleted", 404);
    }

    return createResponse(true, "Message deleted successfully", 200);
  } catch (error) {
    console.log("Error in deleting message:", error);
    return createResponse(false, "Error in deleting message", 500);
  }
}
