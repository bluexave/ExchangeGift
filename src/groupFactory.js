const Group = require('./group');
const Member = require('./member');

class GroupFactory {
  static createFromJson(groupsJson) {
    const groups = [];

    for (const groupData of groupsJson) {
      const group = this.createSingleGroup(groupData);
      groups.push(group);
    }

    return groups;
  }

  static createSingleGroup(groupData) {
    const { name, members, email, isPickAtLeastOnePerGroup } = groupData;
    // Members are objects with name and index properties
    const memberObjects = members.map(member => {
      const memberObj = new Member(member.name);
      // If member has an index (not null), set it
      if (member.index !== null && member.index !== undefined) {
        memberObj.setIndex(member.index);
      }
      return memberObj;
    });
    const group = new Group(name, memberObjects, email, isPickAtLeastOnePerGroup || false);
    return group;
  }
}

module.exports = GroupFactory;
