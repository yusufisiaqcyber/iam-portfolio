const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const slugify = require('slugify');
const db = require('../config/db');
const { authenticateAdmin } = require('../middleware/auth');
const emailService = require('../services/emailService');

// GET /api/writeups — Public: get published writeups
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, title, slug, summary, tags, published_at, created_at
       FROM writeups WHERE published = TRUE
       ORDER BY published_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/writeups/all — Admin: get all writeups (including drafts)
router.get('/all', authenticateAdmin, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM writeups ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/writeups/:slug — Public: get single writeup by slug
router.get('/:slug', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM writeups WHERE slug=$1 AND published=TRUE',
      [req.params.slug]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Write-up not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/writeups — Admin: create writeup
router.post('/', authenticateAdmin, [
  body('title').notEmpty().trim(),
  body('summary').notEmpty().trim(),
  body('content').notEmpty(),
  body('tags').isArray({ min: 1 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { title, summary, content, tags, published } = req.body;
    let slug = slugify(title, { lower: true, strict: true });

    // Ensure unique slug
    const existing = await db.query('SELECT id FROM writeups WHERE slug=$1', [slug]);
    if (existing.rows.length > 0) {
      slug = `${slug}-${Date.now()}`;
    }

    const publishedAt = published ? new Date() : null;

    const result = await db.query(
      `INSERT INTO writeups (title, slug, summary, content, tags, published, published_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [title, slug, summary, content, tags, published || false, publishedAt]
    );

    const writeup = result.rows[0];

    // Send newsletter if published
    if (published) {
      emailService.sendNewsletterNotification(writeup).catch(console.error);
    }

    res.status(201).json(writeup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/writeups/:id — Admin: update writeup
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { title, summary, content, tags, published } = req.body;

    // Check if this is a new publish action
    const current = await db.query('SELECT published FROM writeups WHERE id=$1', [req.params.id]);
    const wasPublished = current.rows[0]?.published;
    const publishedAt = published && !wasPublished ? new Date() : undefined;

    const query = publishedAt
      ? `UPDATE writeups SET title=$1,summary=$2,content=$3,tags=$4,published=$5,published_at=$6,updated_at=NOW()
         WHERE id=$7 RETURNING *`
      : `UPDATE writeups SET title=$1,summary=$2,content=$3,tags=$4,published=$5,updated_at=NOW()
         WHERE id=$6 RETURNING *`;

    const params = publishedAt
      ? [title, summary, content, tags, published, publishedAt, req.params.id]
      : [title, summary, content, tags, published, req.params.id];

    const result = await db.query(query, params);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Write-up not found' });

    const writeup = result.rows[0];

    // Send newsletter if newly published
    if (published && !wasPublished) {
      emailService.sendNewsletterNotification(writeup).catch(console.error);
    }

    res.json(writeup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/writeups/:id — Admin: delete writeup
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const result = await db.query('DELETE FROM writeups WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Write-up not found' });
    res.json({ message: 'Write-up deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
