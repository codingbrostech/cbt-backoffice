# @cbt-bo/portal

The admin portal rendered by `apps/backoffice`, a thin TanStack Start shell. Everything the user sees lives here and is consumed as TypeScript source. The brand (`SO` or `FM`) arrives with the runtime env on every request.

## Layout

```
src/
├── app/         PortalProviders, AppLayout, ColorSchemeScript, buildPortalHead
├── pages/       one folder per page: use-<name> hook, <Name>Page, forms, index barrel
├── layouts/     header, category rail, navbar, content tabs
├── table/       TanStack Table v9 primitives and the config-driven search bar
├── forms/       TanStack Form composition (useAppForm and the field components)
├── components/  portal components and the vendored shadcn/ui set under ui/
├── hooks/       session, permissions, notifications, confirm dialog, list search
├── store/       @tanstack/react-store stores, persisted through persistStore
├── services/    MGT action factories, session and permission helpers
├── actions/     generated API functions wrapped as actions
├── queries/     TanStack Query option factories
├── i18n/        i18next setup and the en/zh resources
├── constants/   paths, page keys and domain constants
└── utils/       framework-free helpers
```

`~/*` resolves to `src/*`. The app maps the same alias to this package in its tsconfig.

## Hosting the portal

The app's root route loads the runtime env (`BRAND`, `MGT_BASE_URL`, `MGT_SITE_ID`, `CLIENT_SITE_LOCALES`) through a server function and hands it to `PortalProviders`, which calls `setEnv`. `setEnv` registers the brand with `configurePortal` and points the API client at the MGT origin before any page renders.

```tsx
// src/routes/__root.tsx
loader: () => getRuntimeEnv(),
head: ({ loaderData }) =>
  buildPortalHead({ portalName: loaderData ? getPortalName(loaderData.brand) : '', stylesheetHref: appCss }),
component: () => (
  <PortalProviders env={Route.useLoaderData()}>
    <AppLayout>
      <Outlet />
    </AppLayout>
  </PortalProviders>
)
```

Storybook has no request, so `.storybook/preview.ts` calls `configurePortal({ brand: 'FM' })` at module scope instead.

```tsx
// src/routes/admins.tsx
export const Route = createFileRoute('/admins')({ component: AdminsPage });
```

## Adding a list page

1. Add `src/actions/<name>.ts` wrapping the generated API functions with `createMgtAction`, and `src/queries/<name>.ts` with `queryOptions` factories when other pages share the data.
2. Add `src/pages/<name>/use-<name>.ts(x)`. It declares the search fields (`ISearchField[]`), the `columnsOrder` tuple and `fieldOptions` for `buildTableConfig`, and calls `useListPage({ fields, queryKey, fetchList, columns })`. Create and edit go through `useFormDialog` plus `useSaveMutation`, deletes through `useConfirmDialog`.
3. Add `src/pages/<name>/<Name>Page.tsx` rendering `ListPage` with the hook result, the toolbar buttons, and a `FormDialog` per dialog. The page key from `PAGE_KEY` drives the permission gate.
4. Export the page from `src/pages/<name>/index.ts`, add the route file to the app, and regenerate the route tree.

Lists inside another page (the player detail tabs) use `EmbeddedList` with `isRouteBound: false`, which keeps the search in component state instead of the URL.

## Adding a form

Forms are TanStack Form through `useAppForm`. Declare the value interface first, build the zod schema so its input type matches those values exactly, and pass it as `validators: { onSubmit: schema }`. Render fields with `form.AppField` and the registered field components, and wrap the fields in `form.AppForm` + `form.FormShell` with a `form.SubmitButton` footer.

## Scripts

```bash
pnpm --filter @cbt-bo/portal storybook   # http://localhost:6008
pnpm --filter @cbt-bo/portal test        # unit tests plus Storybook browser tests
pnpm --filter @cbt-bo/portal lint
pnpm --filter @cbt-bo/portal check:types
```
