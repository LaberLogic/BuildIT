# Vorstellung der Projektarbeit – Construxx

## 1. Einleitung

- **Projektname**: Construxx – Bauverwaltungsplattform
- **Kontext**: Hochschulprojekt in Kooperation mit [Fliesen Hönle](https://www.fliesen-hoenle.de/)
- **Ziel**: Entwicklung eines Prototyps zur Verwaltung von Baustellen, Materialien und Nutzerrollen
- **Entwickler**: Jonas Labermeier

## 2. Live-Demo: Kernfunktionalität

- **Benutzerverwaltung** (Erstellen, Rollen zuweisen, E-Mail-Versand)
- **Baustellenmanagement** (Erstellen, Zuweisung von Mitarbeitern)
- **Materialverfolgung** mit Schwellenwert-Alarmierung
- **Rollenbasierter Zugriff** (Admin, Manager, Worker)

## 3. Codeanalyse: Statische Codeanalyse

### Backend (API)
- Tools: ESLint, TypeScript Compiler, SonarQube Cloud
- Testabdeckung: ca. 90 %
- Analyseziele: Wartbarkeit, Duplikate, Sicherheitsprobleme

### Frontend (Web)
- Tools: ESLint, Nuxt Typecheck, optional Sonar-Scanner
- Alle automatisch erkannten Probleme wurden behoben

## 4. Projektstruktur & Architektur

> Die Architektur wird mit einem C4-Modell vorgestellt. Die Diagramme basieren auf Mermaid da structurizr Account notwendig

### 4.1 System Context Diagram
![System Context Diagram](./diagrams/system_context_diagram.png)
*Übersicht der externen Akteure und Systeme*

### 4.2 Container Diagram
![Container Diagram](./diagrams/container_diagram.png)
*Aufteilung in Web-Frontend, API, Datenbank*

### 4.3 Component Diagram
![Component Diagram](./diagrams/component_diagram.png)
*Wichtige Module: Auth, Materials, Projects, Roles*

### Technologiestack

| Ebene           | Technologie                                      |
| --------------- | ------------------------------------------------ |
| Frontend        | Nuxt 3 (Vue 3), Tailwind CSS, Element Plus       |
| Backend         | Fastify, Prisma ORM, Zod, PostgreSQL, neverthrow |
| Gemeinsame Lib  | Monorepo: `shared`-Paket mit Typen & Schemas     |
| Authentifizierung | JWT-basiert, CUIDs als IDs, Multi-Tenant Isolation |

## 5. Testkonzept & Testtools

Das Testkonzept von *Construxx* basiert auf einem mehrstufigen Ansatz und deckt Backend- und Frontend-Komponenten ab. Ziel ist die Absicherung zentraler Logik und das Testen von End-to-End-Funktionalitäten.

### 5.1 Backend (API)

- **Unit-Tests mit Jest**
  - Fokus auf isolierte Business-Logik (z. B. Services, Validierungen)
  - Externe Abhängigkeiten wie Datenbank oder Mailgun werden **gemockt** (z. B. `vi.mock()` oder eigene Test-Factories)
  - Vorteil: schnelle, deterministische Tests

- **Integrationstests mit Supertest**
  - Tests laufen gegen gestartete Fastify-Instanz im Testmodus
  - Kommunikation über echte HTTP-Requests (`supertest(app.server)`)
  - Verwendung von Testdatenbanken mit `transactional rollback` bzw. `setup/teardown`
  - Beispiel: vollständige Registrierungs- und Login-Flows

- **Performance-Tests mit K6**
  - Simulierte Last auf zentrale Endpunkte (z. B. `/login`, `/materials`)
  - Ziel: Antwortzeiten < 500 ms unter Normalbelastung

- **Testabdeckung**
  - Aktuell ca. **90 %** Coverage, Schwerpunkt auf kritischen Pfaden
  - Coverage-Reports automatisiert im CI

### Performance-Tests mit K6

- **Ablauf**:
  - Anmeldung als Manager (`signIn`)
  - Abruf von Nutzer- und Baustelleninformationen (`getCurrentUser`, `getSites`, `getSiteById`)
  - Wartezeiten simulieren reales Nutzerverhalten

- **Teststufen (Stages)**:
  - Nutzerzahl steigt von 0 auf bis zu 10 in 30 Sekunden
  - Konstante Lastphase
  - Kontrolliertes Runterfahren

- **Ziele (Thresholds)**:
  - 95%-Perzentil Antwortzeit < 20 ms
  - Fehlerrate < 0,5 %

- **Technisches**:
  - Tests gegen lokale API (`http://localhost:3001`)
  - JWT-Authentifizierung genutzt
  - Gemeinsame Hilfsfunktionen in `common.js`

### 5.2 Frontend (Web)

- **End-to-End-Tests mit Cypress**
  - Testen zentraler User-Stories (Login, Materialmanagement, User Management und Scopes)
  - Ausführung gegen lokal laufenden Dev-Server
  - Fokus auf Benutzerführung und Stabilität

- **Typechecks & Linting**
  - `nuxt typecheck` für statische Typprüfung
  - `eslint` für Codequalität und konsistenten Stil

### 5.3 CI-Integration

- Automatisierte Ausführung von Unit- und Integrationstests sowie Linting via **GitHub Actions**
- Qualitätssicherung durch SonarQube Quality Gates

## 6. Fragen & Diskussion

- Zeit für Fragen von Dozent*innen und Mitstudierenden (5 Minuten)
