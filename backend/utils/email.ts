// // src/utils/email.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export async function sendSignupOtp(to: string, otp: string) {
  try {
    return await transporter.sendMail({
      from: `"Blueboard" <${process.env.MAIL_FROM}>`,
      to,
      subject: "Your verification code",
      text: `Your one-time code is: ${otp}\nThis code expires in 10 minutes.`,
      html: `
        <div style="font-family:Arial,sans-serif">
          <h2>Verify your email</h2>
          <p>Your one-time code is:</p>
          <p style="font-size:28px;letter-spacing:8px;"><strong>${otp}</strong></p>
          <p>This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
        </div>`,
    });
  } catch (err) {
    console.error("Error sending OTP email:", err);
    throw new Error("Failed to send OTP email");
  }
}

