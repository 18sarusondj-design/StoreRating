

Introspects an existing database and updates your Prisma schema to reflect its structure.



```bash
prisma db pull [options]
```



- Connects to your database
- Reads the database schema (tables, columns, relations, indexes)
- Updates `schema.prisma` with corresponding Prisma models
- For MongoDB, samples data to infer schema



| Option | Description |
|--------|-------------|
| `--force` | Ignore current Prisma schema file |
| `--print` | Print the introspected Prisma schema to stdout |
| `--schema` | Custom path to your Prisma schema |
| `--config` | Custom path to your Prisma config file |
| `--url` | Override the datasource URL from the Prisma config file |
| `--composite-type-depth` | Specify the depth for introspecting composite types (default: -1 for infinite, 0 = off) |
| `--schemas` | Specify the database schemas to introspect |
| `--local-d1` | Generate a Prisma schema from a local Cloudflare D1 database |





```bash
prisma db pull
```



```bash
prisma db pull --print
```

Outputs schema to terminal for review.



```bash
prisma db pull --force
```

Replaces schema file, losing any manual customizations.



Configure database connection in `prisma.config.ts`:

```typescript
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
})
```





1. Initialize Prisma:
   ```bash
   prisma init
   ```

2. Configure database URL

3. Pull schema:
   ```bash
   prisma db pull
   ```

4. Review and customize generated schema

5. Generate client:
   ```bash
   prisma generate
   ```



When database changes are made outside Prisma:

```bash
prisma db pull
prisma generate
```



Database tables become Prisma models:

```sql
-- Database tables
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100)
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author_id INTEGER REFERENCES users(id)
);
```

Becomes:

```prisma
model users {
  id    Int     @id @default(autoincrement())
  email String  @unique @db.VarChar(255)
  name  String? @db.VarChar(100)
  posts posts[]
}

model posts {
  id        Int    @id @default(autoincrement())
  title     String @db.VarChar(255)
  author_id Int?
  users     users? @relation(fields: [author_id], references: [id])
}
```



After `db pull`, consider:

1. **Rename models** to PascalCase:
   ```prisma
   model User {  // Was: users
     @@map("users")
   }
   ```

2. **Rename fields** to camelCase:
   ```prisma
   authorId Int? @map("author_id")
   ```

3. **Add relation names** for clarity:
   ```prisma
   author User? @relation("PostAuthor", fields: [authorId], references: [id])
   ```

4. **Add documentation**:
   ```prisma
   model User {
     email String @unique
   }
   ```



For MongoDB, `db pull` samples documents to infer schema:

```bash
prisma db pull
```

May require manual refinement since MongoDB is schemaless.



`db pull` overwrites your schema file. Always:
- Commit current schema before pulling
- Use `--print` to preview first
- Backup customizations you want to keep
