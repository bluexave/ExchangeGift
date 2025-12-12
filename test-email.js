#!/usr/bin/env node

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const EmailSender = require('./src/emailSender');

// Initialize email sender with Gmail SMTP
const smtpConfig = {
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'santababy@gmail.com',
    pass: process.env.GMAIL_PASSWORD || ''
  }
};

EmailSender.initialize(smtpConfig);

// Create a mock Group class for testing
class MockMember {
  constructor(name, index, baby) {
    this.name = name;
    this.index = index;
    this.baby = baby;
  }

  getName() {
    return this.name;
  }

  getIndex() {
    return this.index;
  }

  getBaby() {
    return this.baby;
  }
}

class MockGroup {
  constructor(name, email, members) {
    this.name = name;
    this.email = email;
    this.members = members;
  }

  getGroupName() {
    return this.name;
  }

  getEmail() {
    return this.email;
  }

  getMembers() {
    return this.members;
  }

  getMemberIndices() {
    return this.members.map(m => m.getIndex());
  }
}

async function testEmail() {
  console.log('\n=== Gift Exchange Email Test ===\n');

  // Create sample data
  const group1Members = [
    new MockMember('Alice', 1, 5),
    new MockMember('Bob', 2, 8),
    new MockMember('Charlie', 3, 9)
  ];

  const group2Members = [
    new MockMember('David', 4, 2),
    new MockMember('Emma', 5, 1)
  ];

  const group3Members = [
    new MockMember('Frank', 6, 7),
    new MockMember('Grace', 7, 3),
    new MockMember('Henry', 8, 4),
    new MockMember('Iris', 9, 6)
  ];

  const groups = [
    new MockGroup('Team A', 'test.recipient1@gmail.com', group1Members),
    new MockGroup('Team B', 'test.recipient2@gmail.com', group2Members),
    new MockGroup('Team C', 'test.recipient3@gmail.com', group3Members)
  ];

  console.log('Sending test emails to:');
  groups.forEach(g => {
    console.log(`  - ${g.getGroupName()}: ${g.getEmail()}`);
  });
  console.log();

  try {
    const results = await EmailSender.sendAssignments(groups);

    console.log('\n=== Email Results ===\n');
    results.forEach(result => {
      const status = result.status === 'sent' ? '✓' : result.status === 'failed' ? '✗' : '⊘';
      console.log(`${status} ${result.group} (${result.email}): ${result.status}`);
      if (result.messageId) {
        console.log(`  Message ID: ${result.messageId}`);
      }
      if (result.error) {
        console.log(`  Error: ${result.error}`);
      }
    });

    console.log('\n✓ Email test completed!\n');
  } catch (error) {
    console.error('\n✗ Error sending emails:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testEmail();
