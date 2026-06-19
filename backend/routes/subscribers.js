const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const rateLimit = require('express-rate-limit');
const db = require('../config/db');
const { authenticateAdmin } = require('../middleware/auth');
const emailService = require('../services/emailServices');

const subscribeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: { error: 'Too many subscription attempts. Try again later.' }
});

// POST /api/subscribers — Public: subscribe
router.post('/', subscribeLimiter, [
  body('email').isEmail().normalizeEmail(),
  body('name').optional().trim().isLength({ max: 100 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { email, name } = req.body;
    const token = uuidv4();

    const result = await db.query(
      `INSERT INTO subscribers (email, name, unsubscribe_token)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET is_active=TRUE
       RETURNING *`,
      [email, name || null, token]
    );

    // Send welcome email
    emailServices.sendWelcomeEmail(result.rows[0]).catch(console.error);

    res.status(201).json({ message: 'Successfully subscribed! Check your email.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/subscribers/unsubscribe/:token — Public: unsubscribe
router.get('/unsubscribe/:token', async (req, res) => {
  try {
    const result = await db.query(
      `UPDATE subscribers SET is_active=FALSE
       WHERE unsubscribe_token=$1 RETURNING email`,
      [req.params.token]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json({ message: `Successfully unsubscribed ${result.rows[0].email}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/subscribers — Admin: get all subscribers
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, email, name, subscribed_at, is_active FROM subscribers ORDER BY subscribed_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
