const Randomizer = require('./randomizer');

/**
 * First stage: Assign babies for the first draft round
 * - Only pick groups participate
 * - Each pick group picks 1 random member from each other group
 * - Number of picks = number of pick groups * (total groups - 1)
 */
class FirstDraftAssigner {
  static assign(groups, highestIndex) {
    const pickGroups = groups.filter(g => g.getPickAtLeastOnePerGroup());
    const assignedBabies = new Set();
    let currentSeed = Date.now();

    console.log(`\n[FirstDraftAssigner] First draft starting`);
    console.log(`  Pick groups: ${pickGroups.length}`);

    // For each pick group
    for (const pickGroup of pickGroups) {
      console.log(`  ${pickGroup.getGroupName()}:`);

      // Get all other groups (including other pick groups)
      const otherGroups = groups.filter(g => g !== pickGroup);
      console.log(`    Other groups to pick from: ${otherGroups.length}`);

      // Get members from this pick group sorted by index
      const pickGroupMembers = pickGroup.getMembers().sort((a, b) => a.getIndex() - b.getIndex());

      // Track current member index within this pick group
      let memberIndex = 0;

      // For each other group
      for (const otherGroup of otherGroups) {
        if (memberIndex >= pickGroupMembers.length) break;

        // Get unassigned members from this other group
        const unassignedFromOther = otherGroup.getMembers().filter(m => m.getBaby() === null || m.getBaby() === undefined);

        if (unassignedFromOther.length > 0) {
          // Select member from pick group by current index
          const selectedMember = pickGroupMembers[memberIndex];

          // Pick random unassigned member from other group
          const randomIdx = Math.floor(Math.random() * unassignedFromOther.length);
          const randomMember = unassignedFromOther[randomIdx];
          const babyIndex = randomMember.getIndex();

          console.log(`    ${selectedMember.getName()} [Index ${selectedMember.getIndex()}] → ${otherGroup.getGroupName()}: ${randomMember.getName()} (Index ${babyIndex})`);

          selectedMember.setBaby(babyIndex);
          assignedBabies.add(babyIndex);
          memberIndex++;
        }
      }
    }

    console.log(`[FirstDraftAssigner] ✓ Completed first draft with ${assignedBabies.size} picks`);
    return { assignedBabies, currentSeed };
  }
}

module.exports = FirstDraftAssigner;
