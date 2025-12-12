class PickOrderDrafter {
  /**
   * Assigns draft pick order using random selection for groups with isPickAtLeastOnePerGroup = true
   * First round: each "pick" group randomly selects one member, iterating through draft index
   * Subsequent rounds: sequential assignment for remaining members
   * @param {Group[]} groups - Array of groups with members
   * @returns {number} - Highest assigned index
   */
  static assign(groups) {
    // Separate groups into two arrays
    const pickGroups = groups.filter(g => g.getPickAtLeastOnePerGroup() === true);
    
    let draftIndex = 1;
    const totalGroups = groups.length;
    const roundsInFirstDraft = totalGroups - 1;

    // First round: each pick group randomly selects one member
    for (let round = 0; round < roundsInFirstDraft; round++) {
      for (const group of pickGroups) {
        const members = group.getMembers();
        if (members.length > 0) {
          // Find members that haven't been assigned yet
          const unassignedMembers = members.filter(m => m.getIndex() === null);
          
          if (unassignedMembers.length > 0) {
            // Pick random member from unassigned
            const randomIdx = Math.floor(Math.random() * unassignedMembers.length);
            const selectedMember = unassignedMembers[randomIdx];
            selectedMember.setIndex(draftIndex);
            draftIndex++;
          }
        }
      }
    }

    // Second round: Merge groups back and iterate through each group,
    // picking random unassigned member, skipping groups with all members assigned
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
          draftIndex++;
        }
      }
    }

    return draftIndex - 1;
  }
}

module.exports = PickOrderDrafter;
