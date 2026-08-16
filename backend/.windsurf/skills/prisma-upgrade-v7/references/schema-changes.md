

Prisma v7 promotes `prisma-client` to the default generator. Update your generator block, output path, and imports accordingly.

This guide is for projects that are actually migrating to Prisma 7. Do not apply these schema changes to MongoDB projects; keep those on Prisma 6.x.



```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}
```





Use `prisma-client` in Prisma v7. The older `prisma-client-js` generator still exists in the repo for legacy setups, but `prisma-client` is the default path for current projects.



The `output` field is mandatory when using `prisma-client`. Prisma Client no longer generates to `node_modules` with this generator.

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}
```



Legacy Rust engine settings are gone. With `prisma-client`, the relevant value is `engineType = "client"` if you want to state it explicitly, although it is typically inferred and can be omitted.

```prisma
generator client {
  provider   = "prisma-client"
  output     = "../generated/prisma"
  engineType = "client"
}
```



If you must stay on CommonJS:

```prisma
generator client {
  provider     = "prisma-client"
  output       = "../generated/prisma"
  moduleFormat = "cjs"
}
```





```prisma
output = "../generated/prisma"
```

Creates files like:

```text
generated/prisma/
  client.ts
  browser.ts
  enums.ts
  models.ts
  models/
```



```prisma
output = "../../packages/database/generated/prisma"
```



```prisma
output = "./generated/prisma"
```

Creates: `prisma/generated/prisma/client.ts`



The `url`, `directUrl`, and `shadowDatabaseUrl` fields in the `datasource` block are deprecated in Prisma v7. Move them to `prisma.config.ts` and keep only the provider in `schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
}
```

```typescript
export default defineConfig({
  datasource: {
    url: env('DATABASE_URL'),
    directUrl: env('DIRECT_URL'),
    shadowDatabaseUrl: env('SHADOW_DATABASE_URL'),
  },
})
```



1. Run `prisma generate`:
   ```bash
   npx prisma generate
   ```

2. Update imports throughout your codebase:
   ```typescript
   import { PrismaClient } from '../generated/prisma/client'
   ```

3. Update `.gitignore` if you manage this manually:
   ```
   /generated/prisma
   ```

4. Replace `Prisma.validator()` with TypeScript `satisfies` when using `prisma-client`:
   ```typescript
   import { Prisma } from '../generated/prisma/client'

   const userSelect = {
     id: true,
     email: true,
   } satisfies Prisma.UserSelect
   ```



- `client` - server-side Prisma Client and Prisma namespace
- `browser` - browser-safe types and enums without a real `PrismaClient`
- `enums` - slim enum-only entrypoint
- `models` - model types and derived helper types



Preview features still work as before:

```prisma
generator client {
  provider        = "prisma-client"
  output          = "../generated/prisma"
  previewFeatures = ["relationJoins", "fullTextSearch"]
}
```

Recent preview-feature examples also include `partialIndexes` for PostgreSQL, SQLite, SQL Server, and CockroachDB:

```prisma
generator client {
  provider        = "prisma-client"
  output          = "../generated/prisma"
  previewFeatures = ["partialIndexes"]
}
```
