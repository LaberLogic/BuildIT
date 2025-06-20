# Building Block View

## Whitebox Overall System

**Overview Diagram**
![System Overview Diagram](./diagrams/system-overview.png)

**Motivation**
To give a clear understanding of the architecture across the client (Vue) and server (API) and how they connect with external systems like the database and email service.

**Contained Building Blocks**

* `Frontend` – Vue-based SPA with pages and components
* `API` – Node/Nest backend application exposing RESTful services
* External Blackboxes:

  * `Database` (PostgreSQL)
  * `Mailgun` (Email delivery)

**Important Interfaces**

* HTTP interface between Frontend and API
* Internal ORM and notification service interfaces within the API

---

## Level 2

### White Box *Frontend*

**Diagram**
![Frontend Component Dependency Diagram](./diagrams/frontend-dependencies.png)

**Description**
Vue 3 SPA structured around pages, reusable components, and composables. Pages render domain-specific content, components encapsulate UI behavior. All data-fetching is abstracted in composables.

**Contained Elements**

* Pages (`.vue` under `/pages/`)
* Components (grouped by domain: `Auth`, `Users`, `Sites`, etc.)
* Composables (data fetching logic — blackboxed)

**Interfaces**

* Uses Vue Router for navigation
* All API calls are performed inside composables via `useFetchXyz()` patterns
* Components communicate via props and events

---

### White Box *API*

**Diagram**
![API Structure Diagram](./diagrams/api-structure.png)

**Description**
Fastify backend following a layered structure (Controller → Service → Repository). Routes handle logic for authentication, user and company management, site tracking, and email notifications.

**Contained Elements**

* Controllers: `AuthController`, `CompanyController`, `SiteController`, `UserController`, etc.
* Services: Corresponding services encapsulating business logic
* Repositories / ORM: Abstraction layer for DB operations
* MailerService: Integrates with Mailgun

**Interfaces**

* REST endpoints exposed to the frontend
* Internal service methods invoked across layers
* Email interface via a Mailgun wrapper
* Database interface via ORM (e.g., Prisma or TypeORM)

---

## Level 3

### White Box `_API Internal Structure_`

**Diagram**
![API Internal Structure](./diagrams/api-structure.png)

**Purpose**
Show modular controller-service-repository breakdown of the backend, to illustrate separation of concerns and dependency flow.

**Responsibilities**

* **Controllers** handle routing and validation
* **Services** manage core logic and coordination
* **Repositories** abstract database communication
* **Mailer** sends notifications through Mailgun

**Interfaces**

* API routes
* ORM queries
* External mail service

---

### White Box `_Frontend Dependency Map_`

**Diagram**
![Vue Component Dependency Structure](./diagrams/frontend-dependencies.png)

**Purpose**
Visualize how Vue pages use nested components across modules like `Auth`, `Company`, `Users`, and `Site`.

**Responsibilities**

* **Pages** organize route-based rendering
* **Components** encapsulate UI and domain-specific logic
* **Composables** are blackboxes handling data-fetching

**Interfaces**

* Prop/event system within components
* Composable API used across pages and components

---
