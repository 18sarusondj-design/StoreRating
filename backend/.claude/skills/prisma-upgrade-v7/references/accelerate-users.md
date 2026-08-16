

Special migration instructions for users of Prisma Accelerate or Prisma Postgres with `prisma://` or `prisma+postgres://` URLs.



**Do NOT pass Accelerate URLs to driver adapters.**

Driver adapters (like `PrismaPg`) expect direct database connection strings. They will fail with `prisma://` or `prisma+postgres://` URLs.





```env
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=..."
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/..."
```



```bash
npm install @prisma/extension-accelerate
```



```typescript
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),  // Accelerate URL works here
  },
})
```



```typescript
import { PrismaClient } from '../generated/client'
import { withAccelerate } from '@prisma/extension-accelerate'
export const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
}).$extends(withAccelerate())
```



```typescript
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL  // This will fail with prisma://
})
```



For migrations, you may need a direct database connection:



Accelerate URLs work with Prisma CLI commands:

```bash
prisma migrate deploy
prisma db push
```



```env
DATABASE_URL="prisma+postgres://..."  # For app
DIRECT_DATABASE_URL="postgresql://..."  # For migrations
```

```typescript
export default defineConfig({
  datasource: {
    url: env('DIRECT_DATABASE_URL'),  // Direct URL for CLI
  },
})
```



If using Prisma Postgres cloud database:



```typescript
import { PrismaClient } from '../generated/client'
import { withAccelerate } from '@prisma/extension-accelerate'

export const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,  // prisma+postgres:// URL
}).$extends(withAccelerate())
```



If you later switch to direct TCP connection:

```typescript
import { PrismaClient } from '../generated/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL  // Direct postgres:// URL
})

export const prisma = new PrismaClient({ adapter })
```



The extension enables caching:

```typescript
const users = await prisma.user.findMany({
  cacheStrategy: {
    ttl: 60,  // Cache for 60 seconds
    swr: 120, // Stale-while-revalidate for 120 seconds
  },
})
```



Accelerate works great in edge runtimes:

```typescript
import { PrismaClient } from '../generated/client'
import { withAccelerate } from '@prisma/extension-accelerate'

export const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
}).$extends(withAccelerate())
```
