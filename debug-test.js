const MatchingOrchestrator = require('./src/matchingOrchestrator');
const PickOrderOrchestrator = require('./src/pickOrderOrchestrator');

console.log('=== BabyAssigner Debug Test ===\n');

(async () => {
  try {
    // First convert members to object format and run PickOrderOrchestrator
    const groupsData = [
      { name: 'Pau', members: [{ name: 'Paula', index: null }, { name: 'Xavier', index: null }, { name: 'Belle', index: null }, { name: 'Ilysse', index: null }], email: 'pau@example.com' },
      { name: 'JC', members: [{ name: 'JC', index: null }, { name: 'Kriza', index: null }, { name: 'King', index: null }, { name: 'Zion', index: null }], email: 'jc@example.com' },
      { name: 'Che', members: [{ name: 'Cheche', index: null }, { name: 'Raunchie', index: null }, { name: 'Aan', index: null }, { name: 'Lexie', index: null }, { name: 'Wanna', index: null }], email: 'che@example.com' },
      { name: 'Carol', members: [{ name: 'Carol', index: null }, { name: 'Aldrin', index: null }, { name: 'Paul', index: null }], email: 'carol@example.com' },
      { name: 'Budil', members: [{ name: 'Budil', index: null }, { name: 'Doc', index: null }, { name: 'Gio', index: null }], email: 'budil@example.com' },
      { name: 'Cleng', members: [{ name: 'Cleng', index: null }, { name: 'Kat', index: null }, { name: 'Simon', index: null }], email: 'cleng@example.com' }
    ];

    // Run PickOrderOrchestrator first
    const groupsWithIndices = await PickOrderOrchestrator.orchestrate(groupsData);

    // Now run MatchingOrchestrator
    const BabyAssigner = require('./src/babyAssigner');
    const highestIndex = Math.max(...groupsWithIndices.flatMap(g => g.getMembers().map(m => m.getIndex() || 0)));
    BabyAssigner.assign(groupsWithIndices, highestIndex);

    const groups = groupsWithIndices;

    console.log('\n=== Final Results ===');
    for (const group of groups) {
      console.log(`\n${group.getGroupName()}:`);
      for (const member of group.getMembers()) {
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
