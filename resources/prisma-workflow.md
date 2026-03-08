# Prisma Workflow & Best Practices

As a team, it's critical we stay synchronized with our database schema while avoiding merge conflicts during the early prototyping phase. 

## 1. Avoid `prisma migrate dev` (For Now)
Since our schema is evolving rapidly, generating migration histories (`.sql` files) across different branches will create massive conflicts. We will not use migration histories until Phase 2 when our schema locks down.

## 2. Use `db push` for Prototyping
Whenever a developer updates the `schema.prisma` file or pulls down a new schema from the `main` branch, use this command to brute-force the local database to match the new schema gracefully:

```bash
cd frontend
pnpm prisma db push
```
*Note: This strictly alters your local Docker PostgreSQL container and will not create global migration files.*

## 3. Database Seeding
To ensure we all have the exact same mock data to test the UI, we utilize Prisma's seed functionality.
*(Note: Seeding script will be implemented soon.)*

Once the seeding script is ready, running `pnpm prisma db seed` will flush your local DB with standardized mocked information.

## 4. Viewing the Database
To view the contents of your local database through a clean UI without writing raw SQL, run:
```bash
cd frontend
npx prisma studio
```
This will open a web portal on `http://localhost:5555` to view, add, or delete rows directly.
