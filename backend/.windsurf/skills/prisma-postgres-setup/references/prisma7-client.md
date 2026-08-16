

Prisma 7 changed how PrismaClient connects to databases. The CLI (`prisma db push`, `prisma migrate`) reads the URL from `prisma.config.ts`. But at **runtime**, you must provide a driver adapter to PrismaClient explicitly.



```bash
npm install @prisma/client @prisma/adapter-pg pg
```

- `@prisma/adapter-pg` — the Prisma adapter for the `pg` PostgreSQL driver
- `pg` — the underlying Node.js PostgreSQL driver



```typescript
import 'dotenv/config'
import pg from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './generated/prisma/client.js'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })
```



1. **Import path**: Always `./generated/prisma/client.js` — not `./generated/prisma` and not `@prisma/client`.

2. **Adapter is mandatory**: `new PrismaClient()` with no arguments throws. `new PrismaClient({ datasourceUrl: '...' })` also throws — `datasourceUrl` does not exist in Prisma 7.

3. **ESM required**: The generated client uses ESM. Ensure `package.json` has `"type": "module"`.

4. **Pool lifecycle**: Call `await pool.end()` when shutting down (after `prisma.$disconnect()`).



```typescript
import 'dotenv/config'
import pg from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './generated/prisma/client.js'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })
const user = await prisma.user.create({
  data: { email: 'alice@example.com', name: 'Alice' },
})
const posts = await prisma.post.findMany({
  where: { published: true },
  include: { author: true },
})
await prisma.post.update({
  where: { id: 1 },
  data: { published: true },
})
await prisma.post.delete({ where: { id: 1 } })
await prisma.$disconnect()
await pool.end()
```



| Mistake | Error | Fix |
|---|---|---|
| `import { PrismaClient } from './generated/prisma'` | `Cannot find module` | Use `./generated/prisma/client.js` |
| `new PrismaClient()` | `PrismaClient needs non-empty options` | Pass `{ adapter }` |
| `new PrismaClient({ datasourceUrl: url })` | `Unknown property datasourceUrl` | Use adapter pattern instead |
| Missing `"type": "module"` in package.json | ESM import errors | Add `"type": "module"` |
| `import { PrismaClient } from '@prisma/client'` | Wrong export | Use `./generated/prisma/client.js` |
