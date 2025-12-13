const express = require('express');
const fs = require('fs');
const path = require('path');
const { validateSavePayload } = require('../../middleware/validation');

const router = express.Router();
const GROUPS_DIR = path.join(__dirname, '../../..', 'groups-config');

// Ensure groups config directory exists
if (!fs.existsSync(GROUPS_DIR)) {
  fs.mkdirSync(GROUPS_DIR, { recursive: true });
}

/**
 * POST /api/groups/save
 * Save groups configuration to file
 */
router.post('/save', validateSavePayload, (req, res, next) => {
  try {
    const { groups, filename } = req.body;

    // Sanitize filename
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_') + '.json';
    const filepath = path.join(GROUPS_DIR, sanitizedFilename);

    fs.writeFileSync(filepath, JSON.stringify(groups, null, 2));
    
    res.json({
      success: true,
      message: `Groups saved to ${sanitizedFilename}`,
      filename: sanitizedFilename
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/groups/load/:filename
 * Load groups configuration from file
 */
router.get('/load/:filename', (req, res, next) => {
  try {
    const { filename } = req.params;

    // Sanitize filename
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filepath = path.join(GROUPS_DIR, sanitizedFilename);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const data = fs.readFileSync(filepath, 'utf-8');
    const groups = JSON.parse(data);
    
    res.json({ success: true, groups });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/groups/list
 * List all saved group configurations
 */
router.get('/list', (req, res, next) => {
  try {
    const files = fs.readdirSync(GROUPS_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    res.json({ success: true, files: jsonFiles });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
