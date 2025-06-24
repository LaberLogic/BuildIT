# Building Block View

## Whitebox Overall System

![SystemOverview](./images/C1App.png)

**Motivation**
This system is a modular, full-stack web application supporting multi-tenant company management, role-based access control, site and material tracking, and email-based authentication. The architecture separates concerns clearly into frontend, backend, shared validation, and third-party integrations.

**Contained Building Blocks**
* **Web Frontend (Nuxt)**
* **API Backend (Fastify)** — includes controllers, services, repositories, routes, and DTOs for domain mapping
* **PostgreSQL Database**
* **Shared Zod Schemas and TypeScript Types**
* **Mailgun Integration**

**Important Interfaces**
* REST API between frontend and backend
* Prisma ORM between backend and database
* Mailgun HTTP API integration
* Shared validation schemas (Zod) used across frontend and backend

---

## Level 2

### Web Frontend (Nuxt)

![Level 2 Web](./images/c2App.png)

* File-based routing with pages for auth, company, user, site, and profile
* Modular components grouped by domain (Auth, Company, Users, Site)
* Uses shared Zod types for form validation and props

---

### API Backend (Fastify)

![Level 2 API](./images/c2App.png)

* Plugins for JWT authentication and role-based guards
* Mail module including mail.service.ts and mail.sender.ts
* Health check module
* Company, User, Site modules with nested Material submodule — all layers: controllers, services, repositories, DTOs, and routes
* DTO layer maps shared schema types to domain models and response shapes

---

### Shared Zod Schema Module

![Level 2 Shared](./images/c2App.png)

* Defines and exports Zod schemas and inferred types for validation
* Shared by both backend and frontend for consistency and developer experience

---

## Level 3

### User Domain API (Fastify)

![Level 3 API](./images/c3Api.png)

* **Layered architecture for User Domain:**
  * **Routes:** `auth.routes.ts`, `user.routes.ts`, `company.user.routes.ts` — define HTTP endpoints with middleware (JWT, role guards)
  * **Controllers:** `auth.controller.ts`, `user.controller.ts` — handle HTTP requests and responses
  * **Services:** `auth.service.ts`, `user.service.ts` — business logic for authentication and user management
  * **DTOs:** `user.dto.ts` — data transformation and validation using Zod and TypeScript
  * **Repositories:** `user.repository.ts` — Prisma-based data access
* **Integration:**
  * Mail service for transactional emails (password reset, verification)
  * Middleware enforces security and authorization
* Decoupled design supports modular feature development and maintenance

---

### Component Structure Web (Nuxt)

![Level 3 Web](./images/c3Web.png)

* File-based routing for auth, company, user, site, and profile pages
* Modular components grouped by domain:
  * **Auth:** LoginForm, RegisterUserForm, RegisterCompanyForm, HeaderWithIcon
  * **Company:** OverviewCard, CompanyDetailsCard
  * **User:** UserStatistics, UserDashboardActions, UserCard, modals for creating/updating users
  * **Site:** BasicInfo, Tabs, SiteCard, modals, nested material tracking components
  * **General:** ConfirmAction modal dialogs
* Pages compose views from these domain components
* Uses shared Zod schemas for validation and strong typing
* Frontend communicates with backend API for business logic and data persistence

---

### Shared Module (Zod Schemas & DTO Types)

![Level 3 Shared](./images/c3Shared.png)

* Domain-specific shared schema files:
  * `company.ts`
  * `material.ts`
  * `site.ts`
  * `user.ts`
  * `auth.ts`
* Ensures consistent validation and type safety across frontend and backend
* Consumed by both API backend and Nuxt frontend for input validation and type inference

---
## Level 4

### API Backend — User Domain Detailed Structure

This level details the User Domain within the Fastify API Backend, showing how the domain is organized into plugin middleware, routes, controllers, services, DTOs, and repositories, and how it integrates with shared validation schemas and mail services. This clear layering supports modularity, separation of concerns, and maintainability.

![Level 4 APi](./images/c4Api.png)
