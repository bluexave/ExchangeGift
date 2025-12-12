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
    const memberObjects = members.map(memberName => new Member(memberName));
    const group = new Group(name, memberObjects, email, isPickAtLeastOnePerGroup || false);
    return group;
  }
}

module.exports = GroupFactory;
