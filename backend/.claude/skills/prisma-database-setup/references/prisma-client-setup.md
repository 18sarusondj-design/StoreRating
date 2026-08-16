

Generate and instantiate Prisma Client for Prisma's standard SQL provider workflow. For MongoDB, follow the provider-specific notes in `references/mongodb.md` instead of copying the SQL adapter example below.

```bash
npm install prisma --save-dev
npm install @prisma/client
```

In `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated"
}
```

`prisma-client` requires an explicit `output` path and does not generate into `node_modules` by default.

```bash
npx prisma generate
```

Re-run `prisma generate` after every schema change to keep the client in sync.

```typescript
import { PrismaClient } from '../generated/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })
```

If you change the generator `output`, update the import path to match. For the SQL provider workflow, replace `PrismaPg` with the adapter for your database.

Each `PrismaClient` instance creates a connection pool. Reuse a single instance per app process to avoid exhausting database connections.
