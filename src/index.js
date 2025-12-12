const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const MatchingOrchestrator = require('./matchingOrchestrator');
const PickOrderOrchestrator = require('./pickOrderOrchestrator');
const app = express();
const PORT = process.env.PORT || 3000;
const GROUPS_DIR = path.join(__dirname, '../groups-config');

// Ensure groups config directory exists
if (!fs.existsSync(GROUPS_DIR)) {
  fs.mkdirSync(GROUPS_DIR, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/match', async (req, res) => {
  try {
    const { groups, sendEmails = false } = req.body;

    if (!Array.isArray(groups)) {
      return res.status(400).json({ error: 'Groups must be an array' });
    }

    // Validate that all members have proper structure and indices when needed
    for (const group of groups) {
      if (!Array.isArray(group.members)) {
        return res.status(400).json({ error: `Group "${group.name}" must have members array` });
      }
      for (const member of group.members) {
        // Members should be objects with name and index properties
        if (typeof member !== 'object' || !member || typeof member.name !== 'string') {
          return res.status(400).json({ error: `All members must be objects with name property` });
        }
        // For /api/match, index must not be null
        if (member.index === null || member.index === undefined) {
          return res.status(400).json({ error: `Member "${member.name}" is missing pick order index. Run PickOrderDraft first.` });
        }
      }
    }

    // Keep members with indices for MatchingOrchestrator
    // MatchingOrchestrator needs the indices to validate all members are indexed
    const groupsForMatching = groups;

    // Validate and build groups from JSON
    const builtGroups = await MatchingOrchestrator.orchestrate(groupsForMatching, sendEmails);

    // Build response based on sendEmails flag
    const response = {
      success: true,
      message: `Successfully matched ${builtGroups.reduce((sum, g) => sum + g.getMembers().length, 0)} members!`
    };

    // If not sending emails (test mode), include member assignments
    if (!sendEmails) {
      const members = [];
      for (const group of builtGroups) {
        for (const member of group.getMembers()) {
          const babyIndex = member.getBaby();
          // Find baby name
          let babyName = `Member ${babyIndex}`;
          for (const g of builtGroups) {
            for (const m of g.getMembers()) {
              if (m.getIndex() === babyIndex) {
                babyName = m.getName();
                break;
              }
            }
          }
          members.push({
            giver: member.getName(),
            receiver: babyName
          });
        }
      }
      response.members = members;
    }

    res.json(response);
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

app.post('/api/draft-pick-order', async (req, res) => {
  try {
    const { groups } = req.body;

    // Validate and draft pick order
    const draftedGroups = await PickOrderOrchestrator.orchestrate(groups);

    // Return groups with assigned indices
    res.json({
      success: true,
      groups: draftedGroups.map(group => ({
        name: group.getGroupName(),
        email: group.getEmail(),
        isPickAtLeastOnePerGroup: group.getPickAtLeastOnePerGroup(),
        members: group.getMembers().map(member => ({
          name: member.getName(),
          index: member.getIndex()
        }))
      }))
    });
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Save groups configuration
app.post('/api/groups/save', (req, res) => {
  try {
    const { groups, filename } = req.body;

    if (!groups || !Array.isArray(groups)) {
      return res.status(400).json({ error: 'Groups must be an array' });
    }

    if (!filename || typeof filename !== 'string') {
      return res.status(400).json({ error: 'Filename is required' });
    }

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
    res.status(500).json({ error: error.message });
  }
});

// Load groups configuration
app.get('/api/groups/load/:filename', (req, res) => {
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
    res.status(500).json({ error: error.message });
  }
});

// List saved group configurations
app.get('/api/groups/list', (req, res) => {
  try {
    const files = fs.readdirSync(GROUPS_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    res.json({ success: true, files: jsonFiles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log('Gift Exchange API running on http://localhost:' + PORT);
});
