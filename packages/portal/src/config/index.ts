export type TBrand = 'FM' | 'SO';

export interface IPortalConfig {
  brand: TBrand;
  portalName: string;
}

export interface IConfigurePortalOptions {
  brand: TBrand;
}

const portalNames = {
  FM: 'FUNaloMAX Admin Portal',
  SO: 'Solaire Online Admin Portal'
} as const satisfies Record<TBrand, string>;

export const BRANDS = ['FM', 'SO'] as const satisfies readonly TBrand[];

export const APP_TAB_CONFIG = {
  allowDuplicateTabs: false
};

let portalConfig: IPortalConfig | undefined;

export const isKnownBrand = (value?: string): value is TBrand =>
  BRANDS.some(brand => brand === value);

export const getPortalName = (brand: TBrand): string => portalNames[brand];

/**
 * Registers the brand the portal serves. `setEnv` calls it with the brand
 * from the runtime env before any portal module renders; Storybook calls it
 * at module scope.
 *
 * @example
 * configurePortal({ brand: 'SO' });
 */
export const configurePortal = ({ brand }: IConfigurePortalOptions): IPortalConfig => {
  portalConfig = { brand, portalName: getPortalName(brand) };

  return portalConfig;
};

export const getPortalConfig = (): IPortalConfig => {
  if (!portalConfig) {
    throw new Error('[portal] configurePortal must be called before the portal is used');
  }

  return portalConfig;
};

export const isBrandSo = (): boolean => getPortalConfig().brand === 'SO';
