# Contributing to Single Cart

Thank you for your interest in contributing to the Single Cart e-commerce platform! This guide outlines the process for contributing to the project, managing branches, and best practices.

---

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
