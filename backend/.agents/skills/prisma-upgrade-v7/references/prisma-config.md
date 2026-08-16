

Prisma v7 introduces `prisma.config.ts` as the central configuration file for the Prisma CLI.



Place `prisma.config.ts` at your project root (next to `package.json`).



```typescript
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
})
```





Path to your Prisma schema file:

```typescript
schema: 'prisma/schema.prisma'
```



Database connection URL:

```typescript
datasource: {
  url: env('DATABASE_URL'),
}
```



Direct connection URL (bypassing connection pooler):

```typescript
datasource: {
  url: env('DATABASE_URL'),
  directUrl: env('DIRECT_DATABASE_URL'),
}
```



Shadow database for migrations:

```typescript
datasource: {
  url: env('DATABASE_URL'),
  shadowDatabaseUrl: env('SHADOW_DATABASE_URL'),
}
```



Directory for migration files:

```typescript
migrations: {
  path: 'prisma/migrations',
}
```



Seed command for `prisma db seed`:

```typescript
migrations: {
  path: 'prisma/migrations',
  seed: 'tsx prisma/seed.ts',
}
```



```typescript
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
    directUrl: env('DIRECT_DATABASE_URL'),
    shadowDatabaseUrl: env('SHADOW_DATABASE_URL'),
  },
})
```





Use `env()` to reference environment variables:

```typescript
import { env } from 'prisma/config'

datasource: {
  url: env('DATABASE_URL'),
}
```

This provides type safety but does NOT load .env files automatically.



Install and import dotenv:

```bash
npm install dotenv
```

```typescript
import 'dotenv/config'  // Must be first import
import { defineConfig, env } from 'prisma/config'
```





```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```



```typescript
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
    directUrl: env('DIRECT_URL'),
  },
})
```

And update schema.prisma:

```prisma
datasource db {
  provider = "postgresql"
}
```



Use `--config` flag with CLI commands:

```bash
prisma migrate dev --config ./config/prisma.config.ts
```



```typescript
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'
import path from 'path'

export default defineConfig({
  schema: path.join(__dirname, 'packages/database/prisma/schema.prisma'),
  migrations: {
    path: path.join(__dirname, 'packages/database/prisma/migrations'),
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
})
```
