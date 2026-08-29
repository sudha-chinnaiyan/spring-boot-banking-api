# Nexus Bank Web Application (Frontend Portal)

This directory contains the professional single-page web portal for Nexus Bank. It communicates directly with the Spring Boot REST API backend to provide secure user sessions, customer summaries, and account tracking.

## Technical Architecture

*   **React + TypeScript**: Formulates a type-safe component system.
*   **Vite**: High-performance module building and bundling.
*   **Tailwind CSS v4**: Utility-first CSS styling for a responsive, modern dark aesthetic.
*   **Axios Service Layer**: Decoupled HTTP API consumption using request and response interceptors.
*   **Session-Only Basic Authentication**: Encodes user credentials in memory/session-storage, attaching them automatically to protected endpoints.
*   **ProtectedRoute Guard**: Prevents unauthenticated layout access.
*   **Self-Healing Demo State**: Automatically prompts to seed mock databases on fresh container instances if standard profiles (ID 1) are missing.


Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
