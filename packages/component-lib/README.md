# @cbt-bo/component-lib

Shared UI for the admin portals, consumed as TypeScript source by `apps/so-backoffice` and `apps/fm-backoffice`. It holds the shadcn/ui set, the theme stylesheet, the react-hook-form field bindings and the small composed components both apps render the same way.

## Layout

```
src/
├── styles.css          Tailwind entry, theme tokens and the Geist font
├── lib/utils.ts        cn()
├── components/ui/      vendored shadcn/ui components (not linted)
├── components/layout/  page chrome used on its own, such as PageSpinner
├── components/forms/   SubmitButton, PasswordToggle and the react-hook-form field bindings (TextField, PasswordField, CheckboxField), one folder per component with its stories and docs
└── forms/              whole composed forms, such as LoginForm
```

## What belongs here

This package holds building blocks (`components/`, including the field bindings under `components/forms/`) plus whole forms that both apps render the same way (`forms/`). A form stays in the app beside its page under `src/pages/<page>/` only while it is specific to that page or brand. Once a form carries no page, brand or translation knowledge of its own, such as `LoginForm`, it moves into `forms/` here and takes its display copy through a `labels` prop instead of calling `useTranslation` itself, since this package carries no i18n dependency. The page passes that `labels` object, built from `t()`.

## Using it from an app

Add the workspace dependency and import the stylesheet once. The stylesheet registers this package as a Tailwind source, so the app build picks up every class used here.

```css
/* apps/<app>/src/styles.css */
@import '@cbt-bo/component-lib/styles.css';
```

```tsx
import { Button } from '@cbt-bo/component-lib/components/ui/button';
import { SubmitButton, TextField } from '@cbt-bo/component-lib/components/forms';
```

## Adding a shadcn component

Run the CLI from this package so the component lands in `src/components/ui` with the `@cbt-bo/component-lib/*` aliases from `components.json`.

```bash
cd packages/component-lib
pnpm dlx shadcn@latest add dialog
```

## Scripts

```bash
pnpm --filter @cbt-bo/component-lib storybook   # http://localhost:6008
pnpm --filter @cbt-bo/component-lib test        # unit tests plus Storybook browser tests
pnpm --filter @cbt-bo/component-lib lint
pnpm --filter @cbt-bo/component-lib check:types
```
