import { connectToDatabase } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Email from "@/schema/email";
import { sendEmail } from "@/lib/nodemailer";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomJWTPayload extends JwtPayload {
  id: string;
  email: string;
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { to, from, email, trackEnable, subject, isClick, redirectUrl } =
      await req.json();
    const auth_token = req.cookies.get("email-tracker-auth-token")?.value;

    if (!auth_token) {
      return NextResponse.json({
        success: false,
        message: "invalid creadentils",
      });
    }

    if (!to || !from || !email || !trackEnable) {
      return NextResponse.json({
        success: false,
        message: "all fields are required",
      });
    }

    const token_data = jwt.verify(
      auth_token,
      "krrishkadamisahero"
    ) as CustomJWTPayload;

    if (!token_data.id) {
      return NextResponse.json({
        success: false,
        message: "invalid credentails",
      });
    }

    const create_email = await Email.create({
      subject,
      fromEmail: from,
      toEmail: to,
      body: email,
      trackEnable,
      userId: token_data.id,
      isClick: isClick ?? false,
      redirectUrl: redirectUrl,
    });

    if (!create_email) {
      return NextResponse.json({
        success: false,
        message: "failed to create email",
      });
    }

    const email_send = await sendEmail({
      from: create_email.fromEmail,
      to: create_email.toEmail,
      email: create_email.body,
      id: create_email._id,
      subject: create_email.subject,
      isClick: isClick ?? false,
      redirectUrl,
    });

    if (!email_send.success) {
      return NextResponse.json({
        success: false,
        message: "failed to sent email",
      });
    }

    let updated_email;

    if (isClick) {
      const htmlbody = create_email.body.replace(
        "emailId",
        `${create_email._id}`
      );
      const finalBody = htmlbody.replace(
        "redirectUrl",
        `${redirectUrl}`
      );

      console.log({finalBody})
      updated_email = await Email.findByIdAndUpdate(create_email._id, {
        status: "sent",
        body: finalBody,
      });
    } else {
      updated_email = await Email.findByIdAndUpdate(create_email._id, {
        status: "sent",
      });
      console.log("else condition")
    }

    if (!updated_email) {
      return NextResponse.json({
        success: false,
        message: "failed to update email status",
      });
    }

    return NextResponse.json({
      success: true,
      message: "email sent successfully",
      data: updated_email,
    });
  } catch (error) {
    console.log("error while sending email: ", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
