import nodemailer from "nodemailer";

const sendEmail = async ({
  to,
  subject,
  text,
  name,
  password,
}: {
  to: string;
  subject: string;
  text: string;
  name?: string;
  password?: string;
}) => {
  const transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 587,
    auth: {
      user: name || process.env.EMAIL_USER,
      pass: password || process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: name || process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
};

export default sendEmail;
