/**
 * RemainingDrafter - Phase 2 of pick order assignment
 * Randomly assign remaining unassigned members from all groups
 */
class RemainingDrafter {
  static assign(groups, startIndex) {
    console.log(`\n[RemainingDrafter] Phase 2: Assign remaining members (random)`);
    
    let draftIndex = startIndex;
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
          console.log(`  ${group.getGroupName()}: ${selectedMember.getName()} → Index ${draftIndex}`);
          draftIndex++;
        }
      }
    }

    console.log(`[RemainingDrafter] ✓ Phase 2 complete. Final index: ${draftIndex - 1}`);
    return draftIndex - 1;
  }
}

module.exports = RemainingDrafter;
