require("dotenv").config();

const { sendSMS } = require("./src/services/notification.service");

const testMessage = `
Hello Parv! 👋

This is a test SMS from the Farmer Procurement System.

SMS integration is working successfully! ✅
`;

sendSMS("+918618467896", testMessage)
  .then(() => {
    console.log("SMS test completed.");
  })
  .catch(() => {
    console.log("SMS test failed.");
  });