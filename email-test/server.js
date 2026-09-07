const express = require("express");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const app = express();
app.use(express.json());

// Test data for email-test/index.html (accept-invitation-fullaccess)
const testData = {
  inviter_name: "Pratik Poudel",
  invitation_note:
    "Hi Ketan, please review these plans and the questions I marked for discussion.",
  invitation_expiry_days: "7",
  collaboration_expiry_days: "10",
  accept_link: "https://taxmd.com",
  decline_link: "https://taxmd.com",
  current_year: String(new Date().getFullYear()),
};

app.post("/send-test", async (req, res) => {
  try {
    let html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");

    for (const [key, value] of Object.entries(testData)) {
      html = html.replaceAll(`{{${key}}}`, value);
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: '"TaxMD Test" <' + process.env.EMAIL_USER + ">",
      to: "ketan@taxmd.com",
      subject: "Test Invitation For Collaboration",
      html,
    });

    res.send("Test email sent");
  } catch (error) {
    console.error("--- SEND EMAIL ERROR ---");
    console.error(error);
    console.error("-------------------------");
    res.status(500).send("Failed to send email: " + error.message);
  }
});

const server = app.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      "Port 8000 is already in use. Stop the other process first:\n  kill $(lsof -t -i:8000)",
    );
  } else {
    console.error(err);
  }
  process.exit(1);
});
