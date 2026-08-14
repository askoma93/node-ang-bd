# Local-first runtime with local AI

SkillForge is a personal learning project whose complete runtime will work on one developer machine: PostgreSQL, Redis, Mailpit, MinIO, Caddy, and observability services run through Docker Compose, while Ollama runs on the Windows host to use the RTX GPU. GitHub OAuth is the only runtime feature allowed to require the internet; infrastructure integrations remain behind adapter seams so the local constraint does not leak through product modules.
