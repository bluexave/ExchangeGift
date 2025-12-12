const BaseOrchestrator = require('./baseOrchestrator');
const BabyAssigner = require('./babyAssigner');
const EmailSender = require('./emailSender');

class MatchingOrchestrator extends BaseOrchestrator {
  static async orchestrate(groupsJson, sendEmails = false) {
    // Stage 1: Validate JSON
    this.validateJson(groupsJson);

    // Stage 2: Create Group objects
    const groups = this.createGroups(groupsJson);

    // Stage 3: Validate all members have indices (must run PickOrderDraft first)
    this.validateAllMembersIndexed(groups);

    // Stage 4: Assign babies
    const highestIndex = Math.max(...groups.flatMap(g => g.getMembers().map(m => m.getIndex() || 0)));
    BabyAssigner.assign(groups, highestIndex);

    // Stage 5: Send emails (optional)
    if (sendEmails) {
      await EmailSender.sendAssignments(groups);
    }

    return groups;
  }
}

module.exports = MatchingOrchestrator;
