import User from "@/schema/user";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
  await connectToDatabase();
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: "all fields are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ success: false, message: "user not found" });
    }

    const isCorrect = bcrypt.compareSync(password, user.password);

    if (!isCorrect) {
      return NextResponse.json({
        success: false,
        message: "invalid credentials",
      });
    }

    const {password: _, ...others } = user._doc;

    const filtered_user = others;

    const token_data = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(token_data, "krrishkadamisahero");

    const response = NextResponse.json({
      success: true,
      message: "ok",
      data: filtered_user,
    });

    response.cookies.set("email-tracker-auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60,
    });
    return response;
  } catch (error) {
    console.log("error while logging-in: ", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
