const express = require('express');
const MatchingOrchestrator = require('../../orchestrators/matchingOrchestrator');
const { validateArrayPayload, validateGroupMembers, validateMembersIndexed } = require('../../middleware/validation');

const router = express.Router();

/**
 * POST /api/match
 * Execute gift matching with validated pick orders
 */
router.post('/', validateArrayPayload, async (req, res, next) => {
  try {
    const { groups, sendEmails = false } = req.body;

    validateGroupMembers(groups);
    validateMembersIndexed(groups);

    const builtGroups = await MatchingOrchestrator.orchestrate(groups, sendEmails);

    const response = {
      success: true,
      message: `Successfully matched ${builtGroups.reduce((sum, g) => sum + g.getMembers().length, 0)} members!`
    };

    // In test mode, include member assignments
    if (!sendEmails) {
      const members = [];
      for (const group of builtGroups) {
        for (const member of group.getMembers()) {
          const babyIndex = member.getBaby();
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
    next(error);
  }
});

module.exports = router;
