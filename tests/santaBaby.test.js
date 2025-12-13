/**
 * Assignment Service (SantaBaby) - Happy Path Test
 * Verifies that gift assignment works correctly with validated pick orders
 */
const PickOrderService = require('../src/business/pickorder/pickOrderService');
const AssignmentService = require('../src/business/santababy/assignmentService');
const { GroupFactory } = require('../src/shared/factories');

console.log('\n' + '='.repeat(70));
console.log('🎁 SANTABABY ASSIGNMENT - HAPPY PATH TEST');
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

    // Step 1: Create groups
    console.log('🔨 Step 1: Creating group objects...');
    const groups = GroupFactory.createFromJson(testData);
    console.log(`✓ Created ${groups.length} groups\n`);

    // Step 2: Assign pick order first
    console.log('🔨 Step 2: Assigning pick order indices...');
    const pickOrderService = new PickOrderService();
    const highestIndex = pickOrderService.executePicking(groups);
    console.log(`✓ Pick order assigned (highest index: ${highestIndex})\n`);

    // Step 3: Assign gift recipients
    console.log('🔨 Step 3: Executing gift assignment...');
    const assignmentService = new AssignmentService();
    assignmentService.executeAssignment(groups, highestIndex);
    console.log(`✓ Gift assignment complete\n`);

    // Validate results
    console.log('✓ VALIDATION RESULTS:\n');

    let allAssigned = true;
    let validAssignments = true;
    const assignmentMap = new Map();

    for (const group of groups) {
      for (const member of group.getMembers()) {
        const baby = member.getBaby();
        if (baby === null || baby === undefined) {
          allAssigned = false;
          console.log(`  ❌ ${member.getName()} has no gift recipient`);
        } else {
          assignmentMap.set(member.getIndex(), baby);
          
          // Find baby and check they're not from same family
          let babyName = null;
          let babyFamily = null;
          for (const g of groups) {
            for (const m of g.getMembers()) {
              if (m.getIndex() === baby) {
                babyName = m.getName();
                babyFamily = g.getGroupName();
                break;
              }
            }
          }
          
          if (babyFamily === group.getGroupName()) {
            validAssignments = false;
            console.log(`  ❌ ${member.getName()} assigned to own family member ${babyName}`);
          }
        }
      }
    }

    console.log(`  ✅ All members assigned: ${allAssigned}`);
    console.log(`  ✅ Valid assignments (no family members): ${validAssignments}`);
    console.log(`  ✅ Total assignments: ${assignmentMap.size}\n`);

    // Display results
    console.log('📊 Gift Assignment Results:\n');
    for (const group of groups) {
      console.log(`  ${group.getGroupName()}:`);
      for (const member of group.getMembers()) {
        const baby = member.getBaby();
        let babyName = '?';
        for (const g of groups) {
          for (const m of g.getMembers()) {
            if (m.getIndex() === baby) {
              babyName = m.getName();
              break;
            }
          }
        }
        console.log(`    • ${member.getName()} → ${babyName}`);
      }
    }

    // Summary
    if (allAssigned && validAssignments && assignmentMap.size === totalMembers) {
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
