/**
 * Pick Order Service - Happy Path Test
 * Verifies that pick order assignment works correctly
 */
const PickOrderService = require('../src/business/pickorder/pickOrderService');
const { GroupFactory } = require('../src/shared/factories');

console.log('\n' + '='.repeat(70));
console.log('🎲 PICK ORDER SERVICE - HAPPY PATH TEST');
console.log('='.repeat(70) + '\n');

// Test data
const testData = [
  {
    name: 'Family A',
    members: [
      { name: 'Alice', index: null },
      { name: 'Bob', index: null },
      { name: 'Charlie', index: null }
    ],
    email: 'familya@example.com',
    isPickAtLeastOnePerGroup: false
  },
  {
    name: 'Family B',
    members: [
      { name: 'Diana', index: null },
      { name: 'Eve', index: null },
      { name: 'Frank', index: null }
    ],
    email: 'familyb@example.com',
    isPickAtLeastOnePerGroup: false
  },
  {
    name: 'Family C',
    members: [
      { name: 'Grace', index: null },
      { name: 'Henry', index: null },
      { name: 'Iris', index: null }
    ],
    email: 'familyc@example.com',
    isPickAtLeastOnePerGroup: false
  }
];

async function runHappyPathTest() {
  try {
    console.log('📋 Test Setup:');
    console.log(`  Groups: ${testData.length}`);
    let totalMembers = 0;
    testData.forEach((group, idx) => {
      const count = group.members.length;
      totalMembers += count;
      console.log(`    [${idx}] ${group.name}: ${count} members`);
    });
    console.log(`  Total Members: ${totalMembers}\n`);

    // Create groups
    console.log('🔨 Creating group objects...');
    const groups = GroupFactory.createFromJson(testData);
    console.log(`✓ Created ${groups.length} groups\n`);

    // Execute pick order assignment
    console.log('⚙️ Executing Pick Order Assignment...');
    const pickOrderService = new PickOrderService();
    const highestIndex = pickOrderService.executePicking(groups);
    console.log(`✓ Assignment complete\n`);

    // Validate results
    console.log('✓ VALIDATION RESULTS:\n');

    let allIndicesAssigned = true;
    let validSequence = true;
    const assignedIndices = new Set();

    for (const group of groups) {
      for (const member of group.getMembers()) {
        const index = member.getIndex();
        if (index === null || index === undefined) {
          allIndicesAssigned = false;
          console.log(`  ❌ ${member.getName()} has no index`);
        } else {
          assignedIndices.add(index);
        }
      }
    }

    // Check sequential assignment
    for (let i = 1; i <= highestIndex; i++) {
      if (!assignedIndices.has(i)) {
        validSequence = false;
        console.log(`  ❌ Missing index: ${i}`);
      }
    }

    console.log(`  ✅ All members indexed: ${allIndicesAssigned}`);
    console.log(`  ✅ Sequential indices (1-${highestIndex}): ${validSequence}`);
    console.log(`  ✅ Highest index: ${highestIndex} (expected: ${totalMembers})\n`);

    // Display results
    console.log('📊 Member Pick Order Assignments:\n');
    for (const group of groups) {
      console.log(`  ${group.getGroupName()}:`);
      for (const member of group.getMembers()) {
        console.log(`    • ${member.getName()}: Index ${member.getIndex()}`);
      }
    }

    // Summary
    if (allIndicesAssigned && validSequence && highestIndex === totalMembers) {
      console.log('\n' + '='.repeat(70));
      console.log('✅ HAPPY PATH TEST PASSED');
      console.log('='.repeat(70) + '\n');
      return true;
    } else {
      console.log('\n' + '='.repeat(70));
      console.log('❌ HAPPY PATH TEST FAILED');
      console.log('='.repeat(70) + '\n');
      return false;
    }
  } catch (error) {
    console.error('\n❌ TEST ERROR:', error.message);
    console.error(error.stack);
    return false;
  }
}

// Run test
runHappyPathTest().then(success => {
  process.exit(success ? 0 : 1);
});
