# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| latest  | ✅        |

## Reporting a Vulnerability

Njiapanda handles sensitive survivor data. If you discover a security vulnerability, please report it privately.

**Do not report security issues through public GitHub issues.**

Instead, email: **nashe@njiapanda.org**

You should receive a response within 48 hours. If you don't, please follow up.

Please include:
- Type of issue (e.g., XSS, CSRF, data exposure, auth bypass)
- Steps to reproduce
- Affected endpoints or components
- Any proof-of-concept code (if applicable)

## What to Expect

- We will acknowledge receipt within 48 hours
- We will assess severity and impact
- We will work on a fix and communicate a timeline
- We will credit you in the release notes (if desired)

## Scope

- The live platform at https://njiapanda-v2.web.app
- The Cloud Run backends at `*.run.app`
- The Firebase project configuration

## Out of Scope

- Dependencies with known CVEs (report upstream)
- Rate limiting issues on non-authenticated endpoints
- Missing security headers on non-production deployments

## Safe Harbour

We will not pursue legal action against researchers who:
- Follow this disclosure policy
- Make a good-faith effort to avoid privacy violations and data destruction
- Do not access more data than necessary
- Do not publicly disclose the issue before we have addressed it
