# Email Cadence Monorepo

This project is a TypeScript monorepo that manages email cadences using Turborepo, Next.js (App Router), NestJS, and the Temporal.io TypeScript SDK.

## Structure

```text
repo/
  apps/
    web/        # Next.js (TypeScript) - Frontend UI
    api/        # NestJS (TypeScript) - Backend API
    worker/     # Temporal.io worker (TypeScript) - Workflow Processing
  packages/
    types/      # Shared TypeScript interfaces
  package.json
  tsconfig.base.json
  turbo.json
```

## Prerequisites

- Node.js (v18 or later)
- Temporal Server (running locally or via Cloud)

## Local Setup

### 1. Install Dependencies

From the root of the repository:

```bash
npm install
```

### 2. Configure Temporal (Placeholders)

The connection details for the Temporal server can be found in the following locations. By default, it looks for a local server at `localhost:7233`.

- **API:** [apps/api/src/temporal/temporal.module.ts](file:///c:/Users/Tyler/Documents/GitHub/NestJS%20Exam/apps/api/src/temporal/temporal.module.ts)
- **Worker:** [apps/worker/src/worker.ts](file:///c:/Users/Tyler/Documents/GitHub/NestJS%20Exam/apps/worker/src/worker.ts)

**Placeholder Settings:**

- Temporal Server Address: `localhost:7233`
- Namespace: `default`
- Task Queue: `email-cadence-queue`

### 3. Run Applications

You can start all components (Web, API, and Worker) simultaneously using the root dev script:

```bash
npm run dev
```

Alternatively, you can run them individually:

- `npm run dev:web`
- `npm run dev:api`
- `npm run dev:worker`

## Application URLs

- **Frontend (Web):** http://localhost:4000
- **Backend (API):** http://localhost:4001

## API Usage Examples

### Create/Update a Cadence

```bash
curl -X POST http://localhost:4001/cadences \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Welcome Flow",
    "steps": [
      { "id": "1", "type": "SEND_EMAIL", "subject": "Welcome", "body": "Hello there" },
      { "id": "2", "type": "WAIT", "seconds": 10 },
      { "id": "3", "type": "SEND_EMAIL", "subject": "Follow up", "body": "Checking in" }
    ]
  }'
```

### Enroll a Contact

```bash
curl -X POST http://localhost:3001/enrollments \
  -H "Content-Type: application/json" \
  -d '{
    "cadenceId": "cad_123",
    "contactEmail": "user@example.com"
  }'
```

### Update a Running Workflow

```bash
curl -X POST http://localhost:3001/enrollments/enrollment-user@example.com-123456789/update-cadence \
  -H "Content-Type: application/json" \
  -d '{
    "steps": [
      { "id": "1", "type": "SEND_EMAIL", "subject": "New Welcome", "body": "Hi!" }
    ]
  }'
```

## Update-in-Flight Rules

1. Already completed steps remain completed.
2. Current step index is maintained.
3. If the new steps length is less than or equal to the current step index, the workflow completes.
4. Otherwise, the workflow continues from the current index using new steps.
5. Steps version is incremented on every update.
