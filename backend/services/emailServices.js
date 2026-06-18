const nodemailer = require('nodemailer');
const db = require('../config/db');
require('dotenv').config();

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const fromAddress = `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`;

// ── Welcome email ──────────────────────────────────────────────
const sendWelcomeEmail = async (subscriber) => {
  const unsubscribeUrl = `${process.env.FRONTEND_URL}/unsubscribe/${subscriber.unsubscribe_token}`;

  await transporter.sendMail({
    from: fromAddress,
    to: subscriber.email,
    subject: '👋 Welcome to the IAM Engineer Newsletter!',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f5f5f5;">
        <div style="background:#fff;border-radius:8px;padding:30px;border-top:4px solid #378ADD;">
          <h1 style="color:#185FA5;margin-top:0;">Welcome${subscriber.name ? `, ${subscriber.name}` : ''}! 🛡️</h1>
          <p style="color:#333;line-height:1.6;">
            Thanks for subscribing! You'll be the first to know when I publish new write-ups
            about Identity and Access Management, security engineering, and more.
          </p>
          <p style="color:#333;line-height:1.6;">
            Expect deep dives into topics like:
          </p>
          <ul style="color:#555;">
            <li>Zero Trust Architecture</li>
            <li>RBAC / ABAC implementations</li>
            <li>SSO & Federation protocols</li>
            <li>PAM & IGA strategies</li>
            <li>Certification guides & tips</li>
          </ul>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
          <p style="color:#999;font-size:12px;">
            Don't want emails? <a href="${unsubscribeUrl}" style="color:#378ADD;">Unsubscribe here</a>.
          </p>
        </div>
      </body>
      </html>
    `
  });
};

// ── Newsletter notification ────────────────────────────────────
const sendNewsletterNotification = async (writeup) => {
  // Get all active subscribers
  const result = await db.query(
    'SELECT email, name, unsubscribe_token FROM subscribers WHERE is_active = TRUE'
  );

  const subscribers = result.rows;
  if (subscribers.length === 0) return;

  const writeupUrl = `${process.env.FRONTEND_URL}/writeups/${writeup.slug}`;

  // Send individual emails (use BCC in production for large lists)
  const emailPromises = subscribers.map(sub => {
    const unsubscribeUrl = `${process.env.FRONTEND_URL}/unsubscribe/${sub.unsubscribe_token}`;

    return transporter.sendMail({
      from: fromAddress,
      to: sub.email,
      subject: `📝 New Write-up: ${writeup.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f5f5f5;">
          <div style="background:#fff;border-radius:8px;padding:30px;border-top:4px solid #378ADD;">
            <p style="color:#378ADD;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0;">New Write-up Published</p>
            <h1 style="color:#185FA5;margin-top:8px;">${writeup.title}</h1>
            <p style="color:#555;line-height:1.6;">${writeup.summary}</p>
            <div style="margin:16px 0;">
              ${writeup.tags.map(tag =>
                `<span style="background:#E6F1FB;color:#185FA5;padding:4px 10px;border-radius:20px;font-size:12px;margin-right:6px;">${tag}</span>`
              ).join('')}
            </div>
            <a href="${writeupUrl}"
               style="display:inline-block;background:#378ADD;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;margin-top:10px;">
              Read the Full Write-up →
            </a>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
            <p style="color:#999;font-size:12px;">
              You're receiving this because you subscribed to IAM engineering updates.
              <a href="${unsubscribeUrl}" style="color:#378ADD;">Unsubscribe</a>
            </p>
          </div>
        </body>
        </html>
      `
    }).catch(err => console.error(`Failed to send to ${sub.email}:`, err));
  });

  await Promise.allSettled(emailPromises);
  console.log(`📧 Newsletter sent to ${subscribers.length} subscribers`);
};

module.exports = { sendWelcomeEmail, sendNewsletterNotification };
