const Randomizer = require('../../../shared/utils/randomizer');

/**
 * SecondDrafter - Second stage: Assign remaining babies in random draft
 * - All remaining unassigned members pick randomly
 * - Cannot pick from own group
 * - Continues until all members are assigned
 */
class SecondDrafter {
  static assign(groups, highestIndex, assignedBabies, currentSeed) {
    console.log(`\n[SecondDrafter] Starting second draft for remaining members`);

    let seed = currentSeed;
    let allAssigned = false;
    let round = 1;

    while (!allAssigned) {
      allAssigned = true;
      console.log(`  Round ${round}:`);

      for (const group of groups) {
        const members = group.getMembers();
        const groupMemberIndices = group.getMemberIndices();

        // Get unassigned members from this group
        const unassignedMembers = members.filter(m => m.getBaby() === null || m.getBaby() === undefined);

        if (unassignedMembers.length > 0) {
          allAssigned = false;

          // Pick member with lowest index (draft order) from this group
          const member = unassignedMembers.reduce((prev, curr) => 
            (curr.getIndex() < prev.getIndex()) ? curr : prev
          );

          // Build exclusion set: group member indices + already assigned babies
          const exclusions = new Set([...groupMemberIndices, ...Array.from(assignedBabies)]);
          const availableSlots = highestIndex - exclusions.size;

          console.log(`    ${member.getName()} [Index ${member.getIndex()}]: range=[1-${highestIndex}], exclusions=[${Array.from(exclusions).sort((a,b)=>a-b).join(',')}], available=${availableSlots}`);

          try {
            const babyIndex = Randomizer.randomInRange(1, highestIndex, seed, Array.from(exclusions));
            member.setBaby(babyIndex);
            assignedBabies.add(babyIndex);
            console.log(`      → Assigned baby index: ${babyIndex}`);
            seed++;
          } catch (error) {
            throw new Error(`[SecondDrafter] Failed to assign baby to ${member.getName()}: ${error.message}`);
          }
        }
      }

      round++;
    }

    console.log(`[SecondDrafter] ✓ All members assigned in second draft`);
    return assignedBabies;
  }
}

module.exports = SecondDrafter;
