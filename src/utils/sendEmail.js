import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, html }) {
  // sender
  const transporter = nodemailer.createTransport({
    host: "localhost",
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"WE LOVE CODE"<${process.env.EMAIL}>`,
    to,
    subject,
    html,
  });

  if (info.accepted.length > 0) return true;
  return false;
}

// sendEmail(); // Remember to call the function to send the email
