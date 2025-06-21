# 2. Architecture Constraints

This section outlines key technical, organizational, and "legal" constraints that shape the architecture. While this is an early-stage university-backed prototype, these constraints aim to balance practical delivery with long-term maintainability and compliance.

| Category                              | Constraint                                                                                      | Rationale                                                                        |
| ------------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Technical – Frontend**              | Built with **Nuxt 3 (Vue 3)** using **Tailwind CSS** and **Element Plus**.                      | Enables rapid UI development with a modern, component-rich Vue stack.            |
| **Technical – Backend**               | Developed using **Fastify** with **TypeScript**, **Prisma** ORM, and **Zod** for validation.    | Lightweight, type-safe stack aligned with developer skills and fast iteration.   |
| **Technical – Monorepo Structure**    | Shared types and Zod schemas are maintained in a common `shared` package.                       | Improves consistency across frontend and backend while reducing duplication.     |
| **Technical – Database**              | Uses **PostgreSQL** with Prisma for access and schema migrations.                               | Reliable, developer-friendly relational DB with good ecosystem support.          |
| **Technical – Validation & Schema**   | Validation logic is centralized in **Zod** and reused for both runtime checks and OpenAPI docs. | Maintains a single source of truth for validation, even in small projects.       |
| **Technical – API Testing**           | **Supertest** is used for backend integration testing where applicable.                         | Validates core API flows during development.                                     |
| **Technical – Static Analysis**       | Optional use of **SonarQube** or similar tools for code quality and maintainability checks.     | Helpful for tracking code health, especially in longer-running iterations.       |
| **Technical – CI/CD**                 | Basic GitHub Actions pipeline for linting, testing, and deploying.                              | Encourages repeatable development workflows without heavy tooling.               |
| **Technical – Testing**               | **Jest** for unit tests; **Cypress** for critical end-to-end flows.                             | Ensures reliability of core app logic and basic UI flows.                        |
| **Technical – Deployment**            | Docker-based deployment, optionally hosted on **Hetzner Cloud** (Germany).                      | Cost-effective, GDPR-friendly cloud option; easy to manage for a solo developer. |
| **Security – Authentication**         | Stateless JWT auth with Fastify plugins; **CUIDs** used as identifiers.                         | Sufficiently secure and scalable for prototype use.                              |
| **Security – Multi-Tenancy**          | Company-level access isolation via `companyId` checks on key routes.                            | Prevents accidental data exposure across tenants.                                |
| **Organizational – Team**             | Project developed solely by **Jonas Labermeier** (PO & Dev).                                    | Architecture prioritizes simplicity, automation, and low maintenance.            |
| **Organizational – Tech Stack**       | Prefer open-source, TypeScript-friendly tools.                                                  | Reduces cost and learning curve while aligning with developer strengths.         |
| **Legal – Hosting Location**          | Services should be hosted in the **EU**, ideally Germany.                                       | Meets GDPR expectations for academic and future production use.                  |
| **Legal – Privacy & Imprint**         | Include German-language **Impressum** and **Datenschutzerklärung** when deployed publicly.      | Required under German law, even for public prototypes.                           |
| **Availability – Performance Target** | Aim for < 2s initial load time and < 500ms p95 API latency.                                     | Supports good UX without over-engineering early-stage performance.               |
