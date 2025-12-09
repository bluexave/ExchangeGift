class JsonValidator {
  static MIN_FAMILIES = 3;
  static MIN_MEMBERS_TOTAL = 10;
  static MIN_MEMBERS_PER_FAMILY = 3;

  static validate(familiesJson) {
    if (!Array.isArray(familiesJson)) {
      throw new Error('Families must be an array');
    }

    if (familiesJson.length === 0) {
      throw new Error(`At least ${this.MIN_FAMILIES} families are required`);
    }

    if (familiesJson.length < this.MIN_FAMILIES) {
      throw new Error(`At least ${this.MIN_FAMILIES} families are required for gift exchange`);
    }

    this.validateStructure(familiesJson);
    this.validateUniqueness(familiesJson);
    this.validateMinimums(familiesJson);
  }

  static validateStructure(familiesJson) {
    for (const familyData of familiesJson) {
      const { name, members } = familyData;

      if (!name || typeof name !== 'string') {
        throw new Error('Family must have a name (string)');
      }

      if (!Array.isArray(members) || members.length === 0) {
        throw new Error(`Family "${name}" must have at least one member`);
      }

      if (members.length < this.MIN_MEMBERS_PER_FAMILY) {
        throw new Error(`Family "${name}" must have at least ${this.MIN_MEMBERS_PER_FAMILY} members`);
      }

      for (const member of members) {
        if (typeof member !== 'string') {
          throw new Error(`All members in family "${name}" must be strings`);
        }
      }
    }
  }

  static validateUniqueness(familiesJson) {
    const familyNames = new Set();
    const allMemberNames = new Set();

    for (const familyData of familiesJson) {
      const { name, members } = familyData;

      if (familyNames.has(name)) {
        throw new Error(`Duplicate family name: ${name}`);
      }
      familyNames.add(name);

      for (const memberName of members) {
        if (allMemberNames.has(memberName)) {
          throw new Error(`Duplicate member name: ${memberName}`);
        }
        allMemberNames.add(memberName);
      }
    }
  }

  static validateMinimums(familiesJson) {
    let totalMembers = 0;

    for (const familyData of familiesJson) {
      totalMembers += familyData.members.length;
    }

    if (totalMembers < this.MIN_MEMBERS_TOTAL) {
      throw new Error(`Total members must be at least ${this.MIN_MEMBERS_TOTAL}, but got ${totalMembers}`);
    }
  }
}

module.exports = JsonValidator;
