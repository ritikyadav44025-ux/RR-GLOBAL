# RR GLOBAL — Hybrid Development Policy

This repository uses a human-approved hybrid workflow.

## Change levels

- **Low-risk changes:** documentation, copy, styling, and isolated non-sensitive UI fixes may be prepared on a feature branch and submitted as a pull request.
- **High-impact changes:** authentication, authorization, user data, payments, secrets, database migrations, backend infrastructure, production configuration, and deployment settings require explicit owner review before merge or release.

## Required workflow

1. Inspect the existing implementation before editing.
2. Make changes on a dedicated feature branch; do not work directly on `main`.
3. Run relevant tests and the GitHub Actions checks.
4. Open a pull request with a summary, affected files, risks, and test results.
5. The repository owner reviews and merges the pull request.
6. Production deployment follows the repository's existing hosting configuration. Do not create or change production deployment settings without owner approval.

## Automation boundary

GitHub Actions runs repeatable checks. It does not independently design features, make product decisions, approve pull requests, or authorize production deployments. An AI coding agent may prepare proposed changes, but owner approval remains required for high-impact changes and release decisions.
