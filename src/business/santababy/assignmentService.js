const AssignmentRules = require('./assignmentRules');
const FirstDrafter = require('./santababydraft/firstDrafter');
const SecondDrafter = require('./santababydraft/secondDrafter');

/**
 * AssignmentService - Business logic for gift assignment
 * Delegates to drafters for algorithm implementation
 */
class AssignmentService {
  constructor() {
    this.firstDrafter = FirstDrafter;
    this.secondDrafter = SecondDrafter;
  }

  /**
   * Execute gift assignment workflow
   * @param {Group[]} groups - Array of groups with pick orders assigned
   * @param {number} highestIndex - Highest member index
   * @returns {Group[]} - Groups with assignments
   */
  executeAssignment(groups, highestIndex) {
    // Validate prerequisites
    AssignmentRules.validatePrerequisites(groups);

    const MAX_RETRIES = 10;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        console.log(`\n[AssignmentService] Attempt ${attempt + 1}/${MAX_RETRIES}`);

        // Phase 1: Pick group members select sequentially
        const { assignedBabies, currentSeed } = this.firstDrafter.assign(
          groups,
          highestIndex
        );

        // Phase 2: Remaining members select randomly
        this.secondDrafter.assign(groups, highestIndex, assignedBabies, currentSeed);

        // Validate result
        AssignmentRules.validateAssignmentValidity(groups);
        AssignmentRules.validateAssignmentCompleteness(groups);

        console.log(`[AssignmentService] ✓ Assignment successful on attempt ${attempt + 1}\n`);
        return groups;
      } catch (error) {
        console.log(`[AssignmentService] ✗ Attempt ${attempt + 1} failed: ${error.message}`);

        // Reset assignments for retry
        for (const group of groups) {
          for (const member of group.getMembers()) {
            member.setBaby(null);
          }
        }

        if (attempt === MAX_RETRIES - 1) {
          throw new Error(
            `Assignment failed after ${MAX_RETRIES} attempts: ${error.message}`
          );
        }
      }
    }
  }

  /**
   * Validate assignment
   */
  validateAssignment(groups) {
    AssignmentRules.validateAssignmentValidity(groups);
    AssignmentRules.validateAssignmentCompleteness(groups);
    return true;
  }
}

module.exports = AssignmentService;
