class FamilyRepository {
  static isSameFamily(member1, member2, families) {
    const family1 = this.getFamilyOfMember(member1.getName(), families);
    const family2 = this.getFamilyOfMember(member2.getName(), families);
    return family1 && family2 && family1.getFamilyName() === family2.getFamilyName();
  }

  static getFamilyOfMember(memberName, families) {
    for (const family of families) {
      const members = family.getMembers();
      for (const member of members) {
        if (member.getName() === memberName) {
          return family;
        }
      }
    }
    return null;
  }
}

module.exports = FamilyRepository;
