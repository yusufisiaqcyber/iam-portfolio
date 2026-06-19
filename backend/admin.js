const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth');
const db = require('../config/db');

// Middleware to protect all admin routes
router.use(authenticateAdmin);

// Simple health check for admin
router.get('/health', (req, res) => {
  res.json({ status: 'Admin API working' });
});

// Example: Get all projects (for admin dashboard)
router.get('/projects', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Example: Get all writeups
router.get('/writeups', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM writeups ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch writeups' });
  }
});

// TODO: Add more routes later (create/update/delete projects & writeups)

module.exports = router;
