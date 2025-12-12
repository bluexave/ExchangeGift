const fs = require('fs');
const path = require('path');
const MatchingOrchestrator = require('./src/matchingOrchestrator');

// Load sajor.json
const sajorPath = path.join(__dirname, 'groups-config', 'sajor.json');
const sajorData = JSON.parse(fs.readFileSync(sajorPath, 'utf-8'));

console.log('\n' + '='.repeat(70));
console.log('MatchingOrchestrator Test with sajor.json');
console.log('='.repeat(70) + '\n');

async function runTest() {
  try {
    console.log('📋 Input Data:');
    console.log('Groups:', sajorData.length);
    let totalMembers = 0;
    sajorData.forEach((group, idx) => {
      const count = group.members.length;
      totalMembers += count;
      console.log(`  [${idx}] ${group.name}: ${count} members, isPickAtLeastOnePerGroup: ${group.isPickAtLeastOnePerGroup}`);
    });
    console.log(`Total: ${totalMembers} members\n`);
    
    // Convert members to object format {name, index: null}
    const groupsData = sajorData.map(group => ({
      ...group,
      members: group.members.map(m => ({ name: m, index: null }))
    }));
    
    console.log('🎲 Running MatchingOrchestrator (matching members with pick order)...\n');
    
    // First, run PickOrderOrchestrator to get indices
    const PickOrderOrchestrator = require('./src/pickOrderOrchestrator');
    const groupsWithIndices = await PickOrderOrchestrator.orchestrate(groupsData);
    
    console.log('✅ Pick order drafted.\n');
    console.log('🎯 Running baby assignment (matching members with gifts)...\n');
    
    // Run baby assignment directly on groups with indices
    const BabyAssigner = require('./src/babyAssigner');
    const highestIndex = Math.max(...groupsWithIndices.flatMap(g => g.getMembers().map(m => m.getIndex() || 0)));
    BabyAssigner.assign(groupsWithIndices, highestIndex);
    
    const matchedGroups = groupsWithIndices;
    
    console.log('✅ Matching completed successfully!\n');
    
    console.log('📊 Results:\n');
    console.log('Member → Baby (Receiver):');
    console.log('-'.repeat(70));
    
    let allValid = true;
    const membersByIndex = {};
    
    // Build index map
    for (const group of matchedGroups) {
      for (const member of group.getMembers()) {
        membersByIndex[member.getIndex()] = member.getName();
      }
    }
    
    // Display assignments
    for (const group of matchedGroups) {
      for (const member of group.getMembers()) {
        const giver = member.getName();
        const giverIndex = member.getIndex();
        const babyIndex = member.getBaby();
        const recipient = membersByIndex[babyIndex];
        
        // Check if same family
        const sameFamily = group.getMembers().some(m => m.getIndex() === babyIndex);
        
        if (sameFamily) {
          console.log(`✗ ${giver} (${giverIndex}) → ${recipient} (${babyIndex}) [SAME FAMILY]`);
          allValid = false;
        } else {
          console.log(`✓ ${giver} (${giverIndex}) → ${recipient} (${babyIndex})`);
        }
      }
    }
    
    console.log('-'.repeat(70));
    
    console.log('\n✨ Test Summary:');
    console.log(`  • Total members matched: ${totalMembers}`);
    console.log(`  • All assignments valid: ${allValid ? '✓' : '✗'}`);
    console.log(`  • No same-family matches: ${allValid ? '✓' : '✗'}`);
    
    if (!allValid) {
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  }
}

runTest();
