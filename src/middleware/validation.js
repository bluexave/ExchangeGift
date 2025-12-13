/**
 * Request validation middleware and utilities
 */
function validateArrayPayload(req, res, next) {
  if (!Array.isArray(req.body?.groups)) {
    return res.status(400).json({ 
      error: 'Groups must be an array' 
    });
  }
  next();
}

function validateGroupMembers(groups) {
  for (const group of groups) {
    if (!Array.isArray(group.members)) {
      throw {
        status: 400,
        message: `Group "${group.name}" must have members array`
      };
    }

    for (const member of group.members) {
      if (typeof member !== 'object' || !member || typeof member.name !== 'string') {
        throw {
          status: 400,
          message: `All members must be objects with name property`
        };
      }
    }
  }
}

function validateMembersIndexed(groups) {
  for (const group of groups) {
    for (const member of group.members) {
      if (member.index === null || member.index === undefined) {
        throw {
          status: 400,
          message: `Member "${member.name}" is missing pick order index. Run PickOrderDraft first.`
        };
      }
    }
  }
}

function validateSavePayload(req, res, next) {
  const { groups, filename } = req.body;

  if (!groups || !Array.isArray(groups)) {
    return res.status(400).json({ 
      error: 'Groups must be an array' 
    });
  }

  if (!filename || typeof filename !== 'string') {
    return res.status(400).json({ 
      error: 'Filename is required' 
    });
  }

  next();
}

module.exports = {
  validateArrayPayload,
  validateGroupMembers,
  validateMembersIndexed,
  validateSavePayload
};
