import { resend } from "@/config/resend.js";
import { NODE_ENV, EMAIL_SENDER } from "@/constants/env.js";

type Params = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

const getFromEmail = () =>
  NODE_ENV === "development" ? "Acme <onboarding@resend.dev>" : EMAIL_SENDER;
const getToEmail = (to: string) =>
  NODE_ENV === "development" ? ["delivered@resend.dev"] : to;

export const sendMail = async ({ to, subject, text, html }: Params) =>
  await resend.emails.send({
    from: getFromEmail(),
    to: getToEmail(to),
    subject,
    text,
    html,
  });
