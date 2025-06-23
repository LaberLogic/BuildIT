# 1. Introduction and Goals

## 1.1 Project Context and Scope

This project is part of a university-industry collaboration between **Jonas Labermeier** and the construction company **[Fliesen Hönle](https://www.fliesen-hoenle.de/)**, implemented as part of an academic software architecture module. The primary goal is to develop a functional prototype for a construction management platform tailored to small-to-medium construction businesses, with a focus on site coordination, material tracking, and role-based user access.

The system is designed and built by a single developer, with a focus on clean architectural separation, maintainability, and practical deployment readiness. While the software is not production-grade, the architecture is structured for real-world extensibility and compliance with common technical and legal constraints (e.g. GDPR).

The prototype supports the following core features and workflows:

### Core Functional Requirements

* **Company Registration**
  Companies can self-register. Upon registration, the company is created along with the initial manager user account.

* **User and Role Management**
  Managers can create, update, and remove users within their company and assign roles (e.g. Manager, Worker).

* **Construction Site Management**
  Managers can create and maintain construction sites, assign users to sites, and manage site-related resources.

* **Material Tracking**
  Basic functionality to track materials per site, including used and required materials. Show warning on threshold exceeded.

* **Role-Based Access Control (RBAC)**
  Permissions are enforced as follows:
   * **Admin**: Full access to manage users, sites, and materials, can also manage managers.
  * **Managers**: Full access to manage users, sites, and materials.
  * **Workers**: Read-only access to information for assigned sites.

## 1.2 Quality Goals

The system aims to achieve the following quality attributes, aligned with the prototype's scope and resource limitations:

| Priority | Quality Attribute | Description                                                                     |
| -------- | ----------------- | ------------------------------------------------------------------------------- |
| 1        | Usability         | Interface should be minimal and accessible for non-technical field workers.     |
| 2        | Security          | Tenant data isolation between companies must be enforced throughout the system. |
| 3        | Maintainability   | Codebase should be modular, testable, and extensible by a single developer.     |
| 4        | Availability      | The system is expected to be stable and available during typical working hours. |

## 1.3 Stakeholders

| Stakeholder Role         | Contact / Description                           | Expectations                                                                 |
| ------------------------ | ----------------------------------------------- | ---------------------------------------------------------------------------- |
| **Client Organization**  | [Fliesen Hönle](https://www.fliesen-hoenle.de/) | A usable, lightweight solution for coordinating users, sites, and materials. |
| **Student Developer**    | Jonas Labermeier (Product Owner & Developer)    | Maintainable architecture, adherence to academic and practical requirements. |
| **Construction Manager** | Internal stakeholder role at the client company | Dashboard for site and personnel management; fast data access.               |
| **On-Site Workers**      | Internal user group                             | Minimal UI with access to assigned site information and materials.           |
| **University Faculty**   | Course instructor/supervisor                    | Focus on software quality.                |

## 1.4 Limitations

This prototype is constrained by the scope of an academic project and limited development resources. The following limitations apply:

* **Feature Scope**:
  The system covers core management functionality but does not include advanced features such as real-time collaboration, detailed reporting, or integrations beyond email integration.

* **Performance & Scalability**:
  Designed for small to medium-sized companies; large-scale enterprise performance optimizations are out of scope.

* **Security Considerations**:
  While security best practices are followed (e.g., JWT authentication, data isolation), a full security audit and penetration testing will probably not cover professional pentesting.

* **Mobile Support**:
  No dedicated native mobile application is provided; instead, a responsive web interface targets mobile devices.

* **Third-party Integrations**:
  Limited to Mailgun for transactional email; no further external system integrations are included.
