import { connectToDatabase } from "@/lib/db";
import { formatToDateMinute } from "@/lib/utils";
import Email from "@/schema/email";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  // Create a 1x1 transparent PNG (base64)
  await connectToDatabase();

  const pixel = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wwAAn8B9tX53zUAAAAASUVORK5CYII=",
    "base64"
  );

  try {
    const id = new URL(req.url).searchParams.get("id");

    if (!id) {
      return new Response(pixel, {
        status: 200,
        headers: {
          "Content-Type": "image/png",
          "Content-Length": pixel.length.toString(),
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
    }

    console.log("tracking id: ", id);

    console.log("Email opened:", {
      id,
      ip: req.headers.get("x-forwarded-for") || "unknown",
      userAgent: req.headers.get("user-agent"),
    });

    const isEmail = await Email.findById({ _id: id });

    const now = new Date();
    console.log({ isEmail });

    if (!isEmail) {
      return new Response(pixel, {
        status: 200,
        headers: {
          "Content-Type": "image/png",
          "Content-Length": pixel.length.toString(),
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
    }

    const createdAtFormatted = formatToDateMinute(isEmail.createdAt);
    const nowFormatted = formatToDateMinute(now);

    if (createdAtFormatted === nowFormatted) {
      console.log("Same date and minute");
      return new Response(pixel, {
        status: 200,
        headers: {
          "Content-Type": "image/png",
          "Content-Length": pixel.length.toString(),
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
    }

    const updated_email = await Email.findByIdAndUpdate(
      { _id: id },
      {
        isOpen: true,
        openCount: parseInt(isEmail.openCount) + 1,
      }
    );

    if (!updated_email) {
      return new Response(pixel, {
        status: 200,
        headers: {
          "Content-Type": "image/png",
          "Content-Length": pixel.length.toString(),
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
    }

    console.log({
      isOpen: updated_email.isOpen,
      openCount: updated_email.openCount,
    });

    return new Response(pixel, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Length": pixel.length.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.log("error while tracking email: ", error);
    return new Response(pixel, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Length": pixel.length.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  }
}
