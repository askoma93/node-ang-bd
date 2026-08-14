# Nx modular monolith with a separate evaluation worker

The system will use a pnpm-based Nx integrated monorepo containing an Angular SSR web app, a NestJS-on-Express API, and a separate NestJS worker. Product capabilities remain modules inside one modular monolith, while PostgreSQL, Redis/BullMQ, Ollama, object storage, and real-time delivery sit behind adapter seams; this keeps deployment and learning manageable without coupling domain behavior to infrastructure or splitting prematurely into microservices.
