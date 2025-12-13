/**
 * PickOrderRules - Business rules for pick order assignment
 * Pure business logic with no dependencies on external services
 */
class PickOrderRules {
  /**
   * Validate that pick order is valid
   * @throws {Error} If validation fails
   */
  static validatePickOrders(groups) {
    if (!groups || groups.length === 0) {
      throw new Error('No groups provided');
    }

    const assignedIndices = new Set();

    for (const group of groups) {
      for (const member of group.getMembers()) {
        const index = member.getIndex();

        if (index === null || index === undefined) {
          throw new Error(`Member ${member.getName()} missing pick order index`);
        }

        if (assignedIndices.has(index)) {
          throw new Error(`Duplicate pick order index: ${index}`);
        }

        assignedIndices.add(index);
      }
    }

    return true;
  }

  /**
   * Validate pick groups have required members
   */
  static validatePickGroups(pickGroups) {
    for (const group of pickGroups) {
      if (group.getMembers().length === 0) {
        throw new Error(`Pick group ${group.getGroupName()} has no members`);
      }
    }

    return true;
  }

  /**
   * Validate sequential assignment
   */
  static validateSequentialAssignment(groups) {
    const indices = [];

    for (const group of groups) {
      for (const member of group.getMembers()) {
        const index = member.getIndex();
        if (index !== null && index !== undefined) {
          indices.push(index);
        }
      }
    }

    indices.sort((a, b) => a - b);

    for (let i = 0; i < indices.length; i++) {
      if (indices[i] !== i + 1) {
        throw new Error(`Non-sequential assignment: expected ${i + 1}, got ${indices[i]}`);
      }
    }

    return true;
  }
}

module.exports = PickOrderRules;
