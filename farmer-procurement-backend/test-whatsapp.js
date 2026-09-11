require("dotenv").config();

const { sendWhatsApp } = require("./src/services/notification.service");

const testMessage = `
Hello Parv! 👋

This is a test message from the Farmer Procurement System.

WhatsApp integration is working successfully! ✅
`;

sendWhatsApp("+918618467896", testMessage)
  .then(() => {
    console.log("Test completed.");
  })
  .catch((error) => {
    console.error("Test failed.");
  });