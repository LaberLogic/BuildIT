# ADR-002: Technology Stack Selection

## Context

The project is a **Construction Management Platform** targeting small to mid-sized construction companies. It consists of a **Nuxt 3 frontend SPA**, a **Fastify backend API with TypeScript**, a **PostgreSQL database with Prisma ORM**, and **Mailgun** for transactional email integration.

To ensure **scalability, maintainability, performance**, and **developer productivity**, a technology stack decision was required that aligns with modern development practices, supports shared typing, and provides a good developer experience across both client and server.

## Decision

* **Frontend:** Use **Nuxt 3 (Vue 3)** to build a Single Page Application (SPA) with **server-side rendering (SSR)** capabilities.
* **Backend:** Use **Fastify** with **TypeScript** to implement a high-performance REST API.
* **Shared Language:** Use **TypeScript** across both frontend and backend for consistency and type safety.

## Considered Options

### Option 1: Nuxt 3 + Fastify + TypeScript (Selected)

* Nuxt 3 provides SSR, static generation, and a powerful Vue 3 ecosystem.
* Fastify offers high performance, excellent TypeScript support, and a growing plugin ecosystem.
* Shared TypeScript improves development speed and reduces bugs through consistent typings.
* Good documentation and active community support for both frameworks.

### Option 2: Next.js + Express (TypeScript)

* Next.js is tightly integrated with React and has a strong ecosystem, but the team prefers Vue.
* Express is more widely known but slower and less modern compared to Fastify.
* Would require switching to React, which the current developer is less familiar with.

### Option 3: Vue 3 + Vite SPA + NestJS

* Vue 3 with Vite is fast and modern but lacks out-of-the-box SSR like Nuxt.
* NestJS is powerful but has more boilerplate and is heavier than Fastify.
* Could be overkill for a solo developer managing the entire stack.

## Decision Drivers

* **Developer Expertise:** Strong familiarity with Vue and TypeScript.
* **Performance:** Fastify’s non-blocking architecture is ideal for high throughput APIs.
* **Maintainability:** Nuxt 3's structured conventions and Vue 3’s composition API improve code organization.
* **Ecosystem Support:** Rich ecosystem and active community for Nuxt, Fastify, and TypeScript.
* **Monorepo Support:** Shared types can be maintained cleanly across frontend and backend.

## Consequences

### Benefits

* **Nuxt 3**:

  * SSR improves SEO and initial load performance.
  * Composition API offers better modularity and maintainability.
* **Fastify**:

  * High performance under load.
  * Lightweight and extensible with a plugin model.
* **TypeScript**:

  * Reduces runtime errors via static type checking.
  * Enables shared interfaces (e.g., DTOs and validation schemas) across the full stack.

### Trade-offs

* Steeper learning curve for Nuxt 3 and Fastify for newcomers.
* SSR introduces complexity compared to a pure SPA.
* Managing shared code and types across frontend and backend in a monorepo may add some overhead.
* Some Fastify plugins may be less mature than their Express counterparts.

## References

* [Nuxt 3 Documentation](https://nuxt.com/docs)
* [Fastify Documentation](https://www.fastify.io/docs/latest/)
* [TypeScript Handbook](https://www.typescriptlang.org/docs/)
* [Nuxt vs Next.js Comparison](https://daily.dev/blog/nextjs-vs-nuxtjs-whats-best)
