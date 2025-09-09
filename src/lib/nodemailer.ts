import nodemailer from "nodemailer";

export const sendEmail = async ({
  from,
  to,
  email,
  id,
  subject,
  isClick,
  redirectUrl,
}: {
  from: string;
  to: string;
  email: string;
  id: string;
  subject: string;
  isClick?: boolean;
  redirectUrl?: string;
}): Promise<{ success: boolean; message: string }> => {
  const transporter = nodemailer.createTransport({
    // host: process.env.SMTP_HOST,
    // port: 587,
    service: "gmail",
    secure: process.env.NODE_ENV === "production",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const trackingUrl = `${
    process.env.NODE_ENV === "production" ? "https" : "http"
  }://${process.env.NEXT_PUBLIC_URL}/api/email/tracker?id=${id}`;

  let htmlBody = `
    <div>
    ${email}
    <img src="${trackingUrl}" width="1" height="1" style="display:none;" alt="." />
    </div>
    `;

  if (isClick) {
    if (!redirectUrl) {
      return { success: false, message: "redirect url missing" };
    }
    const newhtmlbody = htmlBody.replace("emailId", `${id}`);
    const finalBody = newhtmlbody.replace("redirectUrl", `${redirectUrl}`);
    htmlBody = finalBody;
  }

  const isEmailValid =
    htmlBody.includes("emailId") || htmlBody.includes("redirectUrl");

  if (!isEmailValid) {
    return { success: false, message: "emailId or redirectUrl missing" };
  }

  console.log({ htmlBody });

  try {
    await transporter.sendMail({
      from: from,
      to,
      subject,
      html: htmlBody,
    });

    return { success: true, message: "Email Sent!" };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Failed to Sent" };
  }
};
