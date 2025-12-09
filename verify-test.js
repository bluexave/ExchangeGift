const FamilyBuilder = require('./src/familyBuilder');
const FamilyRepository = require('./src/familyRepository');

console.log('=== Verifying Gift Assignments ===\n');

try {
  const families = FamilyBuilder.buildFromJson([
    { name: 'Pau', members: ['Paula', 'Xavier', 'Belle', 'Ilysse'] },
    { name: 'JC', members: ['JC', 'Kriza', 'King', 'Zion'] },
    { name: 'Che', members: ['Cheche', 'Raunchie', 'Aan', 'Lexie', 'Wanna'] },
    { name: 'Carol', members: ['Carol', 'Aldrin', 'Paul'] },
    { name: 'Budil', members: ['Budil', 'Doc', 'Gio'] },
    { name: 'Cleng', members: ['Cleng', 'Kat', 'Simon'] }
  ]);

  console.log('Checking all assignments are valid...\n');
  
  let allValid = true;
  const membersByIndex = {};
  
  // Build index map
  for (const family of families) {
    for (const member of family.getMembers()) {
      membersByIndex[member.getIndex()] = member;
    }
  }

  // Check each assignment
  for (const family of families) {
    for (const member of family.getMembers()) {
      const giver = member.getName();
      const giverIndex = member.getIndex();
      const babyIndex = member.getBaby();
      const recipient = membersByIndex[babyIndex];
      const recipientName = recipient.getName();
      
      // Check if same family
      const sameFamily = FamilyRepository.isSameFamily(member, recipient, families);
      
      if (sameFamily) {
        console.log(`✗ INVALID: ${giver} (${giverIndex}) → ${recipientName} (${babyIndex}) [SAME FAMILY]`);
        allValid = false;
      } else {
        console.log(`✓ ${giver} (${giverIndex}) → ${recipientName} (${babyIndex})`);
      }
    }
  }

  console.log('\n=== Summary ===');
  if (allValid) {
    console.log('✓ All assignments are valid!');
  } else {
    console.log('✗ Some assignments violate the rules');
  }

} catch (error) {
  console.error('✗ Error:', error.message);
}
