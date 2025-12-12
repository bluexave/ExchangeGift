class PickOrderDrafter {
  /**
   * Assigns draft pick order for pick groups and remaining members
   * Each pick group gets (totalGroups - 1) sequential picks
   * Remaining members are assigned randomly
   * @param {Group[]} groups - Array of groups with members
   * @returns {number} - Highest assigned index
   */
  static assign(groups) {
    // Separate groups into pick and non-pick groups
    const pickGroups = groups.filter(g => g.getPickAtLeastOnePerGroup() === true);
    
    let draftIndex = 1;
    const totalGroups = groups.length;
    const picksPerGroup = totalGroups - 1;

    console.log(`\n[PickOrderDrafter] Starting draft pick order assignment`);
    console.log(`  Total groups: ${totalGroups}, Pick groups: ${pickGroups.length}`);
    console.log(`  Each pick group gets ${picksPerGroup} picks`);

    // Phase 1: Each pick group picks (totalGroups - 1) members
    for (const pickGroup of pickGroups) {
      console.log(`\n  ${pickGroup.getGroupName()} picks:`);
      
      for (let pick = 0; pick < picksPerGroup; pick++) {
        const unassignedMembers = pickGroup.getMembers().filter(m => m.getIndex() === null);
        
        if (unassignedMembers.length > 0) {
          // Pick random unassigned member from this pick group
          const randomIdx = Math.floor(Math.random() * unassignedMembers.length);
          const selectedMember = unassignedMembers[randomIdx];
          selectedMember.setIndex(draftIndex);
          console.log(`    ${selectedMember.getName()} → Index ${draftIndex}`);
          draftIndex++;
        }
      }
    }

    // Phase 2: Randomly assign remaining unassigned members from all groups
    console.log(`\n  Remaining members (random assignment):`);
    let allAssigned = false;
    while (!allAssigned) {
      allAssigned = true;
      
      for (const group of groups) {
        const unassignedMembers = group.getMembers().filter(m => m.getIndex() === null);
        
        if (unassignedMembers.length > 0) {
          allAssigned = false;
          
          // Pick random unassigned member from this group
          const randomIdx = Math.floor(Math.random() * unassignedMembers.length);
          const selectedMember = unassignedMembers[randomIdx];
          selectedMember.setIndex(draftIndex);
          console.log(`    ${group.getGroupName()}: ${selectedMember.getName()} → Index ${draftIndex}`);
          draftIndex++;
        }
      }
    }

    console.log(`\n[PickOrderDrafter] ✓ Draft complete. Highest index: ${draftIndex - 1}\n`);
    return draftIndex - 1;
  }
}

module.exports = PickOrderDrafter;
