

Execute raw SQL when Prisma's query API isn't sufficient.



Execute SELECT queries and get typed results:

```typescript
const users = await prisma.$queryRaw`
  SELECT * FROM "User" WHERE email LIKE ${'%@prisma.io'}
`
```



```typescript
type User = { id: number; email: string; name: string | null }

const users = await prisma.$queryRaw<User[]>`
  SELECT id, email, name FROM "User" WHERE role = ${'ADMIN'}
`
```



Use `Prisma.raw()` for identifiers (not safe for user input):

```typescript
import { Prisma } from '../generated/client'

const column = 'email'
const users = await prisma.$queryRaw`
  SELECT ${Prisma.raw(column)} FROM "User"
`
```



Build queries dynamically:

```typescript
import { Prisma } from '../generated/client'

const email = 'alice@prisma.io'
const query = Prisma.sql`SELECT * FROM "User" WHERE email = ${email}`
const users = await prisma.$queryRaw(query)
```



```typescript
import { Prisma } from '../generated/client'

const conditions = [
  Prisma.sql`role = ${'ADMIN'}`,
  Prisma.sql`verified = ${true}`
]

const users = await prisma.$queryRaw`
  SELECT * FROM "User" 
  WHERE ${Prisma.join(conditions, ' AND ')}
`
```



Execute INSERT, UPDATE, DELETE (returns affected count):

```typescript
const count = await prisma.$executeRaw`
  UPDATE "User" SET verified = true WHERE email LIKE ${'%@prisma.io'}
`
console.log(`Updated ${count} users`)
```



```typescript
const deleted = await prisma.$executeRaw`
  DELETE FROM "User" WHERE "deletedAt" < ${thirtyDaysAgo}
`
```



```typescript
const inserted = await prisma.$executeRaw`
  INSERT INTO "Log" (message, level, timestamp)
  VALUES (${message}, ${level}, ${new Date()})
`
```



For fully dynamic queries (use with caution!):

```typescript
const table = 'User'
const users = await prisma.$queryRawUnsafe(
  `SELECT * FROM "${table}" WHERE id = $1`,
  userId
)
```



```typescript
const result = await prisma.$executeRawUnsafe(
  'UPDATE "User" SET name = $1 WHERE id = $2',
  'Alice',
  1
)
```





```typescript
const email = userInput
const users = await prisma.$queryRaw`
  SELECT * FROM "User" WHERE email = ${email}
`
```



```typescript
const email = userInput
const users = await prisma.$queryRawUnsafe(
  `SELECT * FROM "User" WHERE email = '${email}'`
)
```





```typescript
const users = await prisma.$queryRaw`
  SELECT * FROM "User" WHERE 'admin' = ANY(roles)
`
const users = await prisma.$queryRaw`
  SELECT * FROM "User" WHERE metadata->>'theme' = 'dark'
`
```



```typescript
const posts = await prisma.$queryRaw`
  SELECT * FROM Post WHERE MATCH(title, content) AGAINST(${searchTerm})
`
```



```typescript
await prisma.$transaction(async (tx) => {
  await tx.$executeRaw`UPDATE "Account" SET balance = balance - ${amount} WHERE id = ${senderId}`
  await tx.$executeRaw`UPDATE "Account" SET balance = balance + ${amount} WHERE id = ${recipientId}`
})
```





PostgreSQL returns BigInt for COUNT:

```typescript
const result = await prisma.$queryRaw<[{ count: bigint }]>`
  SELECT COUNT(*) as count FROM "User"
`
const count = Number(result[0].count)
```



```typescript
type Result = { createdAt: Date }
const users = await prisma.$queryRaw<Result[]>`
  SELECT "createdAt" FROM "User"
`
```

Invalid JavaScript `Date` values passed to raw queries fail validation instead of being silently serialized as `null`. Validate date input at the application boundary; do not rely on `new Date(badValue)` reaching the database.

When a driver adapter returns an unmapped database-specific error, Prisma surfaces `P2039` with the adapter's preserved original code/message. If those details are missing, fix the adapter mapping rather than parsing rendered error text.
