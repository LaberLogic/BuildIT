# ADR-005: Email Service Integration

## Context

The application must support **transactional email delivery** for core user workflows such as:

* User invitations and onboarding,
* Password reset and account recovery,

The selected service must be:

* **Reliable and performant** at scale,
* **Support HTML templates** and variable injection,
* **Compliant with GDPR**, with **EU-based infrastructure**,
* **Easy to integrate** with a Fastify backend, and
* **Usable without requiring a custom email domain** for the initial launch phase.

Additionally, the project budget and operational overhead are limited, so **free-tier availability** and **low setup complexity** were significant considerations.

## Decision

Use **Mailgun** as the third-party email service provider for all **transactional emails** in the system.

## Considered Options

### Option 1: Mailgun (Selected)

* Provides a free tier with **up to 5,000 emails/month for 3 months**, ideal for early-stage development and testing.
* Supports **EU region (EU1)** for GDPR-compliant data handling.
* Allows sending emails from a **Mailgun-provided sandbox domain**, removing the need to set up a custom domain initially.
* RESTful API and good SDK support for integration with Fastify.

### Option 2: SendGrid

* Also supports EU data regions and has a generous free tier.
* Requires **domain verification** for production use, which adds overhead.
* Template editor is powerful but more complex for quick setup.

### Option 3: Amazon SES

* Low-cost and highly scalable, especially for high-volume apps.
* Requires domain setup and DKIM/SPF configuration.
* Complex to integrate and manage for a solo developer or early-stage project.

## Decision Drivers

* **Free Tier Access**: Mailgun’s free sandbox domain support and trial volume fits the project’s early needs.
* **No Custom Domain Required**: Can send from a Mailgun-provided domain during MVP.
* **GDPR Compliance**: EU hosting option (EU1 region) aligns with data protection needs.
* **Ease of Integration**: Simple REST API fits well with backend design and avoids the need for complex SDKs or SMTP setup.
* **Template Support**: HTML templating and variable substitution are built-in.

## Consequences

### Benefits

* **Quick setup**: Developer can send emails using sandbox domain without DNS configuration.
* **GDPR alignment**: EU region hosting meets privacy and compliance needs.
* **Modern tooling**: API-first service with strong documentation and dashboard.
* **Extensible**: Can later add custom domains, webhooks, analytics, and delivery logs.

### Trade-offs

* **Vendor Lock-in**: Tightly coupled to Mailgun’s APIs unless abstracted.
* **Usage Limits**: Free tier has strict limits; costs rise with scale.
* **Reliability**: Dependent on third-party uptime and policy changes.
* **Email Deliverability**: Sandbox domains may have lower deliverability; moving to a verified domain is necessary for production.

## References

* [Mailgun EU Region Documentation](https://documentation.mailgun.com/en/latest/quickstart-eu.html)
* [Mailgun Free Tier Overview](https://www.mailgun.com/pricing/)
* [Mailgun API Docs](https://documentation.mailgun.com/en/latest/api-sending.html)
* [GDPR and Email Services Comparison](https://www.emailvendorselection.com/gdpr-compliance-email-service-providers/)
