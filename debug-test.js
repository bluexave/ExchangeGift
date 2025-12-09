const FamilyBuilder = require('./src/familyBuilder');

console.log('=== BabyAssigner Debug Test ===\n');

(async () => {
  try {
    const families = await FamilyBuilder.buildFromJson([
      { name: 'Pau', members: ['Paula', 'Xavier', 'Belle', 'Ilysse'], email: 'pau@example.com' },
      { name: 'JC', members: ['JC', 'Kriza', 'King', 'Zion'], email: 'jc@example.com' },
      { name: 'Che', members: ['Cheche', 'Raunchie', 'Aan', 'Lexie', 'Wanna'], email: 'che@example.com' },
      { name: 'Carol', members: ['Carol', 'Aldrin', 'Paul'], email: 'carol@example.com' },
      { name: 'Budil', members: ['Budil', 'Doc', 'Gio'], email: 'budil@example.com' },
      { name: 'Cleng', members: ['Cleng', 'Kat', 'Simon'], email: 'cleng@example.com' }
    ], true);

    console.log('\n=== Final Results ===');
    for (const family of families) {
      console.log(`\n${family.getFamilyName()}:`);
      for (const member of family.getMembers()) {
        console.log(`  ${member.getName()}: index=${member.getIndex()}, baby=${member.getBaby()}`);
      }
    }
    
    console.log('\n✓ Build completed successfully!');
  } catch (error) {
    console.log('\n✗ Error:', error.message);
    console.log('\nStack trace:', error.stack);
    process.exit(1);
  }
})();
