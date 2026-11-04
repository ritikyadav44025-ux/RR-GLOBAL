# RR GLOBAL Development Approval Policy

This repository uses a safe-autonomy workflow.

## Changes that may be prepared autonomously
- Documentation, comments, formatting, and typo fixes.
- Reversible UI polish that does not change authentication, privacy, data handling, billing, or public product promises.
- Tests and monitoring improvements that do not expose secrets or create external costs.

Autonomous changes should be made on a dedicated branch, checked, and presented in a pull request when they affect application behavior or user-visible functionality.

## Changes that require explicit owner approval before implementation or release
- New or changed AI providers, models, paid APIs, billing, subscriptions, or usage-based services.
- Secrets, API keys, authentication, permissions, account settings, or access-control changes.
- User data collection, storage, sharing, retention, deletion, or privacy-policy changes.
- Database/schema migrations, destructive operations, production infrastructure changes, or domain/DNS changes.
- Public launches, publishing content, sending messages/emails, or other external actions.
- Material changes to product scope, safety behavior, or public claims.

## Release rules
1. Never commit credentials, API keys, tokens, passwords, or private user data.
2. Keep secrets in approved secret stores; read them only from environment variables.
3. Run relevant checks and summarize their results and limitations.
4. Do not merge or deploy a pull request on the owner's behalf unless the owner explicitly approves that specific release.
5. If a check cannot be run, state that clearly rather than claiming it passed.

## Approval signal
A pull request is a proposal, not permission to merge. The repository owner must review and explicitly approve sensitive changes and production releases.
