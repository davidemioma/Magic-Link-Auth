import nodemailer from "nodemailer";

const domain = process.env.BASE_APP_URL;

const from = process.env.EMAIL_USERNAME;

const transporter = nodemailer.createTransport({
  //@ts-ignore
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendMagicLink = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  const confirmLink = `${domain}/auth/magic-link?token=${token}`;

  await transporter.sendMail({
    from,
    to: email,
    subject: "Login with this link",
    html: `<div>
        <a href='${confirmLink}' target="_blank">Login</a>
      </div>`,
  });
};

export const sendEmailChangeEmail = async ({
  newEmail,
  token,
}: {
  newEmail: string;
  token: string;
}) => {
  const confirmLink = `${domain}/auth/new-email?token=${token}`;

  await transporter.sendMail({
    from,
    to: newEmail,
    subject: "Confirm your email",
    html: `<div>
        <a href='${confirmLink}' target="_blank">Verify Email</a>
      </div>`,
  });
};
