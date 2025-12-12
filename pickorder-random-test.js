const fs = require('fs');
const path = require('path');
const PickOrderOrchestrator = require('./src/pickOrderOrchestrator');

// Load sajor.json
const sajorPath = path.join(__dirname, 'groups-config', 'sajor.json');
const sajorData = JSON.parse(fs.readFileSync(sajorPath, 'utf-8'));

console.log('\n' + '='.repeat(70));
console.log('PickOrderOrchestrator - Random Draft Simulation (5 runs)');
console.log('='.repeat(70) + '\n');

async function runMultipleTests() {
  const runs = 5;
  
  for (let run = 1; run <= runs; run++) {
    console.log(`📍 Run ${run}:`);
    
    try {
      const draftedGroups = await PickOrderOrchestrator.orchestrate(JSON.parse(JSON.stringify(sajorData)));
      
      // Get pick order for each group
      const pickGroups = draftedGroups.filter(g => g.getPickAtLeastOnePerGroup());
      const nonPickGroups = draftedGroups.filter(g => !g.getPickAtLeastOnePerGroup());
      
      console.log('  Pick Groups (isPickAtLeastOnePerGroup: true):');
      for (const group of pickGroups) {
        const members = group.getMembers().map(m => `${m.getName()}:${m.getIndex()}`).join(', ');
        console.log(`    ${group.getGroupName()}: ${members}`);
      }
      
      console.log('  Non-Pick Groups:');
      for (const group of nonPickGroups) {
        const members = group.getMembers().map(m => `${m.getName()}:${m.getIndex()}`).join(', ');
        console.log(`    ${group.getGroupName()}: ${members}`);
      }
      
      console.log('');
      
    } catch (error) {
      console.error('  ❌ Error:', error.message);
    }
  }
  
  console.log('='.repeat(70));
  console.log('✨ All simulations completed!');
  console.log('Notice how the pick order changes each run due to random selection');
  console.log('='.repeat(70) + '\n');
}

runMultipleTests();
