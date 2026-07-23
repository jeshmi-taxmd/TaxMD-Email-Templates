const express = require("express");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(express.json());

app.post("/send-test", async (req, res) => {
  try {
    let html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");

    html = html
      .replace(/{{first_name}}/g, "Preeti")
      .replace(/{{expiry_date}}/g, "March 15, 2026")
      .replace(/{{invoice_number}}/g, "1234567890")
      .replace(
        /{{upgrade_url}}/g,
        "https://investorfriendlycpa.monday.com/boards/18395018809/views/234736140",
      )
      .replace(/{{current_year}}/g, new Date().getFullYear())
      .replace(/{{amount_due}}/g, "$100");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: '"TaxMD Test" <' + process.env.EMAIL_USER + ">",
      to: "rajakjeshmi@gmail.com",
      subject: "Test Email Template",
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

app.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});
