# RR GLOBAL Command Center — Free-first

This repository uses GitHub Issues as a simple command inbox and Pull Requests as the review gate.

## How to submit a command

1. Open the repository's **Issues** tab.
2. Select **New issue** and choose **RR GLOBAL Command**.
3. Describe the requested change in ordinary language, including the expected result and constraints.
4. Submit the issue. It becomes a tracked request, not an instruction to deploy or merge automatically.
5. Work is inspected first, prepared on a feature branch, checked, and proposed through a pull request.
6. Review the pull request diff and test summary. Merge only when you are satisfied.

## Example commands

- "Improve the mobile layout of the dashboard without changing login or data storage."
- "Investigate why the chat page is slow. Report the cause before changing code."
- "Add a settings page mock-up. Do not connect paid services."

## Free-first workflow

- GitHub Issues: request inbox and discussion.
- GitHub Actions: repeatable automated checks.
- Pull Requests: change proposals and review history.
- ChatGPT with the connected GitHub app: can inspect repository context and, when available, prepare changes through supported GitHub actions.

## Important limits

- An Issue does not itself start an AI coding agent. It is a structured request queue.
- GitHub Actions runs the tests defined in workflow files; it does not understand product intent or independently write features.
- A connected assistant can only perform actions exposed by its active tools and permissions. It does not continuously watch Issues in the background unless a separately configured agent or integration is added.
- No paid service, API, subscription, or usage-based feature should be enabled without explicit owner approval.
- Never put secrets or private user data in Issues, commits, or pull requests.
- Sensitive changes (authentication, permissions, user data, secrets, payments, database migrations, infrastructure, or deployment) require explicit owner review.
- A pull request is a proposal, not approval to merge or deploy.

## Current setup

The repository already has a GitHub Actions smoke-check workflow and development policy. This Command Center layer adds a structured request form and a guide. It does not change the live website or backend.
