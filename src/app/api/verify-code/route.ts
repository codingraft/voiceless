// import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
// import { verifySchema } from "@/schemas/verifySchema";
// import { usernameValidation } from "@/schemas/signUpSchema";

// const VerifyQuerySchema = z.object({
//   username: usernameValidation,
//   verifyCode: verifySchema,
// });

function createResponse(success: boolean, message: string, status = 200) {
  return Response.json({ success, message }, { status });
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);

    // const result = VerifyQuerySchema.safeParse({
    //   username: decodedUsername,
    //   verifyCode: code,
    // });
    // if (!result.success) {
    //   const usernameErrors = result.error.format().username?._errors || [];
    //   const verifyCodeErrors = result.error.format().verifyCode?._errors || [];
    //   return createResponse(
    //     false,
    //     usernameErrors[0] || verifyCodeErrors[0] || "Invalid query params",
    //     400
    //   );
    // }

    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) return createResponse(false, "User not found", 404);

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired  = new Date(user.verifyCodeExpiration) > new Date();

    if (isCodeValid && isCodeNotExpired ) {
      user.isVerified = true;
      await user.save();
      return createResponse(true, "User verified successfully");
    } else if (!isCodeValid) {
      return createResponse(false, "Invalid verification code", 400);
    } else {
      return createResponse(false, "Verification code expired", 400);
    }
  } catch (error) {
    console.log("Error in verifying code", error);
    return createResponse(false, "Error in verifying code", 500);
  }
}
