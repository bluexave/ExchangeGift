class GroupRepository {
  static isSameGroup(member1, member2, groups) {
    const group1 = this.getGroupOfMember(member1.getName(), groups);
    const group2 = this.getGroupOfMember(member2.getName(), groups);
    return group1 && group2 && group1.getGroupName() === group2.getGroupName();
  }

  static getGroupOfMember(memberName, groups) {
    for (const group of groups) {
      const members = group.getMembers();
      for (const member of members) {
        if (member.getName() === memberName) {
          return group;
        }
      }
    }
    return null;
  }
}

module.exports = GroupRepository;
