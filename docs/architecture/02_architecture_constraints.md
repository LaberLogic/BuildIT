# 2. Architecture Constraints {#section-architecture-constraints}

This section documents fixed technical, organizational, and legal boundaries the architecture must conform to.

| Category | Constraint | Rationale |
|----------|------------|-----------|
| **Technical – Frontend** | Built with **Nuxt 3 (Vue 3)** using **Tailwind CSS** and **Element Plus** UI. | Enables fast development and polished UI with modern Vue stack. |
| **Technical – Backend** | Built with **Fastify** using **TypeScript**, **Prisma** for ORM, and **Zod** for validation. | Lightweight, fast Node.js backend aligned with developer’s expertise. |
| **Technical – Monorepo Structure** | Uses a shared DTO and schema validation layer (`shared` package) between API and frontend. | Reduces duplication and improves consistency across app layers. |
| **Technical – Database** | Uses **PostgreSQL** with Prisma migrations. | ACID-compliant, scalable, and well-supported in TypeScript ecosystems. |
| **Technical – Validation & Schema** | All validation must be declared in **Zod** schemas, then converted to OpenAPI via Swagger. | Single source of truth for validation and API docs. |
| **Technical – API Testing** | Uses **Supertest** for integration tests against Fastify API. | Ensures correctness of routing, middlewares, and error handling. |
| **Technical – Static Analysis** | Uses **SonarQube** for code quality, coverage, and maintainability metrics. | Helps ensure long-term quality even in solo development. |
| **Technical – CI/CD** | Lint, type-check, build, test, and deploy pipelines via GitHub Actions. | Automates quality gates and releases, especially for multi-developer environments. |
| **Technical – Testing** | Uses **Jest** for unit tests and **Cypress** for end-to-end browser tests. | Covers logic and UI regressions efficiently. |
| **Technical – Deployment** | Deployed via Docker containers, hosted on **Hetzner Cloud** in Germany. | GDPR-aligned hosting; predictable and cost-effective. |
| **Security – Authentication** | JWT-based stateless auth using Fastify plugins; CUID identifiers for users/resources. | Secure and scalable auth method; prevents ID enumeration. |
| **Security – Company Isolation** | All user and site access must be restricted by company ID (multi-tenancy). | Avoids data leakage across clients. |
| **Organizational – Team** | One-person team: **Jonas Labermeier** (Product Owner and Developer). | Requires architecture to be simple, maintainable, and automatable. |
| **Organizational – Stack Choice** | All tech must be based on open-source tools with strong TypeScript support. | Avoids vendor lock-in and aligns with skill set. |
| **Legal – Hosting Location** | All services must be hosted in the **EU** if deployed. | Ensures compliance with **GDPR** |
| **Legal – Privacy & Imprint** | Application must include German-language “**Impressum**” and “**Datenschutzerklärung**” when deployed | Required under German law |
| **Availability – Performance Target** | Goals: Initial page load < 2s on web; backend APIs < 300ms p95; 99.5% uptime. | Ensures usability for field users and reliable access. |
