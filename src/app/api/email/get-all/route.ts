import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import Email from "@/schema/email";
import { connectToDatabase } from "@/lib/db";

interface CustomJWTPayload extends JwtPayload {
  id: string;
  email: string;
}

export async function GET(req: NextRequest) {
  await connectToDatabase();
  try {
    const auth_token = req.cookies.get("email-tracker-auth-token")?.value;

    if (!auth_token) {
      return NextResponse.json({
        success: false,
        message: "auth token not found",
      });
    }

    const jwtData = jwt.verify(
      auth_token,
      "krrishkadamisahero"
    ) as CustomJWTPayload;

    if (!jwtData.id) {
      return NextResponse.json({
        success: false,
        message: "auth token not found. invalid credentials",
      });
    }

    console.log({ id: jwtData.id });

    const emails = await Email.find({ userId: jwtData.id });

    if (emails?.length <= 0) {
      return NextResponse.json({ success: false, message: "no emails found" });
    }

    return NextResponse.json({ success: true, message: "ok", data: emails });
  } catch (error) {
    console.log("error while getting all emails: ", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
