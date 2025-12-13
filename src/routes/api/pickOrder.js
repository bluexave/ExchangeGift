const express = require('express');
const PickOrderOrchestrator = require('../../orchestrators/pickOrderOrchestrator');
const { validateArrayPayload } = require('../../middleware/validation');

const router = express.Router();

/**
 * POST /api/draft-pick-order
 * Generate pick order indices for members
 */
router.post('/', validateArrayPayload, async (req, res, next) => {
  try {
    const { groups } = req.body;

    const draftedGroups = await PickOrderOrchestrator.orchestrate(groups);

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
    next(error);
  }
});

module.exports = router;
