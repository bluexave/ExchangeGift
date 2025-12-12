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
      const { name, members, isPickAtLeastOnePerGroup } = groupData;

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
        // Members should be objects with name and index properties
        if (typeof member !== 'object' || member === null) {
          throw new Error(`All members in group "${name}" must be objects with name and index properties`);
        }
        if (typeof member.name !== 'string') {
          throw new Error(`All members in group "${name}" must have a valid name property (string)`);
        }
        // Index can be null, number, or undefined
        if (member.index !== null && member.index !== undefined && typeof member.index !== 'number') {
          throw new Error(`Member index in group "${name}" must be a number or null`);
        }
      }

      // Validate isPickAtLeastOnePerGroup if provided
      if (isPickAtLeastOnePerGroup !== undefined && typeof isPickAtLeastOnePerGroup !== 'boolean') {
        throw new Error(`Group "${name}" isPickAtLeastOnePerGroup must be a boolean`);
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

      for (const member of members) {
        // Extract name from object member
        const memberName = member.name;
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
