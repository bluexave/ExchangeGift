const BaseOrchestrator = require('./baseOrchestrator');
const PickOrderDrafter = require('./pickOrderDrafter');

class PickOrderOrchestrator extends BaseOrchestrator {
  static async orchestrate(groupsJson) {
    // Stage 1: Validate JSON structure
    this.validateJson(groupsJson);

    // Stage 2: Create Group objects
    const groups = this.createGroups(groupsJson);

    // Stage 3: Draft pick order with random selection
    const highestIndex = PickOrderDrafter.assign(groups);

    return groups;
  }
}

module.exports = PickOrderOrchestrator;
