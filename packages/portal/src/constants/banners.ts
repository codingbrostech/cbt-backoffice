export const BANNER_PAGE_SURFACES = ['home', 'promotion'] as const;

export type TBannerPageSurface = (typeof BANNER_PAGE_SURFACES)[number];

export const isBannerPageSurface = (value: string): value is TBannerPageSurface =>
  BANNER_PAGE_SURFACES.some(surface => surface === value);
