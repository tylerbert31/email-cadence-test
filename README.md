# Email Cadence Monorepo

This project is a TypeScript monorepo for managing email cadences. It leverages **Turborepo** for workspace management, **Next.js (App Router)** for the frontend, **NestJS** for the backend API, and **Temporal.io** for reliable workflow execution.

## 🚀 Workspace Structure

```text
repo/
├── apps/
│   ├── web/        # Next.js Frontend (Port 4000)
│   ├── api/        # NestJS Backend API (Port 4001)
│   └── worker/     # Temporal.io Worker
├── packages/
│   └── types/      # Shared TypeScript interfaces
├── package.json    # Root scripts and workspace config
├── turbo.json      # Turborepo pipeline configuration
└── README.md
```

## 📋 Prerequisites

- **Node.js**: v18 or later
- **Temporal.io Server**: Assumed to be available in the environment (e.g., running via Docker or Temporal CLI)
- **npm**: v10 or later

## 🛠️ Monorepo Scripts

Run these commands from the root directory:

| Command              | Description                                            |
| :------------------- | :----------------------------------------------------- |
| `npm run dev`        | **Start all apps** (Web + API + Worker) simultaneously |
| `npm run dev:web`    | Start only the Next.js frontend                        |
| `npm run dev:api`    | Start only the NestJS backend                          |
| `npm run dev:worker` | Start only the Temporal worker                         |
| `npm run build`      | Build all packages and apps                            |
| `npm run lint`       | Lint the entire workspace                              |

## ⚙️ Temporal.io Configuration (Placeholders)

The application is configured to connect to a Temporal server. In a production environment, you should replace these placeholders with your actual Temporal cluster details.

| Setting            | Placeholder Value     | Location                                                                |
| :----------------- | :-------------------- | :---------------------------------------------------------------------- |
| **Server Address** | `localhost:7233`      | `apps/api/src/temporal/temporal.module.ts`, `apps/worker/src/worker.ts` |
| **Namespace**      | `default`             | `apps/api/src/temporal/temporal.module.ts`, `apps/worker/src/worker.ts` |
| **Task Queue**     | `email-cadence-queue` | `apps/worker/src/worker.ts`, `apps/api/src/app.service.ts`              |

## 🏃 Running the Application

### 1. Install Dependencies

```bash
npm install
```

### 2. Start all components

```bash
npm run dev
```

### 3. Application URLs

- **Frontend (Web):** [http://localhost:4000](http://localhost:4000)
- **Backend (API):** [http://localhost:4001](http://localhost:4001)

## 📡 API Usage Examples

### 1. Create a Cadence

Define a sequence of emails and wait steps.

```bash
curl -X POST http://localhost:4001/cadences \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Welcome Flow",
    "steps": [
      { "id": "1", "type": "SEND_EMAIL", "subject": "Welcome", "body": "Hello there" },
      { "id": "2", "type": "WAIT", "seconds": 30 },
      { "id": "3", "type": "SEND_EMAIL", "subject": "Follow up", "body": "Checking in" }
    ]
  }'
```

### 2. Enroll a Contact

Start the email sequence for a specific contact.

```bash
curl -X POST http://localhost:4001/enrollments \
  -H "Content-Type: application/json" \
  -d '{
    "cadenceId": "cadence-123",
    "contactEmail": "user@example.com"
  }'
```

### 3. Update a Running Workflow (Signal)

Update the logic of a cadence currently in progress.

```bash
curl -X POST http://localhost:4001/enrollments/enrollment-user@example.com-xxx/update-cadence \
  -H "Content-Type: application/json" \
  -d '{
    "steps": [
      { "id": "1", "type": "SEND_EMAIL", "subject": "Updated Subject", "body": "New Content" }
    ]
  }'
```

## 🔄 Workflow logic & Rules

1. **Step Consistency**: Already completed steps (emails sent or waits finished) are not re-executed during an update.
2. **Maintenance of State**: The current step index is maintained across updates.
3. **Completion Rule**: If the new steps length is less than or equal to the current step index, the workflow completes immediately.
4. **Versioning**: Each update increments a `stepsVersion` tracker for visibility.

## 📦 Deliverables

- **Working TypeScript Monorepo**: Full source code for API, Web, Worker, and Shared Types.
- **Modern UI**: Next.js frontend styled with Tailwind CSS and Shadcn UI.
- **Temporal Integration**: Completed workflow logic with signal support for "on-the-fly" updates.
- **README**: Comprehensive guide with installation, configuration placeholders, and API usage.
