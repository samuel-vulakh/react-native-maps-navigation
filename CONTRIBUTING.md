# Contributing to React Native Maps Navigation

Thank you for your interest in contributing to React Native Maps Navigation! This document provides guidelines and instructions for contributing to this project.

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/react-native-maps-navigation.git`
3. Install dependencies: `pnpm install`
4. Start development server: `pnpm dev`

## Development Workflow

1. Create a new branch for your feature or bugfix: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Run linting and type checking: `pnpm lint && pnpm typecheck`
4. Fix any issues: `pnpm fix`
5. Run tests: `pnpm test`

## Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) for consistent commit messages. To make this easier, we've set up Commitizen.

Instead of using `git commit`, please use:

```bash
pnpm commit
```

This will prompt you to fill in any required fields and format your commit message according to our guidelines.

### Commit Message Format

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

Types include:
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code changes that neither fix bugs nor add features
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Changes to the build process or auxiliary tools

Commit messages are automatically validated by commitlint before each commit.

## Pull Request Process

1. Update the README.md or documentation with details of your changes if appropriate
2. Make sure all tests pass and the code follows our style guidelines
3. Submit a pull request to the `main` branch
4. The pull request will be reviewed by maintainers

## Code Style

We use ESLint and Prettier to maintain code quality. Please ensure your code adheres to our style guidelines by running:

```bash
pnpm lint
pnpm format
```

## TypeScript

This project is written in TypeScript. Please:
- Use appropriate types and interfaces
- Avoid using `any` when possible
- Write well-typed code that passes type checking (`pnpm typecheck`)

## License

By contributing to React Native Maps Navigation, you agree that your contributions will be licensed under the project's MIT license.

## Questions?

If you have questions about contributing, please open an issue for discussion.

Thank you for contributing to make React Native Maps Navigation better! 
