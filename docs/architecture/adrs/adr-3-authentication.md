# ADR-003: Authentication Approach

## Context

The application requires secure user authentication and role-based authorization. Users include construction managers, site workers, and admins. The system must support JWT tokens and enforce access control across the API.

## Decision

Use JSON Web Tokens (JWT) for stateless authentication combined with role-based access control (RBAC) enforced on API routes.

## Consequences

- **Benefits:**
  - JWT enables scalable, stateless authentication without server-side session storage.
  - Easy integration with Fastify plugins for authentication and authorization.
  - RBAC ensures fine-grained access control.

- **Trade-offs:**
  - JWT token invalidation can be complex.
  - Security depends on proper key management and token expiration.
