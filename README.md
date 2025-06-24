
#  Construxx

**Construxx** is a full-stack application built with **TypeScript** at its core, designed for scalability, type safety, and maintainability.

###  Tech Stack

* **Frontend:** [Nuxt 3](https://nuxt.com/) (`/web`)
* **Backend API:** [Node.js](https://nodejs.org/) (`/api`)
* **Shared Types & Validation:** TypeScript + [Zod](https://zod.dev/) (`/shared`)
* **Database:** [PostgreSQL](https://www.postgresql.org/) (Dockerized)

---

##  Getting Started (with Docker)

### Prerequisites

* [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) installed
* [pnpm](https://pnpm.io/) installed globally (`npm i -g pnpm`)

### 1. Install dependencies

From the project root, run:

```bash
pnpm install
```

### 2. Run in Development Mode

####  With Hot Module Reload (local)

This uses Nuxt’s dev server and Node API in dev mode:

```bash
pnpm run dev
```

####  With Docker (simulates production behavior, no HMR)

```bash
pnpm run start:docker
```

> Hot Module Reload (HMR) is not supported in Docker mode. This simulates how the app runs in CI/CD or production. You will also need to run pnpm run schema:change:docker in root of repository to seed your database

---

##  Project Structure

```
/web      → Nuxt 3 frontend
/api      → Node.js backend API
/shared   → Shared types and Zod schemas
/docker   → Docker configuration (e.g., DB)
```

---

##  Prisma ORM (API)

The `api` package uses [**Prisma**](https://www.prisma.io/) as the ORM to interact with the PostgreSQL database in a type-safe and efficient way.

###  Key Files

```
/api
├── prisma/
│   ├── schema.prisma       # Main database schema & config
│   └── seed-run.ts         # Data seeding logic
```

---

###  Common Commands

> Run these commands from the `/api` directory.

####  **`schema:change`** — For Development (Recommended)

This is the **preferred command during active development**. It resets your database, regenerates Prisma client, and runs seeding all in one go. This will only work with run dev. Other wise either adjust the env var to point to the docker containers localhost address.

```bash
pnpm run schema:change
```

* Runs `migrate:reset` (wipes DB and reapplies all migrations)
* Generates the Prisma client (`prisma:generate`)
* Runs seed data (`migrate:data`)

>  **Warning:** This command **erases all data** — use only in local dev environments.

---

####  **`migrate:dev`** — For Adding New Migrations

When you add or update your Prisma schema (`schema.prisma`), create and apply a new migration with:

```bash
pnpm run migrate:dev --name your_migration_name
```

* Creates a new migration folder with the given name
* Applies the migration to your local database
* Updates Prisma client types automatically

Use this command when making schema changes **without wiping your data**.

---

####  Other Useful Commands

* **Reset database:**

  ```bash
  pnpm run migrate:reset
  ```

  Clears all data and reapplies migrations (like `schema:change` but no client generation or seed by default).

* **Deploy migrations in production:**

  ```bash
  pnpm run migrate:deploy
  ```

* **Generate Prisma client:**

  ```bash
  pnpm run prisma:generate
  ```

* **Seed the database:**

  ```bash
  pnpm run migrate:data
  ```

---

###  Tips & Best Practices

* For **active development**, use `schema:change` frequently to keep your DB schema and seed data in sync.
* For **incremental schema updates**, use `migrate:dev` to create migration scripts without data loss.
* After running migrations, always ensure the Prisma client is up-to-date with `prisma:generate` (this is automated in `migrate:dev`).
* Never run `schema:change` on production or environments with important data — it wipes the database.

Certainly! Here's a suggested **Testing** section you can add to your README, following your existing style and instructions:

---

## Testing

### API Tests

Run all backend API tests from the `/api` directory with:

```bash
pnpm run test
```

You can also filter tests specific to the API by using test name patterns or your test runner’s filtering options.

---

### Web Tests

To run frontend tests, first start your Docker environment:

```bash
pnpm run start:docker
```

Then, in another terminal, run:

```bash
pnpm run test --filter web
```

This ensures the backend API and database are running and accessible for frontend integration tests.

---

### Load and Performance Tests (K6)

Before running K6 tests, make sure your API and database are running — either in development mode (`pnpm run dev`) or via Docker (`pnpm run start:docker`).

Run a K6 test with:

```bash
pnpm run test:k6
```
