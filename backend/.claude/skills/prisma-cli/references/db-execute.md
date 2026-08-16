

Execute native commands (SQL) to your database.



```bash
prisma db execute [options]
```



- Connects to your database using the configured datasource
- Executes a script provided via file (`--file`) or stdin (`--stdin`)
- Useful for running raw SQL, maintenance tasks, or applying diffs from `migrate diff`
- Not supported on MongoDB



| Option | Description |
|--------|-------------|
| `--file` | Path to a file containing the script to execute |
| `--stdin` | Use terminal standard input as the script |
| `--config` | Custom path to your Prisma config file |



`prisma db execute` uses the datasource configured in `prisma.config.ts`. Use `--config` if you need a separate config file for another environment.





```bash
prisma db execute --file ./script.sql
```



```bash
echo "TRUNCATE TABLE User;" | prisma db execute --stdin
```



Pipe the output of `migrate diff` directly to the database:

```bash
prisma migrate diff \
  --from-empty \
  --to-schema prisma/schema.prisma \
  --script \
| prisma db execute --stdin
```



Uses `datasource` from `prisma.config.ts`:

```typescript
export default defineConfig({
  datasource: {
    url: env('DATABASE_URL'),
  },
})
```



- **Manual Migrations**: Applying raw SQL changes
- **Data Maintenance**: Truncating tables, cleaning up data
- **Schema Synchronization**: Applying `migrate diff` scripts
- **Debugging**: Running test queries (though typically not for fetching data)



- **No Data Return**: The command reports success/failure, not query results (rows). Use Prisma Client or `prisma studio` to view data.
- **SQL Only**: Primarily for SQL databases.
