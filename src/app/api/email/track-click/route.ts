import Email from "@/schema/email";
import { NextRequest, NextResponse } from "next/server";

// You can replace this with DB logic
const logClick = async ({
  emailId,
  link,
}: {
  emailId: string;
  link: string;
}) => {
  console.log(
    `Email ID: ${emailId}, Link Clicked: ${link}, Timestamp: ${new Date().toISOString()}`
  );

  try {
    // TODO: Store this info in a database for CTR calculation
    const email = await Email.findById({ _id: emailId });

    if (!email) {
      console.log("failed to find email");
      return NextResponse.redirect(link, 302);
    }

    const updated_email = await Email.findByIdAndUpdate(
      { _id: emailId },
      {
        isClick: true,
        clickCount: parseInt(email.clickCount) + 1,
      }
    );

    if (!updated_email) {
      console.log("failed to update email");
      return NextResponse.redirect(link, 302);
    }
  } catch (error) {
    console.log("error while tracking click: ", error);
    return NextResponse.redirect(link, 302);
  }
};

export async function GET(req: NextRequest) {
  const emailId = req.nextUrl.searchParams.get("id");
  const target = req.nextUrl.searchParams.get("url");
  console.log({ url: req.nextUrl });
  if (!emailId || !target) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  // Log the click
  await logClick({ emailId, link: target });

  // Redirect to the actual destination
  return NextResponse.redirect(target, 302);
}
