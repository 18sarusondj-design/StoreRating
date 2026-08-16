

Resolves issues with database migrations, such as failed migrations or baselining.



```bash
prisma migrate resolve [options]
```



Updates the `_prisma_migrations` table to manually change the state of a migration. This is a recovery tool.



You must provide exactly one of `--applied` or `--rolled-back`.

| Option | Description |
|--------|-------------|
| `--applied <name>` | Mark a migration as **applied** (success) |
| `--rolled-back <name>` | Mark a migration as **rolled back** (ignored/failed) |
| `--schema` | Path to schema file |
| `--config` | Custom path to your Prisma config file |





If you have existing tables and want to initialize migrations without running the SQL:

```bash
prisma migrate resolve --applied 20240101000000_initial_migration
```

This tells Prisma "Assume this migration has already run".



If a migration failed (e.g., syntax error) and you fixed the SQL or want to retry:

```bash
prisma migrate resolve --rolled-back 20240115120000_failed_migration
```

This tells Prisma "Forget this migration run, let me try applying it again".



1. **Baselining**: Adopting Prisma Migrate on an existing production database.
2. **Failed Migrations**: Recovering from a failed `migrate deploy` in production.
3. **Hotfixes**: reconciling manual database changes (rare).



- [Baselining](https:
- [Troubleshooting](https:
