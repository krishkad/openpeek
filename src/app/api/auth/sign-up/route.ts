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

    const xUser = await User.findOne({ email });

    if (xUser) {
      return NextResponse.json({
        success: false,
        message: "user already exists",
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await User.create({ email, password: hashedPassword });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "failed to create user",
      });
    }

    const {password: _, ...others } = user._doc;

    const filtered_user = others

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

    response.cookies.set("email-tracker-auth-token", token);

    return response;
  } catch (error) {
    console.log("error while creating user: ", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
