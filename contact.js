import express from "express";
import rateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator";
import nodemailer from "nodemailer";
import Contact from "../models/Contact.js";

const router = express.Router();

// Strict rate limit for contact form (5 req / hour)
const contactLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, message: "Too many messages. Try again later." },
});

// Validation rules
const validate = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 80 }),
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("message").trim().notEmpty().withMessage("Message is required").isLength({ min: 10, max: 2000 }),
];

/* POST /api/contact */
router.post("/", contactLimit, validate, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, email, message } = req.body;

  try {
    // 1. Save to DB
    const contact = await Contact.create({ name, email, message });

    // 2. Send notification email
    if (process.env.SMTP_USER) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });

      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
        to: process.env.NOTIFY_EMAIL || process.env.SMTP_USER,
        subject: `New message from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
        html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p>${message.replace(/\n/g, "<br>")}</p>`,
      });
    }

    res.status(201).json({ success: true, id: contact._id });
  } catch (err) {
    next(err);
  }
});

/* GET /api/contact  (admin: list all messages) */
router.get("/", async (req, res, next) => {
  // In production, protect this with auth middleware
  try {
    const messages = await Contact.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
});

export default router;
