class IndexAssigner {
  static assign(groups) {
    let memberIndex = 1;
    let highestIndex = 0;

    for (const group of groups) {
      const members = group.getMembers();

      for (const member of members) {
        member.setIndex(memberIndex);
        highestIndex = memberIndex;
        memberIndex++;
      }
    }

    return highestIndex;
  }
}

module.exports = IndexAssigner;
