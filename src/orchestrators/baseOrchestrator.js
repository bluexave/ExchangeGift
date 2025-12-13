const { JsonValidator } = require('../shared/validators');
const { GroupFactory } = require('../shared/factories');

class BaseOrchestrator {
  /**
   * Validates JSON structure
   * @param {Object[]} groupsJson - Raw groups JSON
   * @throws {Error} If validation fails
   */
  static validateJson(groupsJson) {
    JsonValidator.validate(groupsJson);
  }

  /**
   * Creates Group objects from JSON
   * @param {Object[]} groupsJson - Raw groups JSON
   * @returns {Group[]} Array of Group objects
   */
  static createGroups(groupsJson) {
    return GroupFactory.createFromJson(groupsJson);
  }

  /**
   * Validates that all members have been assigned indices (for matching)
   * @param {Group[]} groups - Array of groups
   * @throws {Error} If any member is missing an index
   */
  static validateAllMembersIndexed(groups) {
    for (const group of groups) {
      for (const member of group.getMembers()) {
        if (member.getIndex() === null || member.getIndex() === undefined) {
          throw new Error(
            `Member "${member.getName()}" in group "${group.getGroupName()}" is missing a pick order index. Run PickOrderDraft first.`
          );
        }
      }
    }
  }
}

module.exports = BaseOrchestrator;
