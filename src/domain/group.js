class Group {
  constructor(name, members = [], email = null, isPickAtLeastOnePerGroup = false) {
    this.name = name;
    this.members = members;
    this.email = email;
    this.isPickAtLeastOnePerGroup = isPickAtLeastOnePerGroup;
  }

  getGroupName() {
    return this.name;
  }

  getMembers() {
    return this.members;
  }

  getMemberIndices() {
    return this.members.map(member => member.index);
  }

  getEmail() {
    return this.email;
  }

  setEmail(email) {
    this.email = email;
  }

  getPickAtLeastOnePerGroup() {
    return this.isPickAtLeastOnePerGroup;
  }

  setPickAtLeastOnePerGroup(value) {
    this.isPickAtLeastOnePerGroup = value;
  }
}

module.exports = Group;
