import { createMgtPostAction } from '~/services/mgt';

export type TExportReportType =
  | 'wagertxn'
  | 'ledgertxn'
  | 'paymenttxn'
  | 'pointtxn'
  | 'acsc_reward_pushlog'
  | 'acsc_transfer'
  | 'player_bethistory'
  | 'player_paymenttxn'
  | 'player_pointtxn'
  | 'player_bonus_rebate'
  | 'wagerstats_by_player'
  | 'wagerstats_by_provider'
  | 'wagerstats_by_provider_game'
  | 'wagerstats_by_gametype';

export type TExportJobStatus = 'pending' | 'processing' | 'done' | 'failed';

export interface IExportJobCreateResult {
  jobId: string;
  status: TExportJobStatus;
}

export interface IExportJobGetResult {
  id: string;
  reportType: TExportReportType;
  status: TExportJobStatus;
  rowCount: number;
  downloadUrl?: string;
  downloadUrlExpiresIn?: number;
  downloadFilename?: string;
  errorMsg?: string;
  crtTime: string;
  updTime: string;
}

export interface IExportJobListResult {
  data: IExportJobGetResult[];
  total: number;
}

export const createExportJob = createMgtPostAction<IExportJobCreateResult>(
  '/mgt/v1/export/job/create'
);

export const getExportJob = createMgtPostAction<IExportJobGetResult>('/mgt/v1/export/job/get');

export const listExportJobs = createMgtPostAction<IExportJobListResult>('/mgt/v1/export/job/list');
