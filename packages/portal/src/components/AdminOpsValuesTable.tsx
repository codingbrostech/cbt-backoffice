import { ScrollArea } from '~/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableRow } from '~/components/ui/table';

export interface IAdminOpsValuesTableProps {
  values?: Record<string, string>;
  maxHeight?: number;
}

const DEFAULT_MAX_HEIGHT = 320;
const UNLABELLED_KEY = 'data';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const parseJsonObject = (raw: string): Record<string, unknown> | undefined => {
  const trimmed = raw.trim();
  if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) return undefined;

  try {
    const parsed: unknown = JSON.parse(trimmed);

    return isRecord(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
};

const prettifyJson = (raw: string): string | undefined => {
  const trimmed = raw.trim();
  const isJsonLike =
    (trimmed.startsWith('[') && trimmed.endsWith(']')) ||
    (trimmed.startsWith('{') && trimmed.endsWith('}'));
  if (!isJsonLike) return undefined;

  try {
    return JSON.stringify(JSON.parse(trimmed), null, 2);
  } catch {
    return undefined;
  }
};

const stringifyValue = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);

  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
    ? String(value)
    : '';
};

const PayloadText = ({ text, maxHeight }: { text: string; maxHeight: number }) => (
  <ScrollArea style={{ maxHeight }}>
    <pre className="m-0 font-mono text-xs break-words whitespace-pre-wrap">{text}</pre>
  </ScrollArea>
);

const ValueCell = ({ raw, maxHeight }: { raw: string; maxHeight: number }) => {
  const asObject = parseJsonObject(raw);

  if (asObject) {
    return (
      <div className="rounded-sm border bg-background p-2">
        <Table>
          <TableBody>
            {Object.entries(asObject).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell className="align-top whitespace-nowrap">{key}</TableCell>
                <TableCell className="w-full">
                  <PayloadText text={stringifyValue(value)} maxHeight={maxHeight} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-sm border bg-background p-2">
      <PayloadText text={prettifyJson(raw) ?? raw} maxHeight={maxHeight} />
    </div>
  );
};

/**
 * Renders an ops log payload. A single entry shows its body only, several
 * entries stack with their keys, except `data`.
 */
const AdminOpsValuesTable = ({
  values,
  maxHeight = DEFAULT_MAX_HEIGHT
}: IAdminOpsValuesTableProps) => {
  const entries = Object.entries(values ?? {});

  if (!entries.length) return <span className="text-sm text-muted-foreground">-</span>;

  const [firstEntry] = entries;
  if (entries.length === 1 && firstEntry) {
    const [, raw] = firstEntry;

    return <ValueCell raw={raw} maxHeight={maxHeight} />;
  }

  return (
    <div className="flex flex-col gap-4">
      {entries.map(([key, raw]) => (
        <div key={key}>
          {key !== UNLABELLED_KEY && <p className="mb-1.5 text-xs font-semibold">{key}</p>}
          <ValueCell raw={raw} maxHeight={maxHeight} />
        </div>
      ))}
    </div>
  );
};

export default AdminOpsValuesTable;
