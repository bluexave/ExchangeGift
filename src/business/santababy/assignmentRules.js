/**
 * AssignmentRules - Business rules for gift assignment
 * Pure business logic with no dependencies on external services
 */
class AssignmentRules {
  /**
   * Validate assignment is valid - cannot assign from own family
   */
  static validateAssignmentValidity(groups) {
    if (!groups || groups.length === 0) {
      throw new Error('No groups provided');
    }

    for (const group of groups) {
      const memberIndices = group.getMemberIndices();

      for (const member of group.getMembers()) {
        const baby = member.getBaby();

        if (baby === null || baby === undefined) {
          throw new Error(`Member ${member.getName()} not assigned`);
        }

        // Rule: Cannot assign self
        if (baby === member.getIndex()) {
          throw new Error(
            `${member.getName()} cannot be assigned to themselves`
          );
        }

        // Rule: Cannot assign from same family
        if (memberIndices.includes(baby)) {
          throw new Error(
            `${member.getName()} cannot be assigned to family member (index ${baby})`
          );
        }
      }
    }

    return true;
  }

  /**
   * Validate all members have assignments
   */
  static validateAssignmentCompleteness(groups) {
    const assignedBabies = new Set();

    for (const group of groups) {
      for (const member of group.getMembers()) {
        const baby = member.getBaby();

        if (baby === null || baby === undefined) {
          throw new Error(`Member ${member.getName()} has no assignment`);
        }

        if (assignedBabies.has(baby)) {
          throw new Error(`Duplicate assignment to index ${baby}`);
        }

        assignedBabies.add(baby);
      }
    }

    return true;
  }

  /**
   * Validate assignment prerequisites
   */
  static validatePrerequisites(groups) {
    // All members must have pick order indices
    for (const group of groups) {
      for (const member of group.getMembers()) {
        if (member.getIndex() === null || member.getIndex() === undefined) {
          throw new Error(
            `Member ${member.getName()} missing pick order index - run PickOrder first`
          );
        }
      }
    }

    return true;
  }

  /**
   * Check if assignment is valid (before completion)
   */
  static canAssign(giver, receiver, groupMembers) {
    if (giver.getIndex() === receiver.getIndex()) {
      return false; // Cannot assign self
    }

    if (groupMembers.includes(receiver.getIndex())) {
      return false; // Cannot assign from same family
    }

    return true;
  }
}

module.exports = AssignmentRules;
