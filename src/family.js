class Family {
  constructor(name, members = [], email = null) {
    this.name = name;
    this.members = members;
    this.email = email;
  }

  getFamilyName() {
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
}

module.exports = Family;
