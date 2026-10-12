// Auto-generated barrel. Do not edit — re-run gen:api to regenerate.

export interface AdminCreateInput {
  tenantCode?: string;
  /** 賬號 Required */
  code: string;
  /** 賬戶名稱, 如不輸入用login填入 */
  name?: string;
  /** 賬號密碼 Required */
  secret: string;
  /** 角色代碼 Required（handler 空值回錯，且需存在於 admin_role） */
  role: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface AdminListInput {
  page?: number;
  pageSize?: number;
  /** 賬號, 只filter完全相等 */
  code?: string;
  /** 賬戶狀態 */
  state?: string;
  role?: string;
}

export interface AdminListResult {
  total?: number;
  data?: AdminResult[];
}

/**
 * AdminOpsLogListInput lists admin operation logs.
 */
export interface AdminOpsLogListInput {
  /** 選填：頁碼（0=預設1；-1=全部） */
  page?: number;
  /** 選填：每頁筆數（0=預設100；-1=全部） */
  pageSize?: number;
  /** 選填：管理員代碼（完全相等） */
  adminCode?: string;
  /** 選填：ops_action 完全相等（例：mgt PaymentApprove） */
  opsAction?: string;
  /** 選填：schema v1 resource（例：payment、promotion） */
  resource?: string;
  /** 選填：建立時間起（RFC3339） */
  timeFrom?: string;
  /** 選填：建立時間迄（RFC3339） */
  timeTo?: string;
}

export interface AdminOpsLogListResult {
  total?: number;
  data?: AdminOpsLogResult[];
}

export interface AdminOpsLogResult {
  id?: string;
  crtTime?: string;
  updTime?: string;
  tenantCode?: string;
  adminId?: string;
  adminCode?: string;
  sessionId?: string;
  opsAction?: string;
  opsValues?: AdminOpsLogResultOpsValues;
  /** 人話摘要（v1 summary；舊版由後端 fallback） */
  summary?: string;
}

export type AdminOpsLogResultOpsValues = {[key: string]: string};

/**
 * AdminQuotaConfigListInput 查詢 quota 上限列表
 */
export interface AdminQuotaConfigListInput {
  page?: number;
  pageSize?: number;
  adminCode?: string;
  quotaType: string;
}

export interface AdminQuotaConfigListResult {
  total?: number;
  data?: AdminQuotaConfigResult[];
}

export interface AdminQuotaConfigResult {
  id?: string;
  tenantCode?: string;
  adminId?: string;
  adminCode?: string;
  quotaType?: string;
  limitAmt?: string;
  crtTime?: string;
  updTime?: string;
  adminState?: string;
}

/**
 * AdminQuotaConfigSetInput 修改某管理員的 quota 上限
 */
export interface AdminQuotaConfigSetInput {
  /** 管理員代碼 Required（handler 空值回錯） */
  adminCode: string;
  /** 額度類型 Required（handler 空值回錯） */
  quotaType: string;
  limitAmt?: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface AdminQuotaListInput {
  page?: number;
  pageSize?: number;
  /** 選填：管理員代碼 */
  adminCode?: string;
  /** 選填：玩家ID */
  playerId?: string;
  /** 必填：額度類型（e.g. "deposit"） */
  quotaType: string;
}

export interface AdminQuotaListResult {
  total?: number;
  data?: AdminQuotaResult[];
}

/**
 * AdminQuotaResetInput 重設某 admin 對某 player 的累計為 0
 */
export interface AdminQuotaResetInput {
  /** 管理員代碼 Required（handler 空值回錯） */
  adminCode: string;
  /** 玩家ID Required（handler 檢查 playerId==0 回錯） */
  playerId: string;
  /** 額度類型 Required（handler 空值回錯） */
  quotaType: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface AdminQuotaResult {
  id?: string;
  tenantCode?: string;
  adminId?: string;
  adminCode?: string;
  playerId?: string;
  quotaType?: string;
  quotaUsed?: string;
  crtTime?: string;
  updTime?: string;
  quotaLimit?: string;
  quotaRemain?: string;
}

export interface AdminResult {
  id?: string;
  tenantCode?: string;
  code?: string;
  name?: string;
  type?: string;
  state?: string;
  /** 角色代碼（例如 super / admin) */
  role?: string;
}

/**
 * 所有角色及其權限
 */
export interface AdminRoleAllPermsResult {
  data?: AdminRoleWithPerms[];
}

export interface AdminRoleCodeInput {
  /** 角色代碼 Required（Get/Delete/PermGet 的必要查詢鍵） */
  code: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log）（刪除角色屬高風險操作，建議必填） */
  opsRemark?: string;
}

export interface AdminRoleListInput {
  page?: number;
  pageSize?: number;
  code?: string;
}

export interface AdminRoleListResult {
  total?: number;
  data?: AdminRoleResult[];
}

/**
 * 所有可設定的 page key 清單（供前端使用）
 */
export interface AdminRolePageKeyEntry {
  key?: string;
  /** page = CRUD 頁面；action = 單一動作（canCreate = 允許執行） */
  type?: string;
}

export interface AdminRolePageKeysResult {
  keys?: AdminRolePageKeyEntry[];
}

/**
 * 刪除單條角色頁面權限
 */
export interface AdminRolePermDeleteInput {
  /** 角色代碼 Required（必要刪除鍵） */
  roleCode: string;
  /** 頁面 key Required（必要刪除鍵） */
  pageKey: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log）（調整權限建議必填） */
  opsRemark?: string;
}

/**
 * 頁面/動作 key 的單條權限
 */
export interface AdminRolePermEntry {
  pageKey?: string;
  canCreate?: boolean;
  canRead?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  /** page | action */
  type?: string;
}

/**
 * 取得角色的所有頁面權限
 */
export interface AdminRolePermGetResult {
  roleCode?: string;
  perms?: AdminRolePermEntry[];
}

/**
 * 批次設定角色頁面權限
 */
export interface AdminRolePermSetInput {
  /** 角色代碼 Required（必要寫入鍵） */
  roleCode: string;
  perms?: AdminRolePermEntry[];
  /** 選填：稽核備註（僅寫入 admin_ops_log）（調整權限建議必填） */
  opsRemark?: string;
}

/**
 * 新增/修改單條角色頁面權限
 */
export interface AdminRolePermUpsertInput {
  /** 角色代碼 Required（必要寫入鍵） */
  roleCode: string;
  /** 權限項 Required（handler 直接取用 perm.pageKey，nil 會導致失敗） */
  perm: AdminRolePermEntry;
  /** 選填：稽核備註（僅寫入 admin_ops_log）（調整權限建議必填） */
  opsRemark?: string;
}

export interface AdminRoleResult {
  id?: string;
  tenantCode?: string;
  code?: string;
  name?: string;
  isSystem?: boolean;
}

export interface AdminRoleUpsertInput {
  /** 角色代碼 Required（handler 空值回錯） */
  code: string;
  /** 角色名稱 Required（handler 空值回錯） */
  name: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log）（新增/修改角色建議必填） */
  opsRemark?: string;
}

/**
 * 單一角色 + 其所有權限
 */
export interface AdminRoleWithPerms {
  role?: AdminRoleResult;
  perms?: AdminRolePermEntry[];
}

export interface AdminSessionListInput {
  page?: number;
  pageSize?: number;
  /** 賬號, 只filter完全相等 */
  adminCode?: string;
  /** 賬戶狀態 */
  sessionState?: string;
}

export interface AdminSessionListResult {
  total?: number;
  data?: AdminSessionResult[];
}

export interface AdminSessionResult {
  id?: string;
  crtTime?: string;
  tenantId?: string;
  state?: string;
  adminCode?: string;
  ip?: string;
  cc?: string;
  ua?: string;
}

export interface AdminSessionRevokeInput {
  /** 登入時段編號 */
  id?: string;
  /** 賬號 */
  adminCode?: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface AdminUpdateInput {
  /** 賬號ID Required（handler 檢查 id==0 回錯） */
  id: string;
  name?: string;
  secret?: string;
  state?: string;
  role?: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface AppIngressListInput {
  page?: number;
  pageSize?: number;
  name?: string;
  type?: string;
  state?: string;
}

export interface AppIngressListResult {
  total?: number;
  data?: AppIngressResult[];
}

export interface AppIngressResult {
  id?: string;
  crtTime?: string;
  updTime?: string;
  name?: string;
  type?: string;
  state?: string;
  tenantId?: string;
  expr?: string;
  hint?: string;
}

export interface AppIngressUpsertInput {
  /** 選填。0 或不帶 = 新增, >0 = 更新 */
  id?: string;
  tenantId?: string;
  name?: string;
  type?: string;
  state?: string;
  expr?: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface AuthChangePwdInput {
  /** 舊密碼 Required（空值於 bcrypt 比對回錯中止） */
  oldPwd: string;
  /** 新密碼 Required（handler 空值回錯） */
  newPwd: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface AuthLoginInput {
  /** 賬號 Required */
  code: string;
  /** 賬號密碼 Required */
  secret: string;
  /** lang possible values: en, zh, cn */
  lang?: string;
  /** optional human verify token for cloudflare turnstile use, just pass empty for bypassing dev */
  hvt?: string;
  /** client version possible values: "h5d;1.0.100", "h5m;1.0.100" */
  cv?: string;
  /** client unique id, for browser, could generate a uuid and store into cookie for next time use */
  ck?: string;
  /** master token for pass auth challenge */
  mstToken?: string;
}

export interface AuthTokenResult {
  token?: string;
  /** current detected country */
  cc?: string;
  /** currect detected ip */
  ip?: string;
  /** agent info */
  data?: AdminResult;
}

export interface AuthValidateInput {
  /** lang possible  values: en, zh, cn */
  lang?: string;
  /** client app build version possible values: "h5d;1.0.100", "h5m;1.0.100" */
  cv?: string;
  /** device unique id, for browser, could generate a uuid and store into cookie for next time use */
  ck?: string;
}

export interface BalanceNegativeFixInput {
  balanceId: string;
  maxWriteoff?: string;
}

export interface BalanceNegativeFixResult {
  balanceId?: string;
  applied?: boolean;
  action?: string;
  balanceBefore?: string;
  balanceAfter?: string;
  bonusBefore?: string;
  bonusAfter?: string;
  ledgerId?: string;
  message?: string;
}

/**
 * ── 負餘額查詢/校正（super only）──────────────────────────────
 對應 test_sh/negative_balance/incident_negative_balance_fix_*.sql 的線上版。
 */
export interface BalanceNegativeInspectInput {
  balanceId: string;
}

export interface BalanceNegativeInspectResult {
  balanceId?: string;
  playerId?: string;
  currency?: string;
  balance?: string;
  bonus?: string;
  locked?: string;
  total?: string;
  /** 狀態驅動分類（與過去是否校正過無關）：
   NOT_NEGATIVE / NET_NEGATIVE / BONUS_COVERED / BONUS_COVERED_INSUFFICIENT / HELD_WITHDRAW / OVER_CAP */
  classification?: string;
  /** NONE / WRITE_OFF / BUCKET_TRANSFER / MANUAL_REVIEW */
  proposedAction?: string;
  proposedWriteoff?: string;
  fingerprintCnt?: string;
  realWithdrawSettled?: string;
  alreadyCorrected?: boolean;
}

/**
 * BalanceNegativeList 掃描所有 balance<0 帳戶並分類（super only，唯讀；scan SQL 的線上版）。
 */
export interface BalanceNegativeListInput {
  page?: number;
  pageSize?: number;
  classification?: string;
}

export interface BalanceNegativeListResult {
  data?: BalanceNegativeInspectResult[];
  total?: string;
}

export interface BannerListInput {
  /** 選填。名稱篩選 */
  name?: string;
  /** 選填。狀態篩選。允許值：active | inactive */
  state?: string;
  /** 選填。平台篩選 */
  platform?: string;
  /** 選填。曝光頁面篩選（含任一即列出）。允許值：home | promotion */
  pageSurface?: string;
  /** 選填。頁碼 */
  page?: number;
  /** 選填。每頁筆數 */
  pageSize?: number;
}

export interface BannerListResult {
  total?: number;
  data?: BannerResult[];
}

export interface BannerResult {
  id?: string;
  name?: string;
  tenantId?: string;
  tenantCode?: string;
  startTime?: string;
  endTime?: string;
  /** 狀態。允許值：active | inactive */
  state?: string;
  weight?: number;
  link?: string;
  /** mobile, desktop */
  platform?: string;
  /** 多語系名稱，簡介 */
  descriptions?: BannerResultDescriptions;
  /** 多語系，多尺寸圖片 */
  images?: BannerResultImages;
  /** 其他屬性, 如顯示模式
   for example: displayMode carousel, waterfall, etc, need frontend agree the word to support */
  properties?: BannerResultProperties;
  /** 曝光頁面：home=首頁、promotion=優惠頁 */
  pageSurfaces?: string[];
}

/**
 * 多語系名稱，簡介
 */
export type BannerResultDescriptions = {[key: string]: string};

/**
 * 多語系，多尺寸圖片
 */
export type BannerResultImages = {[key: string]: string};

/**
 * 其他屬性, 如顯示模式
 for example: displayMode carousel, waterfall, etc, need frontend agree the word to support
 */
export type BannerResultProperties = {[key: string]: string};

export interface BannerUpsertInput {
  /** 選填。0 或不帶 = 新增, >0 = 更新 */
  id?: string;
  /** 必填。名稱 */
  name: string;
  /** 選填。租戶 ID，0 時由 session 帶入 */
  tenantId?: string;
  /** 選填。租戶代碼，空時由 session 帶入 */
  tenantCode?: string;
  /** 選填。開始時間 */
  startTime?: string;
  /** 選填。結束時間 */
  endTime?: string;
  /** 選填。狀態，未填預設 active。允許值：active | inactive */
  state?: string;
  /** 選填。排序權重，未填預設 0 */
  weight?: number;
  /** 選填。連結；以 '/' 開頭為站內連結，否則為外鏈 */
  link?: string;
  /** 選填。平台，未填預設 mobile。允許值：mobile | desktop */
  platform?: string;
  /** 選填。多語系名稱、簡介 */
  descriptions?: BannerUpsertInputDescriptions;
  /** 選填。多語系、多尺寸圖片；更新時未送或空則保留既有 */
  images?: BannerUpsertInputImages;
  /** 選填。其他屬性，如顯示模式（displayMode: carousel, waterfall 等，需前後端約定） */
  properties?: BannerUpsertInputProperties;
  /** 選填。曝光頁面；未送或空於新增時預設僅 home；更新時未送或空則保留既有值。允許值：home、promotion（可複選） */
  pageSurfaces?: string[];
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

/**
 * 選填。多語系名稱、簡介
 */
export type BannerUpsertInputDescriptions = {[key: string]: string};

/**
 * 選填。多語系、多尺寸圖片；更新時未送或空則保留既有
 */
export type BannerUpsertInputImages = {[key: string]: string};

/**
 * 選填。其他屬性，如顯示模式（displayMode: carousel, waterfall 等，需前後端約定）
 */
export type BannerUpsertInputProperties = {[key: string]: string};

export interface BatchCancelPlayerPromotionInput {
  promotionId: string;
  mobiles: string[];
  defaultDialCode?: string;
  dryRun?: boolean;
  opsRemark?: string;
}

export interface BatchCancelPlayerPromotionResult {
  dryRun?: boolean;
  total?: number;
  okCount?: number;
  failCount?: number;
  items?: BatchPlayerPromotionOpItem[];
}

export interface BatchGrantPlayerPromotionInput {
  promotionId: string;
  mobiles: string[];
  defaultDialCode?: string;
  dryRun?: boolean;
  opsRemark?: string;
}

export interface BatchGrantPlayerPromotionResult {
  dryRun?: boolean;
  total?: number;
  okCount?: number;
  failCount?: number;
  items?: BatchPlayerPromotionOpItem[];
}

/**
 * MF-585 BO 批量發放/取消 fasttrack promotion（逐筆結果）
 */
export interface BatchPlayerPromotionOpItem {
  mobile?: string;
  ok?: boolean;
  reason?: string;
  detail?: string;
  playerId?: string;
  playerPromotionId?: string;
  bonusAmt?: string;
  code?: number;
}

export interface BonusListInput {
  page?: number;
  pageSize?: number;
  type?: string;
  cycle?: string;
  state?: string;
  isTpl?: boolean;
  /** if not tpl, could set startTime endTime filter */
  startTimeFrom?: string;
  startTimeTo?: string;
  endTimeFrom?: string;
  endTimeTo?: string;
}

export interface BonusListResult {
  total?: number;
  data?: BonusResult[];
}

export interface BonusPrizeListInput {
  bonusId?: string;
  page?: number;
  pageSize?: number;
}

export interface BonusPrizeListResult {
  total?: number;
  data?: BonusPrizeResult[];
}

export interface BonusPrizeResult {
  id?: string;
  crtTime?: string;
  updTime?: string;
  tenantId?: string;
  bonusId?: string;
  name?: string;
  idx?: number;
  /** 獎品類型, coin, rate, item */
  type?: string;
  coinType?: string;
  /** 獎品數值, coin cent */
  coinVal?: string;
  /** 獎品最大值 */
  coinMax?: string;
  /** 中獎達成條件, 0 表示無限制 */
  threshold?: string;
  expr?: string;
  descriptions?: BonusPrizeResultDescriptions;
  images?: BonusPrizeResultImages;
  prop?: BonusPrizeResultProp;
}

export type BonusPrizeResultDescriptions = {[key: string]: string};

export type BonusPrizeResultImages = {[key: string]: string};

export type BonusPrizeResultProp = {[key: string]: string};

export interface BonusPrizeUpsertInput {
  id?: string;
  crtTime?: string;
  updTime?: string;
  tenantId?: string;
  bonusId?: string;
  name?: string;
  index?: number;
  /** 獎品類型, coin, rate, item */
  type?: string;
  coinType?: string;
  /** coin cent */
  coinVal?: string;
  /** 獎品最大值 */
  coinMax?: string;
  /** 中獎達成條件, 0 表示無限制 */
  threshold?: string;
  expr?: string;
  descriptions?: BonusPrizeUpsertInputDescriptions;
  images?: BonusPrizeUpsertInputImages;
  prop?: BonusPrizeUpsertInputProp;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export type BonusPrizeUpsertInputDescriptions = {[key: string]: string};

export type BonusPrizeUpsertInputImages = {[key: string]: string};

export type BonusPrizeUpsertInputProp = {[key: string]: string};

export interface BonusResult {
  id?: string;
  crtTime?: string;
  updTime?: string;
  tenantId?: string;
  startTime?: string;
  endTime?: string;
  name?: string;
  type?: string;
  subType?: string;
  cycle?: string;
  state?: string;
  maxRun?: number;
  expr?: string;
  mode?: string;
  descriptions?: BonusResultDescriptions;
  images?: BonusResultImages;
  prop?: BonusResultProp;
  isTpl?: boolean;
  /** only present in bonus get api */
  prizes?: BonusPrizeResult[];
}

export type BonusResultDescriptions = {[key: string]: string};

export type BonusResultImages = {[key: string]: string};

export type BonusResultProp = {[key: string]: string};

export interface BonusUpsertInput {
  /** 選填。0 或不帶 = 新增, >0 = 更新 (upsert 鍵) */
  id?: string;
  startTime?: string;
  endTime?: string;
  name?: string;
  type?: string;
  /** 必填。handler 驗證 subType 必須為合法值 (目前僅 'bet')，空值即回 ErrInvalidParam */
  subType: string;
  cycle?: string;
  state?: string;
  maxRun?: number;
  tenant_id?: string;
  expr?: string;
  mode?: string;
  descriptions?: BonusUpsertInputDescriptions;
  images?: BonusUpsertInputImages;
  prop?: BonusUpsertInputProp;
  isTpl?: boolean;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export type BonusUpsertInputDescriptions = {[key: string]: string};

export type BonusUpsertInputImages = {[key: string]: string};

export type BonusUpsertInputProp = {[key: string]: string};

export interface CancelPlayerPromotionInput {
  /** 必填。玩家方案 ID */
  id: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface CancelPlayerPromotionResult {
  playerPromotion?: PlayerPromotion;
}

export interface CancelWagerInput {
  /** 注單 ID（必填） */
  wagerId: string;
  /** 取消原因（選填，上限 36 字元；寫入 txn_wager.amend_remark 與 txn_ledger.remark）
   較長的脈絡（單號、逾時證據等）請改放 opsRemark，該欄位無長度限制 */
  reason?: string;
  /** 是否上報 Gobis（選填，預設 true；設為 false 則跳過上報） */
  reportGobis?: boolean;
  /** 選填：稽核備註（僅寫入 admin_ops_log；與 reason 不同，reason 寫入注單/流水） */
  opsRemark?: string;
}

/**
 * CompletePlayerPromotion 後台手動結清：僅 state=active；紅利轉現金、state=completed（需求 Stop）
 */
export interface CompletePlayerPromotionInput {
  /** 必填。player_promotion.id */
  id: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface CompletePlayerPromotionResult {
  playerPromotion?: PlayerPromotion;
}

/**
 * ----------Player
 */
export interface CreatePlayerPromotionInput {
  /** 選填。租戶 ID。以登入 admin 的租戶為準；若提供則必須與 session 一致 */
  tenantId?: string;
  /** 必填。玩家 ID */
  playerId: string;
  /** 選填。玩家代碼。後端由 playerId 解析；若提供則必須與該玩家一致 */
  playerCode?: string;
  /** 必填。方案 ID */
  promotionId: string;
  /** 選填。幣別。fasttrack 方案免填（後端以玩家當前錢包解析；若提供則必須與當前錢包一致）；其他類型建立時必填 */
  currency?: string;
  /** 選填。餘額 ID。fasttrack 方案免填（後端以玩家當前錢包解析；若提供則必須與當前錢包一致）；其他類型建立時必填 */
  balanceId?: string;
  /** 選填。存款交易 ID。fasttrack 方案不可帶（無入金）；其他類型建立時必填 */
  depositTxnId?: string;
  /** 選填。存款金額（分）。fasttrack 方案不可帶（無入金）；其他類型建立時必填 */
  depositAmt?: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface CreatePlayerPromotionResult {
  playerPromotion?: PlayerPromotion;
}

export interface DeletePlayerPromotionInput {
  /** 必填。玩家方案 ID */
  id: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface DeletePlayerPromotionResult {
  playerPromotion?: PlayerPromotion;
}

export interface DeletePromotionInput {
  /** 必填。方案 ID */
  id: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface DeletePromotionResult {
  promotion?: Promotion;
}

/**
 * FeatureFlagResult 租戶功能旗標（後台管理）。
 */
export interface FeatureFlagResult {
  id?: string;
  crtTime?: string;
  updTime?: string;
  tenantId?: string;
  xpEnabled?: boolean;
  fcEnabled?: boolean;
  leaderboardEnabled?: boolean;
  idleLockEnabled?: boolean;
  kycDepositRequired?: boolean;
  kycWithdrawRequired?: boolean;
  /** 出金請求量大時的提示彈窗，於玩家進入出金頁時顯示 (default: false) */
  withdrawHighVolumeNoticeEnabled?: boolean;
  /** 登入後顯示責任博彩 (Responsible Gaming) 指南彈窗 (default: false) */
  postLoginResponsibleGamingModalEnabled?: boolean;
  /** Cookie 使用通知橫幅 (default: false) */
  cookieNoticeEnabled?: boolean;
  /** 獎勵商店功能（獨立於 xpEnabled）(default: false) */
  rewardShopEnabled?: boolean;
  /** 出金前須通過 OTP 驗證 (default: false)。
   欄位 20 保留給 rewardShopEnabled（其他分支已使用），此處自 21 起編號以避免合併撞號。 */
  withdrawOtpRequired?: boolean;
  /** 出金前須完成入金 1x 週轉 (default: false)。
   欄位 22 已被 FeatureFlagUpsertInput 使用，此處跳號至 23 以避免跨分支合併撞號。 */
  depositTurnoverEnabled?: boolean;
}

/**
 * FeatureFlagUpsertInput 新增/更新租戶功能旗標。
 tenantId 為 0 時取當前 admin session 的租戶；提交即覆蓋全部旗標（整表單送出語意）。
 */
export interface FeatureFlagUpsertInput {
  tenantId?: string;
  xpEnabled?: boolean;
  fcEnabled?: boolean;
  leaderboardEnabled?: boolean;
  idleLockEnabled?: boolean;
  kycDepositRequired?: boolean;
  kycWithdrawRequired?: boolean;
  /** 出金請求量大時的提示彈窗，於玩家進入出金頁時顯示 (default: false) */
  withdrawHighVolumeNoticeEnabled?: boolean;
  /** 登入後顯示責任博彩 (Responsible Gaming) 指南彈窗 (default: false) */
  postLoginResponsibleGamingModalEnabled?: boolean;
  /** Cookie 使用通知橫幅 (default: false) */
  cookieNoticeEnabled?: boolean;
  /** 獎勵商店功能（獨立於 xpEnabled）(default: false) */
  rewardShopEnabled?: boolean;
  /** 出金前須通過 OTP 驗證 (default: false)。
   刻意使用 optional（presence 語意）：未傳時維持 DB 原值，避免前端漏送把已開啟的資金安全控制靜默關掉。
   後台表單若要關閉此旗標，必須明確送出 false。
   欄位 21 保留給 rewardShopEnabled（其他分支已使用），此處自 22 起編號以避免合併撞號。 */
  withdrawOtpRequired?: boolean;
  /** 出金前須完成入金 1x 週轉 (default: false)。
   同樣採 optional（presence 語意）：此旗標開啟後會攔截提款，屬資金流程控制，
   前端漏送不應被當成 false 而靜默關閉；未傳時維持 DB 原值。
   欄位 23 已被 FeatureFlagResult 使用，此處跳號至 24 以避免跨分支合併撞號。 */
  depositTurnoverEnabled?: boolean;
  /** （選填）稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

/**
 * 對應 GameHomeResult.data 各 key 之遊戲數量（key 為 game_vec.code）
 */
export interface GameGroupByTypeResult {
  /** 與 data 的 map key 相同，即 game_vec.code */
  type?: string;
  gameCount?: number;
}

/**
 * GameHome: 後台主頁遊戲區塊（mgt 版）
 */
export interface GameHomeInput {
  /** 可選，對應 game_home_tab.code；空則使用該租戶 tabs 中 sort 最小者 */
  gameType?: string;
  /** 分頁：頁碼（optional，預設 1） */
  page?: number;
  /** 分頁：每頁筆數（optional，預設 100；傳 -1 表示不限制） */
  pageSize?: number;
  /** 可選，查詢 game.is_test=true/false 的資料；未傳預設 false */
  isTest?: boolean;
}

export interface GameHomeResult {
  /** key 僅為 game_vec.code（該 gameType 對應分頁下之向量），value = 該群遊戲列表 */
  data?: GameHomeResultData;
  vecs?: GameHomeVecResult[];
  /** 與 data 各 key 對應之遊戲數量（key 為 game_vec.code） */
  groupsByType?: GameGroupByTypeResult[];
  /** 符合條件的遊戲總筆數 */
  total?: number;
  /** 本筆 response 使用的頁碼與每頁筆數 */
  page?: number;
  pageSize?: number;
  /** 與 data 相同 key 集合之顯示順序：依 game_vector.sort ASC、code ASC */
  dataKeyOrder?: string[];
}

/**
 * key 僅為 game_vec.code（該 gameType 對應分頁下之向量），value = 該群遊戲列表
 */
export type GameHomeResultData = {[key: string]: GameResultList};

/**
 * id 與 code 擇一必填（優先 id）
 */
export interface GameHomeTabGetInput {
  /** （選填）分頁主鍵 id（與 code 擇一，優先使用 id） */
  id?: string;
  /** （選填）分頁代碼（與 id 擇一） */
  code?: string;
}

/**
 * 單一主頁分頁（game_home_tab）與該分頁下 vec code 列表
 */
export interface GameHomeTabItem {
  code?: string;
  sort?: number;
  state?: string;
  vecCodes?: GameHomeVecCodeItem[];
  gameTypes?: string[];
  genres?: string[];
}

export interface GameHomeTabListResult {
  data?: GameHomeTabItem[];
}

/**
 * home_tab/show：僅啟用分頁之 code、sort（順序同 DB：sort ASC）
 */
export interface GameHomeTabShowItem {
  code?: string;
  sort?: number;
}

export interface GameHomeTabShowResult {
  data?: GameHomeTabShowItem[];
}

/**
 * （必填）>0 為更新，<=0 為新增
 */
export interface GameHomeTabUpsertInput {
  /** （選填）>0 為更新；0、不帶或 <=0 為新增 */
  id?: string;
  /** （新增必填）分頁 code（= GSI gameType）；更新時忽略此欄 */
  code?: string;
  /** （選填）排序序號（小者前）；未傳時新建預設 0、更新沿用既有 */
  sort?: number;
  /** （選填）active / inactive；未傳時新建預設 active、更新沿用既有 */
  state?: string;
  /** 允許的 db.game.type；空陣列表示清空 */
  gameTypes?: string[];
  /** 允許的 db.game.genre；空陣列表示清空 */
  genres?: string[];
  /** （選填）稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface GameHomeTabUpsertResult {
  id?: string;
}

/**
 * 主頁分頁下單一 game_vector：name 為 code，state 為 active / inactive
 */
export interface GameHomeVecCodeItem {
  name?: string;
  state?: string;
}

/**
 * GameHome 回傳用的簡化向量資料
 */
export interface GameHomeVecResult {
  id?: string;
  name?: string;
  homeTab?: string;
  parentId?: string;
  descriptions?: GameHomeVecResultDescriptions;
  images?: GameHomeVecResultImages;
  properties?: GameHomeVecResultProperties;
  gameCount?: number;
  gameIds?: string[];
}

export type GameHomeVecResultDescriptions = {[key: string]: string};

export type GameHomeVecResultImages = {[key: string]: string};

export type GameHomeVecResultProperties = {[key: string]: string};

export interface GameListInput {
  /** （選填）遊戲名稱關鍵字（LIKE）；可用逗號分隔多值 */
  name?: string;
  /** （選填）狀態過濾：active / inactive；可用逗號分隔多值 */
  state?: string;
  /** （選填）遊戲商代碼過濾；可用逗號分隔多值 */
  providerCode?: string;
  /** （選填）遊戲 UI 分類（db.game.type），與 GameResult.type 相同；合法值同 GameTypeList（perya, slot, casino, egame, sport, bingo）。
   可用逗號分隔多值（IN）。查「未設定」（NULL）請傳保留字 __unset__（大小寫不敏感）；可與合法 type 並列，例如 slot,__unset__ */
  gameType?: string;
  /** （選填）頁碼，未傳時由服務端預設 */
  page?: number;
  /** （選填）每頁筆數，未傳時由服務端預設 */
  pageSize?: number;
}

export interface GameListResult {
  total?: number;
  data?: GameResult[];
}

export interface GameProviderListInput {
  /** （選填）遊戲商名稱關鍵字（LIKE） */
  name?: string;
  /** （選填）狀態過濾：active / inactive */
  state?: string;
  /** （選填）遊戲商代碼（精準或關鍵字） */
  code?: string;
  /** （選填）頁碼，未傳時由服務端預設 */
  page?: number;
  /** （選填）每頁筆數，未傳時由服務端預設 */
  pageSize?: number;
}

export interface GameProviderListResult {
  total?: number;
  data?: GameProviderResult[];
}

export interface GameProviderResult {
  id?: string;
  code?: string;
  name?: string;
  state?: string;
  isTest?: boolean;
  endpointCurrency?: string;
}

export interface GameRankingItemInput {
  /** （必填）遊戲 ID */
  gameId: string;
  /** 多語系標題 */
  titles?: GameRankingItemInputTitles;
  /** 多語系短描述（teaser） */
  descriptions?: GameRankingItemInputDescriptions;
}

/**
 * 多語系短描述（teaser）
 */
export type GameRankingItemInputDescriptions = {[key: string]: string};

/**
 * 多語系標題
 */
export type GameRankingItemInputTitles = {[key: string]: string};

export interface GameRankingListInput {
  /** （選填）租戶 id；未傳時以登入租戶為準 */
  tenantId?: string;
}

export interface GameRankingListResult {
  data?: GameRankingResult[];
  total?: number;
}

/**
 * 整表批次覆寫：items 陣列順序即為排名（1-based），未列出的既有遊戲視為移除
 */
export interface GameRankingMutateInput {
  /** （選填）租戶 id；未傳或 0 時以登入租戶為準；帶入非登入租戶的值會被拒絕（tenant_id mismatch） */
  tenantId?: string;
  items?: GameRankingItemInput[];
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface GameRankingResult {
  /** 排名（1起，值越小越前面；由陣列順序決定） */
  rank?: number;
  gameId?: string;
  /** 多語系標題 */
  titles?: GameRankingResultTitles;
  /** 多語系短描述（teaser） */
  descriptions?: GameRankingResultDescriptions;
  /** 遊戲基本資訊，供後台預覽 */
  game?: GameResult;
}

/**
 * 多語系短描述（teaser）
 */
export type GameRankingResultDescriptions = {[key: string]: string};

/**
 * 多語系標題
 */
export type GameRankingResultTitles = {[key: string]: string};

export interface GameResult {
  /** 遊戲 ID */
  id?: string;
  /** 遊戲提供商代碼 */
  providerCode?: string;
  /** 遊戲代碼 */
  code?: string;
  /** 遊戲類型 */
  genre?: string;
  /** 遊戲 UI 分類（db.game.type ENUM）：perya / slot / casino / egame / sport / bingo；未設定時回空字串（DB 為 NULL） */
  type?: string;
  /** 排序權重 */
  weight?: number;
  /** 多語系名稱，簡介 */
  descriptions?: GameResultDescriptions;
  /** 多語系，多尺寸圖片 */
  images?: GameResultImages;
  /** 其他屬性, 如顯示模式 */
  properties?: GameResultProperties;
  /** 統計數據 */
  statistics?: GameResultStatistics;
  /** 遊戲狀態 */
  state?: string;
  /** 是否開放 */
  isOpen?: boolean;
  /** 建立時間 */
  crtTime?: string;
  /** 更新時間 */
  updTime?: string;
  /** 是否測試環境 */
  isTest?: boolean;
  /** 同步時間 */
  syncTime?: string;
  /** 僅 GameHome 等情境：該遊戲在所屬 game_vector 內之 game_vector_relation.order（群組內排序，1 起） */
  vectorRelationOrder?: number;
  /** 是否支援 Buy Bonus */
  haveBuyBonus?: boolean;
  /** 是否僅 staff 玩家可見/啟動 */
  staffTestOnly?: boolean;
  /** RTP 基點（0-10000，9600=96%）；供 Status Points 計算 hold rate */
  rtpBps?: number;
  /** 是否 VIP 桌台（Bonus Peso 資格） */
  isVipTable?: boolean;
  /** 實體桌號（如 S1 / V1 / MF1）；目前僅 ITAM 有 hardcode 對照，其餘 provider 回空字串 */
  table?: string;
}

/**
 * 多語系名稱，簡介
 */
export type GameResultDescriptions = {[key: string]: string};

/**
 * 多語系，多尺寸圖片
 */
export type GameResultImages = {[key: string]: string};

/**
 * GameHome data 中每個 game_vec.code 對應一組遊戲列表
 */
export interface GameResultList {
  games?: GameResult[];
}

/**
 * 其他屬性, 如顯示模式
 */
export type GameResultProperties = {[key: string]: string};

/**
 * 統計數據
 */
export type GameResultStatistics = {[key: string]: string};

export interface GameSyncInput {
  /** （必填）遊戲商代碼（例如 jl / evo） */
  providerCode: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

/**
 * GameTypeListResult db.game.type 允許值（固定順序：perya, slot, casino, egame, sport, bingo；與 model.GameTypesOrdered 一致）
 */
export interface GameTypeListResult {
  data?: string[];
}

export interface GameUpsertInput {
  /** （選填）遊戲 ID；0、不帶或 <=0 為新增，>0 為更新 */
  id?: string;
  /** （必填）遊戲代碼 */
  code: string;
  /** （必填）遊戲提供商代碼 */
  providerCode: string;
  /** （必填）遊戲分類 genre：live/lottery/chain/elec/chess/sport/slot/mini/fish/bingo/perya */
  genre: string;
  /** （選填）遊戲 UI 分類（db.game.type ENUM）：perya / slot / casino / egame / sport / bingo；未傳或空字串為 NULL（未設定） */
  type?: string;
  /** （必填）遊戲狀態，active / inactive */
  state: string;
  /** （選填）排序權重，未傳時保留原值，新建預設為 0 */
  weight?: number;
  /** （必填）是否開放 */
  isOpen?: boolean;
  /** （選填）空值會保留既有，多語系名稱與簡介：en/zh-TW/zh-CN */
  descriptions?: GameUpsertInputDescriptions;
  /** （選填）空值會保留既有，多語系與多尺寸圖片：imgVertEn/imgRectEn/imgWideEn, imgVertCn/imgRectCn/imgWideCn */
  images?: GameUpsertInputImages;
  /** （選填）空值會保留既有，自訂屬性 */
  properties?: GameUpsertInputProperties;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
  /** （選填）是否支援 Buy Bonus，未傳時更新保留原值，新建預設 false */
  haveBuyBonus?: boolean;
  /** （選填）是否僅 staff 玩家可見/啟動；更新時未傳則保留原值 */
  staffTestOnly?: boolean;
  /** （選填）RTP 基點（0-10000，9600=96%）；更新時未傳則保留原值，新建預設 0 */
  rtpBps?: number;
  /** （選填）是否 VIP 桌台（Bonus Peso 資格）；更新時未傳則保留原值，新建預設 false */
  isVipTable?: boolean;
}

/**
 * （選填）空值會保留既有，多語系名稱與簡介：en/zh-TW/zh-CN
 */
export type GameUpsertInputDescriptions = {[key: string]: string};

/**
 * （選填）空值會保留既有，多語系與多尺寸圖片：imgVertEn/imgRectEn/imgWideEn, imgVertCn/imgRectCn/imgWideCn
 */
export type GameUpsertInputImages = {[key: string]: string};

/**
 * （選填）空值會保留既有，自訂屬性
 */
export type GameUpsertInputProperties = {[key: string]: string};

export interface GameVector {
  id?: string;
  tenantId?: string;
  code?: string;
  state?: string;
  homeTab?: string;
  sort?: number;
  parentId?: string;
  hint?: string;
  expr?: string;
  /** 多語系名稱 */
  descriptions?: GameVectorDescriptions;
  /** 多語系，多尺寸圖片 */
  images?: GameVectorImages;
  /** 其他屬性, 如顯示模式 */
  properties?: GameVectorProperties;
  gameCount?: number;
  games?: GameResult[];
}

/**
 * 依 game_vector.id 批次更新向量欄位（選填）與完整 relation 清單；回傳同 relation/list_by_vec
 */
export interface GameVectorBundleUpsertInput {
  /** （必填）game_vector 主鍵 */
  id: string;
  /** （選填）更新 code；未傳則不改 */
  vecCode?: string;
  /** （選填）active / inactive；未傳則不改 */
  vecState?: string;
  /** （選填）排序（小者前）；未傳則不改 */
  vecSort?: number;
  /** 有送且非空：完整關聯清單；relation.sort 須 >0，後端正規化為 1..n；未列者刪除。未送或空陣列：不異動關聯 */
  relations?: GameVectorRelationSortItem[];
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

/**
 * 多語系名稱
 */
export type GameVectorDescriptions = {[key: string]: string};

export interface GameVectorEvaluateInput {
  /** （必填）game_vector 主鍵 ID */
  id: string;
  /** （必填）是否把 expr 計算結果寫回 relation */
  persisted?: boolean;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

/**
 * 多語系，多尺寸圖片
 */
export type GameVectorImages = {[key: string]: string};

export interface GameVectorListInput {
  /** （選填）頁碼，未傳時由服務端預設 */
  page?: number;
  /** （選填）每頁筆數，未傳時由服務端預設 */
  pageSize?: number;
  /** （選填）租戶 id 清單（目前多以登入租戶為準） */
  tenantIds?: string[];
  /** （選填）父節點 id；0 表示不使用此條件 */
  parentId?: string;
  /** （選填）狀態過濾：active / inactive（可多值） */
  states?: string[];
  /** （選填）主頁分頁過濾（對應 game_vector.home_tab） */
  homeTabs?: string[];
  /** （選填）關鍵字（目前主要用於 code 的 like/equal 過濾） */
  keywords?: string[];
}

export interface GameVectorListResult {
  data?: GameVector[];
  total?: number;
}

export interface GameVectorMutateInput {
  /** （必填）game_vector 主鍵 ID */
  id: string;
  /** （必填）完整遊戲 id 清單；順序即 relation.order（1-based） */
  gameIds?: string[];
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

/**
 * 其他屬性, 如顯示模式
 */
export type GameVectorProperties = {[key: string]: string};

/**
 * 新增單筆 game_vector_relation（以 game_vector.id 為主）
 */
export interface GameVectorRelationCreateInput {
  /** 必填，game_vector 主鍵 ID */
  id: string;
  /** 必填，要新增到群組的遊戲 ID */
  gameId: string;
  /** 選填，插入位置（1-based）；未填或 <=0 則附加到最後 */
  order?: number;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

/**
 * 刪除單筆 game_vector_relation（以 game_vector.id + game_id）
 */
export interface GameVectorRelationDeleteInput {
  /** 必填，game_vector 主鍵 ID */
  id: string;
  /** 必填，要從群組移除的遊戲 ID */
  gameId: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

/**
 * 依租戶 + game_vector.code + game_vector.home_tab 查詢關聯列與遊戲摘要
 */
export interface GameVectorRelationListByVecInput {
  /** （必填）向量代碼 */
  code: string;
  /** （必填）主頁分頁（對應 game_vector.home_tab） */
  homeTab: string;
}

export interface GameVectorRelationListByVecResult {
  vector?: GameVectorRelationVecInfo;
  data?: GameVectorRelationRow[];
}

export interface GameVectorRelationRow {
  gameId?: string;
  /** 對應 DB game_vector_relation.order（群組內排序，1 起） */
  sort?: number;
  providerCode?: string;
  gameCode?: string;
  descriptions?: GameVectorRelationRowDescriptions;
  images?: GameVectorRelationRowImages;
  /** 實體桌號（如 S1 / V1 / MF1）；目前僅 ITAM 有 hardcode 對照，其餘 provider 回空字串 */
  table?: string;
}

export type GameVectorRelationRowDescriptions = {[key: string]: string};

export type GameVectorRelationRowImages = {[key: string]: string};

export interface GameVectorRelationSortItem {
  gameId?: string;
  /** 相對順序，必須 >0 */
  sort?: number;
}

export interface GameVectorRelationVecInfo {
  id?: string;
  sort?: number;
  code?: string;
  homeTab?: string;
  state?: string;
}

/**
 * 單筆調整遊戲在陣列內的排序（目標位置 1 起算，且不可大於目前關聯筆數）
 */
export interface GameVectorReorderInput {
  /** 必填，game_vector 主鍵 ID */
  id: string;
  /** 必填，要移動的遊戲 ID（須已存在於該陣列關聯） */
  gameId: string;
  /** 必填，目標排序位置（1-based，最大為目前關聯列數） */
  order: number;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface GameVectorUpsertInput {
  /** （選填）向量 id；0 或不帶為新增，>0 為更新 */
  id?: string;
  /** （選填）租戶 id；0 時由後端以登入租戶補入 */
  tenantId?: string;
  /** （必填）向量代碼（同租戶需唯一） */
  code: string;
  /** （必填）狀態：active / inactive */
  state?: string;
  /** （必填）主頁分頁（對應 game_vector.home_tab） */
  homeTab: string;
  /** （選填）排序序號（小者前） */
  sort?: number;
  /** （選填）父節點 id；0 代表無父節點 */
  parentId?: string;
  /** （選填）語法提示；實作端可能覆寫 */
  hint?: string;
  /** （選填）表達式；有傳時會先做語法驗證 */
  expr?: string;
  /** 多語系名稱 */
  descriptions?: GameVectorUpsertInputDescriptions;
  /** 多語系，多尺寸圖片 */
  images?: GameVectorUpsertInputImages;
  /** 其他屬性, 如顯示模式 */
  properties?: GameVectorUpsertInputProperties;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

/**
 * 多語系名稱
 */
export type GameVectorUpsertInputDescriptions = {[key: string]: string};

/**
 * 多語系，多尺寸圖片
 */
export type GameVectorUpsertInputImages = {[key: string]: string};

/**
 * 其他屬性, 如顯示模式
 */
export type GameVectorUpsertInputProperties = {[key: string]: string};

export interface GenRescueOtpInput {
  /** 必填：手機號碼（國際格式，例如 +63917123456） */
  identifier: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface GenRescueOtpResult {
  /** 6-digit rescue OTP code. */
  code?: string;
  /** expiry time in RFC3339 format */
  expiresAt?: string;
}

export interface GenerateRebateBonusForPeriodInput {
  /** 必填。handler 檢查 periodTime == "" 即回 ErrInvalidParam */
  periodTime: string;
  bonusCycle?: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface GetOtpCodeInput {
  /** 必填：OTP 動作
   - "mstkey": 主控碼模式（僅 dev/test/uat 等環境）
   - "auth": 一般登入驗證 */
  action: string;
  /** 選填：玩家 ID
   - playerId / identifier 至少需要填一個 */
  playerId?: string;
  /** 選填：手機號碼（國際格式，例如 +63917123456）
   - playerId / identifier 至少需要填一個 */
  identifier?: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface GetOtpCodeResult {
  code?: string;
}

export interface GetPlayerPromotionInput {
  /** 必填。玩家方案 ID */
  id: string;
}

export interface GetPlayerPromotionResult {
  playerPromotion?: PlayerPromotion;
}

export interface GetPromotionInput {
  /** 必填。方案 ID */
  id: string;
}

export interface GetPromotionResult {
  promotion?: Promotion;
}

/**
 * 某 action 的跨日合計
 */
export interface GobisReconActionTotal {
  /** Gobis action */
  action?: string;
  /** 筆數合計 */
  txnCount?: string;
  /** 金額合計(單位:分) */
  amount?: string;
}

/**
 * 對帳逐筆鑽取 Input
 */
export interface GobisReconDetailListInput {
  /** 必填。營運日,格式 YYYY-MM-DD(action=PENDING_AGED 時忽略——該 action 為 as-of-now) */
  gamingDay: string;
  /** 必填。action(BET/WIN/WIN_HB_CONT/CANCEL/ROLLBACK/JACKPOT/PENDING_AGED) */
  action: string;
  /** 選填。篩選遊戲供應商代碼 */
  provider?: string;
  /** 選填。篩選玩家 ID */
  playerId?: string;
  /** 選填。以 Gobis 的 Transaction ID 精確回查(= 我方 ext_txn_id;hb 續玩為 transfer_ext_id) */
  extTxnId?: string;
  /** 選填。分頁頁碼,從 1 開始 */
  page?: number;
  /** 選填。每頁筆數,0=預設 100,-1=全部(大窗口慎用) */
  pageSize?: number;
}

/**
 * 對帳逐筆鑽取結果
 */
export interface GobisReconDetailListResult {
  /** 符合條件的總筆數(已套與彙總相同的口徑,含 jl 摺疊) */
  total?: string;
  /** 本頁資料列表 */
  data?: GobisReconDetailRow[];
  /** 符合條件的金額合計(單位:分)——非本頁合計,而是全體合計 */
  totalAmount?: string;
  /** 該營運日實際採用的 UTC 窗口(PENDING_AGED 不適用,回傳空值) */
  windowFrom?: string;
  windowTo?: string;
}

/**
 * 對帳逐筆鑽取每列
 */
export interface GobisReconDetailRow {
  /** 列 ID(注單 id;WIN_HB_CONT 為 txn_wager_continuation.id) */
  rowId?: string;
  /** 遊戲供應商代碼 */
  provider?: string;
  /** 對 Gobis 的 Transaction ID */
  extTxnId?: string;
  /** 遊戲商局號 */
  extRoundCode?: string;
  /** 玩家 ID */
  playerId?: string;
  /** 該 action 的時點(BET=bet_time、WIN/JACKPOT=settle_time、CANCEL/ROLLBACK=cancel_time、
   WIN_HB_CONT=crt_time、PENDING_AGED=bet_time) */
  occurTime?: string;
  /** 金額(單位:分,2 位精度;與彙總同口徑) */
  amount?: string;
  /** 金額原始儲存值(該列自身 precision 的最小單位,供追查精度問題) */
  amountStored?: string;
}

/**
 * 對帳彙總查詢 Input
 */
export interface GobisReconSummaryListInput {
  /** 必填。起始營運日(含),格式 YYYY-MM-DD */
  gamingDayFrom: string;
  /** 選填。結束營運日(含),格式 YYYY-MM-DD;未給則等於 gamingDayFrom(單日查詢) */
  gamingDayTo?: string;
  /** 選填。篩選遊戲供應商代碼(如 jl、st8、itam) */
  provider?: string;
  /** 選填。篩選 action;未給回傳全部 action */
  action?: string;
  /** 選填。資料來源:snapshot(預設,讀每日快照,快)| live(即時由 VIEW 重算,慢但反映當下)
   live 不含 PENDING_AGED(該 action 無營運日窗口語意,僅快照有基準值) */
  source?: string;
}

/**
 * 對帳彙總查詢結果
 */
export interface GobisReconSummaryListResult {
  /** 符合條件的列數 */
  total?: string;
  /** 本次資料列表(依 營運日 DESC、provider、action 排序;不分頁——維度數量有限) */
  data?: GobisReconSummaryRow[];
  /** 實際採用的資料來源(snapshot / live) */
  source?: string;
  /** 各 action 的跨日合計(供頁面表頭顯示) */
  actionTotals?: GobisReconActionTotal[];
}

/**
 * 對帳彙總每列
 */
export interface GobisReconSummaryRow {
  /** 營運日(YYYY-MM-DD) */
  gamingDay?: string;
  /** 遊戲供應商代碼 */
  provider?: string;
  /** Gobis action(BET/WIN/WIN_HB_CONT/CANCEL/ROLLBACK/JACKPOT/PENDING_AGED) */
  action?: string;
  /** 筆數(WIN 已套 jl 兄弟卡摺疊) */
  txnCount?: string;
  /** 金額(單位:分,2 位精度) */
  amount?: string;
  /** 該營運日實際採用的 UTC 窗口起(含) */
  windowFrom?: string;
  /** 該營運日實際採用的 UTC 窗口迄(不含) */
  windowTo?: string;
}

export interface IdInput {
  id: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log，不更新業務表） */
  opsRemark?: string;
}

export interface ListPlayerPromotionsInput {
  /** 必填。租戶 ID */
  tenantId?: string;
  /** 選填。頁碼 */
  page?: number;
  /** 選填。每頁筆數 */
  pageSize?: number;
  /** 選填。玩家 ID 篩選 */
  playerId?: string;
  /** 選填。方案 ID 篩選 */
  promotionId?: string;
  /** 選填。玩家方案狀態篩選。允許值：unspecified | active | completed | cancelled | failed */
  state?: string;
  /** 選填。是否含已刪除 */
  includeDeleted?: boolean;
  /** 選填。建立時間下限（可單邊傳入；缺省時後端補預設值；字串格式同 TxnLedgerList timeFrom） */
  crtTimeFrom?: string;
  /** 選填。建立時間上限（可單邊傳入；缺省時後端補預設值） */
  crtTimeTo?: string;
  /** 選填。玩家代碼篩選（對應 player.code；語意同 player_session list 之 playerCode） */
  playerCode?: string;
  /** 選填。手機號碼篩選（對應 player.mobile） */
  mobile?: string;
  /** 選填。方案類型篩選（對應 promotion.type）。允許值：normal | gig_migration | leaderboard | fasttrack | daily；未傳或空表示不篩選
   （注意：促銷主檔已軟刪之紀錄在帶入此過濾時會被排除，未帶時仍會列出且 promotionName 為空） */
  promoType?: string;
  /** 選填。玩家方案狀態多值篩選（OR，SQL IN）。允許值同 state；提供時優先於單值 state */
  states?: string[];
}

export interface ListPlayerPromotionsResult {
  data?: PlayerPromotion[];
  total?: number;
}

export interface ListPromotionsInput {
  /** 選填。頁碼，預設 1 */
  page?: number;
  /** 選填。每頁筆數，預設 100；-1 表示不限制 */
  pageSize?: number;
  /** 選填。方案狀態篩選。允許值：unspecified | active | inactive */
  state?: string;
  /** 選填。目標遊戲類別篩選（對應 db.game.type）；與方案 target_game_types 有交集即命中；未設定限制的方案亦會列出 */
  targetGameTypes?: string[];
  /** 選填。方案類型篩選。允許值：normal | gig_migration | leaderboard | fasttrack；未傳或空表示不篩選 */
  promoType?: string;
}

export interface ListPromotionsResult {
  data?: Promotion[];
  total?: number;
}

/**
 * ManualDistributeRebateInput 手動派發返水獎勵
 */
export interface ManualDistributeRebateInput {
  /** 必填。handler 檢查 len(playerBonusIds) == 0 即回 ErrInvalidParam */
  playerBonusIds: string[];
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface MessagingAppProviderEntry {
  providerCode?: string;
  priority?: number;
}

export interface MessagingAppProviderGetResult {
  appCode?: string;
  data?: MessagingAppProviderEntry[];
}

export interface MessagingAppProviderSetInput {
  /** 必填。handler 檢查 appCode == "" 即回 ErrInvalidParam */
  appCode: string;
  data?: MessagingAppProviderEntry[];
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface MessagingProviderCodeInput {
  /** 必填。MessagingAppProviderGet 以此為唯一查詢鍵 (app_code) */
  code: string;
}

export interface MessagingProviderListResult {
  total?: number;
  data?: MessagingProviderResult[];
}

export interface MessagingProviderResult {
  code?: string;
  name?: string;
  state?: string;
  endpoint?: string;
  apiKey?: string;
  apiSecret?: string;
  smsFrom?: string;
  viberFrom?: string;
  smsFromMarketing?: string;
}

export interface MessagingProviderUpsertInput {
  /** 必填。handler 檢查 code == "" 即回 ErrInvalidParam */
  code: string;
  name?: string;
  state?: string;
  endpoint?: string;
  apiKey?: string;
  apiSecret?: string;
  smsFrom?: string;
  viberFrom?: string;
  /** 行銷簡訊發送者(如 FUNaloMAXPH);空則行銷簡訊 fallback 回 smsFrom */
  smsFromMarketing?: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export type MgtServiceCronSchedulerEnqueueParams = {
/**
 * 必填。排程項目 ID（指定要 enqueue 的 scheduler entry，必要查詢鍵）
 */
id?: string;
};

export interface Noop { [key: string]: unknown }

export interface OperationalStat {
  /** all money related fields are presented in cent */
  income?: number;
  registerUsersCnt?: number;
  firstDepositAmt?: number;
  firstDepositUserCnt?: number;
  secondDepositAmt?: number;
  secondDepositUserCnt?: number;
  thirdDepositAmt?: number;
  thirdDepositUserCnt?: number;
  totalDepositAmt?: number;
  totalDepositUserCnt?: number;
  totalWithdrawalAmt?: number;
  totalWithdrawalUserCnt?: number;
  totalWithdrawalCnt?: number;
}

export interface OperationalStatResult {
  today?: OperationalStat;
  yesterday?: OperationalStat;
  week?: OperationalStat;
  month?: OperationalStat;
}

export interface PageDivListInput {
  page?: number;
  pageSize?: number;
  pageId?: string;
  lang?: string;
}

export interface PageDivListResult {
  total?: number;
  data?: PageDivResult[];
}

export interface PageDivResult {
  id?: string;
  pageId?: string;
  weight?: number;
  lang?: string;
  link?: string;
  html?: string;
  descriptions?: PageDivResultDescriptions;
  images?: PageDivResultImages;
  prop?: PageDivResultProp;
}

export type PageDivResultDescriptions = {[key: string]: string};

export type PageDivResultImages = {[key: string]: string};

export type PageDivResultProp = {[key: string]: string};

export interface PageDivUpsertInput {
  /** 選填。0 或不帶 = 新增, >0 = 更新 */
  id?: string;
  /** 必填。所屬頁面 ID（必要寫入鍵） */
  pageId: string;
  weight?: number;
  lang?: string;
  link?: string;
  html?: string;
  descriptions?: PageDivUpsertInputDescriptions;
  images?: PageDivUpsertInputImages;
  prop?: PageDivUpsertInputProp;
  /** （選填）稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export type PageDivUpsertInputDescriptions = {[key: string]: string};

export type PageDivUpsertInputImages = {[key: string]: string};

export type PageDivUpsertInputProp = {[key: string]: string};

export interface PageListInput {
  page?: number;
  pageSize?: number;
  refType?: string;
  refId?: string;
  slug?: string;
  name?: string;
  state?: string;
}

export interface PageListResult {
  total?: number;
  data?: PageResult[];
}

export interface PageResult {
  id?: string;
  tenantId?: string;
  refType?: string;
  refId?: string;
  slug?: string;
  name?: string;
  state?: string;
  divs?: PageDivResult[];
}

export interface PageUpsertInput {
  /** 選填。0 或不帶 = 新增, >0 = 更新 */
  id?: string;
  tenantId?: string;
  refType?: string;
  refId?: string;
  /** 必填。頁面 slug（自然鍵）；新增時空值會被拒絕 */
  slug: string;
  name?: string;
  state?: string;
  /** （選填）稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

/**
 * PaymentAmountLimitListInput 查詢租戶入出金限額列表。
 tenantId 為 0 時取當前 admin session 的租戶。
 */
export interface PaymentAmountLimitListInput {
  tenantId?: string;
}

export interface PaymentAmountLimitListResult {
  data?: PaymentAmountLimitResult[];
  total?: string;
}

/**
 * PaymentAmountLimitResult 租戶入出金單筆金額限制（單位：分）。
 以 (tenantId, currency) 為唯一鍵；tenantId=0 為全站預設，可依租戶覆寫。
 */
export interface PaymentAmountLimitResult {
  id?: string;
  crtTime?: string;
  updTime?: string;
  tenantId?: string;
  currency?: string;
  firstSuccessThreshold?: string;
  depositMinBefore?: string;
  depositMinAfter?: string;
  depositMax?: string;
  withdrawMin?: string;
  withdrawMax?: string;
}

/**
 * PaymentAmountLimitUpsertInput 新增/更新某幣別的入出金限額（整表單覆蓋）。
 tenantId 為 0 時取當前 admin session 的租戶；currency 必填，提交即覆蓋全部限額欄位。
 */
export interface PaymentAmountLimitUpsertInput {
  tenantId?: string;
  /** 必填。幣別 */
  currency: string;
  firstSuccessThreshold?: string;
  depositMinBefore?: string;
  depositMinAfter?: string;
  depositMax?: string;
  withdrawMin?: string;
  withdrawMax?: string;
  /** （選填）稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

/**
 * PaymentEntry 支付入口（對應 payment_entry 表）
 */
export interface PaymentEntry {
  id?: string;
  crtTime?: string;
  updTime?: string;
  code?: string;
  state?: string;
  name?: string;
  currency?: string;
  isTest?: boolean;
  weight?: number;
  providerCode?: string;
  images?: PaymentEntryImages;
  /** entry 層級開關：可在 provider 預設能力基礎上進一步關閉 */
  depositEnabled?: boolean;
  withdrawEnabled?: boolean;
  isAccountNumber?: boolean;
  entryType?: string;
}

export interface PaymentEntryDeleteInput {
  /** 必填。handler 檢查 id == "" 即回 ErrInvalidParam */
  id: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface PaymentEntryGetInput {
  /** 必填。handler 檢查 id == "" 即回 ErrInvalidParam */
  id: string;
}

export type PaymentEntryImages = {[key: string]: string};

export interface PaymentEntryListInput {
  code?: string;
  state?: string;
  providerCode?: string;
  isTest?: boolean;
  page?: number;
  pageSize?: number;
  /** 選填。依 payment_entry.entry_type 過濾（e-wallet / local_bank / partner_bank）。
   未帶或空字串不過濾。legacy 值 wallet / bank 會正規化成 e-wallet / local_bank。 */
  entryType?: string;
}

export interface PaymentEntryListResult {
  total?: number;
  data?: PaymentEntry[];
}

export interface PaymentEntryUpsertInput {
  /** 選填。空字串或不帶 = 新增, 非空 = 更新 */
  id?: string;
  /** 必填。handler 檢查 code == "" 即回 ErrInvalidParam */
  code: string;
  state?: string;
  name?: string;
  currency?: string;
  isTest?: boolean;
  weight?: number;
  /** 必填。handler 檢查 providerCode == "" 即回 ErrInvalidParam */
  providerCode: string;
  images?: PaymentEntryUpsertInputImages;
  /** 選填；未傳時新增預設 true、更新則維持既有值 */
  depositEnabled?: boolean;
  withdrawEnabled?: boolean;
  isAccountNumber?: boolean;
  entryType?: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export type PaymentEntryUpsertInputImages = {[key: string]: string};

export interface PaymentEntryUpsertResult {
  id?: string;
}

/**
 * PaymentProvider 支付提供商（對應 payment_provider 表）
 */
export interface PaymentProvider {
  id?: string;
  code?: string;
  state?: string;
  name?: string;
  isTest?: boolean;
}

export interface PaymentProviderListInput {
  code?: string;
  state?: string;
  isTest?: boolean;
  page?: number;
  pageSize?: number;
}

export interface PaymentProviderListResult {
  total?: number;
  data?: PaymentProvider[];
}

export interface PaymentStatusUpdateInput {
  correlationId?: string;
  status?: string;
  amount?: number;
  currencyCode?: string;
  partnerName?: string;
  referenceNo?: string;
  startTime?: string;
  endTime?: string;
  metadata?: PaymentStatusUpdateInputMetadata;
}

export type PaymentStatusUpdateInputMetadata = {[key: string]: string};

export interface PaymentStatusUpdateResult {
  amount?: number;
  currency?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
}

export interface PlayerAccountNoteChange {
  field?: string;
  label?: string;
  old?: string;
  new?: string;
}

/**
 * PlayerAccountNoteCreateInput creates a manual account note (opsAction=mgtAddNote).
 */
export interface PlayerAccountNoteCreateInput {
  /** 玩家 ID（必填） */
  playerId: string;
  /** 備註內容（必填，最多 1000 字元） */
  remark: string;
  /** 選填：過期時間（RFC3339）；未設定表示永久有效 */
  expireTime?: string;
}

export interface PlayerAccountNoteCreateResult {
  id?: string;
}

export interface PlayerAccountNoteEntry {
  id?: string;
  crtTime?: string;
  adminCode?: string;
  summary?: string;
  remark?: string;
  resource?: string;
  verb?: string;
  opsAction?: string;
  changes?: PlayerAccountNoteChange[];
  /** 選填：備註過期時間（RFC3339）；未設定表示永久有效 */
  expireTime?: string;
}

/**
 * PlayerAccountNoteListInput lists admin ops logs for a single player (account notes tab).
 */
export interface PlayerAccountNoteListInput {
  /** 玩家 ID（必填） */
  playerId?: string;
  /** 選填：頁碼（0=預設1；-1=全部） */
  page?: number;
  /** 選填：每頁筆數（0=預設100；-1=全部） */
  pageSize?: number;
  /** 選填：schema v1 resource（例：player、player_wallet、kyc） */
  resource?: string;
  /** 選填：建立時間起（RFC3339） */
  timeFrom?: string;
  /** 選填：建立時間迄（RFC3339） */
  timeTo?: string;
}

export interface PlayerAccountNoteListResult {
  total?: string;
  data?: PlayerAccountNoteEntry[];
}

export interface PlayerBetHistoryItem {
  id?: string;
  /** 下注時間 */
  dateTime?: string;
  /** 會話ID */
  sessionId?: string;
  /** 遊戲局數編號(Round ID) */
  extRoundId?: string;
  /** 遊戲名稱（多語系 map） */
  gameName?: PlayerBetHistoryItemGameName;
  /** 遊戲廠商代碼 */
  gameProvider?: string;
  /** 投注金額(單位:分) */
  betAmt?: string;
  /** 有效投注(單位:分) */
  validBetAmt?: string;
  /** 派彩(Bet-Win)(單位:分) */
  payout?: string;
  /** 幣別(PHP / Bonus) */
  coinType?: string;
  /** 錢包變動金額(單位:分) */
  walletAmount?: string;
  /** 紅利變動金額(單位:分) */
  bonusAmount?: string;
  /** 錢包餘額(單位:分) */
  walletBalance?: string;
  /** 紅利餘額(單位:分) */
  bonusBalance?: string;
  /** 備註 */
  remark?: string;
  /** 投注狀態(normal, result, cancel, error) */
  betState?: string;
}

/**
 * 遊戲名稱（多語系 map）
 */
export type PlayerBetHistoryItemGameName = {[key: string]: string};

export interface PlayerBetHistoryListInput {
  /** 玩家 ID（必填） */
  playerId: string;
  /** 頁碼（選填，0 或未傳則由後端預設） */
  page?: number;
  /** 每頁筆數（選填，0 或未傳則由後端預設；-1 表示不分頁回傳全部） */
  pageSize?: number;
  /** 建立時間起（選填，篩選 txn_wager.crt_time，格式建議 RFC3339） */
  timeFrom?: string;
  /** 建立時間迄（選填，篩選 txn_wager.crt_time，格式建議 RFC3339） */
  timeTo?: string;
  /** 投注狀態（選填，篩選 txn_wager.bet_state；單一值或逗號分隔多值；可加 like: 前綴做模糊） */
  betState?: string;
  /** 遊戲廠商代碼（選填，篩選 txn_wager.game_provider_code；單一值或逗號分隔多值；可加 like: 前綴做模糊） */
  gameProvider?: string;
}

export interface PlayerBetHistoryListResult {
  total?: number;
  data?: PlayerBetHistoryItem[];
}

export interface PlayerBetInfoGetInput {
  /** 玩家 ID（必填） */
  playerId: string;
  /** 遊戲商代號（選填） */
  gamePvdId?: string;
  /** 遊戲類型（選填） */
  gameGenre?: string;
}

export interface PlayerBetInfoGetResult {
  data?: PlayerBetStatResult;
}

export interface PlayerBetStatResult {
  bet?: PlayerFinancialBetDetails;
  betAdj?: PlayerFinancialBetDetails;
  win?: PlayerFinancialBetDetails;
  profit?: PlayerFinancialBetDetails;
}

/**
 * PlayerBonusRebateList 查詢玩家返水獎勵列表
 */
export interface PlayerBonusRebateListInput {
  page?: number;
  pageSize?: number;
  playerId?: string;
  state?: string;
  periodTime?: string;
  bonusCycle?: string;
  mobile?: string;
  /** 選填，玩家代碼（player.code） */
  playerCode?: string;
}

export interface PlayerBonusRebateListResult {
  total?: number;
  data?: PlayerBonusRebateResult[];
}

export interface PlayerBonusRebateResult {
  id?: string;
  playerId?: string;
  playerCode?: string;
  playerMobile?: string;
  bonusId?: string;
  bonusName?: string;
  bonusCycle?: string;
  state?: string;
  prizeValue?: string;
  prizeProperties?: PlayerBonusRebateResultPrizeProperties;
  startTime?: string;
  endTime?: string;
  crtTime?: string;
  updTime?: string;
}

export type PlayerBonusRebateResultPrizeProperties = {[key: string]: string};

/**
 * PlayerBonusRebateUpdate 手動調整返水獎勵金額
 */
export interface PlayerBonusRebateUpdateInput {
  /** 必填。handler 檢查 playerBonus_id == 0 即回 ErrInvalidParam */
  playerBonus_id: string;
  prizeValue?: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

/**
 * 後台更改玩家手機號碼
 */
export interface PlayerChangeMobileInput {
  /** 玩家 ID（必填） */
  playerId: string;
  /** 新手機號碼（必填） */
  mobile: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface PlayerClearWithdrawalReviewInput {
  playerId: string;
  confirm: boolean;
}

/**
 * 後台直接充值（與 gsi deposit 命名一致）
 */
export interface PlayerDepositInput {
  /** 必填，玩家 ID */
  playerId: string;
  /** 必填，金額，單位：分 */
  amount: string;
  /** 必填，幣別，例：PHP */
  currency: string;
  /** 選填，備註；寫入 txn_payment.remark，並同步寫入 admin_ops_log.ops_values.remark（本 Input 無 opsRemark） */
  remark?: string;
}

export interface PlayerDepositTurnoverRow {
  currency?: string;
  total_eligible_deposit_minor?: string;
  required_turnover_minor?: string;
  achieved_turnover_minor?: string;
  remaining_turnover_minor?: string;
}

export interface PlayerFinancialBetDetails {
  /** amt all in USD cent */
  today?: number;
  yesterday?: number;
  sevenDays?: number;
  fifteenDays?: number;
  thirtyDays?: number;
  total?: number;
}

export interface PlayerFinancialInfoGetResult {
  data?: PlayerFinancialInfoResult;
}

export interface PlayerFinancialInfoResult {
  deposit?: PlayerFinancialBetDetails;
  withdraw?: PlayerFinancialBetDetails;
  profit?: PlayerFinancialBetDetails;
  normal?: number;
  bonus?: number;
  point?: string;
}

export interface PlayerGroupListInput {
  page?: number;
  pageSize?: number;
  name?: string;
  state?: string;
  tenant_id?: string;
}

export interface PlayerGroupListResult {
  total?: number;
  data?: PlayerGroupResult[];
}

export interface PlayerGroupResult {
  id?: string;
  crtTime?: string;
  updTime?: string;
  tenantId?: string;
  name?: string;
  state?: string;
  expr?: string;
  hint?: string;
}

export interface PlayerGroupUpsertInput {
  /** 選填。0 或不帶 = 新增, >0 = 更新 */
  id?: string;
  tenantId?: string;
  name?: string;
  state?: string;
  expr?: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface PlayerInfoResult {
  firstName?: string;
  lastName?: string;
  country?: string;
  gender?: string;
  birthday?: string;
  birthPlace?: string;
  nationality?: string;
  city?: string;
  address?: string;
  postalCode?: string;
  incomeSourceId?: string;
  workNatureId?: string;
  email?: string;
  middleName?: string;
}

export interface PlayerInfoUpsertInput {
  /** 玩家 ID（必填） */
  playerId: string;
  /** 名（選填） */
  firstName?: string;
  /** 姓（選填） */
  lastName?: string;
  /** 國家（選填） */
  country?: string;
  /** 性別（選填） */
  gender?: string;
  /** 生日（選填） */
  birthday?: string;
  /** 出生地（選填） */
  birthPlace?: string;
  /** 國籍（選填） */
  nationality?: string;
  /** 城市（選填） */
  city?: string;
  /** 郵遞區號（選填） */
  postalCode?: string;
  /** 收入來源 ID（選填） */
  incomeSourceId?: string;
  /** 工作性質 ID（選填） */
  workNatureId?: string;
  /** 地址（選填） */
  address?: string;
  /** Email（選填） */
  email?: string;
  /** 中間名（選填） */
  middleName?: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

/**
 * PlayerKyc 完整呈現 player_kyc 表欄位
 */
export interface PlayerKyc {
  playerId?: string;
  crtTime?: string;
  updTime?: string;
  applicantId?: string;
  externalUserId?: string;
  inspectionId?: string;
  /** reminder / pending / approved / rejected */
  kycStatus?: string;
  reviewStatus?: string;
  verifiedAt?: string;
  firstName?: string;
  lastName?: string;
  birthday?: string;
  country?: string;
  nationality?: string;
  gender?: string;
  birthPlace?: string;
  city?: string;
  address?: string;
  postalCode?: string;
  docType?: string;
  docNumber?: string;
  docExpiryDate?: string;
  /** SumSub 完整 JSON，後續由 admin role 控制可查看 KYC 的帳號 */
  rawResponse?: string;
  /** 關聯 player 方便顯示 */
  playerCode?: string;
  /** 證件列表 */
  documents?: PlayerKycDocumentSummary[];
  email?: string;
  middleName?: string;
}

export interface PlayerKycDocumentSummary {
  id?: string;
  idDocType?: string;
  idDocSubType?: string;
  filePath?: string;
  isSuccess?: boolean;
  errorMessage?: string;
}

export interface PlayerKycGetInput {
  playerId: string;
}

export interface PlayerKycGetResult {
  data?: PlayerKyc;
}

export interface PlayerKycListInput {
  page?: number;
  pageSize?: number;
  playerId?: string;
  playerCode?: string;
  kycStatus?: string;
}

export interface PlayerKycListResult {
  total?: number;
  data?: PlayerKyc[];
}

export interface PlayerKycResult {
  kycState?: string;
  /** 身份證件正面照預簽名 URL（唯讀） */
  idPicFrontUrl?: string;
  /** 自拍照預簽名 URL（唯讀） */
  selfieUrl?: string;
  /** 身份證件背面照預簽名 URL（唯讀） */
  idPicBackUrl?: string;
  applicantId?: string;
  reviewStatus?: string;
  verifiedAt?: string;
  docType?: string;
  docNumber?: string;
  firstName?: string;
  lastName?: string;
  birthday?: string;
  country?: string;
  nationality?: string;
  gender?: string;
  birthPlace?: string;
  city?: string;
  address?: string;
  postalCode?: string;
  docExpiryDate?: string;
  email?: string;
  middleName?: string;
}

export interface PlayerKycStatusUpdateInput {
  playerId: string;
  /** reminder / pending / approved / rejected */
  kycStatus: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface PlayerKycStatusUpdateResult {
  playerId?: string;
}

export interface PlayerKycSyncInput {
  playerId: string;
}

/**
 * PlayerLabelAssignInput manually assigns a label to a player.
 */
export interface PlayerLabelAssignInput {
  playerId: string;
  labelId: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface PlayerLabelAssignListItem {
  id?: string;
  name?: string;
  remark?: string;
  assignedAt?: string;
  state?: string;
}

export interface PlayerLabelAssignListResult {
  data?: PlayerLabelAssignListItem[];
}

export interface PlayerLabelListInput {
  page?: number;
  pageSize?: number;
  name?: string;
  state?: string;
}

export interface PlayerLabelListResult {
  total?: number;
  data?: PlayerLabelResult[];
}

/**
 * PlayerLabelRemoveInput manually removes a label from a player.
 */
export interface PlayerLabelRemoveInput {
  playerId: string;
  labelId: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface PlayerLabelRestrictionItem {
  id?: string;
  labelId?: string;
  apiPattern?: string;
}

export interface PlayerLabelRestrictionListInput {
  labelId: string;
}

export interface PlayerLabelRestrictionListResult {
  data?: PlayerLabelRestrictionItem[];
}

export interface PlayerLabelRestrictionUpsertInput {
  /** 選填。0 或不帶 = 新增, >0 = 更新 */
  id?: string;
  labelId: string;
  apiPattern: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface PlayerLabelResult {
  id?: string;
  crtTime?: string;
  updTime?: string;
  name?: string;
  state?: string;
  remark?: string;
  permittedRoles?: string[];
}

export interface PlayerLabelUpsertInput {
  /** 選填。0 或不帶 = 新增, >0 = 更新 */
  id?: string;
  name?: string;
  state?: string;
  remark?: string;
  permittedRoles?: string[];
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

/**
 * PlayerLabelsByPlayerInput returns all labels assigned to a player.
 */
export interface PlayerLabelsByPlayerInput {
  playerId: string;
}

export interface PlayerListInput {
  /** 頁碼（選填，預設由後端決定） */
  page?: number;
  /** 每頁筆數（選填，預設由後端決定） */
  pageSize?: number;
  /** 賬號/NickName（選填，playerCode 即 NickName，等值過濾 code/nick） */
  playerCode?: string;
  /** 賬戶狀態（選填） */
  state?: string;
  /** 開戶時間從（選填） */
  timeFrom?: string;
  /** 開戶時間至（選填） */
  timeTo?: string;
  /** 手機號碼 */
  mobile?: string;
  /** 玩家ID */
  id?: string;
  /** KYC申請ID */
  applicantId?: string;
  /** Email */
  email?: string;
  /** 名字和姓氏 */
  firstName?: string;
  lastName?: string;
  /** KYC狀態 */
  kycStatus?: string;
  /** 玩家標籤ID列表 */
  labelIds?: string[];
}

export interface PlayerListResult {
  total?: number;
  data?: PlayerListResultItem[];
}

export interface PlayerListResultItem {
  /** 玩家ID */
  id?: string;
  /** 開戶時間 */
  crtTime?: string;
  /** 手機號碼 */
  mobile?: string;
  /** 暱稱 */
  playerCode?: string;
  /** kyc狀態 */
  kycState?: string;
  /** 最後訪問時間 */
  lastAccessTime?: string;
  /** 賬戶狀態 */
  state?: string;
  /** 賬號類型 (player, guest, agent, staff) */
  type?: string;
  /** 國際區號(e.g. 852, 63) */
  dialCode?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  /** KYC申請ID */
  applicantId?: string;
  /** 玩家標籤 */
  labels?: string[];
}

/**
 * 後台發送個人訊息
 */
export interface PlayerMessageSendInput {
  /** 玩家 ID（選填，與 playerCode 擇一，至少填一個） */
  playerId?: string;
  /** 玩家帳號（選填，與 playerId 擇一，至少填一個） */
  playerCode?: string;
  /** 訊息標題（必填） */
  title: string;
  /** 訊息內容（必填） */
  content: string;
  /** （選填）稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface PlayerMessageTemplateListInput {
  page?: number;
  pageSize?: number;
  messageType?: string;
}

export interface PlayerMessageTemplateListResult {
  total?: number;
  data?: PlayerMessageTemplateResult[];
}

export interface PlayerMessageTemplateResult {
  id?: string;
  /** 模板類別 */
  messageType?: string;
  /** 多語系（暫時使用：目前把 properties 替換系統字眼 bind desc） */
  descriptions?: PlayerMessageTemplateResultDescriptions;
  /** 屬性（目前用到 title / content） */
  properties?: PlayerMessageTemplateResultProperties;
  /** 模板名稱 */
  name?: string;
}

/**
 * 多語系（暫時使用：目前把 properties 替換系統字眼 bind desc）
 */
export type PlayerMessageTemplateResultDescriptions = {[key: string]: string};

/**
 * 屬性（目前用到 title / content）
 */
export type PlayerMessageTemplateResultProperties = {[key: string]: string};

export interface PlayerMessageTemplateUpsertInput {
  /** 選填。0 或不帶 = 新增, >0 = 更新 */
  id?: string;
  /** 模板類別（必填） */
  messageType: string;
  /** 多語系（選填；暫時使用：目前把 properties 替換系統字眼 bind desc） */
  descriptions?: PlayerMessageTemplateUpsertInputDescriptions;
  /** 屬性（必填；目前用到 title / content） */
  properties: PlayerMessageTemplateUpsertInputProperties;
  /** 模板名稱（必填） */
  name: string;
  /** （選填）稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

/**
 * 多語系（選填；暫時使用：目前把 properties 替換系統字眼 bind desc）
 */
export type PlayerMessageTemplateUpsertInputDescriptions = {[key: string]: string};

/**
 * 屬性（必填；目前用到 title / content）
 */
export type PlayerMessageTemplateUpsertInputProperties = {[key: string]: string};

export interface PlayerMobilePolicyListInput {
  page?: number;
  pageSize?: number;
  type?: string;
  playerId?: string;
  mobile?: string;
  firstName?: string;
  lastName?: string;
  playerCode?: string;
}

export interface PlayerMobilePolicyListResult {
  total?: number;
  data?: PlayerMobilePolicyResult[];
}

export interface PlayerMobilePolicyResult {
  id?: string;
  mobile?: string;
  type?: string;
  reason?: string;
  crtTime?: string;
  updTime?: string;
  dialCode?: string;
  playerId?: string;
  firstName?: string;
  lastName?: string;
  playerCode?: string;
}

export interface PlayerMobilePolicyUpsertInput {
  /** 選填。0 或不帶 = 新增, >0 = 更新 */
  id?: string;
  mobile: string;
  type: string;
  reason?: string;
  /** （選填）稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface PlayerPointAdjustInput {
  playerId: string;
  /** positive = credit, negative = deduct */
  amount: string;
  remark?: string;
}

export interface PlayerPointAdjustResult {
  txnId?: string;
}

export interface PlayerPromotion {
  id?: string;
  crtTime?: string;
  updTime?: string;
  delTime?: string;
  tenantId?: string;
  playerId?: string;
  playerCode?: string;
  promotionId?: string;
  /** 玩家方案狀態。允許值：unspecified | active | completed | cancelled | failed */
  state?: string;
  depositTxnId?: string;
  depositAmt?: string;
  bonusAmt?: string;
  wageringTarget?: string;
  wageringProgress?: string;
  balanceId?: string;
  currency?: string;
  completedAt?: string;
  /** 列表／Get 帶出方案主檔（由後端 JOIN promotion 或另查；無則省略） */
  promotionName?: string;
  promotionCode?: string;
  /** 手機號碼（對應 player.mobile；列表等情境由後端 JOIN 帶入） */
  mobile?: string;
  /** 方案類型（對應 promotion.type；列表由後端 JOIN 帶入，無則省略） */
  promotionType?: string;
}

export interface PlayerReferenceDataItem {
  id?: string;
  code?: string;
  description?: string;
  children?: PlayerReferenceDataItem[];
}

export interface PlayerReferenceDataListResult {
  data?: PlayerReferenceDataItem[];
}

export interface PlayerResult {
  /** 賬號ID */
  id?: string;
  /** 開戶時間 */
  crtTime?: string;
  /** 最後更改時間 */
  updTime?: string;
  /** 手機號碼 */
  mobile?: string;
  /** 國際區號(e.g. 852, 63) */
  dialCode?: string;
  /** 賬號 */
  code?: string;
  /** 賬號類型 (player, guest, agent) */
  type?: string;
  /** 受邀码 */
  referKey?: string;
  /** 賬戶狀態 */
  playerState?: string;
  tenantId?: string;
  /** 暱稱 */
  playerCode?: string;
  /** 推薦人 */
  parentId?: string;
  parentCode?: string;
  playerMobileVerified?: boolean;
  /** 最後登入成功時間 */
  lastSuccessTime?: string;
  /** 最後登入失敗時間 */
  lastFailureTime?: string;
  /** 連續登入失敗次數 */
  loginFailureCnt?: number;
  playerLabels?: string[];
  info?: PlayerInfoResult;
  vault?: PlayerVaultResult;
  kyc?: PlayerKycResult;
  /** 該幣別的主錢包餘額（單位：分，對應本次請求的 currency；由後台 Deposit / Withdraw 等操作後回填） */
  balance?: number;
  /** 該幣別的紅利餘額（單位：分，對應本次請求的 currency；由後台 Deposit / Withdraw 等操作後回填） */
  bonus?: number;
  /** 積分值餘額 */
  point?: string;
  /** 依幣別之存款週轉彙總（真錢入金 1x FIFO；後台 mgt 入金不計入 bucket） */
  deposit_turnover?: PlayerDepositTurnoverRow[];
  /** 該手機號碼是否被 mobile policy freeze */
  mobilePolicyFreezed?: boolean;
}

export interface PlayerSelfLimitsResult {
  id?: string;
  /** limit 類別 (wager/login) */
  limitType?: string;
  /** limit wager 數值 (dollar) */
  limitWagerValue?: string;
  /** limit 持續天數 */
  limitDuration?: string;
  /** limit state (pending active pending_removal expired) */
  state?: string;
  /** relax limit wager 數值 (dollar) */
  relaxLimitWagerValue?: string;
  /** relax limit 持續天數 */
  relaxLimitDuration?: string;
  /** relax limit state */
  relaxState?: string;
  /** 申請時間 */
  requestTime?: string;
  /** 生效時間 */
  startTime?: string;
  /** 失效時間 */
  endTime?: string;
  tenantId?: string;
  tenantCode?: string;
  playerId?: string;
  /** 手機號碼（來自 player.mobile；無則空字串） */
  mobile?: string;
  /** ACSC Patron ID（player_acsc_patron.patron_number）；未綁定或未啟用 acsc.enabled 時為空字串 */
  patronNumber?: string;
  /** 玩家代碼（來自 player.code；無則空字串） */
  playerCode?: string;
}

export interface PlayerSessionListInput {
  page?: number;
  pageSize?: number;
  /** 登入時段編號 */
  id?: string;
  /** 玩家 ID（精確） */
  playerId?: string;
  /** 登入時段狀態 (active, logout, revoke, revoke_other_device, expire, otp_fail, self_limit) */
  state?: string;
  /** 賬號名稱 */
  playerCode?: string;
  /** 手機碼 */
  mobile?: string;
  /** 登入時段IP */
  ip?: string;
  /** 登入時段國家 */
  cc?: string;
  domain?: string;
  platform?: string;
  /** 時間從 */
  timeFrom?: string;
  /** 時間至 */
  timeTo?: string;
}

export interface PlayerSessionListResult {
  total?: number;
  data?: PlayerSessionResult[];
}

export interface PlayerSessionResult {
  /** 登入時段編號 */
  id?: string;
  crtTime?: string;
  updTime?: string;
  tenantId?: string;
  /** 登入時段狀態 (active, logout, revoke, revoke_other_device, expire, otp_fail, self_limit) */
  state?: string;
  /** 賬號 */
  playerCode?: string;
  /** 手機碼 */
  mobile?: string;
  /** 玩家 ID */
  playerId?: string;
  /** 登入時段IP */
  ip?: string;
  /** 登入時段國家 */
  cc?: string;
  /** 登入時段UA */
  ua?: string;
  domain?: string;
  platform?: string;
}

export interface PlayerSessionRevokeInput {
  /** 登入時段編號 (這個或userCode選填其中一個) */
  id?: string;
  /** 賬號 (這個或id選填其中一個) */
  playerCode?: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface PlayerTxnPaymentItem {
  /** 交易單號 */
  id?: string;
  /** 外部參考ID */
  referenceId?: string;
  /** 支付供應商代碼 */
  paymentProviderCode?: string;
  /** 支付入口代碼 */
  paymentEntryCode?: string;
  /** 建立時間 */
  crtTime?: string;
  /** 更新時間 */
  updTime?: string;
  /** 交易類型(deposit/withdraw) */
  txnType?: string;
  /** 錢包變動金額(單位:分) */
  walletAmount?: string;
  /** 紅利變動金額(單位:分) */
  bonusAmount?: string;
  /** 錢包餘額(單位:分) */
  walletBalance?: string;
  /** 紅利餘額(單位:分) */
  bonusBalance?: string;
  /** 備註 */
  remark?: string;
  /** 交易狀態 */
  state?: string;
  /** 金額(單位:分) */
  amount?: string;
  /** 幣別 */
  currency?: string;
  /** 提款審核狀態（not_required / required / approved / rejected） */
  approvalStatus?: string;
  /** 審核備註（Reject 時玩家可見內容亦存此欄） */
  approvalRemark?: string;
  /** 審核人員代碼（Approve/Reject 時寫入 operated_by） */
  approvedBy?: string;
  /** 審核時間 */
  approvedAt?: string;
  /** 玩家付款/提款帳號（依 playerId + paymentEntryCode 對應 player_payment_account.account_number） */
  accountNumber?: string;
}

export interface PlayerTxnPaymentListInput {
  /** 玩家 ID（必填） */
  playerId: string;
  /** 頁碼（選填，0 或未傳則由後端預設） */
  page?: number;
  /** 每頁筆數（選填，0 或未傳則由後端預設；-1 表示不分頁回傳全部） */
  pageSize?: number;
  /** 建立時間起（選填，篩選 txn_payment.crt_time，格式建議 RFC3339） */
  timeFrom?: string;
  /** 建立時間迄（選填，篩選 txn_payment.crt_time，格式建議 RFC3339） */
  timeTo?: string;
  /** 交易類型（選填，篩選 txn_payment.type，例：deposit、withdraw） */
  txnType?: string;
  /** 交易狀態（選填，篩選 txn_payment.state，與 TxnPayment.state 一致，例：pending、normal、cancel、failed、expired） */
  state?: string;
  /** 提款審核狀態（選填，篩選 txn_payment.approval_status：not_required / required / approved / rejected） */
  approvalStatus?: string;
}

export interface PlayerTxnPaymentListResult {
  total?: number;
  data?: PlayerTxnPaymentItem[];
}

export interface PlayerUpdateInput {
  /** 玩家 ID（選填，與 playerCode 擇一，至少填一個） */
  playerId?: string;
  /** 玩家帳號（選填，與 playerId 擇一，至少填一個） */
  playerCode?: string;
  /** 玩家狀態（選填） */
  playerState?: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface PlayerVaultResult {
  vipGrade?: string;
  vipLevel?: number;
  vipLevelVal?: string;
  vipLevelNxt?: string;
  weeklyCashbackRate?: number;
  monthlyCashbackRate?: number;
  liveCommRate?: number;
  sportCommRate?: number;
  slotCommRate?: number;
}

/**
 * PlayerVipLevelSetInput 人工設定玩家 VIP 等級
 */
export interface PlayerVipLevelSetInput {
  playerId: string;
  vipLevel?: number;
  opsRemark?: string;
}

export interface PlayerVipLevelSetResult {
  playerId?: string;
  oldVipLevel?: number;
  newVipLevel?: number;
}

export interface PlayerWalletAdjustmentInput {
  /** 必填，玩家 ID */
  playerId: string;
  /** 必填，金額，單位：分；amount > 0 視為充值，amount < 0 視為提款 */
  amount: string;
  /** 必填，幣別，例：PHP */
  currency: string;
  /** 選填，備註；寫入 txn_payment.remark，並同步寫入 admin_ops_log.ops_values.remark（本 Input 無 opsRemark） */
  remark?: string;
}

/**
 * 前台提款阻擋原因（客服診斷）
 */
export interface PlayerWithdrawDiagnosticsBlockReason {
  code?: string;
  message?: string;
}

export interface PlayerWithdrawDiagnosticsInput {
  player_id?: string;
  currency?: string;
}

export interface PlayerWithdrawDiagnosticsResult {
  reasons?: PlayerWithdrawDiagnosticsBlockReason[];
  blocked_gsi_withdraw?: boolean;
  deposit_turnover?: PlayerDepositTurnoverRow;
  blocked_by_deposit_turnover?: boolean;
  deposit_turnover_blocked_message?: string;
}

/**
 * 後台直接提款（與 gsi withdraw 命名一致）
 */
export interface PlayerWithdrawInput {
  /** 必填，玩家 ID */
  playerId: string;
  /** 必填，金額，單位：分 */
  amount: string;
  /** 必填，幣別，例：PHP */
  currency: string;
  /** 選填，備註；寫入 txn_payment.remark，並同步寫入 admin_ops_log.ops_values.remark（本 Input 無 opsRemark） */
  remark?: string;
}

export interface PlayersByLabelInput {
  labelId: string;
}

export interface PlayersByLabelItem {
  id?: string;
  code?: string;
  mobile?: string;
  dialCode?: string;
  state?: string;
  crtTime?: string;
  updTime?: string;
  lastSuccessTime?: string;
  lastFailureTime?: string;
  loginFailureCnt?: number;
  assignedAt?: string;
}

export interface PlayersByLabelResult {
  data?: PlayersByLabelItem[];
}

export interface Promotion {
  id?: string;
  crtTime?: string;
  updTime?: string;
  delTime?: string;
  tenantId?: string;
  code?: string;
  name?: string;
  promoType?: string;
  /** 方案狀態。允許值：unspecified | active | inactive（與 API 回傳字面值一致） */
  state?: string;
  startTime?: string;
  endTime?: string;
  minDepositAmt?: string;
  /** 獎金比例 decimal(5,4)。>0 為比例獎金（與 bonus_amt 互斥，正規化後 bonus_amt=0）；=0 為固定獎金，須搭配 bonusAmt>0 */
  bonusRate?: string;
  /** 流水要求（分）。wagering_multiplier=0 時作為固定流水目標（須 >0）；倍率優先時正規化可清 0 */
  wageringRequirement?: string;
  descriptions?: PromotionDescriptions;
  images?: PromotionImages;
  weight?: number;
  /** 最高入金額（分）；不輸出表示無上限（DB NULL） */
  maxDepositAmt?: string;
  /** 最高獎金額（分）；不輸出表示無上限（DB NULL） */
  maxBonusAmt?: string;
  /** 流水倍率；0=使用固定值 wageringRequirement（固定獎金 bonusRate=0 必須用此）；
   >0 時流水目標 = (有效存款+獎金)*倍率，有效存款 = min(存款, maxBonusAmt/bonusRate)（獎金封頂後超額存款不計） */
  wageringMultiplier?: number;
  /** 資格限制。允許值：unlimited | once_per_lifetime */
  eligibility?: string;
  /** 固定獎金（分，對應 DB bonus_amt）。bonus_rate=0（固定獎金）時為實際值且須 >0；bonus_rate>0（比例獎金）時可省略語意，正規化後為 0 */
  bonusAmt?: string;
  /** 目標遊戲類別白名單（對應 db.game.type）；空表示不限制 */
  targetGameTypes?: string[];
  /** 促銷描述（單語系，對應 DB promotion_desc；僅用於簡化前端展示，非多語系） */
  promoDesc?: string;
}

export type PromotionDescriptions = {[key: string]: string};

export type PromotionImages = {[key: string]: string};

/**
 * RecaptchaConfigGetInput 取得租戶 reCAPTCHA 設定。tenantId 為 0 時取當前 admin session 的租戶。
 */
export interface RecaptchaConfigGetInput {
  tenantId?: string;
}

/**
 * RecaptchaConfigResult 租戶 reCAPTCHA 設定（後台管理）。
 */
export interface RecaptchaConfigResult {
  id?: string;
  crtTime?: string;
  updTime?: string;
  tenantId?: string;
  enabled?: boolean;
  siteKey?: string;
  otpAction?: string;
  minScore?: number;
  /** secretKey 遮罩回傳（如 6Ld1****），僅供 UI 判斷是否已設定；不回傳明文。 */
  secretKey?: string;
}

/**
 * RecaptchaConfigUpsertInput 新增/更新租戶 reCAPTCHA 設定。
 tenantId 為 0 時取當前 admin session 的租戶；提交即覆蓋全部欄位。
 */
export interface RecaptchaConfigUpsertInput {
  tenantId?: string;
  enabled?: boolean;
  siteKey?: string;
  otpAction?: string;
  minScore?: number;
  /** （選填）稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
  /** Classic reCAPTCHA v3 secret key（後端驗證用）。留空或送出遮罩值（含 ****）視為不變更，不覆寫既有 secret。 */
  secretKey?: string;
}

export interface RequeueGobisOutboxFailedInput {
  /** 選填：限定 provider 代碼（對應 gobis_outbox.provider_code） */
  providerCode?: string;
  /** 選填：限定玩家 ID */
  playerId?: string;
  /** 選填：crt_time 起（含） */
  from?: string;
  /** 選填：crt_time 迄（含） */
  to?: string;
  /** 選填：直接指定 outbox 列 ID 清單（通常取自 failed 告警 email）；與其他條件 AND。 */
  ids?: string[];
}

export interface RequeueGobisOutboxFailedResult {
  /** 翻回 pending 的列數 */
  requeued?: string;
}

export interface ResendWagerToGobisInput {
  /** 要重送的注單 ID 清單（必填） */
  wagerIds: string[];
}

export interface ResendWagerToGobisResult {
  /** 成功直送 Gobis 的注單數 */
  resent?: string;
  /** 查無資料（不存在或非本租戶）的注單 ID */
  notFound?: string[];
  /** 略過上報的注單筆數（staff 玩家、測試遊戲或查無對應遊戲/供應商） */
  skipped?: string;
  /** 直送 Gobis 失敗的注單 ID（HTTP/Gobis 回應錯誤，可重試） */
  failed?: string[];
}

export interface SchedulerEnqueueEvent {
  taskId?: string;
  enqueuedAt?: string;
}

export interface SchedulerEnqueueResult {
  data?: SchedulerEnqueueEvent[];
}

export interface SchedulerEntry {
  id?: string;
  spec?: string;
  taskType?: string;
  options?: string[];
  nextEnqueueAt?: string;
  prevEnqueueAt?: string;
}

export interface SchedulerListResult {
  data?: SchedulerEntry[];
}

export interface SelfLimitDeleteInput {
  /** 必填，指定要刪除的紀錄 */
  id: string;
  /** 選填，限制玩家ID */
  playerId?: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface SelfLimitListInput {
  playerId?: string;
  /** 選填，限制類型：login / wager */
  type?: string;
  /** 頁碼（選填） */
  page?: number;
  /** 每頁筆數（選填） */
  pageSize?: number;
  /** 選填，手機號碼（player.mobile，模糊／精確依 WithFilterInOrLike） */
  mobile?: string;
  /** 選填，玩家代碼（player.code） */
  playerCode?: string;
  /** 選填，ACSC Patron ID（精確；acsc.enabled=false 時視為無結果） */
  patronNumber?: string;
}

export interface SelfLimitListResult {
  total?: number;
  data?: PlayerSelfLimitsResult[];
}

export interface SelfLimitUpdateInput {
  /** 必填，指定要更新的紀錄 */
  id: string;
  /** 選填，可更新限制天數 */
  limitDuration?: string;
  /** 選填，可更新投注限制金額 */
  limitWagerValue?: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface TxnLedgerListInput {
  page?: number;
  pageSize?: number;
  timeFrom?: string;
  timeTo?: string;
  /** 賬號, 只filter完全相等 */
  playerCode?: string;
  playerId?: string;
  mobile?: string;
  /** tran type: deposit, withdraw, bonus, bet, settle */
  txnType?: string;
  /** tran state: completed, processing, failed, canceled */
  state?: string;
  /** 交易單號 */
  txnId?: string;
  txnRefId?: string;
}

export interface TxnLedgerListResult {
  total?: number;
  data?: TxnLedgerResult[];
}

export interface TxnLedgerResult {
  /** 交易單號 */
  id?: string;
  /** 新增時間 */
  crtTime?: string;
  /** 執行時間 */
  updTime?: string;
  /** tran type: deposit, withdraw, bonus */
  txnType?: string;
  /** 關聯編號 */
  txnRefId?: string;
  /** tran state: completed, processing, failed, canceled */
  state?: string;
  remark?: string;
  playerId?: string;
  playerCode?: string;
  mobile?: string;
  /** 幣別（txn_ledger.currency） */
  currency?: string;
  /** 精度（txn_ledger.precision） */
  precision?: number;
  /** 錢包相關（餘額；單位：分） */
  coinBalChange?: string;
  coinBalBefore?: string;
  coinBalAfter?: string;
  /** 紅利／鎖定額（txn_ledger；單位：分） */
  bonusChange?: string;
  bonusBefore?: string;
  bonusAfter?: string;
  lockedChange?: string;
  lockedBefore?: string;
  lockedAfter?: string;
}

export interface TxnPaymentApproveWithdrawInput {
  txnId: string;
  remark?: string;
}

export interface TxnPaymentApproveWithdrawResult {
  txnId?: string;
  approvalStatus?: string;
  extRefId?: string;
}

export interface TxnPaymentListInput {
  page?: number;
  pageSize?: number;
  timeFrom?: string;
  timeTo?: string;
  playerCode?: string;
  playerId?: string;
  mobile?: string;
  txnType?: string;
  state?: string;
  paymentEntryCode?: string;
  paymentProviderCode?: string;
  /** 提款審核狀態：not_required / required / approved / rejected */
  approvalStatus?: string;
}

export interface TxnPaymentListResult {
  total?: number;
  data?: TxnPaymentResult[];
}

export interface TxnPaymentRejectWithdrawInput {
  txnId: string;
  remark: string;
}

export interface TxnPaymentRejectWithdrawResult {
  txnId?: string;
  approvalStatus?: string;
  state?: string;
}

export interface TxnPaymentResult {
  id?: string;
  crtTime?: string;
  updTime?: string;
  txnType?: string;
  state?: string;
  remark?: string;
  playerId?: string;
  playerCode?: string;
  mobile?: string;
  currency?: string;
  amount?: string;
  paymentEntryCode?: string;
  paymentEntryName?: string;
  paymentProviderCode?: string;
  extRefId?: string;
  /** 玩家提款帳號（withdraw 快照，建立提款當下值；deposit 為空） */
  accountNumber?: string;
  operatedBy?: string;
  operatedAt?: string;
  approvalStatus?: string;
  approvalRemark?: string;
  approvedBy?: string;
  approvedAt?: string;
  meta?: TxnPaymentResultMeta;
}

export type TxnPaymentResultMeta = { [key: string]: unknown };

export interface TxnPointApproveInput {
  txnId: string;
  remark?: string;
}

export interface TxnPointApproveResult {
  txnId?: string;
  approveStatus?: string;
}

export interface TxnPointListInput {
  page?: number;
  pageSize?: number;
  playerCode?: string;
  type?: string;
  timeFrom?: string;
  timeTo?: string;
  mobile?: string;
  playerId?: string;
  state?: string;
  approveStatus?: string;
}

export interface TxnPointListResult {
  data?: TxnPointResult[];
  total?: number;
}

export interface TxnPointRejectInput {
  txnId: string;
  remark: string;
}

export interface TxnPointRejectResult {
  txnId?: string;
  approveStatus?: string;
  state?: string;
}

export interface TxnPointResult {
  id?: string;
  crtTime?: string;
  updTime?: string;
  playerId?: string;
  playerCode?: string;
  tenantCode?: string;
  mobile?: string;
  /** dailyEarn | redeem | credit | deduct | expiry */
  type?: string;
  /** pending | processing | rejected | normal | cancel | failed | expired | completed */
  state?: string;
  /** not_required | required | approved | rejected */
  approveStatus?: string;
  remark?: string;
  xpBefore?: string;
  xpChange?: string;
  xpAfter?: string;
  xpRemain?: string;
  expireTime?: string;
  refId?: string;
  approvalRemark?: string;
  operatedBy?: string;
  operatedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface TxnVipLevelListInput {
  page?: number;
  pageSize?: number;
  playerCode?: string;
  actionType?: string;
  timeFrom?: string;
  timeTo?: string;
  mobile?: string;
}

export interface TxnVipLevelListResult {
  data?: TxnVipLevelResult[];
  total?: number;
}

export interface TxnVipLevelResult {
  id?: string;
  crtTime?: string;
  updTime?: string;
  playerId?: string;
  playerCode?: string;
  actionType?: string;
  oldLevelIdx?: number;
  newLevelIdx?: number;
  turnoverAmt?: string;
  dailyDepositAmt?: string;
  dailyBetAmt?: string;
  remark?: string;
  mobile?: string;
}

export interface TxnWagerListInput {
  page?: number;
  pageSize?: number;
  timeFrom?: string;
  timeTo?: string;
  playerCode?: string;
  mobile?: string;
  /** 玩家 ID（精確） */
  playerId?: string;
  sessionCode?: string;
  /** 遊戲編號, 多過一個可用逗號分隔 */
  gameId?: string;
  /** 遊戲大類, 多過一個可用逗號分隔 */
  gameGenre?: string;
  /** 遊戲類型(UI 分類: perya/slot/casino/egame/sport), 多過一個可用逗號分隔 */
  gameType?: string;
  /** 遊戲廠商, 多過一個可用逗號分隔 */
  gamePvdId?: string;
  /** 遊戲局數編號, 多過一個可用逗號分隔 */
  extRoundId?: string;
  /** 下注編號 */
  txnCode?: string;
  /** 未結算 normal, 已結算 result, 取消 cancel, 錯誤 error */
  betState?: string;
  /** (下注: bet, 免費下注: free_bet, 打賞: tip) */
  txnType?: string;
  /** 外部交易ID, 多過一個可用逗號分隔 */
  extTxnId?: string;
}

export interface TxnWagerListResult {
  /** 交易總筆數（卡片「Total Transactions」）= 篩選後 COUNT(*)，含未結算與已取消注單 */
  total?: number;
  /** 本頁注單列表 */
  data?: TxnWagerResult[];
  /** === 本頁小計（只統計目前這一頁的 data；單位:分）===
   本頁下注金額小計 = 本頁 SUM(bet_amt) */
  subTotalBetAmt?: string;
  /** 本頁有效投注小計 = 本頁 SUM(bet_adj_amt) */
  subTotalBetAdjAmt?: string;
  /** 本頁投注輸贏小計 = 本頁 SUM(bet_ret_amt) */
  subTotalBetRetAmt?: string;
  /** 本頁派彩小計 = 本頁 SUM(bet_amt + bet_ret_amt) */
  subTotalPayout?: string;
  /** === 全部總計（對「整個篩選結果」聚合，非僅本頁；單位:分）===
   總下注金額（卡片「Total Bet Amount」）= SUM(bet_amt) */
  totalBetAmt?: string;
  /** 總有效投注額（計佣用）= SUM(bet_adj_amt)；itam/itamfc 改用 provider_bet_adj_amt */
  totalBetAdjAmt?: string;
  /** 總投注輸贏（玩家視角、不含本金）= SUM(bet_ret_amt)；>0 玩家淨贏、<0 玩家淨輸 */
  totalBetRetAmt?: string;
  /** 總派彩金額（卡片「Total Payout Amount」）= SUM(bet_amt + bet_ret_amt) */
  totalPayoutAmt?: string;
  /** 總輸贏 / GGR（卡片「Total W/L (GGR)」）= 總下注 − 總派彩 = totalBetAmt − totalPayoutAmt；正值=莊家贏 */
  totalWl?: string;
  /** === 注單結果計數（只計「已結算」注單 bet_state='result'，依輸贏金額 bet_ret_amt 判定；未結算/已取消不計入）===
   贏注數（卡片「Win Count」）= 已結算且 bet_ret_amt > 0 的注單數 */
  winCount?: string;
  /** 輸注數（卡片「Loss Count」）= 已結算且 bet_ret_amt < 0 的注單數 */
  lossCount?: string;
  /** 和局數（卡片「Tie Count」）= 已結算且 bet_ret_amt = 0 的注單數 */
  tieCount?: string;
}

export interface TxnWagerResult {
  /** 交易編號 */
  id?: string;
  /** 新增時間 */
  crtTime?: string;
  /** 執行時間 */
  updTime?: string;
  /** 執行者
   string updBy = 4;
   (下注: bet, 免費下注: free_bet, 打賞: tip) */
  txnType?: string;
  /** (有效: normal, 取消: cancel) */
  txnState?: string;
  /** external game providers' bet id */
  extTxnId?: string;
  extRoundId?: string;
  /** 玩家 ID */
  playerId?: string;
  playerCode?: string;
  playerType?: string;
  parentCode?: string;
  sessionId?: string;
  currencyId?: string;
  /** 游戲資料 */
  gameId?: string;
  gameGenre?: string;
  /** 遊戲類型(UI 分類: perya/slot/casino/egame/sport)，可能為空 */
  gameType?: string;
  gameGpId?: string;
  gameResult?: TxnWagerResultGameResult;
  /** 遊戲名稱（多語系 map，前端取 en key） */
  gameName?: TxnWagerResultGameName;
  /** 外部參考ID */
  extRefId?: string;
  /** 結算交易ID */
  settleTxnId?: string;
  /** 投注資料 */
  betTime?: string;
  /** 派彩時間 */
  settleTime?: string;
  /** 投注類型 */
  betCode?: string;
  /** 投注金額 */
  betAmt?: string;
  /** 輸贏金額（玩家視角、不含本金）= bet_ret_amt；>0 玩家淨贏、<0 玩家淨輸 */
  betRetAmt?: string;
  /** 有效投注 */
  betAdjAmt?: string;
  /** 派彩金額 = bet_amt + bet_ret_amt（含本金；未結算注單 bet_ret_amt=0，派彩=本金） */
  payout?: string;
  /** 投注狀態(normal, result, cancel, error) */
  betState?: string;
  /** 投注結果(win, lose, tie)；標籤優先、金額補位：遊戲商有送 bet_result 就採標籤，
   沒送才依 bet_ret_amt 正負推導（>0 win / <0 lose / =0 tie），與彙總卡片 Win/Loss/Tie Count
   同口徑。僅已結算(betState=result)有值，未結算/取消為空。 */
  betResult?: string;
  betRemark?: string;
  mobile?: string;
}

/**
 * 遊戲名稱（多語系 map，前端取 en key）
 */
export type TxnWagerResultGameName = {[key: string]: string};

export type TxnWagerResultGameResult = {[key: string]: string};

/**
 * by-gametype 列表結果
 */
export interface TxnWagerStatsByGameTypeListResult {
  /** 符合條件的總筆數（分頁用） */
  total?: number;
  /** 本頁資料列表 */
  data?: TxnWagerStatsByGameTypeResult[];
  /** 符合查詢條件的不重複玩家數 */
  activePlayerCount?: number;
  /** 每人平均流水（單位：分） */
  averageTurnover?: string;
}

/**
 * by-gametype 每列（Game Type - per Month）
 */
export interface TxnWagerStatsByGameTypeResult {
  /** 遊戲類型（如 Video Slots、Live Baccarat） */
  gameType?: string;
  /** GGR = BetReal − WinReal（單位：分）：真錢錢包流量 */
  ggr?: string;
  /** NGR = (BetReal + BetsBonus) − (WinReal + WinBonus)（單位：分）：含 bonus 段的總錢包流量 */
  ngr?: string;
  /** 該維度下不重複玩家數 */
  activePlayerCount?: number;
  /** 該列每人平均流水（單位：分） */
  averageTurnover?: string;
  /** normal 錢包有效投注金額總計（單位：分） */
  betReal?: string;
  /** normal 派彩總計（單位：分） */
  winReal?: string;
  /** bonus/free_bet 有效投注金額總計（單位：分） */
  betsBonus?: string;
  /** bonus/free_bet 派彩總計（單位：分） */
  winBonus?: string;
  /** 有效投注彙總（單位：分）= SUM(txn_wager_stats.total_bet_adj_amt) */
  totalBetAdjAmt?: string;
  /** 聚合列無單一玩家，固定空字串 */
  mobile?: string;
}

/**
 * 注單統計查詢結果列表（Username - Game - per Month）
 */
export interface TxnWagerStatsByPlayerListResult {
  /** 符合條件的總筆數（分頁用） */
  total?: number;
  /** 本頁資料列表 */
  data?: TxnWagerStatsByPlayerResult[];
  /** 符合查詢條件的不重複玩家數 */
  activePlayerCount?: number;
  /** 每人平均流水（單位：分）= (SUM(全列 betReal+winReal+betsBonus+winBonus)) / activePlayerCount，等同原 totalBetAmount+totalWin 全月彙總 */
  averageTurnover?: string;
}

/**
 * 注單統計結果（以玩家+遊戲維度加總整月，真錢/紅利合併於一列；金額單位：分）
 */
export interface TxnWagerStatsByPlayerResult {
  /** 玩家 ID */
  playerId?: string;
  /** 玩家代碼 */
  playerCode?: string;
  /** 遊戲供應商代碼 */
  gameProviderCode?: string;
  /** 遊戲類型（如 slot、live_baccarat） */
  gameType?: string;
  /** 遊戲代碼 */
  gameCode?: string;
  /** Username-Game 維度下每列固定為 1 */
  activePlayerCount?: number;
  /** normal 錢包（type=bet）有效投注金額總計（單位：分） */
  betReal?: string;
  /** normal 下注實際派彩總計（單位：分） */
  winReal?: string;
  /** bonus/free_bet（type=free_bet）有效投注金額總計（單位：分） */
  betsBonus?: string;
  /** bonus/free_bet 實際派彩總計（單位：分） */
  winBonus?: string;
  /** GGR = BetReal − WinReal（單位：分）：真錢錢包流量 */
  ggr?: string;
  /** NGR = (BetReal + BetsBonus) − (WinReal + WinBonus)（單位：分）：含 bonus 段的總錢包流量 */
  ngr?: string;
  /** 該列流水（單位：分）= betReal + winReal + betsBonus + winBonus */
  averageTurnover?: string;
  /** 有效投注彙總（單位：分）= SUM(txn_wager_stats.total_bet_adj_amt)，整月加總 */
  totalBetAdjAmt?: string;
  /** 手機號（來自 player.mobile；無則空字串） */
  mobile?: string;
}

/**
 * by-provider-game 列表結果
 */
export interface TxnWagerStatsByProviderGameListResult {
  /** 符合條件的總筆數（分頁用） */
  total?: number;
  /** 本頁資料列表 */
  data?: TxnWagerStatsByProviderGameResult[];
  /** 符合查詢條件的不重複玩家數 */
  activePlayerCount?: number;
  /** 每人平均流水（單位：分） */
  averageTurnover?: string;
}

/**
 * by-provider-game 每列（Game Provider - Game - per Month）
 */
export interface TxnWagerStatsByProviderGameResult {
  /** 遊戲供應商代碼 */
  gameProviderCode?: string;
  /** 遊戲代碼 */
  gameCode?: string;
  /** GGR = BetReal − WinReal（單位：分）：真錢錢包流量 */
  ggr?: string;
  /** NGR = (BetReal + BetsBonus) − (WinReal + WinBonus)（單位：分）：含 bonus 段的總錢包流量 */
  ngr?: string;
  /** 該維度下不重複玩家數 */
  activePlayerCount?: number;
  /** 該列每人平均流水（單位：分） */
  averageTurnover?: string;
  /** normal 錢包有效投注金額總計（單位：分） */
  betReal?: string;
  /** normal 派彩總計（單位：分） */
  winReal?: string;
  /** bonus/free_bet 有效投注金額總計（單位：分） */
  betsBonus?: string;
  /** bonus/free_bet 派彩總計（單位：分） */
  winBonus?: string;
  /** 有效投注彙總（單位：分）= SUM(txn_wager_stats.total_bet_adj_amt) */
  totalBetAdjAmt?: string;
  /** 聚合列無單一玩家，固定空字串 */
  mobile?: string;
}

/**
 * by-provider 列表結果
 */
export interface TxnWagerStatsByProviderListResult {
  /** 符合條件的總筆數（分頁用） */
  total?: number;
  /** 本頁資料列表 */
  data?: TxnWagerStatsByProviderResult[];
  /** 符合查詢條件的不重複玩家數 */
  activePlayerCount?: number;
  /** 每人平均流水（單位：分） */
  averageTurnover?: string;
}

/**
 * by-provider 每列（Game Provider - per Month）
 */
export interface TxnWagerStatsByProviderResult {
  /** 遊戲供應商代碼 */
  gameProviderCode?: string;
  /** GGR = BetReal − WinReal（單位：分）：真錢錢包流量 */
  ggr?: string;
  /** NGR = (BetReal + BetsBonus) − (WinReal + WinBonus)（單位：分）：含 bonus 段的總錢包流量 */
  ngr?: string;
  /** 該維度下不重複玩家數（真錢或紅利任一有注單） */
  activePlayerCount?: number;
  /** 該列每人平均流水（單位：分）= (SUM(total_bet_amount)+SUM(total_win)) / activePlayerCount */
  averageTurnover?: string;
  /** normal 錢包有效投注金額總計（單位：分） */
  betReal?: string;
  /** normal 派彩總計（單位：分） */
  winReal?: string;
  /** bonus/free_bet 有效投注金額總計（單位：分） */
  betsBonus?: string;
  /** bonus/free_bet 派彩總計（單位：分） */
  winBonus?: string;
  /** 有效投注彙總（單位：分）= SUM(txn_wager_stats.total_bet_adj_amt) */
  totalBetAdjAmt?: string;
  /** 聚合列無單一玩家，固定空字串（與其他報表欄位結構一致） */
  mobile?: string;
}

/**
 * 注單統計查詢 Input（4 種 GiG 報表 API 共用）
 */
export interface TxnWagerStatsQueryInput {
  /** 選填。分頁頁碼，從 1 開始 */
  page?: number;
  /** 選填。每頁筆數，0=預設 100，-1=全部 */
  pageSize?: number;
  /** 選填。篩選玩家 ID */
  playerId?: string;
  /** 選填。篩選玩家代碼 */
  playerCode?: string;
  /** 選填。篩選遊戲供應商代碼 */
  gameProviderCode?: string;
  /** 選填。篩選遊戲類型（如 slot、live_baccarat） */
  gameType?: string;
  /** 選填。篩選遊戲代碼 */
  gameCode?: string;
  /** 必填。統計月份，格式 YYYY-MM（例如 2026-03） */
  statMonth: string;
  /** 選填。依玩家手機號（player.mobile，精確比對）篩選 */
  mobile?: string;
}

export interface UpdatePlayerPromotionInput {
  /** 必填。玩家方案 ID */
  id: string;
  /** 選填。玩家方案狀態。允許值：unspecified | active | completed | cancelled | failed */
  state?: string;
  /** 選填。存款交易 ID */
  depositTxnId?: string;
  /** 選填。存款金額（分） */
  depositAmt?: string;
  /** 選填。獎金金額（分） */
  bonusAmt?: string;
  /** 選填。流水目標（分） */
  wageringTarget?: string;
  /** 選填。流水進度（分） */
  wageringProgress?: string;
  /** 選填。餘額 ID */
  balanceId?: string;
  /** 選填。幣別 */
  currency?: string;
}

export interface UpdatePlayerPromotionResult {
  playerPromotion?: PlayerPromotion;
}

export interface UpsertLeaderboardPromotionInput {
  /** 選填。0 或不帶 = 新增, >0 = 更新 */
  id?: string;
  /** 必填。租戶 ID */
  tenantId?: string;
  /** 必填。prize 對應代碼 */
  code: string;
  /** 必填。方案名稱 */
  name: string;
  /** 選填。方案狀態。允許值：unspecified | active | inactive */
  state?: string;
  /** 選填。開始時間 */
  startTime?: string;
  /** 選填。結束時間 */
  endTime?: string;
  /** 必填。固定獎金（分，對應 bonus_amt）。bonus_rate=0 時須 >0；比例獎金（bonus_rate>0）可省略，正規化後 bonus_amt=0 */
  bonusAmt: string;
  /** 必填。流水要求（分）。wagering_multiplier=0 時須 >0；>0 倍率時可搭配正規化清為 0 */
  wageringRequirement: string;
  /** 選填。多語系描述 */
  descriptions?: UpsertLeaderboardPromotionInputDescriptions;
  /** 選填。多語系圖片 */
  images?: UpsertLeaderboardPromotionInputImages;
  /** 選填。排序權重 */
  weight?: number;
  /** 選填。目標遊戲類別白名單（對應 db.game.type）；空表示不限制 */
  targetGameTypes?: string[];
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

/**
 * 選填。多語系描述
 */
export type UpsertLeaderboardPromotionInputDescriptions = {[key: string]: string};

/**
 * 選填。多語系圖片
 */
export type UpsertLeaderboardPromotionInputImages = {[key: string]: string};

export interface UpsertPlayerPromotionInput {
  /** 選填。本端點僅建立指派（assign-only），傳入 >0 一律拒絕；更新請走 internal update。 */
  id?: string;
  /** 選填。租戶 ID。以登入 admin 的租戶為準；若提供則必須與 session 一致 */
  tenantId?: string;
  /** 必填。玩家 ID */
  playerId: string;
  /** 選填。玩家代碼。後端由 playerId 解析；若提供則必須與該玩家一致 */
  playerCode?: string;
  /** 必填。方案 ID */
  promotionId: string;
  /** 選填。幣別。fasttrack 方案免填（後端以玩家當前錢包解析；若提供則必須與當前錢包一致）；其他類型建立時必填 */
  currency?: string;
  /** 選填。餘額 ID。fasttrack 方案免填（後端以玩家當前錢包解析；若提供則必須與當前錢包一致）；其他類型建立時必填 */
  balanceId?: string;
  /** 選填。存款交易 ID。fasttrack 方案不可帶（無入金）；其他類型建立時必填 */
  depositTxnId?: string;
  /** 選填。存款金額（分）。fasttrack 方案不可帶（無入金）；其他類型建立時必填 */
  depositAmt?: string;
  /** 選填。不支援。本端點僅建立指派，此欄位僅存於 internal update 流程。玩家方案狀態 */
  state?: string;
  /** 選填。不支援。本端點僅建立指派，此欄位僅存於 internal update 流程。獎金金額（分） */
  bonusAmt?: string;
  /** 選填。不支援。本端點僅建立指派，此欄位僅存於 internal update 流程。流水目標（分） */
  wageringTarget?: string;
  /** 選填。不支援。本端點僅建立指派，此欄位僅存於 internal update 流程。流水進度（分） */
  wageringProgress?: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface UpsertPlayerPromotionResult {
  playerPromotion?: PlayerPromotion;
}

export interface UpsertPromotionInput {
  /** 選填。0 或不帶 = 新增, >0 = 更新 */
  id?: string;
  /** 必填。租戶 ID */
  tenantId?: string;
  /** 必填。方案名稱 */
  name: string;
  /** 選填。方案狀態。允許值：unspecified | active | inactive */
  state?: string;
  /** 選填。開始時間 */
  startTime?: string;
  /** 選填。結束時間 */
  endTime?: string;
  /** 新增（id=0）必填；更新（id>0）選填，未傳表示不變、傳 0 為合法更新。最低存款金額（分） */
  minDepositAmt?: string;
  /** 必填。獎金比例。語意同 CreatePromotionInput.bonusRate（>0 比例／=0 固定獎金須 bonusAmt>0） */
  bonusRate?: string;
  /** 新增（id=0）必填；更新（id>0）選填，未傳表示不變、傳 0 為合法更新。流水要求（分）。語意同 CreatePromotionInput.wageringRequirement */
  wageringRequirement?: string;
  /** 選填。多語系描述 */
  descriptions?: UpsertPromotionInputDescriptions;
  /** 選填。多語系圖片 */
  images?: UpsertPromotionInputImages;
  /** 新增（id=0）選填，未傳視為 0；更新（id>0）選填，未傳表示不變、傳 0 為合法更新。排序權重 */
  weight?: number;
  /** 選填。最高入金額（分）；不傳表示無上限（新增）或不變（更新）；傳 -1 表示無上限（寫入 NULL） */
  maxDepositAmt?: string;
  /** 選填。最高獎金額（分）；不傳表示無上限（新增）或不變（更新）；傳 -1 表示無上限（寫入 NULL） */
  maxBonusAmt?: string;
  /** 新增（id=0）選填，未傳視為 0；更新（id>0）選填，未傳表示不變、傳 0 為合法更新（切回固定流水模式）。流水倍率 */
  wageringMultiplier?: number;
  /** 選填。資格限制。允許值：unlimited | once_per_lifetime */
  eligibility?: string;
  /** 選填。固定獎金（分）；新增／更新皆可用。bonus_rate=0 時須 >0；比例獎金可省略，正規化後 bonus_amt=0 */
  bonusAmt?: string;
  /** 選填。目標遊戲類別白名單（對應 db.game.type）；空表示不限制 */
  targetGameTypes?: string[];
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
  /** 選填。方案類型。允許值：normal | gig_migration | leaderboard | fasttrack；新增時空表示 normal，更新時空表示不變 */
  promoType?: string;
  /** 選填。促銷描述（單語系，對應 DB promotion_desc；僅用於簡化前端展示，非多語系）。更新時有傳則覆寫 */
  promoDesc?: string;
}

/**
 * 選填。多語系描述
 */
export type UpsertPromotionInputDescriptions = {[key: string]: string};

/**
 * 選填。多語系圖片
 */
export type UpsertPromotionInputImages = {[key: string]: string};

export interface VipGradeConfig {
  weeklyCashbackMultiplier?: number;
  monthlyCashbackMultiplier?: number;
}

export interface VipGradeListInput { [key: string]: unknown }

export interface VipGradeListResult {
  total?: number;
  data?: VipGradeResult[];
}

export interface VipGradeResult {
  id?: string;
  crtTime?: string;
  updTime?: string;
  updCode?: string;
  idx?: string;
  code?: string;
  fromLevel?: string;
  toLevel?: string;
  descriptions?: VipGradeResultDescriptions;
  images?: VipGradeResultImages;
  config?: VipGradeConfig;
}

export type VipGradeResultDescriptions = {[key: string]: string};

export type VipGradeResultImages = {[key: string]: string};

export interface VipGradeUpsertInput {
  /** 選填。0 或不帶 = 新增, >0 = 更新 */
  id?: string;
  idx?: string;
  code?: string;
  fromLevel?: string;
  toLevel?: string;
  descriptions?: VipGradeUpsertInputDescriptions;
  images?: VipGradeUpsertInputImages;
  config?: VipGradeConfig;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export type VipGradeUpsertInputDescriptions = {[key: string]: string};

export type VipGradeUpsertInputImages = {[key: string]: string};

export interface VipLevelIdxItem {
  idx?: string;
  code?: string;
  name?: string;
}

export interface VipLevelIdxListResult {
  data?: VipLevelIdxItem[];
}

export interface VipLevelListInput {
  page?: number;
  pageSize?: number;
}

export interface VipLevelListResult {
  total?: number;
  data?: VipLevelResult[];
}

export interface VipLevelResult {
  id?: string;
  crtTime?: string;
  updTime?: string;
  updCode?: string;
  idx?: string;
  code?: string;
  upgradeTurnoverThreshold?: string;
  upgradeDailyDepositTurnoverThreshold?: string;
  upgradeDailyBetTurnoverThreshold?: string;
  retentionTurnoverThreshold?: string;
  levelUpReward?: string;
  downgradeProtectionMonths?: number;
  fcToCashTurnoverThreshold?: string;
  fcDailyLimit?: string;
  fcFillDaysLimit?: number;
  paydayReward?: string;
  retentionReward?: string;
  birthdayReward?: string;
  rewardShopDiscountBps?: number;
  name?: string;
  /** 特權福利
   standard | faster | priority | instant（空白 = 不顯示） */
  withdrawalPerk?: string;
  tournamentPerk?: boolean;
  vipHostPerk?: boolean;
  travelLifestyleFundAmt?: string;
}

export interface VipLevelUpsertInput {
  /** 選填。0 或不帶 = 新增, >0 = 更新 */
  id?: string;
  idx: string;
  code: string;
  upgradeTurnoverThreshold?: string;
  upgradeDailyDepositTurnoverThreshold?: string;
  upgradeDailyBetTurnoverThreshold?: string;
  retentionTurnoverThreshold?: string;
  levelUpReward?: string;
  downgradeProtectionMonths?: number;
  fcToCashTurnoverThreshold?: string;
  fcDailyLimit?: string;
  fcFillDaysLimit?: number;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
  paydayReward?: string;
  retentionReward?: string;
  birthdayReward?: string;
  rewardShopDiscountBps?: number;
  name: string;
  /** 特權福利
   standard | faster | priority | instant（空白 = 不顯示） */
  withdrawalPerk?: string;
  tournamentPerk?: boolean;
  vipHostPerk?: boolean;
  travelLifestyleFundAmt?: string;
}

/**
 * VipRebate represents a VIP rebate scheme.
 */
export interface VipRebate {
  id?: string;
  crtTime?: string;
  updTime?: string;
  idx?: string;
  name?: string;
  type?: string;
  active?: boolean;
  peryaRate?: number;
  slotRate?: number;
  casinoRate?: number;
  egameRate?: number;
  sportRate?: number;
  bingoRate?: number;
  peryaHouseEdge?: number;
  slotHouseEdge?: number;
  casinoHouseEdge?: number;
  egameHouseEdge?: number;
  sportHouseEdge?: number;
  bingoHouseEdge?: number;
  peryaExchangeRate?: number;
  slotExchangeRate?: number;
  casinoExchangeRate?: number;
  egameExchangeRate?: number;
  sportExchangeRate?: number;
  bingoExchangeRate?: number;
}

/**
 * VipRebateDeleteInput is the input for deleting a VIP rebate scheme.
 */
export interface VipRebateDeleteInput {
  /** 必填。刪除主鍵 */
  id: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

/**
 * VipRebateGetInput is the input for getting a single VIP rebate scheme.
 */
export interface VipRebateGetInput {
  /** 必填。查詢主鍵 */
  id: string;
}

/**
 * VipRebateListInput is the input for listing VIP rebate schemes.
 */
export interface VipRebateListInput {
  page?: number;
  pageSize?: number;
  idx?: string;
  type?: string;
  active?: boolean;
}

/**
 * VipRebateListResult is the result for listing VIP rebate schemes.
 */
export interface VipRebateListResult {
  data?: VipRebate[];
  total?: number;
}

/**
 * VipRebateUpsertInput is the input for creating or updating a VIP rebate scheme.
 */
export interface VipRebateUpsertInput {
  /** 選填。0 或不帶 = 新增, >0 = 更新 */
  id?: string;
  idx?: string;
  name?: string;
  type?: string;
  active?: boolean;
  peryaRate?: number;
  slotRate?: number;
  casinoRate?: number;
  egameRate?: number;
  sportRate?: number;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
  bingoRate?: number;
  peryaHouseEdge?: number;
  slotHouseEdge?: number;
  casinoHouseEdge?: number;
  egameHouseEdge?: number;
  sportHouseEdge?: number;
  bingoHouseEdge?: number;
  peryaExchangeRate?: number;
  slotExchangeRate?: number;
  casinoExchangeRate?: number;
  egameExchangeRate?: number;
  sportExchangeRate?: number;
  bingoExchangeRate?: number;
}

/**
 * VipRebateUpsertResult is the result for creating or updating a VIP rebate scheme.
 */
export interface VipRebateUpsertResult {
  data?: VipRebate;
}

export interface XpShopGroupByTypeResult {
  type?: string;
  itemCount?: number;
}

/**
 * XpShopHome：後台預覽分組（對標 GameHome）
 */
export interface XpShopHomeInput {
  page?: number;
  pageSize?: number;
  vecCode?: string;
  vectorCode?: string;
}

export interface XpShopHomeResult {
  data?: XpShopHomeResultData;
  vecs?: XpShopHomeVecResult[];
  groupsByType?: XpShopGroupByTypeResult[];
  total?: number;
  page?: number;
  pageSize?: number;
  dataKeyOrder?: string[];
}

export type XpShopHomeResultData = {[key: string]: XpShopItemList};

export interface XpShopHomeVecResult {
  id?: string;
  name?: string;
  /** 分組代碼（Tab key，與 data / dataKeyOrder 一致） */
  code?: string;
  state?: string;
  sort?: number;
  descriptions?: XpShopHomeVecResultDescriptions;
  images?: XpShopHomeVecResultImages;
  properties?: XpShopHomeVecResultProperties;
  itemCount?: number;
  itemIds?: string[];
}

export type XpShopHomeVecResultDescriptions = {[key: string]: string};

export type XpShopHomeVecResultImages = {[key: string]: string};

export type XpShopHomeVecResultProperties = {[key: string]: string};

/**
 * XpShopItem 積分商城品項
 */
export interface XpShopItem {
  id?: string;
  code?: string;
  name?: string;
  /** 類型: physical(實體商品)/reward(獎勵) */
  type?: string;
  /** 選填。多語系描述（key 如 en、zh） */
  descriptions?: XpShopItemDescriptions;
  /** 所需積分 */
  pointRequired?: string;
  /** 庫存數量 */
  stockQty?: number;
  /** 已兌換數量 */
  itemRedeemed?: number;
  /** 是否無限庫存 */
  isUnlimited?: boolean;
  /** 狀態。允許值：active | inactive */
  state?: string;
  /** 排序 */
  weight?: number;
  /** 圖片網址（多語系、多尺寸，key 如 mobileEn、mobileZh） */
  images?: XpShopItemImages;
  /** reward type 增加 balance */
  rewardBalance?: string;
  /** reward type 的幣別 */
  rewardCurrency?: string;
  /** 所屬分組 Tab key（XpShopHome items[] 回傳；對應 xp_shop_vector.code）
   註：14/15 已由 base 分支的 rewardBalance/rewardCurrency 占用，故此欄改用 16 */
  vectorCode?: string;
}

/**
 * 選填。多語系描述（key 如 en、zh）
 */
export type XpShopItemDescriptions = {[key: string]: string};

/**
 * 圖片網址（多語系、多尺寸，key 如 mobileEn、mobileZh）
 */
export type XpShopItemImages = {[key: string]: string};

export interface XpShopItemList {
  items?: XpShopItem[];
}

/**
 * List
 */
export interface XpShopItemListInput {
  /** 篩選狀態（選填）。允許值：active | inactive */
  state?: string;
  /** 篩選類型（選填）：physical | reward */
  itemType?: string;
  /** 頁碼（選填） */
  page?: number;
  /** 每頁筆數（選填） */
  pageSize?: number;
}

export interface XpShopItemListResult {
  data?: XpShopItem[];
  total?: number;
}

export interface XpShopItemResult {
  item?: XpShopItem;
}

/**
 * Upsert
 */
export interface XpShopItemUpsertInput {
  /** 選填。0 或不帶 = 新增, >0 = 更新 */
  id?: string;
  /** 必填。品項代碼 */
  code: string;
  /** 必填。品項名稱 */
  name?: string;
  /** 必填。類型。允許值：physical | reward */
  type?: string;
  /** 選填。多語系描述（key 如 en、zh）；更新時未送或空則保留既有 */
  descriptions?: XpShopItemUpsertInputDescriptions;
  /** 必填。所需積分 */
  pointRequired?: string;
  /** 必填。庫存數量 */
  stockQty?: number;
  /** 必填。是否無限庫存 */
  isUnlimited?: boolean;
  /** 選填。狀態，未填預設 active。允許值：active | inactive */
  state?: string;
  /** 選填。排序權重，未填預設 0 */
  weight?: number;
  /** 選填。圖片網址（多語系、多尺寸，key 如 mobileEn、mobileZh）；更新時未送或空則保留既有 */
  images?: XpShopItemUpsertInputImages;
  /** （選填）稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
  /** type=reward 時必填。reward type 增加 balance */
  rewardBalance?: string;
  /** type=reward 時必填。reward type 的幣別 */
  rewardCurrency?: string;
}

/**
 * 選填。多語系描述（key 如 en、zh）；更新時未送或空則保留既有
 */
export type XpShopItemUpsertInputDescriptions = {[key: string]: string};

/**
 * 選填。圖片網址（多語系、多尺寸，key 如 mobileEn、mobileZh）；更新時未送或空則保留既有
 */
export type XpShopItemUpsertInputImages = {[key: string]: string};

/**
 * XpShopOrderDetail 訂單明細訊息定義
 */
export interface XpShopOrderDetail {
  id?: string;
  crtTime?: string;
  updTime?: string;
  /** 玩家 ID */
  playerId?: string;
  /** 玩家代碼 */
  playerCode?: string;
  /** 玩家手機號碼 */
  mobile?: string;
  /** 品項 ID */
  itemId?: string;
  /** 品項代碼 */
  itemCode?: string;
  /** 品項名稱 */
  itemName?: string;
  /** 類型。允許值：physical | reward */
  itemType?: string;
  /** 單項所需積分 */
  pointRequired?: string;
  /** 數量 */
  quantity?: number;
  /** 小計積分 */
  total?: string;
  /** 狀態。允許值：normal | cancel | completed | failed | expired | delivered */
  state?: string;
  /** 備註 */
  remark?: string;
  /** 剩餘積分快照（兌換當下） */
  xpRemain?: string;
}

export interface XpShopOrderListInput {
  /** 選填。玩家 ID 篩選 */
  playerId?: string;
  /** 選填。篩選類型：physical | reward */
  itemType?: string;
  /** 選填。頁碼 */
  page?: number;
  /** 選填。每頁筆數 */
  pageSize?: number;
  /** 選填。篩選狀態：normal | cancel | completed | failed | expired | delivered */
  state?: string;
  /** 選填。訂單 ID 精確篩選 */
  orderId?: string;
  /** 選填。品項名稱篩選（LIKE 模糊匹配） */
  itemName?: string;
  playerCode?: string;
  mobile?: string;
  timeFrom?: string;
  timeTo?: string;
}

export interface XpShopOrderListResult {
  data?: XpShopOrderDetail[];
  total?: number;
}

export interface XpShopOrderStateUpdateInput {
  /** 必填。訂單 ID */
  id: string;
  /** 必填。更新狀態 'normal','cancel','completed','failed','expired','delivered' */
  state: string;
  /** 選填：稽核備註（僅寫入 admin_ops_log） */
  opsRemark?: string;
}

export interface XpShopVector {
  id?: string;
  code?: string;
  state?: string;
  sort?: number;
  descriptions?: XpShopVectorDescriptions;
  images?: XpShopVectorImages;
  properties?: XpShopVectorProperties;
  itemCount?: number;
  items?: XpShopItem[];
  /** Tab 顯示名稱（來源：descriptions.en，無則 fallback code） */
  name?: string;
}

export interface XpShopVectorBundleUpsertInput {
  id: string;
  vecCode?: string;
  vecState?: string;
  vecSort?: number;
  relations?: XpShopVectorRelationSortItem[];
  opsRemark?: string;
  /** Tab 顯示名稱（寫入 descriptions.en） */
  vecName?: string;
}

export type XpShopVectorDescriptions = {[key: string]: string};

export type XpShopVectorImages = {[key: string]: string};

export interface XpShopVectorListInput {
  page?: number;
  pageSize?: number;
  states?: string[];
  keywords?: string[];
}

export interface XpShopVectorListResult {
  data?: XpShopVector[];
  total?: number;
}

export type XpShopVectorProperties = {[key: string]: string};

export interface XpShopVectorRelationListByVecInput {
  code: string;
}

export interface XpShopVectorRelationListByVecResult {
  vector?: XpShopVectorRelationVecInfo;
  data?: XpShopVectorRelationRow[];
}

export interface XpShopVectorRelationRow {
  itemId?: string;
  sort?: number;
  itemCode?: string;
  itemName?: string;
  itemType?: string;
  descriptions?: XpShopVectorRelationRowDescriptions;
  images?: XpShopVectorRelationRowImages;
}

export type XpShopVectorRelationRowDescriptions = {[key: string]: string};

export type XpShopVectorRelationRowImages = {[key: string]: string};

export interface XpShopVectorRelationSortItem {
  itemId?: string;
  sort?: number;
}

export interface XpShopVectorRelationVecInfo {
  id?: string;
  sort?: number;
  code?: string;
  state?: string;
  /** Tab 顯示名稱（來源：descriptions.en，無則 fallback code） */
  name?: string;
}

export interface XpShopVectorUpsertInput {
  id?: string;
  code: string;
  state?: string;
  /** 排序序號（小者前）。更新時不傳＝沿用原值；傳 0 才是明確設為 0 */
  sort?: number;
  descriptions?: XpShopVectorUpsertInputDescriptions;
  images?: XpShopVectorUpsertInputImages;
  properties?: XpShopVectorUpsertInputProperties;
  opsRemark?: string;
  /** Tab 顯示名稱（寫入 descriptions.en） */
  name?: string;
}

export type XpShopVectorUpsertInputDescriptions = {[key: string]: string};

export type XpShopVectorUpsertInputImages = {[key: string]: string};

export type XpShopVectorUpsertInputProperties = {[key: string]: string};

export interface XpWalletFcTxnEntry {
  id?: string;
  crtTime?: string;
  updTime?: string;
  playerId?: string;
  playerCode?: string;
  tenantCode?: string;
  type?: string;
  state?: string;
  remark?: string;
  fcBefore?: string;
  fcChange?: string;
  fcAfter?: string;
  refId?: string;
}

export interface XpWalletFcTxnListResult {
  total?: number;
  data?: XpWalletFcTxnEntry[];
}

export interface XpWalletTxnListInput {
  page?: number;
  pageSize?: number;
  timeFrom?: string;
  timeTo?: string;
  playerId?: string;
  playerCode?: string;
  type?: string;
  state?: string;
}

export interface XpWalletXpTxnEntry {
  id?: string;
  crtTime?: string;
  updTime?: string;
  playerId?: string;
  playerCode?: string;
  tenantCode?: string;
  type?: string;
  state?: string;
  remark?: string;
  xpBefore?: string;
  xpChange?: string;
  xpAfter?: string;
  refId?: string;
}

export interface XpWalletXpTxnListResult {
  total?: number;
  data?: XpWalletXpTxnEntry[];
}
