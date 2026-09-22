import type { PlayerListInput, Promotion } from '@cbt-bo/api-schema/bo-fm/models';

/** Map one search box to `PlayerListInput`: id (UUID / ObjectId / long numeric id), `mobile`, or `playerCode`. */
export function buildPlayerListParamsFromSearchQuery(
  query: string
): Pick<PlayerListInput, 'id' | 'mobile' | 'playerCode'> {
  const q = query.trim();
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(q);
  if (uuid) return { id: q };
  if (/^[a-f\d]{24}$/i.test(q)) return { id: q };
  if (/^\d{16,}$/.test(q)) return { id: q };
  const phoneLike = /^[\d\s+\-().]+$/u.test(q) && q.replace(/\D/g, '').length >= 6;
  return phoneLike ? { mobile: q } : { playerCode: q };
}

export interface IPromotionIdSelectBundle {
  data: { value: string; label: string }[];
  selectSearchText: Record<string, string>;
}

/** Labels = promotion name (fallback id); search matches name, code, and id. */
export function buildPromotionIdSelectData(promotions: Promotion[]): IPromotionIdSelectBundle {
  interface IRow {
    value: string;
    label: string;
    searchBlob: string;
  }
  const rows: IRow[] = [];
  for (const p of promotions) {
    const id = p.id;
    if (!id) continue;
    const name = p.name?.trim() ?? '';
    const code = p.code?.trim() ?? '';
    rows.push({
      value: id,
      label: name || id,
      searchBlob: `${name} ${code} ${id}`.trim().toLowerCase()
    });
  }
  rows.sort((a, b) => a.label.localeCompare(b.label));

  const data: IPromotionIdSelectBundle['data'] = [];
  const selectSearchText: Record<string, string> = {};
  for (const r of rows) {
    data.push({ value: r.value, label: r.label });
    selectSearchText[r.value] = r.searchBlob;
  }
  return { data, selectSearchText };
}
