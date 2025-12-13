const PickOrderRules = require('./pickOrderRules');
const PickGroupDrafter = require('./pickorderdraft/pickGroupDrafter');
const RemainingDrafter = require('./pickorderdraft/remainingDrafter');

/**
 * PickOrderService - Business logic for pick order assignment
 * Delegates to drafters for algorithm implementation
 */
class PickOrderService {
  constructor() {
    this.pickGroupDrafter = PickGroupDrafter;
    this.remainingDrafter = RemainingDrafter;
  }

  /**
   * Execute pick order assignment workflow
   * @param {Group[]} groups - Array of groups
   * @returns {number} - Highest assigned index
   */
  executePicking(groups) {
    // Validate preconditions
    const pickGroups = groups.filter(g => g.getPickAtLeastOnePerGroup() === true);
    PickOrderRules.validatePickGroups(pickGroups);

    console.log(`\n[PickOrderService] Executing pick order assignment`);
    console.log(`  Total groups: ${groups.length}, Pick groups: ${pickGroups.length}`);

    // Phase 1: Assign pick group members sequentially
    const nextIndex = this.pickGroupDrafter.assign(groups);

    // Phase 2: Assign remaining members randomly
    const highestIndex = this.remainingDrafter.assign(groups, nextIndex);

    // Validate postconditions
    PickOrderRules.validatePickOrders(groups);
    PickOrderRules.validateSequentialAssignment(groups);

    console.log(`[PickOrderService] ✓ Pick order assignment complete\n`);
    return highestIndex;
  }

  /**
   * Validate pick order assignment
   */
  validatePickOrders(groups) {
    return PickOrderRules.validatePickOrders(groups);
  }
}

module.exports = PickOrderService;
