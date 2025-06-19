# 9 Architecture Decisions {#section-design-decisions}

Important architecture decisions made during the design and implementation of the Construction Management Platform are documented here. These decisions have significant impact on the system's structure, maintainability, and operational characteristics.

This section helps stakeholders understand why certain technologies and approaches were chosen, allowing transparency and better maintainability over time.

## Documented Architecture Decisions

| Title                            | Summary                                                      | Reference                                      |
|---------------------------------|--------------------------------------------------------------|------------------------------------------------|
| Architecture Style Selection     | Chose classic layered architecture over hexagonal for simplicity and team familiarity. | [ADR-001 Architecture Style](./adrs/adr-1-architecture-style.md) |
| Technology Stack Selection       | Selected Nuxt 3 for frontend, Fastify + TypeScript for backend, and shared types.       | [ADR-002 Technology Stack](./adrs/adr-2-technology-stack.md)   |
| Authentication Approach          | Used JWT tokens with role-based access control for stateless, secure authentication.    | [ADR-003 Authentication](./adrs/adr-3-authentication.md)     |
| Database and ORM Choice          | PostgreSQL selected for relational data; Prisma chosen as type-safe ORM.                | [ADR-004 ORM and DB](./adrs/adr-4-orm-and-db.md)        |
| Email Service Integration        | Integrated Mailgun for transactional email delivery compliant with GDPR.                | [ADR-005 Email Service](./adrs/adr-5-email.md) |

## Purpose and Scope

Architectural decisions recorded here cover the major technical choices that influence the system's development, deployment, and evolution.

Some decisions are documented locally within component or building block documentation, but those with broad impact are centralized here for ease of reference.

## Additional Notes

- Decisions are reviewed and updated as the project evolves.
- The ADR documents include context, options considered, chosen alternative, and consequences.
