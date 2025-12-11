const JsonValidator = require('./src/jsonValidator');
const FamilyFactory = require('./src/familyFactory');
const IndexAssigner = require('./src/indexAssigner');
const BabyAssigner = require('./src/babyAssigner');
const FamilyRepository = require('./src/familyRepository');
const MatchingOrchestrator = require('./src/matchingOrchestrator');

// Test utilities
let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

function test(description, testFn) {
  testsRun++;
  try {
    testFn();
    testsPassed++;
    console.log(`✓ ${description}`);
  } catch (error) {
    testsFailed++;
    console.log(`✗ ${description}`);
    console.log(`  Error: ${error.message}`);
  }
}

async function testAsync(description, testFn) {
  testsRun++;
  try {
    await testFn();
    testsPassed++;
    console.log(`✓ ${description}`);
  } catch (error) {
    testsFailed++;
    console.log(`✗ ${description}`);
    console.log(`  Error: ${error.message}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertThrows(fn, expectedMessage) {
  try {
    fn();
    throw new Error(`Expected error with message: ${expectedMessage}`);
  } catch (error) {
    if (!error.message.includes(expectedMessage)) {
      throw new Error(`Expected message "${expectedMessage}" but got "${error.message}"`);
    }
  }
}

// Sample test data
const validFamilies = [
  { name: 'Family A', members: ['Alice', 'Bob', 'Andrew', 'Anna'] },
  { name: 'Family B', members: ['Charlie', 'Diana', 'David', 'Debra'] },
  { name: 'Family C', members: ['Edward', 'Fiona', 'Frank', 'Flora'] }
];

const invalidSmallFamilies = [
  { name: 'Family A', members: ['Alice'] },
  { name: 'Family B', members: ['Bob'] }
];

console.log('\n=== JsonValidator Tests ===\n');

test('should validate valid families', () => {
  JsonValidator.validate(validFamilies);
});

test('should reject non-array input', () => {
  assertThrows(() => JsonValidator.validate({}), 'must be an array');
});

test('should reject empty array', () => {
  assertThrows(() => JsonValidator.validate([]), 'families are required');
});

test('should reject less than 3 families', () => {
  assertThrows(() => JsonValidator.validate(invalidSmallFamilies), 'At least 3 families');
});

test('should reject family with less than 3 members', () => {
  const invalid = [
    { name: 'Family A', members: ['Alice', 'Bob'] },
    { name: 'Family B', members: ['Charlie', 'Diana', 'David'] },
    { name: 'Family C', members: ['Edward', 'Fiona', 'Frank'] }
  ];
  assertThrows(() => JsonValidator.validate(invalid), 'at least 3 members');
});

test('should reject total members less than 10', () => {
  const invalid = [
    { name: 'Family A', members: ['Alice', 'Bob', 'Andrew'] },
    { name: 'Family B', members: ['Charlie', 'Diana', 'David'] },
    { name: 'Family C', members: ['Edward', 'Fiona', 'Frank', 'Flora'] }
  ];
  assertThrows(() => JsonValidator.validate(invalid), 'at least 10');
});

test('should reject duplicate family names', () => {
  const invalid = [
    { name: 'Family A', members: ['Alice', 'Bob', 'Andrew'] },
    { name: 'Family A', members: ['Charlie', 'Diana', 'David'] },
    { name: 'Family B', members: ['Edward', 'Fiona', 'Frank'] }
  ];
  assertThrows(() => JsonValidator.validate(invalid), 'Duplicate family name');
});

test('should reject duplicate member names', () => {
  const invalid = [
    { name: 'Family A', members: ['Alice', 'Bob', 'Andrew'] },
    { name: 'Family B', members: ['Alice', 'Diana', 'David'] },
    { name: 'Family C', members: ['Edward', 'Fiona', 'Frank'] }
  ];
  assertThrows(() => JsonValidator.validate(invalid), 'Duplicate member name');
});

test('should reject family with non-string name', () => {
  const invalid = [
    { name: 123, members: ['Alice', 'Bob', 'Andrew'] },
    { name: 'Family B', members: ['Charlie', 'Diana', 'David'] },
    { name: 'Family C', members: ['Edward', 'Fiona', 'Frank'] }
  ];
  assertThrows(() => JsonValidator.validate(invalid), 'Family must have a name');
});

test('should reject family with empty members array', () => {
  const invalid = [
    { name: 'Family A', members: [] },
    { name: 'Family B', members: ['Charlie', 'Diana', 'David'] },
    { name: 'Family C', members: ['Edward', 'Fiona', 'Frank'] }
  ];
  assertThrows(() => JsonValidator.validate(invalid), 'at least one member');
});

test('should reject non-string member names', () => {
  const invalid = [
    { name: 'Family A', members: ['Alice', 123, 'Andrew'] },
    { name: 'Family B', members: ['Charlie', 'Diana', 'David'] },
    { name: 'Family C', members: ['Edward', 'Fiona', 'Frank'] }
  ];
  assertThrows(() => JsonValidator.validate(invalid), 'must be strings');
});

console.log('\n=== FamilyFactory Tests ===\n');

test('should create families from JSON', () => {
  const families = FamilyFactory.createFromJson(validFamilies);
  assert(families.length === 3, 'Should create 3 families');
  assert(families[0].getFamilyName() === 'Family A', 'First family name should be "Family A"');
});

test('should create members as Member objects', () => {
  const families = FamilyFactory.createFromJson(validFamilies);
  const members = families[0].getMembers();
  assert(members.length === 4, 'First family should have 4 members');
  assert(members[0].getName() === 'Alice', 'First member name should be "Alice"');
});

test('should preserve member order', () => {
  const families = FamilyFactory.createFromJson(validFamilies);
  const members = families[2].getMembers();
  assert(members[0].getName() === 'Edward', 'First member of third family should be "Edward"');
  assert(members[1].getName() === 'Fiona', 'Second member of third family should be "Fiona"');
});

console.log('\n=== IndexAssigner Tests ===\n');

test('should assign sequential indices starting from 1', () => {
  const families = FamilyFactory.createFromJson(validFamilies);
  const highestIndex = IndexAssigner.assign(families);
  
  let members = families[0].getMembers();
  assert(members[0].getIndex() === 1, 'First member should have index 1');
  assert(members[1].getIndex() === 2, 'Second member should have index 2');
  
  members = families[2].getMembers();
  assert(members[0].getIndex() === 9, 'Ninth member should have index 9');
  assert(members[1].getIndex() === 10, 'Tenth member should have index 10');
});

test('should return highest index', () => {
  const families = FamilyFactory.createFromJson(validFamilies);
  const highestIndex = IndexAssigner.assign(families);
  assert(highestIndex === 12, 'Highest index should be 12 for 12 members');
});

test('should handle equal member families', () => {
  const families = FamilyFactory.createFromJson(validFamilies);
  const highestIndex = IndexAssigner.assign(families);
  
  assert(families[0].getMembers()[0].getIndex() === 1, 'First member should be 1');
  assert(families[1].getMembers()[0].getIndex() === 5, 'Fifth member should be 5');
  assert(families[2].getMembers()[0].getIndex() === 9, 'Ninth member should be 9');
  assert(highestIndex === 12, 'Highest index should be 12');
});

console.log('\n=== BabyAssigner Tests ===\n');

test('should assign babies to all members', () => {
  const families = FamilyFactory.createFromJson(validFamilies);
  IndexAssigner.assign(families);
  BabyAssigner.assign(families, 12);
  
  for (const family of families) {
    for (const member of family.getMembers()) {
      assert(member.getBaby() !== null && member.getBaby() !== undefined, 
        `Member ${member.getName()} should have a baby assigned`);
    }
  }
});

test('should not assign baby from own family', () => {
  const families = FamilyFactory.createFromJson(validFamilies);
  IndexAssigner.assign(families);
  BabyAssigner.assign(families, 12);
  
  // Family A members have indices 1, 2, 3, 4
  const familyAMembers = families[0].getMembers();
  const familyAIndices = new Set([1, 2, 3, 4]);
  
  for (const member of familyAMembers) {
    const baby = member.getBaby();
    assert(!familyAIndices.has(baby), 
      `Member ${member.getName()} from Family A should not have baby from Family A`);
  }
});

test('should not have duplicate baby assignments', () => {
  const families = FamilyFactory.createFromJson(validFamilies);
  IndexAssigner.assign(families);
  BabyAssigner.assign(families, 12);
  
  const babyIndices = new Set();
  for (const family of families) {
    for (const member of family.getMembers()) {
      const baby = member.getBaby();
      assert(!babyIndices.has(baby), 
        `Baby index ${baby} should only be assigned once`);
      babyIndices.add(baby);
    }
  }
});

console.log('\n=== FamilyRepository Tests ===\n');

test('should find family of member', () => {
  const families = FamilyFactory.createFromJson(validFamilies);
  const family = FamilyRepository.getFamilyOfMember('Alice', families);
  assert(family !== null, 'Should find family for Alice');
  assert(family.getFamilyName() === 'Family A', 'Alice should be in Family A');
});

test('should return null for non-existent member', () => {
  const families = FamilyFactory.createFromJson(validFamilies);
  const family = FamilyRepository.getFamilyOfMember('NonExistent', families);
  assert(family === null, 'Should return null for non-existent member');
});

test('should identify same family members', () => {
  const families = FamilyFactory.createFromJson(validFamilies);
  const memberA = families[0].getMembers()[0]; // Alice
  const memberB = families[0].getMembers()[1]; // Bob
  
  const isSame = FamilyRepository.isSameFamily(memberA, memberB, families);
  assert(isSame === true, 'Alice and Bob should be from same family');
});

test('should identify different family members', () => {
  const families = FamilyFactory.createFromJson(validFamilies);
  const memberA = families[0].getMembers()[0]; // Alice
  const memberC = families[1].getMembers()[0]; // Charlie
  
  const isSame = FamilyRepository.isSameFamily(memberA, memberC, families);
  assert(isSame === false, 'Alice and Charlie should be from different families');
});

console.log('\n=== MatchingOrchestrator Integration Tests ===\n');

testAsync('should build families with complete pipeline', async () => {
  const families = await MatchingOrchestrator.orchestrate(validFamilies);
  assert(families.length === 3, 'Should create 3 families');
});

testAsync('should assign indices and babies in pipeline', async () => {
  // Use a safer distribution for baby assignment
  const testFamilies = [
    { name: 'Family X', members: ['X1', 'X2', 'X3', 'X4'] },
    { name: 'Family Y', members: ['Y1', 'Y2', 'Y3', 'Y4'] },
    { name: 'Family Z', members: ['Z1', 'Z2', 'Z3', 'Z4'] }
  ];
  const families = await MatchingOrchestrator.orchestrate(testFamilies);
  
  for (const family of families) {
    for (const member of family.getMembers()) {
      assert(member.getIndex() !== null, `${member.getName()} should have index`);
      assert(member.getBaby() !== null, `${member.getName()} should have baby`);
    }
  }
});

testAsync('should handle equal distribution families', async () => {
  const families = await MatchingOrchestrator.orchestrate(validFamilies);
  assert(families.length === 3, 'Should create 3 families');
  assert(families[0].getMembers()[0].getBaby() !== null, 'Members should have babies assigned');
});

console.log('\n=== Test Summary ===\n');
console.log(`Total tests: ${testsRun}`);
console.log(`✓ Passed: ${testsPassed}`);
console.log(`✗ Failed: ${testsFailed}`);
console.log(`\nResult: ${testsFailed === 0 ? '✓ All tests passed!' : '✗ Some tests failed'}\n`);

process.exit(testsFailed === 0 ? 0 : 1);
