const Randomizer = require('./randomizer');

class BabyAssigner {
  static MAX_RETRIES = 3;

  static assign(groups, highestIndex) {
    for (let attempt = 0; attempt < this.MAX_RETRIES; attempt++) {
      try {
        console.log(`\n[BabyAssigner] Attempt ${attempt + 1}/${this.MAX_RETRIES}`);
        this.assignBabiesOnce(groups, highestIndex, Date.now() + attempt);
        console.log(`[BabyAssigner] ✓ Success on attempt ${attempt + 1}`);
        return; // Success
      } catch (error) {
        console.log(`[BabyAssigner] ✗ Attempt ${attempt + 1} failed: ${error.message}`);
        
        // Reset babies for next attempt
        for (const group of groups) {
          for (const member of group.getMembers()) {
            member.setBaby(null);
          }
        }

        // If this was the last attempt, throw error
        if (attempt === this.MAX_RETRIES - 1) {
          throw new Error('Failed to randomize baby assignment after maximum retries');
        }
      }
    }
  }

  static assignBabiesOnce(groups, highestIndex, seed) {
    const assignedBabies = new Set();
    const babyNames = {}; // Track names by index for logging
    let currentSeed = seed;

    // Nested loop: for each group, for each member
    for (const group of groups) {
      const members = group.getMembers();
      const groupMemberIndices = group.getMemberIndices();

      for (const member of members) {
        // Build exclusion set: group member indices + already assigned babies
        const exclusions = new Set([...groupMemberIndices, ...Array.from(assignedBabies)]);
        const availableSlots = highestIndex - exclusions.size;

        console.log(`  ${member.getName()}: range=[1-${highestIndex}], exclusions=[${Array.from(exclusions).sort((a,b)=>a-b).join(',')}], available=${availableSlots}`);

        try {
          // Get random baby index, excluding self group and already assigned
          const babyIndex = Randomizer.randomInRange(1, highestIndex, currentSeed, Array.from(exclusions));
          member.setBaby(babyIndex);
          assignedBabies.add(babyIndex);
          babyNames[babyIndex] = '?'; // Placeholder, will update after all indices assigned
          console.log(`    → Assigned baby index: ${babyIndex}`);
          currentSeed++;
        } catch (error) {
          console.log(`    → ERROR: ${error.message}`);
          throw error;
        }
      }
    }

    // Now resolve names for logging
    for (const group of groups) {
      for (const member of group.getMembers()) {
        babyNames[member.getIndex()] = member.getName();
      }
    }

    // Show final summary with names
    console.log('\n[BabyAssigner] Assignment Summary:');
    for (const group of groups) {
      for (const member of group.getMembers()) {
        const babyIndex = member.getBaby();
        const babyName = babyNames[babyIndex];
        console.log(`  ${member.getName()} (${member.getIndex()}) → ${babyName} (${babyIndex})`);
      }
    }

    this.validate(groups);
  }

  static validate(groups) {
    const babyIndices = new Set();

    for (const group of groups) {
      const members = group.getMembers();

      for (const member of members) {
        const baby = member.getBaby();

        if (baby === null || baby === undefined) {
          throw new Error(`Member ${member.getName()} was not assigned a baby`);
        }

        if (babyIndices.has(baby)) {
          throw new Error(`Duplicate baby assignment: multiple members assigned to index ${baby}`);
        }

        babyIndices.add(baby);
      }
    }
  }
}

module.exports = BabyAssigner;
