

Formats your Prisma schema file.



```bash
prisma format [options]
```



- Fixes formatting (indentation, spacing)
- Adds missing back-relations (e.g., adds the other side of a relation)
- Adds missing relation arguments (e.g., `fields`, `references`)
- Sorts fields and attributes (opinionated)



| Option | Description |
|--------|-------------|
| `--schema` | Path to schema file |
| `--config` | Custom path to your Prisma config file |





```bash
prisma format
```



```bash
prisma format --schema=./custom/schema.prisma
```



`prisma format` modifies the file in place. It is equivalent to "Prettier for Prisma schemas" but also has semantic understanding to fix/add missing schema definitions.



Most Prisma editor extensions (VS Code, WebStorm) run `prisma format` automatically on save. This command is useful for:
- CI pipelines (check formatting)
- CLI-based workflows
- Fixing large schema refactors
