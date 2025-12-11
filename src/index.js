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
    const { families, sendEmails = false } = req.body;

    // Validate and build families from JSON
    const builtFamilies = await MatchingOrchestrator.orchestrate(families, sendEmails);

    // Flatten families to array of members with name and baby
    const matches = [];
    for (const family of builtFamilies) {
      for (const member of family.getMembers()) {
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
