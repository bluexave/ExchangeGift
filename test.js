const JsonValidator = require('./src/jsonValidator');
const GroupFactory = require('./src/groupFactory');
const PickOrderDrafter = require('./src/pickOrderDrafter');
const BabyAssigner = require('./src/babyAssigner');
const GroupRepository = require('./src/groupRepository');
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
  { name: 'Group A', members: ['Alice', 'Bob', 'Andrew', 'Anna'] },
  { name: 'Group B', members: ['Charlie', 'Diana', 'David', 'Debra'] },
  { name: 'Group C', members: ['Edward', 'Fiona', 'Frank', 'Flora'] }
];

const invalidSmallFamilies = [
  { name: 'Group A', members: ['Alice'] },
  { name: 'Group B', members: ['Bob'] }
];

console.log('\n=== JsonValidator Tests ===\n');

test('should validate valid groups', () => {
  JsonValidator.validate(validFamilies);
});

test('should reject non-array input', () => {
  assertThrows(() => JsonValidator.validate({}), 'must be an array');
});

test('should reject empty array', () => {
  assertThrows(() => JsonValidator.validate([]), 'groups are required');
});

test('should reject less than 3 groups', () => {
  assertThrows(() => JsonValidator.validate(invalidSmallFamilies), 'At least 3 groups');
});

test('should reject Group with less than 3 members', () => {
  const invalid = [
    { name: 'Group A', members: ['Alice', 'Bob'] },
    { name: 'Group B', members: ['Charlie', 'Diana', 'David'] },
    { name: 'Group C', members: ['Edward', 'Fiona', 'Frank'] }
  ];
  assertThrows(() => JsonValidator.validate(invalid), 'at least 3 members');
});

test('should reject total members less than 10', () => {
  const invalid = [
    { name: 'Group A', members: ['Alice', 'Bob', 'Andrew'] },
    { name: 'Group B', members: ['Charlie', 'Diana', 'David'] },
    { name: 'Group C', members: ['Edward', 'Fiona', 'Frank', 'Flora'] }
  ];
  assertThrows(() => JsonValidator.validate(invalid), 'at least 10');
});

test('should reject duplicate Group names', () => {
  const invalid = [
    { name: 'Group A', members: ['Alice', 'Bob', 'Andrew'] },
    { name: 'Group A', members: ['Charlie', 'Diana', 'David'] },
    { name: 'Group B', members: ['Edward', 'Fiona', 'Frank'] }
  ];
  assertThrows(() => JsonValidator.validate(invalid), 'Duplicate group name');
});

test('should reject duplicate member names', () => {
  const invalid = [
    { name: 'Group A', members: ['Alice', 'Bob', 'Andrew'] },
    { name: 'Group B', members: ['Alice', 'Diana', 'David'] },
    { name: 'Group C', members: ['Edward', 'Fiona', 'Frank'] }
  ];
  assertThrows(() => JsonValidator.validate(invalid), 'Duplicate member name');
});

test('should reject Group with non-string name', () => {
  const invalid = [
    { name: 123, members: ['Alice', 'Bob', 'Andrew'] },
    { name: 'Group B', members: ['Charlie', 'Diana', 'David'] },
    { name: 'Group C', members: ['Edward', 'Fiona', 'Frank'] }
  ];
  assertThrows(() => JsonValidator.validate(invalid), 'Group must have a name');
});

test('should reject Group with empty members array', () => {
  const invalid = [
    { name: 'Group A', members: [] },
    { name: 'Group B', members: ['Charlie', 'Diana', 'David'] },
    { name: 'Group C', members: ['Edward', 'Fiona', 'Frank'] }
  ];
  assertThrows(() => JsonValidator.validate(invalid), 'at least one member');
});

test('should reject non-string member names', () => {
  const invalid = [
    { name: 'Group A', members: ['Alice', 123, 'Andrew'] },
    { name: 'Group B', members: ['Charlie', 'Diana', 'David'] },
    { name: 'Group C', members: ['Edward', 'Fiona', 'Frank'] }
  ];
  assertThrows(() => JsonValidator.validate(invalid), 'must be strings');
});

console.log('\n=== GroupFactory Tests ===\n');

test('should create groups from JSON', () => {
  const groups = GroupFactory.createFromJson(validFamilies);
  assert(groups.length === 3, 'Should create 3 groups');
  assert(groups[0].getGroupName() === 'Group A', 'First Group name should be "Group A"');
});

test('should create members as Member objects', () => {
  const groups = GroupFactory.createFromJson(validFamilies);
  const members = groups[0].getMembers();
  assert(members.length === 4, 'First Group should have 4 members');
  assert(members[0].getName() === 'Alice', 'First member name should be "Alice"');
});

test('should preserve member order', () => {
  const groups = GroupFactory.createFromJson(validFamilies);
  const members = groups[2].getMembers();
  assert(members[0].getName() === 'Edward', 'First member of third Group should be "Edward"');
  assert(members[1].getName() === 'Fiona', 'Second member of third Group should be "Fiona"');
});

console.log('\n=== PickOrderDrafter Tests ===\n');

test('should assign sequential indices starting from 1', () => {
  const groups = GroupFactory.createFromJson(validFamilies);
  const highestIndex = PickOrderDrafter.assign(groups);
  
  let members = groups[0].getMembers();
  assert(members[0].getIndex() === 1, 'First member should have index 1');
  assert(members[1].getIndex() === 2, 'Second member should have index 2');
  
  members = groups[2].getMembers();
  assert(members[0].getIndex() === 9, 'Ninth member should have index 9');
  assert(members[1].getIndex() === 10, 'Tenth member should have index 10');
});

