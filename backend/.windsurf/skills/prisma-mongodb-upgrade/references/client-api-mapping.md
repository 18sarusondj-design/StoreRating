

How v6 Prisma Client calls map to Prisma Next's Mongo client — names map, parity does not.

CRITICAL

The v6 and Next client APIs look superficially similar, but none of the v6 MongoDB raw
methods exist under their old names, aggregation moved to a different lane entirely, and
transactions go through the driver rather than a façade wrapper. Assuming parity produces
code that does not compile — or, in the transactions case, code that silently loses
atomicity.

| v6 call | Prisma Next equivalent | Notes |
|---------|------------------------|-------|
| `prisma.user.findMany(...)` | `db.orm.users.where(...).all()` | Fluent ORM lane; storage-name keys (see `schema-contract-mapping.md`) |
| `prisma.user.findFirst(...)` | `db.orm.users.where(...).first()` | |
| `create` / `update` / `upsert` / `delete` / `updateMany` / `deleteMany` | `create` / `update` / `upsert` / `delete` / `updateAll` / `deleteAll` on `db.orm.<collection>` | See Prisma Next's `prisma-next-queries` skill |
| `prisma.user.aggregate(...)`, `groupBy(...)` | **No ORM equivalent.** Use the typed aggregation-pipeline builder: `db.query.from(...).match(...).group(...).build()` | Prisma Next's `prisma-next-queries` skill covers the builder lane |
| `$runCommandRaw(...)` ([v6 docs](https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/raw-queries#runcommandraw)) | **Name does not exist in Next.** Raw lane is `mongoRaw(...)` → a raw collection with `aggregate`, `insertOne/Many`, `updateOne/Many`, `deleteOne/Many`, `findOneAndUpdate/Delete`. For arbitrary database commands, use the underlying `mongodb` driver directly — it is a user-supplied peer dependency and fully accessible | Check the installed version's raw surface |
| `<model>.findRaw(...)` ([v6 docs](https:
| `<model>.aggregateRaw(...)` ([v6 docs](https:
| `$transaction(...)` — works on v6 with a replica set ([v6 docs](https:
| `$connect` / `$disconnect` | `connect()` / `close()` on the Mongo façade client | |



```typescript
await db.user.$runCommandRaw({ collStats: 'users' }); // no such method
await db.transaction(async (tx) => { ... });          // no such method on the Mongo façade
```



```typescript
const raw = mongoRaw(db);
await raw.users.aggregate([{ $match: { status: 'active' } }]);
const stats = await db.query.from('users').group({ _id: '$role', n: { $count: {} } }).build();
const session = mongoClient.startSession();
await session.withTransaction(async () => {
});
```



- [v6 MongoDB raw queries](https:
- [v6 replica set requirement for transactions](https:
- Prisma Next queries + runtime skills (`skills/prisma-next-queries`, incl. its dedicated `mongo.md`; `skills/prisma-next-runtime`) — authoritative for the Next side; verified @ `a2791c5dd59d579b4b3052942ae7f8fe5e2ee852`
