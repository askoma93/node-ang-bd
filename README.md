# SkillForge

SkillForge is an Nx monorepo containing:

* `web` — Angular application with SSR
* `api` — NestJS HTTP API
* `worker` — NestJS background worker without an HTTP listener

## Requirements

Use the following versions:

```text
Node.js: 24.19.0
pnpm: 10.34.5
Nx: 23.1.1
Angular: 22
NestJS: 11
```

The required Node.js version is also specified in `.nvmrc`.

## Install dependencies

From the repository root:

```powershell
pnpm install --frozen-lockfile
```

## Project structure

```text
apps/
├── web/
├── api/
└── worker/
```

### web

Angular application with Server-Side Rendering.

### api

NestJS API.

Default address:

```text
http://127.0.0.1:3000/api
```

Health endpoint:

```text
GET /api/health
```

Expected response:

```json
{
  "status": "ok"
}
```

### worker

NestJS background process without an HTTP server.

The worker starts as a standalone Nest application context and shuts down gracefully on `SIGINT` or `SIGTERM`.

## Run applications

Run the Angular application:

```powershell
pnpm nx serve web
```

Run the API:

```powershell
pnpm nx serve api
```

Run the worker:

```powershell
pnpm nx serve worker
```

Run each application in a separate terminal when all three are needed simultaneously.

## API configuration

The API uses port `3000` by default.

To use another port in PowerShell:

```powershell
$env:API_PORT="4000"
pnpm nx serve api
```

The API will then be available at:

```text
http://127.0.0.1:4000/api
```

Remove the environment variable:

```powershell
Remove-Item Env:API_PORT
```

Valid ports are integers from `1` to `65535`.

## Verify API health

With the API running:

```powershell
Invoke-RestMethod http://127.0.0.1:3000/api/health
```

Expected result:

```text
status
------
ok
```

Raw JSON response:

```powershell
(Invoke-WebRequest http://127.0.0.1:3000/api/health -UseBasicParsing).Content
```

Expected:

```json
{"status":"ok"}
```

## Verify SSR

Start the web application:

```powershell
pnpm nx serve web
```

Then request the page directly:

```powershell
(Invoke-WebRequest http://localhost:4200 -UseBasicParsing).Content
```

The returned HTML should already contain:

```html
<h1>SkillForge</h1>
```

This confirms that the page is rendered on the server.

## Tests

Run tests for one project:

```powershell
pnpm nx test web
pnpm nx test api
pnpm nx test worker
```

## Lint

```powershell
pnpm nx lint web
pnpm nx lint api
pnpm nx lint worker
```

## Type checking

```powershell
pnpm nx typecheck web
pnpm nx typecheck api
pnpm nx typecheck worker
```

## Build

```powershell
pnpm nx build web
pnpm nx build api
pnpm nx build worker
```

## Run all checks

Before committing changes, run:

```powershell
pnpm nx run-many -t lint typecheck test build
```

All targets should complete successfully.

## Nx dependency graph

Open the dependency graph:

```powershell
pnpm nx graph
```

Or generate it as an HTML file:

```powershell
pnpm nx graph --file=output.html
```

The graph must not contain:

* circular dependencies
* direct `web -> api` dependencies
* direct `api -> worker` dependencies
* direct `worker -> web` dependencies
* any other direct app-to-app imports

Shared code should be moved into Nx libraries instead of being imported from another application.

`output.html` is a temporary verification artifact and should not be committed.

## Architecture boundaries

Applications use Nx tags such as:

```text
type:app
scope:web
scope:api
scope:worker
```

Module-boundary rules prevent applications from importing other applications directly.

Reusable code should eventually live in libraries tagged with types such as:

```text
type:feature
type:ui
type:data-access
type:domain
type:util
type:contract
```

## Useful Nx commands

Show all projects:

```powershell
pnpm nx show projects
```

Show configuration for a project:

```powershell
pnpm nx show project web
pnpm nx show project api
pnpm nx show project worker
```

Run a specific target explicitly:

```powershell
pnpm nx run api:test
```

Equivalent shorthand:

```powershell
pnpm nx test api
```

## Generated files

Do not commit generated or local files such as:

```text
node_modules/
dist/
.nx/
.env
output.html
```
