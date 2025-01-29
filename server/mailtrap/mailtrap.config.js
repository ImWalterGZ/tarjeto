import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";
dotenv.config();

console.log(
  "Mailtrap Token loaded:",
  process.env.MAILTRAP_TOKEN ? "Yes" : "No"
);

export const mailtrapClient = new MailtrapClient({
  endpoint: process.env.MAILTRAP_ENDPOINT || "https://send.api.mailtrap.io/",
  token: process.env.MAILTRAP_TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "GZZZ",
};
