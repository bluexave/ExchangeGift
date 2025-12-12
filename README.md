# Gift Exchange Partner Matching API

A Node.js REST API for matching gift exchange partners, ensuring participants are matched only with people from different families. Includes optional email notification system.

## Features

✅ **Smart Matching Algorithm** - Uses backtracking with retry logic (3 attempts)
✅ **Email Notifications** - Optional email sending to family contacts
✅ **Input Validation** - Enforces minimum requirements (3 families, 3 members per family, 10 total members)
✅ **Clean Architecture** - 5-stage modular pipeline (Validate → Create → Index → Assign → Email)
✅ **Comprehensive Logging** - Detailed output showing assignment process and exclusion lists
✅ **Full Test Suite** - 27 unit tests covering all components
✅ **No Same-Family Matches** - Guaranteed no person gives to family member

## Project Structure

```
src/
  ├── index.js              # Express server and API routes
  ├── matchingOrchestrator.js # Orchestrator (5-stage pipeline)
  ├── jsonValidator.js      # Input validation
  ├── familyFactory.js      # Create Family/Member objects
  ├── pickOrderDrafter.js   # Draft pick order for gift selection
  ├── babyAssigner.js       # Random gift assignment with retries
  ├── emailSender.js        # Email notification system
  ├── familyRepository.js   # Query utility functions
  ├── family.js             # Family class
  ├── member.js             # Member class
  └── randomizer.js         # Seeded random number generation

test.js                      # 27 unit tests
testscript.js               # HTTP API test script
debug-test.js               # Debug/demo script
```

## Installation

```bash
npm install
```

### Optional: Email Support

For actual email sending (not console logging):

```bash
npm install nodemailer
```

Then set environment variables:
```powershell
$env:SMTP_HOST = "smtp.gmail.com"
$env:SMTP_PORT = "587"
$env:SMTP_SECURE = "false"
$env:SMTP_USER = "your-email@gmail.com"
$env:SMTP_PASS = "your-app-password"
```

## Running

### Start Server
```bash
npm start
```

### Run Tests
```bash
npm test
```

### Test API
```bash
node testscript.js
```

### Debug Mode
```bash
node debug-test.js
```

## API Usage

### POST /api/match

**Request:**
```json
{
  "families": [
    {
      "name": "Smith",
      "members": ["John", "Mary", "Tom"],
      "email": "smith@example.com"
    },
    {
      "name": "Johnson", 
      "members": ["Alice", "Bob", "Charlie"],
      "email": "johnson@example.com"
    },
    {
      "name": "Williams",
      "members": ["David", "Eve", "Frank", "Grace"],
      "email": "williams@example.com"
    }
  ],
  "sendEmails": true
}
```

**Requirements:**
- Minimum 3 families
- Minimum 3 members per family
- Minimum 10 total members
- All family/member names must be unique strings
- Email field is optional (only used if `sendEmails: true`)

**Response:**
```json
{
  "success": true,
  "matches": [
    {
      "name": "John",
      "baby": 5
    },
    {
      "name": "Mary", 
      "baby": 9
    }
  ]
}
```

The `baby` field is the index of the person they give a gift to (1-based indexing).

### GET /health

Returns server status:
```json
{
  "status": "OK"
}
```

## How It Works

### 5-Stage Pipeline

1. **JsonValidator** - Validates input meets requirements
2. **FamilyFactory** - Converts JSON to Family/Member objects
3. **PickOrderDrafter** - Assigns sequential indices (1, 2, 3, ...) to draft pick order
4. **BabyAssigner** - Randomly assigns gifts (3 retries if needed)
5. **EmailSender** - Sends assignment notifications (optional)

### Assignment Algorithm

Uses seeded random selection with exclusion lists:
- Each person gets a random person from outside their family
- Already-assigned people are excluded
- Family members are excluded
- Retries with different seeds if no valid assignment found

## Validation Rules

- `MIN_FAMILIES = 3` - At least 3 families required
- `MIN_MEMBERS_PER_FAMILY = 3` - Each family needs 3+ members
- `MIN_MEMBERS_TOTAL = 10` - At least 10 members across all families
- No duplicate family names
- No duplicate member names
- All family/member names must be strings

## Email Configuration

### Development Mode (Default)
Emails are logged to console - no SMTP needed.

### Gmail (Recommended)
1. Enable 2-Factor Authentication
2. Create App Password: https://myaccount.google.com/apppasswords
3. Set environment variables with the 16-char password

### Other Providers
- **Office 365**: `smtp.office365.com:587`
- **SendGrid**: Use API key
- **Custom SMTP**: Configure host, port, user, pass

## Testing

### Unit Tests (27 tests)
```bash
npm test
```

### API Test
```bash
node testscript.js
```

## Error Handling

Returns `400 Bad Request` with error messages for invalid input.

## Performance

- Assignment: O(n) where n = total members
- Retries: Up to 3 attempts (typically 1)
- With 22 members: Usually succeeds on first attempt

## License

MIT
