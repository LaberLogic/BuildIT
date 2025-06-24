---
marp: true
theme: default
paginate: true
headingDivider: 2
---

# Vorstellung der Projektarbeit
## **Construxx – Bauverwaltungsplattform**

**Entwickler:** Jonas Labermeier
**Kooperationspartner:** [Fliesen Hönle](https://www.fliesen-hoenle.de/)
**Format:** Hochschulprojekt
**Ziel:** Prototyp zur Verwaltung von Baustellen, Materialien und Nutzerrollen

---

## 🔹 Einleitung

**Projektname:** Construxx
**Kontext:** Hochschulprojekt (Kooperation mit Fliesen Hönle)
**Ziel:**
- Verwaltung von Baustellen
- Material-Tracking
- Benutzer- und Rollenmanagement
- Multi-Tenant Support

**Technologien:** Webplattform (Frontend + Backend)

---

## 🔹 Live-Demo: Kernfunktionen

- 👥 **Benutzerverwaltung**
  - Nutzer anlegen, Rollen zuweisen
  - E-Mail-Versand bei Erstellung

- 🏗️ **Baustellenmanagement**
  - Erstellung von Projekten
  - Zuweisung von Mitarbeitenden

- 📦 **Materialverfolgung**
  - Schwellenwerte & automatische Warnung
  - Übersichtlicher Materialstatus

- 🔐 **Rollenkonzept**
  - Admin, Manager, Worker
  - Zugriffsbeschränkungen je Rolle

---

## 🔹 Codeanalyse: Backend

- **Tools:** ESLint, TypeScript Compiler, SonarQube Cloud
- **Testabdeckung:** ~90 %
- **Analyseziele:**
  - Wartbarkeit sicherstellen
  - Sicherheitslücken erkennen
  - Duplikate vermeiden

---

## 🔹 Codeanalyse: Frontend

- **Tools:** ESLint, Nuxt Typecheck, optional SonarScanner
- **Ergebnisse:**
  - Alle automatisch erkannten Probleme behoben
  - Fokus auf saubere, stabile Codebasis

---

## 🔹 Architektur & Struktur

**Visualisierung:** C4-Modell (Diagramme via Mermaid)
**Aufbau in mehreren Ebenen:**

| Ebene            | Technologien                                       |
|------------------|----------------------------------------------------|
| **Frontend**      | Nuxt 3 (Vue 3), Tailwind CSS, Element Plus         |
| **Backend**       | Fastify, Prisma ORM, Zod, PostgreSQL, neverthrow   |
| **Shared Lib**    | Monorepo mit `shared`-Paket (Typen, Schemas)       |
| **Auth**          | JWT, CUIDs, Multi-Tenant Isolation                 |

---

## 🔹 Testkonzept – Überblick

**Testansatz:** Mehrstufig, Backend & Frontend
**Ziel:** Absicherung zentraler Logik & User-Flows

**Schwerpunkte:**
- Isolierte Komponenten
- Echte Schnittstellen
- Performanzkritische Endpunkte

---

## 🔹 Backend-Tests (Details)

### ✅ Unit-Tests mit Jest
- Fokus: Business-Logik (Services, Validierungen)
- Nutzung von Mocks (`jest.mock()`)
- Vorteile: Schnell, deterministisch

### 🌐 Integrationstests mit Supertest
- Echte HTTP-Anfragen gegen Fastify
- Nutzung von Testdatenbank & Rollbacks
- Beispiel: Registrierungsflow

---

## 🔹 Performance-Tests mit K6

**Ablauf:**
1. Authentifizierung (z. B. signIn)
2. Datenabruf (z. B. getSites, getCurrentUser)
3. Nutzerverhalten simuliert (Wartezeiten, Ramp-up)

**Teststufen:**
- Ramp-Up: 0 → 10 User in 30s
- Konstante Phase
- Cooldown

**Ziele:**
- 95%-Antwortzeit < **20 ms**
- Fehlerquote < **0,5 %**

---

## 🔹 Frontend-Tests

### 🧪 End-to-End mit Cypress
- Login, Materialverwaltung, User Management
- Ausführung lokal mit Dev-Server
- Fokus auf User-Flows & UI-Stabilität

### 🔍 Typechecks & Linting
- `nuxt typecheck`
- `eslint` für Codequalität & Stil

---

## 🔹 Fehlerhandling: ChainedError & ErrorCodeMapper

### 🧱 `ChainedError` – Strukturierte Fehlerverkettung
- Verkettet mehrere Fehlerursachen (DB → Service → API)
- Speichert `messageStack` und optionalen `errorCode`
- Automatische Formatierung für Logs & Debugging

```ts
throw new ChainedError()
  .chain("Failed to assign user")
  .chain(originalError);
🔄 ErrorCode Mapping
PrismaClientKnownRequestError → HTTP-Status

P2002 → 409 Conflict

P2003 → 400 Bad Request

P2025 → 404 Not Found

sonst → 400 Bad Request

sendChainedErrorReply liefert:

Status aus error.errorCode oder 500

JSON { error: message }

Automatisches Logging via Fastify```


## 🔹 CI-Integration

**Automatisierung via GitHub Actions:**
- Unit-Tests, Integrationstests, Linting

**Codequalität mit SonarQube:**
- Analyse & Quality Gates
- Coverage-Reports im CI-Prozess

---

## ✅ Zusammenfassung & Fazit

**Construxx bietet:**
- 🛠️ Modernen Tech-Stack
- ✅ Hohe Testabdeckung (~90 %)
- 🔐 Robustes Rollensystem
- 📦 Materialverwaltung mit Warnung

---

## ❓ Fragen & Diskussion

Vielen Dank für Ihre Aufmerksamkeit!
→ Ich freue mich auf Ihre Fragen.
