## 11. Risks and Technical Debt

### 11.1 Risks

| ID  | Risk Description                                                                                    | Impact | Likelihood | Mitigation Strategy                                                                                                                   |
| --- | --------------------------------------------------------------------------------------------------- | ------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| R-1 | **Single email provider dependency (Mailgun)** may lead to delivery failures if the service is down | Medium | Medium     | Use a circuit breaker (e.g., `opossum`); implement fallback to a second provider or queueing mechanism                                |
| R-2 | **Backend performance bottlenecks under high traffic** due to tightly coupled monolithic structure  | High   | Low        | Monitor with structured logs (e.g., `pino`), load testing (`k6`); modularize domains further or consider future service decomposition |
| R-3 | **Security vulnerabilities** (e.g., lax input validation or route access misconfiguration)          | High   | Medium     | Enforce `zod` validation, centralized role guards, and periodic security audits                                                       |
| R-4 | **Concurrent data mutations** could lead to race conditions or partial writes                       | High   | Low        | Use Prisma transactions; add locking or constraint-based conflict resolution                                                          |
| R-5 | **GDPR/data privacy non-compliance**, especially in user and site modules                           | High   | Low        | Incorporate regular data handling reviews; automate data anonymization and deletion flows                                             |
| R-6 | **Steep onboarding curve** for new developers due to cross-repo structure (API/Web/Shared)          | Medium | Medium     | Maintain clear `README`s, architecture diagrams, and enforce naming conventions                                                       |
| R-7 | **Insufficient test coverage in core routes (auth, user, company)** leads to regressions            | High   | Medium     | Expand unit/integration coverage using `jest`, `supertest`, and CI enforcement                                                        |

---

### 11.2 Technical Debt

| ID   | Area                      | Description                                                                  | Impact                              | Remediation Plan                                                                                                      |
| ---- | ------------------------- | ---------------------------------------------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| TD-1 | **API Testing**           | Incomplete test coverage across route/controller/service layers              | High confidence risk                | Add unit tests (`jest`), integration tests (`supertest`); enforce coverage thresholds in CI                           |
| TD-2 | **Frontend Consistency**  | UI component duplication and inconsistent styling in domain modules          | Medium maintainability risk         | Refactor shared components; enforce design tokens and Tailwind CSS conventions                                        |
| TD-3 | **DB Migration Workflow** | Occasional need for manual correction during migration rollout               | Deployment reliability risk         | Automate via `prisma migrate deploy`; add pre-migration validation and rollback hooks                                 |
| TD-4 | **Shared Validation**     | Some forms still use locally scoped validation instead of shared Zod schemas | Data inconsistency, duplicate logic | Extend use of `shared` package in all forms; validate prop types against Zod directly                                 |
| TD-5 | **Observability**         | Logging is not centralized and lacks correlation IDs for tracing             | Debugging and error triage pain     | Integrate structured logging (`pino` + transport), connect with external observability tools (e.g., Logtail, Datadog) |
| TD-6 | **Test Automation**       | Load and spike testing is isolated (`k6` not integrated into CI pipeline)    | Scalability blind spots             | Schedule `k6` runs in CI/CD pipelines to monitor regressions before production                                        |

---

### Mitigation Strategy

* **CI pipeline hardening:** Include `typecheck`, `lint`, `test:unit`, `test:integration`, and optionally `test:k6` stages before merging.
* **Zod-first design:** Standardize all DTOs and frontend forms to use shared schemas; enforce in multi team  with lint rules or dev checks.
