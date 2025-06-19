# ADR 001: Choice of Architecture Style — Layered Architecture vs Hexagonal Architecture

## Context
The project is a Construction Management Platform targeting small to mid-sized construction companies. It includes a Nuxt 3 frontend SPA, a Fastify backend API with TypeScript, a PostgreSQL database with Prisma ORM, and integration with Mailgun for transactional emails.

A key architectural decision is how to structure the backend application to maximize maintainability, scalability, and ease of development given the team size (single developer) and project scope.

## Decision
The backend API will follow a **classic layered architecture** rather than Hexagonal Architecture (Ports and Adapters).

## Considered Options

### Option 1: Layered Architecture
- Divides the application into logical layers: Routes → Controllers → Services → Repositories → Database.
- Clear responsibility separation and well-known structure.
- DTOs and validation schemas shared via a dedicated package.
- Familiar pattern with many libraries and frameworks supporting it directly.
- Easy to onboard developers and maintain with a small team.

### Option 2: Hexagonal Architecture (Ports and Adapters)
- Application core isolated from infrastructure by defining ports (interfaces) and adapters.
- Infrastructure details (DB, API, external services) are injected into the core via adapters.
- Promotes high testability and flexibility to replace external dependencies without impacting business logic.
- Higher upfront complexity and requires more architectural discipline.

## Decision Drivers
- **Team Size & Expertise**: Single developer prefers a straightforward, proven approach.
- **Project Scope**: The domain complexity is moderate and does not currently justify more complex architecture.
- **Maintainability**: Layered approach offers clear separation of concerns, sufficient for scaling and maintenance.
- **Flexibility**: Hexagonal architecture provides flexibility but adds complexity and boilerplate.
- **Time-to-Market**: Layered architecture enables faster development and iteration.

## Consequences
- Using layered architecture simplifies development, testing, and onboarding.
- Potentially less flexible in adapting to major infrastructure changes, but this risk is acceptable for the current project scope.
- Easier integration of shared DTOs and validation with `zod` across layers.
- Future refactoring to Hexagonal or other architectures remains possible if requirements grow.

## References
- [Hexagonal Architecture - Wikipedia](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software))
- [Layered Architecture Pattern - OReilly](https://www.oreilly.com/library/view/software-architecture-patterns/9781491971437/ch01.html)
- [Typescript Hexagonal Architecture - Robert C. Martin](https://medium.com/@walid.karray/building-a-todo-app-with-typescript-using-clean-hexagonal-architecture-a-detailed-look-at-the-d9e177f9f31)
