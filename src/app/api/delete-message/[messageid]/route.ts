import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";

export async function DELETE({ params }: { params: { messageid: string } }) {
  const { messageid } = params;
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  try {
    const updatedUser = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageid } } }
    );

    if (updatedUser.modifiedCount === 0) {
      return Response.json({ success: false, message: "Message not found" });
    }
    return Response.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.log("Error in deleting message", error);
    return Response.json({
      success: false,
      message: "Error in deleting message",
    });
  }
}
