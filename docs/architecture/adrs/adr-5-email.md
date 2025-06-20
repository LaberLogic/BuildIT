# ADR-005: Email Service Integration

## Context

The system requires sending transactional emails such as user invitations, password resets, and notifications. The email service must be reliable, support templates, and comply with GDPR requirements for hosting in the EU.

## Decision

Integrate Mailgun as the third-party email service provider for sending all system-triggered emails.

## Consequences

- **Benefits:**
  - Mailgun provides a robust, scalable API for sending transactional emails.
  - Supports template management and analytics.
  - EU hosting options align with GDPR compliance needs.
  - Easy integration with backend API via HTTP requests.

- **Trade-offs:**
  - Introduces external dependency and potential vendor lock-in.
  - Costs associated with Mailgun usage beyond free tier.
  - Requires handling service outages or API changes.
