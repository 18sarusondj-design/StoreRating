

Validates your Prisma schema file.



```bash
prisma validate [options]
```



- Parses the `schema.prisma` file
- Checks for syntax errors
- Validates model definitions, relations, and types
- Reports any errors or warnings without generating code



| Option | Description |
|--------|-------------|
| `--schema` | Path to schema file |
| `--config` | Custom path to your Prisma config file |





```bash
prisma validate
```



```bash
prisma validate --schema=./custom/schema.prisma
```



Run `validate` in your CI pipeline to catch schema errors early:

```yaml
- name: Validate Schema
  run: npx prisma validate
```



- Missing `@relation` fields
- Invalid types
- Duplicate model names
- Syntax errors (missing braces, etc.)
