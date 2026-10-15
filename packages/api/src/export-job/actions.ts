import { customFetch } from '@cbt-bo/api-schema/fetcher';
import { type IMgtEnvelope, createMgtAction } from '@cbt-bo/api-schema/mgt';

/**
 * Report a job exports, the `reportType` of `/mgt/v1/export/job/create`.
 */
export type TExportReportType =
  | 'wagertxn'
  | 'ledgertxn'
  | 'paymenttxn'
  | 'pointtxn'
  | 'acsc_reward_pushlog'
  | 'acsc_transfer'
  | 'player_promotion'
  | 'player_bethistory'
  | 'player_paymenttxn'
  | 'player_pointtxn'
  | 'player_bonus_rebate'
  | 'wagerstats_by_player'
  | 'wagerstats_by_provider'
  | 'wagerstats_by_provider_game'
  | 'wagerstats_by_gametype';

export type TExportJobStatus = 'pending' | 'processing' | 'done' | 'failed';

export interface IExportJobCreateInput {
  reportType: TExportReportType;
  /**
   * Filters of the report's own list endpoint, without the page.
   */
  input: object;
}

export interface IExportJobCreateResult {
  jobId?: string;
  status?: TExportJobStatus;
}

export interface IExportJobGetInput {
  id: string;
}

export interface IExportJobGetResult {
  id?: string;
  reportType?: TExportReportType;
  status?: TExportJobStatus;
  rowCount?: number;
  /**
   * Link to the exported file, present once `status` is `done`.
   */
  downloadUrl?: string;
  downloadUrlExpiresIn?: number;
  downloadFilename?: string;
  /**
   * Reason the job failed, present when `status` is `failed`.
   */
  errorMsg?: string;
  crtTime?: string;
  updTime?: string;
}

const EXPORT_JOB_CREATE_URL = '/mgt/v1/export/job/create';
const EXPORT_JOB_GET_URL = '/mgt/v1/export/job/get';

const buildJsonPostInit = (input: unknown, options?: RequestInit): RequestInit => {
  const headers = new Headers(options?.headers);

  headers.set('Content-Type', 'application/json');

  return { ...options, method: 'POST', headers, body: JSON.stringify(input) };
};

const mgtServiceExportJobCreate = (input: IExportJobCreateInput, options?: RequestInit) =>
  customFetch<IMgtEnvelope<IExportJobCreateResult>>(
    EXPORT_JOB_CREATE_URL,
    buildJsonPostInit(input, options)
  );

const mgtServiceExportJobGet = (input: IExportJobGetInput, options?: RequestInit) =>
  customFetch<IMgtEnvelope<IExportJobGetResult>>(
    EXPORT_JOB_GET_URL,
    buildJsonPostInit(input, options)
  );

export const createExportJob = createMgtAction(mgtServiceExportJobCreate);

export const getExportJob = createMgtAction(mgtServiceExportJobGet);
