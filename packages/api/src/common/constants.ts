/**
 * Page size that makes an MGT list endpoint return every row in one response.
 *
 * @example
 * getAdminRoles({ pageSize: ALL_ROWS_PAGE_SIZE });
 */
export const ALL_ROWS_PAGE_SIZE = -1;

/**
 * The `active | inactive` state shared by MGT records such as admins, games
 * and promotion plans.
 */
export const ACTIVATION_STATES = ['active', 'inactive'] as const satisfies readonly string[];

export type TActivationState = (typeof ACTIVATION_STATES)[number];
