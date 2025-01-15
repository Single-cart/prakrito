# Contributing to Single Cart

Thank you for your interest in contributing to the Single Cart e-commerce platform! This guide outlines the process for contributing to the project, managing branches, and best practices.

---

## Commit Message Convention

This repository follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. Commitizen tool is used to help contributors to follow the convention.

### Format

Each commit message consists of a **header**, a **body** and a **footer**. The header has a special format that includes a **type**, a **scope** and a **subject**:

```<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

### Type

Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Scope

The scope should be the name of the module affected (as perceived by the person reading the changelog generated from commit messages).

### Subject

The subject contains a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense. The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is also the place to reference GitHub issues that this commit **Closes**.

### Examples

```feat(auth): add JWT authentication system

Implement JWT-based authentication system with refresh tokens.
This includes user login, registration, and token refresh endpoints.

Closes #123
```

```fix(database): resolve connection timeout issue

Increase connection timeout and add retry mechanism to prevent random disconnections in production.

Closes #456
```

```docs(api): update API documentation with new endpoints

Add detailed documentation for the newly added authentication endpoints including examples and response schemas.
```

## **Branching Strategy**

We use a structured branching strategy to maintain stability and streamline development:

### Main Branches

- **`main`**: The production-ready branch. Only stable, tested, and approved code is merged here.
- **`develop`**: The integration branch for ongoing development. All feature branches are merged here before going to `main`.

### Supporting Branches

- **Feature branches (`feature/*`)**: Used to develop new features.
  - Naming convention: `feature/[client-name]-[feature-description]`
  - Example: `feature/client1-payment-gateway`
- **Bugfix branches (`bugfix/*`)**: For fixing specific issues.
  - Naming convention: `bugfix/[issue-id]-[description]`
  - Example: `bugfix/123-checkout-error`
- **Release branches (`release/*`)**: For preparing a version for deployment.
  - Naming convention: `release/[version-number]`
  - Example: `release/v1.0.0`
- **Hotfix branches (`hotfix/*`)**: For critical fixes to production.
  - Naming convention: `hotfix/[description]`
  - Example: `hotfix/cart-validation-bug`

---

## **Versioning**

- We use **semantic versioning** (`vX.Y.Z`):
  - `X`: Major version for significant updates.
  - `Y`: Minor version for new features or improvements.
  - `Z`: Patch version for bug fixes.
- Tags are created for every release (e.g., `v1.0.0`).

---

## **Contributor Workflow**

1. **Fork the Repository**: Create your own copy of the repository.
2. **Create a Branch**:
   - Use the appropriate naming convention (see above).
3. **Make Changes**:
   - Follow code quality standards and add tests if applicable.
4. **Push the Branch**:
   - Push your changes to your fork or a feature branch.
5. **Submit a Pull Request (PR)**:
   - Compare your branch against `develop` or `main` (as appropriate).
   - Provide a clear description of the changes in the PR.

---

## **Branch Protection Rules**

- **`main` and `develop`** branches are protected.
  - Requires pull request reviews.
  - Continuous Integration (CI) checks must pass before merging.

---

## **Placing the File in a Turborepo Monorepo**

- Add this file in the **root directory** of your Turborepo monorepo.
- Directory structure example:
