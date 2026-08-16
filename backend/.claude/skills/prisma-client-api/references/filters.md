

Filter operators for the `where` clause.



```typescript
where: { email: 'alice@prisma.io' }
where: { email: { equals: 'alice@prisma.io' } }
where: { email: { not: 'alice@prisma.io' } }
```



```typescript
where: { age: { gt: 18 } }
where: { age: { gte: 18 } }
where: { age: { lt: 65 } }
where: { age: { lte: 65 } }
where: { age: { gte: 18, lte: 65 } }
```



```typescript
where: { role: { in: ['ADMIN', 'MODERATOR'] } }
where: { role: { notIn: ['GUEST', 'BANNED'] } }
```



```typescript
where: { email: { contains: 'prisma' } }
where: { email: { startsWith: 'alice' } }
where: { email: { endsWith: '@prisma.io' } }
where: { 
  email: { 
    contains: 'PRISMA',
    mode: 'insensitive' 
  } 
}
```



```typescript
where: { deletedAt: null }
where: { deletedAt: { not: null } }
where: { middleName: { isSet: true } }
```





```typescript
where: {
  email: { contains: '@prisma.io' },
  role: 'ADMIN'
}
```



```typescript
where: {
  AND: [
    { email: { contains: '@prisma.io' } },
    { role: 'ADMIN' }
  ]
}
```



```typescript
where: {
  OR: [
    { email: { contains: '@gmail.com' } },
    { email: { contains: '@prisma.io' } }
  ]
}
```



```typescript
where: {
  NOT: {
    role: 'GUEST'
  }
}
where: {
  NOT: [
    { role: 'GUEST' },
    { verified: false }
  ]
}
```



```typescript
where: {
  AND: [
    { verified: true },
    {
      OR: [
        { role: 'ADMIN' },
        { role: 'MODERATOR' }
      ]
    }
  ],
  NOT: { deletedAt: { not: null } }
}
```





At least one related record matches:

```typescript
where: {
  posts: {
    some: { published: true }
  }
}
```



All related records match:

```typescript
where: {
  posts: {
    every: { published: true }
  }
}
```



No related records match:

```typescript
where: {
  posts: {
    none: { published: true }
  }
}
```



```typescript
where: {
  profile: {
    is: { country: 'USA' }
  }
}
where: {
  profile: {
    isNot: null
  }
}
```



For fields like `String[]`:

```typescript
where: { tags: { has: 'typescript' } }
where: { tags: { hasSome: ['typescript', 'javascript'] } }
where: { tags: { hasEvery: ['typescript', 'prisma'] } }
where: { tags: { isEmpty: true } }
```



```typescript
where: {
  metadata: {
    path: ['settings', 'theme'],
    equals: 'dark'
  }
}
where: {
  metadata: {
    path: ['bio'],
    string_contains: 'developer'
  }
}
```



```typescript
where: {
  content: {
    search: 'prisma database'
  }
}
```
