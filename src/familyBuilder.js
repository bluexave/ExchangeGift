const JsonValidator = require('./jsonValidator');
const FamilyFactory = require('./familyFactory');
const IndexAssigner = require('./indexAssigner');
const BabyAssigner = require('./babyAssigner');
const EmailSender = require('./emailSender');

class FamilyBuilder {
  static async buildFromJson(familiesJson, sendEmails = false) {
    // Stage 1: Validate JSON
    JsonValidator.validate(familiesJson);

    // Stage 2: Create Family objects
    const families = FamilyFactory.createFromJson(familiesJson);

    // Stage 3: Assign sequential indices
    const highestIndex = IndexAssigner.assign(families);

    // Stage 4: Assign babies
    BabyAssigner.assign(families, highestIndex);

    // Stage 5: Send emails (optional)
    if (sendEmails) {
      await EmailSender.sendAssignments(families);
    }

    return families;
  }
}

module.exports = FamilyBuilder;
