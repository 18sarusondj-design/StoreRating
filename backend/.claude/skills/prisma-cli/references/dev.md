

Starts a local Prisma Postgres database for development. Provides a PostgreSQL-compatible database that runs entirely on your machine.



```bash
prisma dev [options]
```



- Starts a local PostgreSQL-compatible database
- Runs in your terminal or as a background process
- Perfect for development and testing
- Easy migration to Prisma Postgres cloud in production



| Option | Description | Default |
|--------|-------------|---------|
| `--name` / `-n` | Name for the database instance | `default` |
| `--port` / `-p` | HTTP server port | `51213` |
| `--db-port` / `-P` | Database server port | `51214` |
| `--shadow-db-port` | Shadow database port (for migrations) | `51215` |
| `--detach` / `-d` | Run in background | `false` |
| `--debug` | Enable debug logging | `false` |





```bash
prisma dev
```

Interactive mode with keyboard shortcuts:
- `q` - Quit
- `h` - Show HTTP URL  
- `t` - Show TCP URLs



```bash
prisma dev --name myproject
```

Useful for multiple projects.



```bash
prisma dev --detach
```

Frees your terminal for other commands.



```bash
prisma dev --port 5000 --db-port 5432
```





```bash
prisma dev ls
```

Shows all local Prisma Postgres instances with status.



```bash
prisma dev start myproject
```

Starts a previously created instance in background.



```bash
prisma dev stop myproject
```



```bash
prisma dev stop "myproject*"
```

Stops all instances matching pattern.



```bash
prisma dev rm myproject
```

Removes instance data from filesystem.



```bash
prisma dev rm myproject --force
```



Configure your `prisma.config.ts` to use local Prisma Postgres:

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



1. Start local database:
   ```bash
   prisma dev
   ```

2. In another terminal, run migrations:
   ```bash
   prisma migrate dev
   ```

3. Generate client:
   ```bash
   prisma generate
   ```

4. Run your application



When ready for production, switch to Prisma Postgres cloud:

```bash
prisma init --db
```

Update your `DATABASE_URL` to the cloud connection string.
