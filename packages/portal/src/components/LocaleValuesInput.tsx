import { Trash2Icon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  type ILocaleEntry,
  buildOrderedLocaleEntries,
  getSiteLocales,
  normalizeLocaleKey
} from '~/utils/site-locales';

export interface ILocaleValuesInputProps {
  label: string;
  addLabel: string;
  value: ILocaleEntry[];
  onChange: (value: ILocaleEntry[]) => void;
}

/**
 * One text value per site locale. Adds the next missing locale in site order.
 */
const LocaleValuesInput = ({ label, addLabel, value, onChange }: ILocaleValuesInputProps) => {
  const { t } = useTranslation();

  const siteLocales = getSiteLocales();
  const nextKey = siteLocales.find(
    locale => !value.some(entry => normalizeLocaleKey(entry.key) === locale)
  );
  const orderedEntries = buildOrderedLocaleEntries(value, siteLocales);

  const updateEntry = (index: number, next: Partial<ILocaleEntry>) => {
    onChange(value.map((entry, position) => (position === index ? { ...entry, ...next } : entry)));
  };

  const removeEntry = (index: number) => {
    onChange(value.filter((_entry, position) => position !== index));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <Label>{label}</Label>
        <Button
          type="button"
          size="xs"
          disabled={!nextKey}
          onClick={() => {
            if (nextKey) onChange([...value, { key: nextKey, value: '' }]);
          }}
        >
          {addLabel}
        </Button>
      </div>
      {orderedEntries.map(({ entry, index }) => (
        <div key={`${entry.key}-${index}`} className="flex items-center gap-2">
          <Input className="flex-1" placeholder={t('common.key')} readOnly value={entry.key} />
          <Input
            className="flex-1"
            placeholder={t('common.value')}
            value={entry.value}
            onChange={event => {
              updateEntry(index, { value: event.target.value });
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-destructive"
            aria-label={t('common.delete')}
            onClick={() => {
              removeEntry(index);
            }}
          >
            <Trash2Icon />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default LocaleValuesInput;
