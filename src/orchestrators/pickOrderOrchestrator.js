const BaseOrchestrator = require('./baseOrchestrator');
const PickOrderService = require('../business/pickorder/pickOrderService');

class PickOrderOrchestrator extends BaseOrchestrator {
  static async orchestrate(groupsJson) {
    // Step 1: Validate JSON structure
    this.validateJson(groupsJson);

    // Step 2: Create Group objects
    const groups = this.createGroups(groupsJson);

    // Step 3: Execute pick order assignment business logic
    const pickOrderService = new PickOrderService();
    pickOrderService.executePicking(groups);

    return groups;
  }
}

module.exports = PickOrderOrchestrator;
