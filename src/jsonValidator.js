class JsonValidator {
  static MIN_GROUPS = 3;
  static MIN_MEMBERS_TOTAL = 10;
  static MIN_MEMBERS_PER_GROUP = 3;

  static validate(groupsJson) {
    if (!Array.isArray(groupsJson)) {
      throw new Error('Groups must be an array');
    }

    if (groupsJson.length === 0) {
      throw new Error(`At least ${this.MIN_GROUPS} groups are required`);
    }

    if (groupsJson.length < this.MIN_GROUPS) {
      throw new Error(`At least ${this.MIN_GROUPS} groups are required for gift exchange`);
    }

    this.validateStructure(groupsJson);
    this.validateUniqueness(groupsJson);
    this.validateMinimums(groupsJson);
  }

  static validateStructure(groupsJson) {
    for (const groupData of groupsJson) {
      const { name, members } = groupData;

      if (!name || typeof name !== 'string') {
        throw new Error('Group must have a name (string)');
      }

      if (!Array.isArray(members) || members.length === 0) {
        throw new Error(`Group "${name}" must have at least one member`);
      }

      if (members.length < this.MIN_MEMBERS_PER_GROUP) {
        throw new Error(`Group "${name}" must have at least ${this.MIN_MEMBERS_PER_GROUP} members`);
      }

      for (const member of members) {
        if (typeof member !== 'string') {
          throw new Error(`All members in group "${name}" must be strings`);
        }
      }
    }
  }

  static validateUniqueness(groupsJson) {
    const groupNames = new Set();
    const allMemberNames = new Set();

    for (const groupData of groupsJson) {
      const { name, members } = groupData;

      if (groupNames.has(name)) {
        throw new Error(`Duplicate group name: ${name}`);
      }
      groupNames.add(name);

      for (const memberName of members) {
        if (allMemberNames.has(memberName)) {
          throw new Error(`Duplicate member name: ${memberName}`);
        }
        allMemberNames.add(memberName);
      }
    }
  }

  static validateMinimums(groupsJson) {
    let totalMembers = 0;

    for (const groupData of groupsJson) {
      totalMembers += groupData.members.length;
    }

    if (totalMembers < this.MIN_MEMBERS_TOTAL) {
      throw new Error(`Total members must be at least ${this.MIN_MEMBERS_TOTAL}, but got ${totalMembers}`);
    }
  }
}

module.exports = JsonValidator;
