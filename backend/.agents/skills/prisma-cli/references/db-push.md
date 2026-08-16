

Pushes schema changes directly to database without creating migrations. Ideal for prototyping.



```bash
prisma db push [options]
```



- Syncs your Prisma schema to the database
- Creates database if it doesn't exist
- Does NOT create migration files
- Does NOT track migration history

| Option | Description |
|--------|-------------|
| `--force-reset` | Force a reset of the database before push |
| `--accept-data-loss` | Ignore data loss warnings |
| `--schema` | Custom path to your Prisma schema |
| `--config` | Custom path to your Prisma config file |
| `--url` | Override the datasource URL from the Prisma config file |

When Prisma detects an AI agent, `--force-reset` and `--accept-data-loss` require explicit user consent. Follow `agent-safety.md`; never infer or fabricate the consent text.

- Run `prisma generate` explicitly when you need refreshed client output

```bash
prisma db push
```

```bash
prisma db push --accept-data-loss
```

Required when changes would delete data (dropping columns, etc.)

```bash
prisma db push --force-reset
```

Completely resets database and applies schema.

```bash
prisma db push
prisma generate
```

- **Prototyping** - Rapid schema iteration
- **Local development** - Quick schema changes
- **MongoDB** - Primary workflow (migrations not supported)
- **Testing** - Setting up test databases

- **Production** - Use `migrate deploy`
- **Team collaboration** - Use migrations for trackable changes
- **When you need rollback** - Migrations provide history

| Feature | db push | migrate dev |
|---------|---------|-------------|
| Creates migration files | No | Yes |
| Tracks history | No | Yes |
| Requires shadow database | No | Yes |
| Speed | Faster | Slower |
| Rollback capability | No | Yes |
| Best for | Prototyping | Development |

MongoDB doesn't support migrations. Use `db push` exclusively:

```bash
prisma db push
prisma generate
```





```bash
prisma db push
prisma generate
```



```bash
prisma db push --force-reset
prisma db seed
```



If `db push` can't apply changes safely:

```
Error: The following changes cannot be applied:
  - Removing field `email` would cause data loss
  
Use --accept-data-loss to proceed
```

Decide whether data loss is acceptable, then:

```bash
prisma db push --accept-data-loss
```

When ready for production, switch to migrations:

```bash
prisma migrate dev --name init
```

Then use `migrate dev` for future changes.
