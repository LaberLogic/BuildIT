Here is an improved and more polished version of your **Cross-cutting Concepts** section. It maintains the practical essence of a university prototype while improving clarity, structure, and professional tone.

---

# Cross-cutting Concepts {#section-concepts}

This section describes overarching principles, technical patterns, and solution strategies that apply across multiple parts of the system. These concepts help maintain **consistency, integrity, and maintainability** throughout the architecture.

## Authentication & Authorization

The application uses **JWT-based stateless authentication** managed by the backend. Users are assigned roles (e.g., Construction Manager, Site Worker, Admin), and **role-based access control (RBAC)** is enforced across API routes. Tokens are stored in **HTTP-only cookies** on the client for security.

> **Impacts:** Frontend authentication flow, backend route guards, shared user models.

## Data Validation

Data is validated consistently across the entire system:

* On the **frontend**, input validation is implemented using `async-validator` and form-level checks.
* On the **backend**, all DTOs and request bodies are validated using **Zod** schemas, which also serve as a source for OpenAPI documentation.

> **Goal:** Prevent propagation of invalid data and ensure a single source of truth for validation rules.

## Multi-Tenancy

The platform supports multiple companies within a single system. All users and entities are scoped by a `companyId`, ensuring strict **data isolation** between tenants.

> **Impacts:** Database schema design, access control logic, query filtering.

## Transactional Email Integration

Transactional emails (e.g., user invitations, password resets, status notifications) are sent through the **Mailgun API**. The backend manages email dispatching based on system events and templates.

> **Notes:** Mailgun’s free tier is leveraged, and no custom domain setup is currently required.

## Error Handling & Logging

Backend services use **structured error handling** and **centralized logging** via `pino`. Standardized error types and consistent response formats improve reliability and debuggability. A chained error handling mechanism ensures that errors are propagated correctly across layers and later can be extended easily with more context information.

> **Example:** All internal server errors are captured, logged, and returned as generic error responses with trace IDs in development.

## Security

Security best practices are applied system-wide:

* Passwords are hashed using **bcrypt**.
* All communication is expected over **HTTPS**.
* JWTs are stored in **secure, HTTP-only cookies**.
* **CORS** is configured strictly to allow only trusted origins.
* Input sanitization and validation guard against common attacks (XSS, SQL injection).

> **Impacts:** Authentication flow, request parsing, data access, and deployment setup.

## Testing Strategy

The project follows a **multi-layered testing strategy**:

* **Unit tests** with Jest for business logic and services.
* **Integration tests** using Supertest to validate API endpoints.
* **End-to-end tests** with Cypress for UI flows.
* **Performance/load testing** with K6 for selected endpoints.

> CI pipelines automate test runs on every pull request, ensuring code quality and early error detection in multi team scenarios.
