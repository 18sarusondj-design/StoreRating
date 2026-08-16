

Options for controlling query behavior.



Choose specific fields to return:

```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    id: true,
    name: true,
    email: true,
  }
})
```



```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    name: true,
    posts: {
      select: {
        title: true,
        published: true
      }
    }
  }
})
```



```typescript
const user = await prisma.user.findMany({
  select: {
    name: true,
    posts: {
      include: {
        comments: true
      }
    }
  }
})
```



```typescript
const users = await prisma.user.findMany({
  select: {
    name: true,
    _count: {
      select: { posts: true }
    }
  }
})
```



Include related records:

```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: true,
    profile: true
  }
})
```



```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 5
    }
  }
})
```



```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      include: {
        comments: {
          include: {
            author: true
          }
        }
      }
    }
  }
})
```



```typescript
const users = await prisma.user.findMany({
  include: {
    _count: {
      select: { posts: true, followers: true }
    }
  }
})
```



Exclude specific fields:

```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  omit: {
    password: true
  }
})
```



```typescript
const users = await prisma.user.findMany({
  omit: { password: true },
  include: {
    posts: {
      omit: { content: true }
    }
  }
})
```

**Note:** Cannot use `select` and `omit` together.



Filter records:

```typescript
const users = await prisma.user.findMany({
  where: {
    email: { contains: '@prisma.io' },
    role: 'ADMIN'
  }
})
```

See `filters.md` for detailed filter operators.



Sort results:

```typescript
const users = await prisma.user.findMany({
  orderBy: { name: 'asc' }
})
const users = await prisma.user.findMany({
  orderBy: [
    { role: 'desc' },
    { name: 'asc' }
  ]
})
```



```typescript
const users = await prisma.user.findMany({
  orderBy: {
    posts: { _count: 'desc' }
  }
})
```



```typescript
const users = await prisma.user.findMany({
  orderBy: {
    name: { sort: 'asc', nulls: 'last' }
  }
})
```



Pagination:

```typescript
const users = await prisma.user.findMany({
  take: 10,
  skip: 0
})
const users = await prisma.user.findMany({
  take: 10,
  skip: 10
})
```



```typescript
const lastUsers = await prisma.user.findMany({
  take: -10,
  orderBy: { id: 'asc' }
})
```



Cursor-based pagination:

```typescript
const firstPage = await prisma.user.findMany({
  take: 10,
  orderBy: { id: 'asc' }
})
const nextPage = await prisma.user.findMany({
  take: 10,
  skip: 1,  // Skip the cursor record
  cursor: { id: firstPage[firstPage.length - 1].id },
  orderBy: { id: 'asc' }
})
```



Return unique values:

```typescript
const cities = await prisma.user.findMany({
  distinct: ['city'],
  select: { city: true }
})
```



```typescript
const locations = await prisma.user.findMany({
  distinct: ['city', 'country']
})
```
