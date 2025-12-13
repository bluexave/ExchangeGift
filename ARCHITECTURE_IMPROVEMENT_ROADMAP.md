# Architecture Improvement Roadmap

## Phase 1: Foundation Hardening (Weeks 1-2)

### 1.1 Add TypeScript Support

**Why:** Type safety, better IDE support, self-documenting code

**Steps:**
```bash
npm install -D typescript @types/node @types/express
npx tsc --init
```

**Example Migration:**
```typescript
// src/domain/Group.ts
import { Member } from './Member';

export class Group {
  constructor(
    private name: string,
    private members: Member[],
    private email: string,
    private isPickAtLeastOnePerGroup: boolean
  ) {}

  getGroupName(): string {
    return this.name;
  }

  getMembers(): Member[] {
    return this.members;
  }

  getEmail(): string {
    return this.email;
  }

  getPickAtLeastOnePerGroup(): boolean {
    return this.isPickAtLeastOnePerGroup;
  }
}
```

**Effort:** 3-5 days  
**Impact:** High (prevents runtime type errors)

---

### 1.2 Add Test Framework (Jest)

**Why:** Automated testing, better coverage, CI/CD ready

**Steps:**
```bash
npm install -D jest @types/jest
```

**Example Test:**
```javascript
// tests/unit/PickOrderService.test.js
const PickOrderService = require('../../src/business/pickorder/pickOrderService');
const { GroupFactory } = require('../../src/shared/factories');

describe('PickOrderService', () => {
  it('should assign sequential indices to all members', () => {
    const groups = GroupFactory.createFromJson([
      {
        name: 'Family A',
        members: [
          { name: 'Alice', index: null },
          { name: 'Bob', index: null }
        ],
        email: 'a@example.com',
        isPickAtLeastOnePerGroup: false
      }
    ]);

    const service = new PickOrderService();
    const highest = service.executePicking(groups);

    expect(highest).toBe(2);
    expect(groups[0].getMembers()[0].getIndex()).toBe(expect.any(Number));
  });
});
```

**File Structure:**
```
tests/
├── unit/
│   ├── business/
│   │   ├── pickorder/
│   │   │   └── PickOrderService.test.js
│   │   └── santababy/
│   │       └── AssignmentService.test.js
│   ├── domain/
│   │   └── Group.test.js
│   └── middleware/
│       └── validation.test.js
├── integration/
│   ├── routes/
│   │   ├── matching.test.js
│   │   └── pickOrder.test.js
│   └── orchestrators/
│       └── MatchingOrchestrator.test.js
└── fixtures/
    └── testData.js
```

**Effort:** 2-3 days  
**Impact:** High (enables safe refactoring)

---

### 1.3 Add API Documentation (Swagger/OpenAPI)

**Why:** Frontend integration easier, API contract clear

**Setup:**
```bash
npm install swagger-ui-express swagger-jsdoc
```

**Example:**
```javascript
// src/config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gift Exchange API',
      version: '1.0.0',
      description: 'API for matching gift exchange partners'
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Development' }
    ]
  },
  apis: ['./src/routes/api/*.js']
};

const specs = swaggerJsdoc(options);
module.exports = { specs, swaggerUi };
```

**Route Documentation:**
```javascript
/**
 * @swagger
 * /api/draft-pick-order:
 *   post:
 *     summary: Generate pick order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groups:
 *                 type: array
 *                 items: { $ref: '#/components/schemas/Group' }
 *     responses:
 *       200:
 *         description: Pick order generated
 */
router.post('/', validateArrayPayload, async (req, res, next) => {
  // ...
});
```

**Effort:** 1-2 days  
**Impact:** Medium (improves integration experience)

---

## Phase 2: Critical Features (Weeks 3-4)

### 2.1 Add Controller Layer

**Why:** Further decouples HTTP from business logic, enables easier testing

**Structure:**
```
src/
└── controllers/
    ├── matchingController.js
    ├── pickOrderController.js
    └── configController.js
```

**Example:**
```javascript
// src/controllers/matchingController.js
const MatchingOrchestrator = require('../orchestrators/matchingOrchestrator');

class MatchingController {
  async executeMatching(groups, sendEmails = false) {
    try {
      const result = await MatchingOrchestrator.orchestrate(groups, sendEmails);
      return {
        success: true,
        data: this.formatGroups(result),
        message: `Successfully matched ${this.countMembers(result)} members`
      };
    } catch (error) {
      throw new MatchingError(error.message);
    }
  }

  formatGroups(groups) {
    return groups.map(g => ({
      name: g.getGroupName(),
      email: g.getEmail(),
      members: g.getMembers().map(m => ({
        name: m.getName(),
        giver: m.getName(),
        receiver: this.findMemberName(m.getBaby(), groups)
      }))
    }));
  }

  countMembers(groups) {
    return groups.reduce((sum, g) => sum + g.getMembers().length, 0);
  }

  findMemberName(index, groups) {
    for (const group of groups) {
      for (const member of group.getMembers()) {
        if (member.getIndex() === index) return member.getName();
      }
    }
    return `Member ${index}`;
  }
}

module.exports = new MatchingController();
```

**Updated Route:**
```javascript
// src/routes/api/matching.js
const matchingController = require('../../controllers/matchingController');

router.post('/', validateArrayPayload, async (req, res, next) => {
  try {
    const { groups, sendEmails = false } = req.body;
    validateGroupMembers(groups);
    validateMembersIndexed(groups);

    const result = await matchingController.executeMatching(groups, sendEmails);
    res.json(result);
  } catch (error) {
    next(error);
  }
});
```

**Effort:** 2-3 days  
**Impact:** High (improves testability)

---

### 2.2 Database Integration (PostgreSQL)

