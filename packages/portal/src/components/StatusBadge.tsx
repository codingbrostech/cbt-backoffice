import { Badge } from '~/components/ui/badge';
import { cn } from '~/lib/utils';

export interface IStatusBadgeProps {
  /**
   * Palette name from the status colour maps in `constants`.
   */
  color: string;
  children: React.ReactNode;
  className?: string;
}

const BADGE_CLASSES: Readonly<Record<string, string>> = {
  green: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200',
  teal: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-200',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
  cyan: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-200',
  yellow: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200',
  orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200',
  red: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
  pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-200',
  violet: 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200',
  grape: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200',
  indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200',
  lime: 'bg-lime-100 text-lime-800 dark:bg-lime-900/50 dark:text-lime-200'
} as const;

const NEUTRAL_BADGE_CLASS = 'bg-muted text-muted-foreground';

/**
 * Tinted badge for status values, coloured by the palette name of the
 * status colour maps.
 */
const StatusBadge = ({ color, children, className }: IStatusBadgeProps) => (
  <Badge
    variant="secondary"
    className={cn('font-medium', BADGE_CLASSES[color] ?? NEUTRAL_BADGE_CLASS, className)}
  >
    {children}
  </Badge>
);

export default StatusBadge;
