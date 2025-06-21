# ADR-004: Database and ORM Choice

## Context

The application requires a **relational database** to manage structured data related to users, projects, construction sites, roles, and tasks. Key technical needs include:

* **Multi-tenancy** (e.g., separating data between companies or contractors),
* **Transactional integrity** (e.g., for financial and project data),
* **Type-safe database access**, and
* **Streamlined schema evolution** as the system grows.

The developer  works primarily in **TypeScript**, and productivity tools like auto-generated types and migrations are valued.

## Decision

Use **PostgreSQL** as the primary relational database, and **Prisma ORM** for database access and schema management.

## Considered Options

### Option 1: PostgreSQL + Prisma (Selected)

* PostgreSQL offers strong ACID guarantees, JSONB support, indexing, and performance at scale.
* Prisma provides a modern, declarative ORM with excellent TypeScript integration.
* Prisma’s migration system makes schema changes safe and traceable.
* Good tooling and community support for both technologies.

### Option 2: PostgreSQL + Knex.js + Objection.js

* Lower-level and more flexible.
* More boilerplate code and less type safety compared to Prisma.
* Better suited for teams needing fine-grained control, but slower to develop with.

### Option 3: MySQL/MariaDB + TypeORM

* Similar relational capabilities.
* TypeORM has a larger learning curve and less active maintenance than Prisma.
* Prisma has better DX, documentation, and community momentum.

## Decision Drivers

* **Type Safety:** Prisma generates TypeScript types directly from the schema.
* **Developer Experience:** Prisma’s schema-first approach, rich CLI, and query builder improve productivity.
* **Migrations:** Built-in migration system handles schema evolution reliably.
* **Multi-tenancy Support:** PostgreSQL’s schemas, roles, and row-level security features are suitable.
* **Community & Ecosystem:** Both tools are widely adopted and well-supported.

## Consequences

### Benefits

* **PostgreSQL**:

  * Battle-tested, open-source RDBMS.
* **Prisma**:

  * Strong TypeScript support, auto-completion, and reduced runtime errors.
  * Clear and simple migrations with version control.
  * Rapid development and onboarding with intuitive syntax.

### Trade-offs

* Prisma introduces an **abstraction layer**, which may limit access to some raw SQL features unless bypassed.
* **Operational overhead** of managing PostgreSQL, especially in multi-tenant environments (e.g., provisioning schemas or roles).
* Prisma’s ecosystem, while growing fast, may lag in some advanced use cases (e.g., custom query optimization or triggers).

## References

* [PostgreSQL Documentation](https://www.postgresql.org/docs/)
* [Prisma Documentation](https://www.prisma.io/docs/)
* [Prisma vs TypeORM Comparison](https://www.prisma.io/docs/comparisons/prisma-vs-typeorm)
* [Multi-Tenancy with PostgreSQL](https://www.citusdata.com/blog/2017/10/12/five-ways-to-scale-postgresql/)
