const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/db');
const { authenticateAdmin } = require('../middleware/auth');

// GET /api/projects — Public: get all published projects
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM projects ORDER BY featured DESC, created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/projects/:id — Public: get single project
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM projects WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/projects — Admin: create project
router.post('/', authenticateAdmin, [
  body('title').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('tech_stack').isArray({ min: 1 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { title, description, long_description, tech_stack, github_url, demo_url, image_url, featured } = req.body;

    const result = await db.query(
      `INSERT INTO projects 
        (title, description, long_description, tech_stack, github_url, demo_url, image_url, featured)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [title, description, long_description, tech_stack, github_url, demo_url, image_url, featured || false]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/projects/:id — Admin: update project
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { title, description, long_description, tech_stack, github_url, demo_url, image_url, featured } = req.body;

    const result = await db.query(
      `UPDATE projects SET
        title=$1, description=$2, long_description=$3, tech_stack=$4,
        github_url=$5, demo_url=$6, image_url=$7, featured=$8, updated_at=NOW()
       WHERE id=$9 RETURNING *`,
      [title, description, long_description, tech_stack, github_url, demo_url, image_url, featured, req.params.id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/projects/:id — Admin: delete project
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM projects WHERE id=$1 RETURNING id',
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
