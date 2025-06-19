# ADR-004: Database and ORM Choice

## Context

The system requires a relational database for structured data with multi-tenancy support, transactions, and complex queries. Developer productivity and schema evolution are important.

## Decision

Use PostgreSQL as the relational database with Prisma ORM for type-safe database access and migrations.

## Consequences

- **Benefits:**
  - PostgreSQL offers robustness, ACID compliance, and strong community support.
  - Prisma provides a modern, type-safe ORM that integrates well with TypeScript.
  - Prisma migrations simplify schema changes.

- **Trade-offs:**
  - Prisma adds an additional abstraction layer.
  - PostgreSQL requires operational expertise and hosting considerations.