test('should return highest index', () => {
  const groups = GroupFactory.createFromJson(validFamilies);
  const highestIndex = PickOrderDrafter.assign(groups);
  assert(highestIndex === 12, 'Highest index should be 12 for 12 members');
});

test('should handle equal member groups', () => {
  const groups = GroupFactory.createFromJson(validFamilies);
  const highestIndex = PickOrderDrafter.assign(groups);
  
  assert(groups[0].getMembers()[0].getIndex() === 1, 'First member should be 1');
  assert(groups[1].getMembers()[0].getIndex() === 5, 'Fifth member should be 5');
  assert(groups[2].getMembers()[0].getIndex() === 9, 'Ninth member should be 9');
  assert(highestIndex === 12, 'Highest index should be 12');
});

console.log('\n=== BabyAssigner Tests ===\n');

test('should assign babies to all members', () => {
  const groups = GroupFactory.createFromJson(validFamilies);
  PickOrderDrafter.assign(groups);
  BabyAssigner.assign(groups, 12);
  
  for (const Group of groups) {
    for (const member of group.getMembers()) {
      assert(member.getBaby() !== null && member.getBaby() !== undefined, 
        `Member ${member.getName()} should have a baby assigned`);
    }
  }
});

test('should not assign baby from own group', () => {
  const groups = GroupFactory.createFromJson(validFamilies);
  PickOrderDrafter.assign(groups);
  BabyAssigner.assign(groups, 12);
  
  // Group A members have indices 1, 2, 3, 4
  const groupAMembers = groups[0].getMembers();
  const groupAIndices = new Set([1, 2, 3, 4]);
  
  for (const member of groupAMembers) {
    const baby = member.getBaby();
    assert(!groupAIndices.has(baby), 
      `Member ${member.getName()} from Group A should not have baby from Group A`);
  }
});

test('should not have duplicate baby assignments', () => {
  const groups = GroupFactory.createFromJson(validFamilies);
  PickOrderDrafter.assign(groups);
  BabyAssigner.assign(groups, 12);
  
  const babyIndices = new Set();
  for (const group of groups) {
    for (const member of group.getMembers()) {
      const baby = member.getBaby();
      assert(!babyIndices.has(baby), 
        `Baby index ${baby} should only be assigned once`);
      babyIndices.add(baby);
    }
  }
});

console.log('\n=== groupRepository Tests ===\n');

test('should find Group of member', () => {
  const groups = GroupFactory.createFromJson(validFamilies);
  const group = GroupRepository.getGroupOfMember('Alice', groups);
  assert(group !== null, 'Should find Group for Alice');
  assert(group.getGroupName() === 'Group A', 'Alice should be in Group A');
});

test('should return null for non-existent member', () => {
  const groups = GroupFactory.createFromJson(validFamilies);
  const group = GroupRepository.getGroupOfMember('NonExistent', groups);
  assert(group === null, 'Should return null for non-existent member');
});

test('should identify same Group members', () => {
  const groups = GroupFactory.createFromJson(validFamilies);
  const memberA = groups[0].getMembers()[0]; // Alice
  const memberB = groups[0].getMembers()[1]; // Bob
  
  const isSame = GroupRepository.isSameGroup(memberA, memberB, groups);
  assert(isSame === true, 'Alice and Bob should be from same group');
});

test('should identify different Group members', () => {
  const groups = GroupFactory.createFromJson(validFamilies);
  const memberA = groups[0].getMembers()[0]; // Alice
  const memberC = groups[1].getMembers()[0]; // Charlie
  
  const isSame = GroupRepository.isSameGroup(memberA, memberC, groups);
  assert(isSame === false, 'Alice and Charlie should be from different groups');
});

console.log('\n=== MatchingOrchestrator Integration Tests ===\n');

testAsync('should build groups with complete pipeline', async () => {
  const groups = await MatchingOrchestrator.orchestrate(validFamilies);
  assert(groups.length === 3, 'Should create 3 groups');
});

testAsync('should assign indices and babies in pipeline', async () => {
  // Use a safer distribution for baby assignment
  const testFamilies = [
    { name: 'Group X', members: ['X1', 'X2', 'X3', 'X4'] },
    { name: 'Group Y', members: ['Y1', 'Y2', 'Y3', 'Y4'] },
    { name: 'Group Z', members: ['Z1', 'Z2', 'Z3', 'Z4'] }
  ];
  const groups = await MatchingOrchestrator.orchestrate(testFamilies);
  
  for (const Group of groups) {
    for (const member of group.getMembers()) {
      assert(member.getIndex() !== null, `${member.getName()} should have index`);
      assert(member.getBaby() !== null, `${member.getName()} should have baby`);
    }
  }
});

testAsync('should handle equal distribution groups', async () => {
  const groups = await MatchingOrchestrator.orchestrate(validFamilies);
  assert(groups.length === 3, 'Should create 3 groups');
  assert(groups[0].getMembers()[0].getBaby() !== null, 'Members should have babies assigned');
});

console.log('\n=== Test Summary ===\n');
console.log(`Total tests: ${testsRun}`);
console.log(`✓ Passed: ${testsPassed}`);
console.log(`✗ Failed: ${testsFailed}`);
console.log(`\nResult: ${testsFailed === 0 ? '✓ All tests passed!' : '✗ Some tests failed'}\n`);

process.exit(testsFailed === 0 ? 0 : 1);
