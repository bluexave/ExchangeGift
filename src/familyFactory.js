const Family = require('./family');
const Member = require('./member');

class FamilyFactory {
  static createFromJson(familiesJson) {
    const families = [];

    for (const familyData of familiesJson) {
      const family = this.createSingleFamily(familyData);
      families.push(family);
    }

    return families;
  }

  static createSingleFamily(familyData) {
    const { name, members, email } = familyData;
    const memberObjects = members.map(memberName => new Member(memberName));
    const family = new Family(name, memberObjects, email);
    return family;
  }
}

module.exports = FamilyFactory;
