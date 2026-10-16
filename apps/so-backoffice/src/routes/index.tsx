import { Navigate, Route, Routes } from 'react-router';

import { PATH } from '#/constants/path';
import AppLayout from '#/routes/app/Layout';
import AdminsPage from '#/routes/app/admins';
import BetTransPage from '#/routes/app/bet-trans';
import DashboardPage from '#/routes/app/dashboard';
import GameProvidersPage from '#/routes/app/game-providers';
import GameRankingPage from '#/routes/app/game-ranking';
import NotFoundPage from '#/routes/app/not-found';
import PlaceholderPage from '#/routes/app/placeholder';
import LoginPage from '#/routes/login';

const PLACEHOLDER_PATHS = [
  PATH.PLAYERS,
  PATH.PLAYER_SESSIONS,
  PATH.PLAYER_MOBILE_POLICY,
  PATH.PLAYER_SELF_LIMITS,
  PATH.PLAYER_LABELS,
  PATH.PLAYER_GROUPS,
  PATH.LEDGER_TRANS,
  PATH.PAYMENT_TRANSACTION,
  PATH.WAGER_STATS,
  PATH.TOP_WAGER,
  PATH.PATRON_BET_HISTORY,
  PATH.ACSC_REWARD_PUSHLOG,
  PATH.ACSC_TRANSFER,
  PATH.GAMES,
  PATH.GAME_CATEGORIES,
  PATH.BANNERS,
  PATH.BONUSES,
  PATH.REBATE_SETTING,
  PATH.REBATE_TRANS,
  PATH.REWARDS_SHOP,
  PATH.REWARDS_SHOP_CATEGORIES,
  PATH.REDEMPTION_HISTORY,
  PATH.PROMOS,
  PATH.PROMOTION_TRANSACTIONS,
  PATH.PAGES,
  PATH.ADMIN_QUOTA_CONFIGS,
  PATH.ADMIN_QUOTAS,
  PATH.ADMIN_SESSIONS,
  PATH.ADMIN_OPS_LOGS,
  PATH.ROLES,
  PATH.ROLES_PERMISSION,
  PATH.PAYMENT_CHANNELS
] as const satisfies readonly string[];

/**
 * Route tree of the app. The index redirects to PATH.DASHBOARD, PATH.LOGIN
 * renders LoginPage, and every other path renders inside AppLayout, with an
 * unknown one falling through to NotFoundPage.
 */
const AppRoutes = () => (
  <Routes>
    <Route index element={<Navigate to={PATH.DASHBOARD} replace />} />
    <Route path={PATH.LOGIN} element={<LoginPage />} />
    <Route element={<AppLayout />}>
      <Route path={PATH.DASHBOARD} element={<DashboardPage />} />
      <Route path={PATH.ADMINS} element={<AdminsPage />} />
      <Route path={PATH.BET_TRANS} element={<BetTransPage />} />
      <Route path={PATH.GAME_RANKING} element={<GameRankingPage />} />
      <Route path={PATH.GAME_PROVIDERS} element={<GameProvidersPage />} />
      {PLACEHOLDER_PATHS.map(path => (
        <Route key={path} path={path} element={<PlaceholderPage />} />
      ))}
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
);

export default AppRoutes;
