# @kirbkis/database-handler-bettersqlite3

Better-sqlite3 adapter for Kirbkis Database Handler.

## Installation

```bash
npm install @iamkirbki/database-handler-core
npm install @iamkirbki/database-handler-bettersqlite3
```

## Features

- ✅ SQLite3 support via better-sqlite3
- ⚡ Synchronous operations (no async/await needed for queries)
- 🔒 Type-safe with TypeScript
- 📝 Full schema builder support
- 🎯 Unified API with other adapters

## Quick Start

```typescript
import { BetterSqlite3Adapter } from '@iamkirbki/database-handler-bettersqlite3';
import { Container } from '@iamkirbki/database-handler-core';

// Connect to database
const db = new BetterSqlite3Adapter('./database.db');
Container.RegisterAdapter(db);

// Create a table
await db.createTable('users', (table) => {
    table.integer('id').primaryKey().increments();
    table.string('name', 100);
    table.string('email', 100).unique();
    table.timestamps();
});

// Use core classes
import { Table } from '@iamkirbki/database-handler-core';
const usersTable = new Table('users');
const users = await usersTable.Records<User>();
```

## Adapter API

### Constructor

```typescript
const db = new BetterSqlite3Adapter(database?: string | Database);
```

**Parameters:**
- `database` (optional): Path to SQLite file or better-sqlite3 Database instance

### Methods

```typescript
// Connect to database
db.connect(path: string): void

// Schema operations
await db.createTable(name: string, callback: (table) => void): Promise<void>
await db.alterTable(name: string, callback: (table) => void): Promise<void>
await db.dropTable(name: string): Promise<void>

// Execute queries
db.execute(sql: string, params?: any): any
db.query(sql: string, params?: any): any[]
```

## Schema Builder

SQLite-specific data types and constraints:

```typescript
await db.createTable('posts', (table) => {
    // Auto-increment primary key
    table.integer('id').primaryKey().increments();
    
    // String types
    table.string('title', 200);      // VARCHAR(200)
    table.text('content');           // TEXT
    table.uuid('uuid');              // UUID (text-based)
    
    // Numbers
    table.integer('views');          // INTEGER
    table.decimal('price', 10, 2);   // DECIMAL(10,2)
    table.float('rating');           // REAL
    
    // Other types
    table.boolean('is_active');      // BOOLEAN
    table.json('metadata');          // TEXT (JSON stored as string)
    table.timestamp('created_at');   // DATETIME
    table.time('start_time');        // TEXT (time stored as string)
    
    // Constraints
    table.string('email').unique();
    table.string('bio').nullable();
    table.integer('status').defaultTo(1);
    table.integer('user_id').foreignKey('users', 'id');
    
    // Helpers
    table.timestamps();              // created_at, updated_at
    table.softDeletes();            // deleted_at
    table.morphs('commentable');    // commentable_id, commentable_type
});
```

## SQLite Specifics

### Data Type Mapping

| Method | SQLite Type | Notes |
|--------|-------------|-------|
| `string()` | VARCHAR | Optional length parameter |
| `text()` | TEXT | For large text |
| `integer()` | INTEGER | Whole numbers |
| `decimal()` | DECIMAL | Precise decimals |
| `float()` | REAL | Floating point |
| `boolean()` | BOOLEAN | True/false |
| `json()` | TEXT | Stored as JSON string |
| `uuid()` | UUID | Text-based UUID |
| `timestamp()` | DATETIME | Date and time |
| `time()` | TEXT | Time as string (HH:MM:SS) |

### Auto-Increment

```typescript
table.integer('id').primaryKey().increments();
// Generates: id INTEGER PRIMARY KEY AUTO_INCREMENT
```

### Foreign Keys

```typescript
table.integer('user_id').foreignKey('users', 'id');
// Generates: user_id INTEGER FOREIGN KEY(user_id) REFERENCES users(id)
```

### Enum Values

```typescript
table.enum('status', ['draft', 'published', 'archived']);
// Generates: status TEXT CHECK (status IN ('draft', 'published', 'archived'))
```

## Examples

### In-Memory Database

```typescript
const db = new BetterSqlite3Adapter(':memory:');
Container.RegisterAdapter(db);
```

### File-Based Database

```typescript
const db = new BetterSqlite3Adapter('./data/app.db');
Container.RegisterAdapter(db);
```

### Multiple Databases

```typescript
const mainDb = new BetterSqlite3Adapter('./main.db');
const analyticsDb = new BetterSqlite3Adapter('./analytics.db');

Container.RegisterAdapter(mainDb, 'main', true);  // Default
Container.RegisterAdapter(analyticsDb, 'analytics');

// Use specific database
const table = new Table('events', 'analytics');
```

### Complete CRUD

```typescript
import { BetterSqlite3Adapter } from '@iamkirbki/database-handler-bettersqlite3';
import { Container, Table, Record } from '@iamkirbki/database-handler-core';

const db = new BetterSqlite3Adapter('./app.db');
Container.RegisterAdapter(db);

await db.createTable('users', (table) => {
    table.integer('id').primaryKey().increments();
    table.string('name', 100);
    table.string('email', 100).unique();
    table.boolean('is_active').defaultTo(true);
    table.timestamps();
});

const usersTable = new Table('users');

// Create
const user = new Record<User>('users', {
    name: 'Alice',
    email: 'alice@example.com'
});
await user.Insert();

// Read
const users = await usersTable.Records<User>({ 
    where: { is_active: true } 
});

// Update
const alice = await usersTable.Record<User>({ 
    where: { email: 'alice@example.com' } 
});
if (alice) {
    alice.values.name = 'Alice Smith';
    await alice.Update();
}

// Delete
await alice.Delete();
```

## Performance Tips

1. **Use Transactions**: Better-sqlite3 is very fast with transactions
2. **Prepare Statements**: Statements are automatically prepared and cached
3. **In-Memory for Tests**: Use `:memory:` for test databases
4. **WAL Mode**: Enable WAL mode for better concurrency

```typescript
import Database from 'better-sqlite3';

const sqlite = new Database('./app.db');
sqlite.pragma('journal_mode = WAL');

const db = new BetterSqlite3Adapter(sqlite);
```

## Documentation

- [Core Documentation](../core/README.md)
- [Query Guide](../core/src/base/Wiki/Query.md)
- [Table Guide](../core/src/base/Wiki/Table.md)
- [Record Guide](../core/src/base/Wiki/Record.md)
- [Schema Builder](../core/src/abstract/Wiki/SchemaTableBuilder.md)

## License

ISC License
