const twilio = require("twilio");
require("dotenv").config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendWhatsApp = async (to, message) => {
  try {
    const response = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${to}`,
      body: message,
    });

    console.log("WhatsApp message sent:", response.sid);
    return response;
  } catch (error) {
    console.error("WhatsApp sending failed:", error.message);
    throw error;
  }
};
const sendSMS = async (to, message) => {
  try {
    const response = await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
      body: message,
    });

    console.log("SMS sent:", response.sid);
    return response;
  } catch (error) {
    console.error("SMS sending failed:", error.message);
    throw error;
  }
};

module.exports = {
  sendWhatsApp,
  sendSMS,
};