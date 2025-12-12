const Randomizer = require('./randomizer');

/**
 * First stage: Assign babies for the first draft round
 * - Only pick groups participate
 * - Number of picks = number of pick groups * (total groups - 1)
 * - Each pick group picks 1 member per round from other groups
 * - Rounds continue for (total groups - 1) times
 */
class FirstDraftAssigner {
  static assign(groups, highestIndex) {
    const assignedBabies = new Set();
    let currentSeed = Date.now();

    // Separate pick and non-pick groups
    const pickGroups = groups.filter(g => g.getPickAtLeastOnePerGroup());
    const totalGroups = groups.length;
    const roundsInFirstDraft = totalGroups - 1;
    const picksInFirstDraft = pickGroups.length * roundsInFirstDraft;

    console.log(`\n[FirstDraftAssigner] First draft picks: ${pickGroups.length} pick groups × ${roundsInFirstDraft} rounds = ${picksInFirstDraft} picks`);

    // For each round
    for (let round = 0; round < roundsInFirstDraft; round++) {
      console.log(`  Round ${round + 1}:`);

      // For each pick group, pick one member
      for (const pickGroup of pickGroups) {
        const members = pickGroup.getMembers();
        const groupMemberIndices = pickGroup.getMemberIndices();

        // Get unassigned members from this pick group
        const unassignedMembers = members.filter(m => m.getBaby() === null || m.getBaby() === undefined);

        if (unassignedMembers.length > 0) {
          // Pick random unassigned member from this pick group
          const randomIdx = Math.floor(Math.random() * unassignedMembers.length);
          const member = unassignedMembers[randomIdx];

          // Build exclusion set: group member indices + already assigned babies
          const exclusions = new Set([...groupMemberIndices, ...Array.from(assignedBabies)]);
          const availableSlots = highestIndex - exclusions.size;

          console.log(`    ${member.getName()} (${pickGroup.getGroupName()}): range=[1-${highestIndex}], exclusions=[${Array.from(exclusions).sort((a,b)=>a-b).join(',')}], available=${availableSlots}`);

          try {
            const babyIndex = Randomizer.randomInRange(1, highestIndex, currentSeed, Array.from(exclusions));
            member.setBaby(babyIndex);
            assignedBabies.add(babyIndex);
            console.log(`      → Assigned baby index: ${babyIndex}`);
            currentSeed++;
          } catch (error) {
            throw new Error(`[FirstDraftAssigner] Failed to assign baby to ${member.getName()}: ${error.message}`);
          }
        }
      }
    }

    console.log(`[FirstDraftAssigner] ✓ Completed first draft with ${assignedBabies.size} picks`);
    return { assignedBabies, currentSeed };
  }
}

module.exports = FirstDraftAssigner;
