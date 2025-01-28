# Database Configuration Guide

## Configuration Details

### Connection Parameters
```json
{
  "development": {
    "username": "barbatos",
    "password": "******",
    "database": "motortrip_dev",
    "host": "127.0.0.1",
    "port": 5432,
    "dialect": "postgres"
  },
  "test": {
    "use_env_variable": "DATABASE_URL"
  },
  "production": {
    "use_env_variable": "DATABASE_URL",
    "dialectOptions": {
      "ssl": {
        "require": true,
        "rejectUnauthorized": false
      }
    }
  }
}
```

### Connection Pool Settings (from database.ts)
```typescript
const sequelize = new Sequelize({
  // ...
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false
});
```

## Migration History

### Notable Schema Changes
1. **Initial Schema (2025-01-23)**
   - Created core tables: users, trips, bookings, reviews
   - Defined relationships:
     - User → Trip (created_by)
     - User → Booking (user_id)
     - Trip → Booking (trip_id)
   - Added soft delete columns (deleted_at)

2. **Review System Enhancement (2025-01-23)**
   - Added rating validation (1-5)
   - Created composite index on (user_id, trip_id)
   - Added check constraint for rating values

## Common Issues & Solutions

### Authentication Failures
```bash
# Solution: Verify permissions
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE motortrip_dev TO barbatos;"
```

### Migration Conflicts
```bash
# Rollback and re-run
npx sequelize-cli db:migrate:undo
npx sequelize-cli db:migrate
```

### Connection Pool Exhaustion
```typescript
// Adjust pool settings in database.ts
pool: {
  max: 10,  // Increased from 5
  min: 2,
  acquire: 60000,
  idle: 30000
}
```

## Security Practices

### Credential Management
```bash
# Environment setup
export DATABASE_URL="postgres://user:******@host:port/dbname?ssl=true"
```

### Encryption Standards
- Passwords: bcrypt with 12 rounds
- SSL: Enabled in production with strict certificate validation
- Audit logs: Admin actions tracked in admin_logs table

### Index Optimization
```javascript
// Example from migration
await queryInterface.addIndex('reviews', ['user_id', 'trip_id'], {
  unique: true,
  name: 'review_unique_constraint'
});
```

## Migration Management

### Sequelize CLI Commands
```bash
# Create new migration
npx sequelize-cli migration:generate --name description

# Run pending migrations
npx sequelize-cli db:migrate

# Rollback last migration
npx sequelize-cli db:migrate:undo
