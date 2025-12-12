const JsonValidator = require('./jsonValidator');
const GroupFactory = require('./groupFactory');
const IndexAssigner = require('./indexAssigner');
const BabyAssigner = require('./babyAssigner');
const EmailSender = require('./emailSender');

class MatchingOrchestrator {
  static async orchestrate(groupsJson, sendEmails = false) {
    // Stage 1: Validate JSON
    JsonValidator.validate(groupsJson);

    // Stage 2: Create Group objects
    const groups = GroupFactory.createFromJson(groupsJson);

    // Stage 3: Assign sequential indices
    const highestIndex = IndexAssigner.assign(groups);

    // Stage 4: Assign babies
    BabyAssigner.assign(groups, highestIndex);

    // Stage 5: Send emails (optional)
    if (sendEmails) {
      await EmailSender.sendAssignments(groups);
    }

    return groups;
  }
}

module.exports = MatchingOrchestrator;
