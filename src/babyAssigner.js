const FirstDraftAssigner = require('./firstDraftAssigner');
const SecondDraftAssigner = require('./secondDraftAssigner');

class BabyAssigner {
  static MAX_RETRIES = 3;

  static assign(groups, highestIndex) {
    for (let attempt = 0; attempt < this.MAX_RETRIES; attempt++) {
      try {
        console.log(`\n[BabyAssigner] Attempt ${attempt + 1}/${this.MAX_RETRIES}`);
        this.assignBabiesInTwoStages(groups, highestIndex, Date.now() + attempt);
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

  static assignBabiesInTwoStages(groups, highestIndex, seed) {
    // Stage 1: First draft assignment
    const { assignedBabies, currentSeed } = FirstDraftAssigner.assign(groups, highestIndex);

    // Stage 2: Second draft assignment for remaining members
    SecondDraftAssigner.assign(groups, highestIndex, assignedBabies, currentSeed);

    // Show final summary with names
    const babyNames = {};
    for (const group of groups) {
      for (const member of group.getMembers()) {
        babyNames[member.getIndex()] = member.getName();
      }
    }

    console.log('\n[BabyAssigner] Final Assignment Summary:');
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
