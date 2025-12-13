const BaseOrchestrator = require('./baseOrchestrator');
const AssignmentService = require('../business/santababy/assignmentService');
const EmailService = require('../services/emailService');

class MatchingOrchestrator extends BaseOrchestrator {
  static async orchestrate(groupsJson, sendEmails = false) {
    // Step 1: Validate JSON
    this.validateJson(groupsJson);

    // Step 2: Create Group objects
    const groups = this.createGroups(groupsJson);

    // Step 3: Validate all members have pick order indices (prerequisite)
    this.validateAllMembersIndexed(groups);

    // Step 4: Execute gift assignment business logic
    const highestIndex = Math.max(...groups.flatMap(g => g.getMembers().map(m => m.getIndex() || 0)));
    const assignmentService = new AssignmentService();
    assignmentService.executeAssignment(groups, highestIndex);

    // Step 5: Send emails (optional)
    if (sendEmails) {
      await EmailService.sendAssignments(groups);
    }

    return groups;
  }
}

module.exports = MatchingOrchestrator;
