# 1. Introduction and Goals

## 1.1 Requirements Overview

This construction management software is developed for **[Fliesen Hönle(https://www.fliesen-hoenle.de/)**, a construction company focused on tiling and interior works. The system aims to streamline and digitize daily operational tasks, primarily related to personnel, site, and material management.

### Core Functional Requirements:

- **Company Registration**: During signup, a company is created along with its initial users.
- **User & Role Management**: Users are assigned to a company. Managers can create, update, or delete users.
- **Site Management**: Managers can create and maintain construction sites, and assign users to sites.
- **Material Management**: Track materials needed and used per site.
- **Role-Based Access Control**:
  - Managers can manage sites, users, and materials.
  - Regular users have access to their assigned site data.

## 1.2 Quality Goals

| Priority | Quality Goal     | Description                                                                 |
|----------|------------------|-----------------------------------------------------------------------------|
| 1        | Usability        | Simple and intuitive UI for non-technical construction staff.               |
| 2        | Security         | Data isolation between companies; no cross-company data leakage.           |
| 3        | Maintainability  | Code should be easy to extend as the business grows or features evolve.    |
| 4        | Availability     | System must be reliable during working hours with minimal downtime.        |

## 1.3 Stakeholders

| Role/Name             | Contact                           | Expectations                                                             |
|-----------------------|-----------------------------------|--------------------------------------------------------------------------|
| Client Company        | [Fliesen Hönle ](https://www.fliesen-hoenle.de/) | Software that simplifies management of workers, sites, and materials.     |
|  Jonas Labermeier   | *Product Owner & Developer*       | Clear vision, simple architecture, easy to maintain and grow.            |
| Construction Manager  | Internal                          | Quick access to site info, user assignments, and material overviews.     |
| On-Site Workers       | Internal                          | Minimal interface to view site tasks and assigned materials.             |
