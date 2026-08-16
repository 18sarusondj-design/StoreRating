

Several features have been removed in Prisma v7. Here's how to migrate.

```typescript
prisma.$use(async (params, next) => {
  const before = Date.now()
  const result = await next(params)
  const after = Date.now()
  console.log(`Query took ${after - before}ms`)
  return result
})
```

```typescript
const prisma = new PrismaClient({ adapter }).$extends({
  query: {
    $allModels: {
      async $allOperations({ operation, model, args, query }) {
        const before = Date.now()
        const result = await query(args)
        const after = Date.now()
        console.log(`${model}.${operation} took ${after - before}ms`)
        return result
      },
    },
  },
})
```

```typescript
const prisma = new PrismaClient({ adapter }).$extends({
  query: {
    user: {
      async delete({ args, query }) {
        return prisma.user.update({
          where: args.where,
          data: { deletedAt: new Date() },
        })
      },
      async findMany({ args, query }) {
        args.where = { ...args.where, deletedAt: null }
        return query(args)
      },
    },
  },
})
```

```typescript
const prisma = new PrismaClient({ adapter }).$extends({
  query: {
    $allModels: {
      async $allOperations({ operation, model, args, query }) {
        console.log(`${model}.${operation}`, JSON.stringify(args))
        return query(args)
      },
    },
  },
})
```

The Metrics preview feature has been removed.

```typescript
const metrics = await prisma.$metrics.json()
```

```typescript
let totalQueries = 0

const prisma = new PrismaClient({ adapter }).$extends({
  client: {
    async $totalQueries() {
      return totalQueries
    },
  },
  query: {
    $allModels: {
      async $allOperations({ query, args }) {
        totalQueries += 1
        return query(args)
      },
    },
  },
})
const count = await prisma.$totalQueries()
```

Access metrics from the underlying driver adapter.

Removed from `migrate dev` and `db push`.

```bash
prisma migrate dev --skip-generate
prisma migrate dev
prisma generate  # Run explicitly if needed
```

Local verification with Prisma `7.6.0` showed no generated client files emitted by `migrate dev` or `db push`, even though some CLI help text still says `migrate dev` "trigger[s] generators".

Removed from `migrate dev`. More importantly, Prisma v7 no longer auto-runs seeds during `migrate dev` or `migrate reset`, so seed explicitly when you need it.

```bash
prisma migrate dev --skip-seed
prisma migrate dev
prisma db seed  # Run explicitly if needed
```

```bash
prisma db execute --file ./script.sql --url "$DATABASE_URL"
prisma db execute --file ./script.sql
```

| Removed | Replacement |
|---------|-------------|
| `--from-url` | `--from-config-datasource` |
| `--to-url` | `--to-config-datasource` |
| `--from-schema-datasource` | `--from-config-datasource` |
| `--to-schema-datasource` | `--to-config-datasource` |
| `--shadow-database-url` | Configure in `prisma.config.ts` |

```bash
prisma migrate diff --from-url "$DATABASE_URL" --to-schema schema.prisma
prisma migrate diff --from-config-datasource --to-schema schema.prisma
```

```bash
prisma migrate dev --name add_field
prisma generate  # Must run explicitly
```

```bash
prisma migrate reset --force
prisma db seed  # Must run explicitly
```

The `prisma-client` generator no longer exposes `Prisma.validator`. Use TypeScript's `satisfies` operator instead.

```typescript
import { Prisma } from '../generated/prisma/client'

const userSelect = {
  id: true,
  email: true,
} satisfies Prisma.UserSelect
```



Removed in v5.0.0 (already deprecated).

```typescript
const prisma = new PrismaClient({
  rejectOnNotFound: true,
})
const user = await prisma.user.findUniqueOrThrow({
  where: { id: 1 },
})

const user = await prisma.user.findFirstOrThrow({
  where: { email: 'test@example.com' },
})
```
