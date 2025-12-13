/**
 * PickGroupDrafter - Phase 1 of pick order assignment
 * Each pick group picks (totalGroups - 1) members in sequential order
 */
class PickGroupDrafter {
  static assign(groups) {
    const pickGroups = groups.filter(g => g.getPickAtLeastOnePerGroup() === true);
    const totalGroups = groups.length;
    const picksPerGroup = totalGroups - 1;
    let draftIndex = 1;

    console.log(`\n[PickGroupDrafter] Phase 1: Assign pick group members`);
    console.log(`  Pick groups: ${pickGroups.length}, Picks per group: ${picksPerGroup}`);

    // Each pick group picks (totalGroups - 1) members
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

    console.log(`[PickGroupDrafter] ✓ Phase 1 complete. Next index: ${draftIndex}`);
    return draftIndex;
  }
}

module.exports = PickGroupDrafter;
