# Contributing to Njiapanda

Thank you for your interest in contributing to Njiapanda. This project is built for GBV survivors in Kenya, and every contribution helps make the platform more accessible, safer, and more effective.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How to Contribute

### Report a Bug

Open an issue with the `bug` label. Include:
- A clear title and description
- Steps to reproduce
- Expected vs actual behaviour
- Browser/device information
- Screenshots if relevant

### Suggest a Feature

Open an issue with the `enhancement` label. Include:
- What problem the feature solves
- How it fits the trauma-informed design principles
- Any relevant examples

### Submit Code

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Run the type checker (`npm run typecheck`)
5. Run the linter (`npm run lint`)
6. Commit your changes (`git commit -m "feat: add your feature"`)
7. Push to your fork (`git push origin feature/your-feature`)
8. Open a pull request

### Commit Style

We use conventional commits:
- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation
- `style:` — formatting
- `refactor:` — code restructuring
- `test:` — tests
- `chore:` — maintenance

### PR Checklist

- [ ] TypeScript compiles with `npx tsc --noEmit`
- [ ] Linter passes with `npm run lint`
- [ ] No hardcoded secrets or credentials
- [ ] All new UI follows trauma-informed design principles
- [ ] Emergency exit button is present on any new page
- [ ] Mobile responsive (test on 375px viewport)

## Local Development

```bash
npm install
npm run dev
```

See [README.md](README.md) for full setup instructions.

## Design Principles

- Trauma-informed: recognition before action, anonymity by default
- Low cognitive load: progressive disclosure at every step
- Mobile-first: 48px+ tap targets, responsive layouts
- Safety as foundation: emergency exit, no PII collection
- Open source: MIT license, fork and localise freely
