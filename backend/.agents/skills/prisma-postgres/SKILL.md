---
name: prisma-postgres
description: Prisma Postgres setup and operations guidance across Console, create-db CLI, Management API, and Management API SDK. Use when creating Prisma Postgres databases, working in Prisma Console, provisioning with create-db/create-pg/create-postgres, or integrating programmatic provisioning with service tokens or OAuth.
license: MIT
metadata:
  author: prisma
  version: "7.9.1"
---



Guidance for creating, managing, and integrating Prisma Postgres across interactive and programmatic workflows.



Reference this skill when:
- Setting up Prisma Postgres from Prisma Console
- Provisioning instant temporary databases with `create-db`
- Linking an existing local project with `prisma postgres link`
- Managing Prisma Postgres resources via Management API
- Using `@prisma/management-api-sdk` in TypeScript/JavaScript
- Handling claim URLs, connection strings, regions, and auth flows



| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | CLI Provisioning | CRITICAL | `create-db-cli` |
| 2 | Management API | CRITICAL | `management-api` |
| 3 | Management API SDK | HIGH | `management-api-sdk` |
| 4 | Console and Connections | HIGH | `console-and-connections` |



- `create-db-cli` - instant databases and current CLI flags (`--ttl`, `--copy`, `--quiet`, `--open`)
- `management-api` - service token and OAuth API workflows
- `management-api-sdk` - typed SDK usage with token storage
- `console-and-connections` - Console operations, `prisma postgres link`, direct TCP connections, and serverless-driver choices





Use Prisma Console for manual setup and operations:

- Open `https://console.prisma.io`
- Create/select workspace and project
- Use Studio in the project sidebar to view/edit data
- Retrieve direct connection details from the project UI



Use `create-db` when you need a database immediately:

```bash
npx create-db@latest
```

Aliases:

```bash
npx create-pg@latest
npx create-postgres@latest
```

For app integrations, you can also use the programmatic API (`create()` / `regions()`) from the `create-db` npm package.

Temporary databases auto-delete after ~24 hours unless claimed.



For databases that belong to a Project (not throwaway `create-db` databases), use `@prisma/cli`:

```bash
npx -y @prisma/cli@latest database create --help
npx -y @prisma/cli@latest database list --json
npx -y @prisma/cli@latest database connection create db_123
npx -y @prisma/cli@latest database usage db_123
npx -y @prisma/cli@latest database backup list db_123
```

`database create` and `database connection create` print a one-time connection URL; store it immediately. Destructive commands (`remove`, `restore`) require exact `--confirm <id>`.

For automation, prefer `--json --no-interactive`, resolve ids before mutations, and verify the installed command's help because this CLI is beta.

Use `prisma postgres link` when the database already exists and you want to wire a local project to it:

```bash
prisma postgres link
```

For CI or other non-interactive environments:

```bash
prisma postgres link --api-key "<your-api-key>" --database "db_..."
```

This flow updates your local `.env` with `DATABASE_URL`, then you can run `prisma generate` and `prisma migrate dev`.

Use API endpoints on:

```text
https://api.prisma.io/v1
```

Explore the schema and endpoints using:

- OpenAPI docs: `https://api.prisma.io/v1/doc`
- Swagger Editor: `https://api.prisma.io/v1/swagger-editor`

Auth options:

- Service token (workspace server-to-server)
- OAuth 2.0 (act on behalf of users)

Install and use:

```bash
npm install @prisma/management-api-sdk
```

Use `createManagementApiClient` for existing tokens, or `createManagementApiSdk` for OAuth + token refresh.

The SDK exposes typed workspace service-token list, create, and revoke routes. A newly created token value is returned exactly once. Let the installed SDK types or OpenAPI document settle exact beta endpoint shapes.

Detailed guidance lives in:

```
references/console-and-connections.md
references/create-db-cli.md
references/management-api.md
references/management-api-sdk.md
```

Start with `references/create-db-cli.md` for fast setup, then switch to `references/management-api.md` or `references/management-api-sdk.md` when you need programmatic provisioning.
