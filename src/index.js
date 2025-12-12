const express = require('express');
const cors = require('cors');
const MatchingOrchestrator = require('./matchingOrchestrator');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/match', async (req, res) => {
  try {
    const { groups, sendEmails = false } = req.body;

    // Validate and build groups from JSON
    const builtGroups = await MatchingOrchestrator.orchestrate(groups, sendEmails);

    // Flatten groups to array of members with name and baby
    const matches = [];
    for (const group of builtGroups) {
      for (const member of group.getMembers()) {
        matches.push({
          name: member.getName(),
          baby: member.getBaby()
        });
      }
    }

    res.json({
      success: true,
      matches: matches
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

// Start server
app.listen(PORT, () => {
  console.log('Gift Exchange API running on http://localhost:' + PORT);
});
