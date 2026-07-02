# Contributing to Lite Project Manager

Thank you for your interest in contributing to Lite Project Manager! To maintain the high quality, architectural integrity, and performance of this project, we kindly ask you to follow these guidelines.

## 1. Commit Message Convention

We strictly follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This helps us maintain a readable and organized project history.

**Format:**
```text
<type>(<scope>): <description>
```

**Types allowed:**
- `feat`: A new feature (e.g., `feat(ui): add dragging animations`)
- `fix`: A bug fix (e.g., `fix(core): resolve data parsing error`)
- `refactor`: A code change that neither fixes a bug nor adds a feature (e.g., `refactor(board): extract cell component`)
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `perf`: A code change that improves performance

**Scopes:** Use logical areas of the codebase like `core`, `ui`, `board`, `sidebar`, `utils`.

## 2. Architecture: Feature-Sliced Design (FSD)

This project uses Feature-Sliced Design. Before adding new components or logic, please read [ARCHITECTURE.md](ARCHITECTURE.md).

**Key rules when contributing:**
- **Do not create "monolith" folders.** If you are building a new feature (e.g., a "Calendar"), create an isolated `app/features/calendar` folder.
- **Do not cross-import.** Features cannot import from other sibling features. If two features need the same component, move it to `app/common/`.
- **Public API only.** Export only the main component at the root of your feature folder. Keep subcomponents hidden inside `app/features/<your-feature>/components/`.

## 3. Creating a Pull Request

1. Fork the repository and create your branch from `main`.
2. Make sure your code compiles without TypeScript errors by running `npx tsc --noEmit`.
3. Test your changes locally.
4. Issue that pull request!
