class IndexAssigner {
  static assign(families) {
    let memberIndex = 1;
    let highestIndex = 0;

    for (const family of families) {
      const members = family.getMembers();

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
