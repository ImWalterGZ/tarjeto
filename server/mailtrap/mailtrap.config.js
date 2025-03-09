import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";
dotenv.config();

// Validate sender email format
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const defaultSenderEmail = "hello@tarjeto.com";
const senderEmail =
  process.env.MAILTRAP_SENDER && validateEmail(process.env.MAILTRAP_SENDER)
    ? process.env.MAILTRAP_SENDER
    : defaultSenderEmail;

console.log("Mailtrap Configuration:");
console.log("- Token loaded:", process.env.MAILTRAP_TOKEN ? "Yes" : "No");
console.log("- Sender email:", senderEmail);
console.log(
  "- Endpoint:",
  process.env.MAILTRAP_ENDPOINT || "https://send.api.mailtrap.io/"
);

export const mailtrapClient = new MailtrapClient({
  endpoint: process.env.MAILTRAP_ENDPOINT || "https://send.api.mailtrap.io/",
  token: process.env.MAILTRAP_TOKEN,
});

export const sender = {
  email: senderEmail,
  name: "Tarjeto",
};
