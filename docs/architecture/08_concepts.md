# Cross-cutting Concepts {#section-concepts}

## Authentication & Authorization {#__emphasis_authentication_authorization_emphasis}

The system uses JWT-based authentication managed by the backend API. Role-based access control ensures that Construction Managers, Site Workers, and Admins can only access features and data they are authorized for. This concept impacts the frontend, backend, and API security layers.

## Data Validation {#__emphasis_data_validation_emphasis}

Input validation is enforced on both client (frontend using Zod) and server (backend DTOs with Zod schemas) to ensure data integrity and prevent invalid data from propagating through the system. This validation is tightly integrated across multiple layers.

## Multi-tenancy {#__emphasis_multi_tenancy_emphasis}

The system supports multiple companies (tenants) within the same database schema. All queries and data operations are scoped by company to enforce strict data isolation and data privacy.

## Transactional Email Integration {#__emphasis_email_integration_emphasis}

Email notifications (invitations, password resets, system notifications) are handled asynchronously by the backend via the Mailgun API. This integration ties into user workflows and system events.

## Error Handling & Logging {#__emphasis_error_handling_logging_emphasis}

Errors are handled consistently using structured error types and logging with pino across backend services. This approach enables effective monitoring, diagnostics, and auditing to improve system reliability.

## Security {#__emphasis_security_emphasis}

Security best practices are implemented throughout the system, including encrypted password storage (bcrypt), HTTPS for all communications, strict CORS policies, and input sanitization to protect user data and prevent common vulnerabilities.

## Testing Strategy {#__emphasis_testing_strategy_emphasis}

A comprehensive testing strategy includes unit tests, integration tests, and end-to-end tests using Jest and Cypress. Critical paths such as authentication, site and user management, and material tracking are covered to ensure system quality and robustness.
