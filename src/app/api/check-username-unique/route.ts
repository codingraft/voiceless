import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(req: Request) {
    await dbConnect();
  try {
    const { searchParams } = new URL(req.url);

    const queryParam = {
      username: searchParams.get("username"),
    };

    const result = UsernameQuerySchema.safeParse(queryParam); // Validate with Zod
    console.log("check-result", result);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors.length > 0
              ? usernameErrors[0]
              : "Invalid query params",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "User already exists",
        },
        { status: 400 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in checking username unique", error);
    return Response.json(
      {
        success: false,
        message: "Error in checking username unique",
      },
      { status: 500 }
    );
  }
}
