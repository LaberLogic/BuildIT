## Solution Strategy

The backend API is implemented following a **layered architecture** style, dividing responsibilities across routes, controllers, services, and repositories. This choice reflects the moderate project complexity, team size, and development speed requirements.

For a detailed comparison of architecture styles considered, see the [ADR 1: Architecture Style Decision](./adrs/adr-1-architecture-style.md).


## 5.1 Overview

The solution is designed as a **modular, scalable, and maintainable** construction management platform using modern web technologies. It focuses on providing a clear separation of concerns, reusability, and alignment with industry best practices.

## 5.2 Key Strategic Decisions

- **Monorepo Structure**
  The project is organized as a monorepo with separate packages for frontend (`web`), backend API (`api`), and shared DTOs/validation (`shared`). This promotes consistency, reuse, and synchronized versioning.

- **Layered Architecture for Backend**
  The backend is structured in layers (routes, controllers, services, repositories, DTOs) to isolate responsibilities, improve testability, and support future extension or replacement of layers without affecting others.

- **Shared Validation & Types**
  DTOs and validation schemas are defined in the shared package using `zod`, ensuring consistent validation rules across frontend and backend.

- **Tech Stack**
  - Frontend: Nuxt 3 (Vue 3) with Pinia state management, TailwindCSS, Element Plus UI components
  - Backend: Fastify with TypeScript, Prisma ORM with PostgreSQL, layered service design
  - Testing: Cypress for e2e, Jest for unit, Supertest for API integration
  - Email Integration: Mailgun for transactional email delivery

- **API-First Design**
  The backend API is designed with clear RESTful endpoints, secured by JWT tokens, and documented using Swagger for easier integration and maintenance.

- **Scalability & Resilience**
  Use of circuit breakers (`opossum`) and layered error handling supports resilience. Prisma migrations and schema evolve with versioning to support smooth updates.


- **CI/CD & Quality Assurance**
  Automated testing with Jest, Cypress, and Supertest integrated into CI pipelines, with code quality monitored using SonarQube.

## 5.3 Non-Goals / Constraints

- No mobile native app planned in current scope; the system is delivered as a responsive SPA.
- Third-party integrations are limited to email sending via Mailgun; no other external integrations are in scope currently.
- The system targets small to mid-sized construction companies, not large enterprise-grade solutions.
