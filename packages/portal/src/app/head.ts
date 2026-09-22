export interface IPortalHead {
  meta: { charSet?: string; name?: string; content?: string; title?: string }[];
  links: { rel: string; href: string; crossOrigin?: 'anonymous' }[];
}

const FONT_STYLESHEETS = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap',
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&display=swap'
];

/**
 * Meta and link tags for the root route `head()`.
 *
 * @example
 * head: ({ loaderData }) =>
 *   buildPortalHead({ portalName: getPortalName(loaderData.brand), stylesheetHref: appCss })
 */
export const buildPortalHead = ({
  portalName,
  stylesheetHref
}: {
  portalName: string;
  stylesheetHref: string;
}): IPortalHead => ({
  meta: [
    { charSet: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'description', content: portalName },
    { title: portalName }
  ],
  links: [
    { rel: 'stylesheet', href: stylesheetHref },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    ...FONT_STYLESHEETS.map(href => ({ rel: 'stylesheet', href }))
  ]
});
