import { DashboardPage } from '@cbt-bo/portal/pages/dashboard';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard')({ component: DashboardPage });
