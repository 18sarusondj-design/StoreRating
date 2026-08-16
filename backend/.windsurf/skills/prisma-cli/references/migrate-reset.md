

Resets your database and re-applies all migrations.



```bash
prisma migrate reset [options]
```



1. **Drops** the database (if possible) or deletes all data/tables
2. **Re-creates** the database
3. **Applies** all migrations from `prisma/migrations/`
4. Stops there - run seed and generate explicitly if needed

**Warning: All data will be lost.**

When Prisma detects an AI agent, this command is blocked until the user gives explicit consent. Follow `agent-safety.md`; `--force` skips the ordinary prompt but does not constitute user consent for an agent.



| Option | Description |
|--------|-------------|
| `--force` / `-f` | Skip confirmation prompt |
| `--schema` | Path to schema file |
| `--config` | Custom path to your Prisma config file |





```bash
prisma migrate reset
```

Prompts for confirmation in interactive terminals.



```bash
prisma migrate reset --force
```



```bash
prisma migrate reset --schema=./custom/schema.prisma
```



- **Development**: When you want a fresh start
- **Testing**: Resetting test database before suites
- **Drift Recovery**: When the database is out of sync and you can't migrate

Run `prisma generate` and `prisma db seed` explicitly when you need refreshed client output or seed data after a reset.

Configure the seed script in `prisma.config.ts`, then run it explicitly after reset:

```typescript
export default defineConfig({
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
})
```

Typical workflow:

```bash
prisma migrate reset --force
prisma generate
prisma db seed
```
