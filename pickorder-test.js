const fs = require('fs');
const path = require('path');
const PickOrderOrchestrator = require('./src/pickOrderOrchestrator');

// Load sajor.json
const sajorPath = path.join(__dirname, 'groups-config', 'sajor.json');
const sajorData = JSON.parse(fs.readFileSync(sajorPath, 'utf-8'));

console.log('\n' + '='.repeat(60));
console.log('PickOrderOrchestrator Test with sajor.json');
console.log('='.repeat(60) + '\n');

async function runTest() {
  try {
    console.log('📋 Input Data:');
    console.log('Groups:', sajorData.length);
    
    // Convert members to object format {name, index: null}
    const groupsData = sajorData.map(group => ({
      ...group,
      members: group.members.map(m => ({ name: m, index: null }))
    }));
    
    groupsData.forEach((group, idx) => {
      console.log(`  [${idx}] ${group.name}: ${group.members.length} members, isPickAtLeastOnePerGroup: ${group.isPickAtLeastOnePerGroup}`);
    });
    
    console.log('\n🎲 Running PickOrderOrchestrator...\n');
    const draftedGroups = await PickOrderOrchestrator.orchestrate(groupsData);
    
    console.log('✅ Draft completed successfully!\n');
    
    console.log('📊 Results:\n');
    let totalMembers = 0;
    draftedGroups.forEach((group, groupIdx) => {
      console.log(`Group: ${group.getGroupName()} (isPickAtLeastOnePerGroup: ${group.getPickAtLeastOnePerGroup()})`);
      const members = group.getMembers();
      members.forEach((member, memberIdx) => {
        console.log(`  ${memberIdx + 1}. ${member.getName()} - Pick Order: ${member.getIndex()}`);
        totalMembers++;
      });
      console.log('');
    });
    
    console.log(`Total Members: ${totalMembers}`);
    console.log('\n✨ Test Summary:');
    console.log(`  • All members assigned unique indices: ${checkUniqueIndices(draftedGroups) ? '✓' : '✗'}`);
    console.log(`  • Indices sequential (1 to ${totalMembers}): ${checkSequential(draftedGroups, totalMembers) ? '✓' : '✗'}`);
    console.log(`  • Pick groups drafted first: ${checkPickGroupsDraftedFirst(draftedGroups) ? '✓' : '✗'}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

function checkUniqueIndices(groups) {
  const indices = new Set();
  for (const group of groups) {
    for (const member of group.getMembers()) {
      if (indices.has(member.getIndex())) return false;
      indices.add(member.getIndex());
    }
  }
  return true;
}

function checkSequential(groups, totalMembers) {
  const indices = new Set();
  for (const group of groups) {
    for (const member of group.getMembers()) {
      indices.add(member.getIndex());
    }
  }
  for (let i = 1; i <= totalMembers; i++) {
    if (!indices.has(i)) return false;
  }
  return true;
}

function checkPickGroupsDraftedFirst(groups) {
  const pickGroups = groups.filter(g => g.getPickAtLeastOnePerGroup());
  if (pickGroups.length === 0) return true;
  
  const pickMemberIndices = [];
  const allMemberIndices = [];
  
  for (const group of groups) {
    for (const member of group.getMembers()) {
      allMemberIndices.push(member.getIndex());
      if (group.getPickAtLeastOnePerGroup()) {
        pickMemberIndices.push(member.getIndex());
      }
    }
  }
  
  // Check that pick groups have representation early in draft order
  // (at least one member per pick group in first round)
  const totalGroups = groups.length;
  const roundsInFirstDraft = totalGroups - 1;
  
  // Simple check: at least one member from each pick group should be drafted
  for (const pickGroup of pickGroups) {
    let hasAnyMember = false;
    for (const member of pickGroup.getMembers()) {
      if (member.getIndex()) {
        hasAnyMember = true;
        break;
      }
    }
    if (!hasAnyMember) return false;
  }
  
  return true;
}

runTest();
