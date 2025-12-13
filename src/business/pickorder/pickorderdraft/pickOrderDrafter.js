const PickGroupDrafter = require('./pickGroupDrafter');
const RemainingDrafter = require('./remainingDrafter');

class PickOrderDrafter {
  /**
   * Assigns draft pick order for pick groups and remaining members
   * Each pick group gets (totalGroups - 1) sequential picks
   * Remaining members are assigned randomly
   * @param {Group[]} groups - Array of groups with members
   * @returns {number} - Highest assigned index
   */
  static assign(groups) {
    const totalGroups = groups.length;

    console.log(`\n[PickOrderDrafter] Starting draft pick order assignment`);
    console.log(`  Total groups: ${totalGroups}`);

    // Phase 1: Each pick group picks members sequentially
    const nextIndex = PickGroupDrafter.assign(groups);

    // Phase 2: Randomly assign remaining unassigned members from all groups
    const highestIndex = RemainingDrafter.assign(groups, nextIndex);

    console.log(`\n[PickOrderDrafter] ✓ Draft complete. Highest index: ${highestIndex}\n`);
    return highestIndex;
  }
}

module.exports = PickOrderDrafter;
