# ADR-003: Authentication Approach

## Context

The application requires **secure user authentication** and **role-based authorization** for different user types: **construction managers**, **site workers**, and **administrators**. The system must protect API routes based on roles and support secure, stateless authentication.

Given that the **frontend is a Nuxt 3 SPA**, authentication must also be **securely managed in the browser**, including CSRF protection and SSR compatibility.

## Decision

Use **JSON Web Tokens (JWT)** for **stateless authentication**, with **role-based access control (RBAC)** enforced at the API layer.
Authentication tokens will be **stored in HTTP-only cookies** on the frontend for improved security and SSR support.

## Considered Options

### Option 1: JWT stored in cookies (Selected)

* Store JWT access token in a secure, HTTP-only cookie.
* Use refresh tokens (optional) to maintain sessions securely.
* Use Fastify plugins (`fastify-jwt`, custom guards) to protect routes.
* RBAC logic enforced via middleware or route-level hooks.

### Option 2: JWT stored in localStorage

* Simpler to implement on SPA-only apps.
* Higher XSS risk due to JavaScript-accessible storage.
* Not ideal for SSR scenarios (Nuxt 3).

### Option 3: Server-side session management

* Store sessions in Redis or a database.
* Adds server-side complexity and statefulness.
* Provides easier session invalidation but less scalable.

## Decision Drivers

* **Security:** HTTP-only cookies reduce XSS risk and are compatible with SSR.
* **Scalability:** JWT supports stateless auth and scales well horizontally.
* **Maintainability:** Widely adopted, with mature Fastify plugins and community support.
* **Frontend Compatibility:** Cookies work naturally with Nuxt 3 SSR features and fetch APIs.
* **Role Enforcement:** RBAC model ensures only authorized roles can access protected routes.

## Consequences

### Benefits

* **Scalable stateless authentication** with JWT, eliminating server-side session storage.
* **Secure storage** of tokens in HTTP-only cookies minimizes attack surface.
* **RBAC support** provides fine-grained access control for different user roles.
* Easy integration with Fastify via `fastify-jwt`, `fastify-cookie`, and custom guards/middleware.

### Trade-offs

* **Token invalidation** requires additional logic (e.g., token blacklist or short-lived tokens with refresh).
* **Security depends** on strong signing keys, short token lifetimes, and proper cookie configuration (`SameSite`, `Secure`, `HttpOnly`).
* Slightly more complex setup compared to storing tokens in localStorage.

## References

* [JWT Best Practices](https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/)
* [Fastify JWT Plugin](https://github.com/fastify/fastify-jwt)
* [Nuxt Auth with Cookies Guide](https://nuxt.com/docs/api/composables/use-cookie)
* [OWASP JWT Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