**Setup:**
```bash
npm install pg sequelize
npm install -D sequelize-cli
npx sequelize-cli init
```

**Example Model:**
```javascript
// src/data/models/Group.js
'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Group = sequelize.define('Group', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isPickAtLeastOnePerGroup: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'groups',
    timestamps: true
  });

  Group.associate = (models) => {
    Group.hasMany(models.Member, { foreignKey: 'groupId' });
    Group.hasMany(models.Assignment, { foreignKey: 'groupId' });
  };

  return Group;
};
```

**Repository Pattern:**
```javascript
// src/data/repositories/GroupRepository.js
class GroupRepository {
  async save(groupData) {
    return await Group.create(groupData, {
      include: [{ association: 'members' }]
    });
  }

  async findAll() {
    return await Group.findAll({
      include: [{ association: 'members' }]
    });
  }

  async findById(id) {
    return await Group.findByPk(id, {
      include: [{ association: 'members' }]
    });
  }
}

module.exports = new GroupRepository();
```

**Effort:** 3-4 days  
**Impact:** Critical (enables data persistence)

---

### 2.3 Authentication (JWT)

**Setup:**
```bash
npm install jsonwebtoken bcrypt
npm install -D @types/jsonwebtoken
```

**Middleware:**
```javascript
// src/middleware/auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
```

**Apply to Routes:**
```javascript
// src/routes/api/matching.js
const authMiddleware = require('../../middleware/auth');

router.post('/', authMiddleware, validateArrayPayload, async (req, res, next) => {
  // Protected route - user info available as req.user
  const userId = req.user.id;
  // ...
});
```

**Effort:** 2-3 days  
**Impact:** Critical (enables access control)

---

## Phase 3: Operations & Monitoring (Weeks 5-6)

### 3.1 Structured Logging (Winston)

**Setup:**
```bash
npm install winston
```

**Implementation:**
```javascript
// src/services/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'gift-exchange-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

**Usage:**
```javascript
const logger = require('../services/logger');

logger.info('Pick order assignment started', { groups: groups.length });
logger.error('Assignment failed', { error: error.message });
logger.warn('Retrying assignment', { attempt: 2, remaining: 8 });
```

**Effort:** 1-2 days  
**Impact:** High (enables production debugging)

---

### 3.2 Error Categorization

**Implementation:**
```javascript
// src/shared/errors/ApplicationError.js
class ApplicationError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.timestamp = new Date();
  }
}

class ValidationError extends ApplicationError {
  constructor(message, field = null) {
    super(message, 400, 'VALIDATION_ERROR');
    this.field = field;
  }
}

class NotFoundError extends ApplicationError {
  constructor(message) {
    super(message, 404, 'NOT_FOUND');
  }
}

class ConflictError extends ApplicationError {
  constructor(message) {
    super(message, 409, 'CONFLICT');
  }
}

class InternalError extends ApplicationError {
  constructor(message) {
    super(message, 500, 'INTERNAL_ERROR');
  }
}

module.exports = {
  ApplicationError,
  ValidationError,
  NotFoundError,
  ConflictError,
  InternalError
};
```

**Updated Error Handler:**
```javascript
// src/middleware/errorHandler.js
const logger = require('../services/logger');
const { ApplicationError } = require('../shared/errors');

function errorHandler(err, req, res, next) {
  logger.error('Request error', {
    path: req.path,
    method: req.method,
    error: err.message,
    code: err.code,
    stack: err.stack
  });

  if (err instanceof ApplicationError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
      timestamp: err.timestamp
    });
  }

  // Unknown error
  res.status(500).json({
    error: 'Internal Server Error',
    code: 'INTERNAL_ERROR',
    timestamp: new Date()
  });
}

module.exports = errorHandler;
```

**Effort:** 1-2 days  
**Impact:** High (consistent error handling)

---

## Phase 4: Advanced (Ongoing)

### 4.1 Dependency Injection Container

```bash
npm install tsyringe reflect-metadata
```

### 4.2 Caching (Redis)

```bash
npm install redis
```

### 4.3 Rate Limiting

```bash
npm install express-rate-limit
```

### 4.4 Input Validation Schema (Zod)

```bash
npm install zod
```

---

## Quick Implementation Checklist

### Week 1 Tasks
- [ ] Add TypeScript setup
- [ ] Add Jest test framework
- [ ] Create unit test suite structure
- [ ] Add Swagger documentation
- [ ] Setup tsconfig.json
- [ ] Update build/start scripts

### Week 2 Tasks
- [ ] Convert 5-10 key files to TypeScript
- [ ] Write 20-30 unit tests
- [ ] Document all API endpoints
- [ ] Setup CI/CD pipeline basics
- [ ] Create deployment guide

### Week 3-4 Tasks
- [ ] Add controller layer
- [ ] Setup PostgreSQL locally
- [ ] Create database models
- [ ] Implement JWT auth
- [ ] Write integration tests

### Week 5-6 Tasks
- [ ] Setup Winston logging
- [ ] Error categorization
- [ ] Monitoring dashboard
- [ ] Load testing
- [ ] Security audit

---

## Success Metrics

After completing these phases:

```
✅ 80%+ test coverage
✅ <100ms average response time
✅ 0 critical security issues
✅ 99.9% uptime capability
✅ <5 minute deployment
✅ <30s database failover
✅ Full API documentation
✅ Structured logging & alerting
```

---

## Estimated Resource Hours

```
Phase 1 (Foundation):     60-80 hours
Phase 2 (Critical):      100-120 hours
Phase 3 (Operations):     60-80 hours
Phase 4 (Advanced):      Variable

Total to Production:     220-280 hours
(~4-5 weeks with 2 developers)
```

Start with Phase 1 immediately for maximum impact!
