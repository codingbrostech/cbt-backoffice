import { Trash2Icon } from 'lucide-react';
import { useId, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import ImageHoverButton from '~/components/ImageHoverButton';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { getSiteLocales } from '~/utils/site-locales';

export interface IImageItem {
  key: string;
  value: string;
  file?: File;
}

export interface IImagesInputProps {
  label: string;
  addLabel: string;
  value: IImageItem[];
  onChange: (value: IImageItem[]) => void;
  /**
   * Keys offered in order. Defaults to the mobile English image only.
   */
  keyOrder?: readonly string[];
  /**
   * Lets the user type the key instead of taking the next one from `keyOrder`.
   */
  isCustomKeyAllowed?: boolean;
  /**
   * Shows a row for every key in `keyOrder`, filled or not.
   */
  isShowingAllKeys?: boolean;
}

interface IDisplayRow {
  key: string;
  item?: IImageItem;
  index: number;
}

const IMAGE_LAYOUTS = ['mobile', 'desktop'] as const;

const buildImageKey = (layout: string, locale: string): string =>
  `${layout}${locale.charAt(0).toUpperCase()}${locale.slice(1)}`;

const DEFAULT_KEY_ORDER: readonly string[] = [buildImageKey('mobile', 'en')];

/**
 * Image keys for every layout and site locale, layouts first.
 */
export const getLocalizedImageKeyOrder = (): readonly string[] => {
  const locales = getSiteLocales();

  return IMAGE_LAYOUTS.flatMap(layout => locales.map(locale => buildImageKey(layout, locale)));
};

export const hasImage = (item: IImageItem): boolean => Boolean(item.file ?? item.value);

const hasFile = (item: IImageItem): item is IImageItem & { file: File } => Boolean(item.file);

const buildDisplayRows = (
  value: IImageItem[],
  keyOrder: readonly string[],
  isListingAllKeys: boolean
): IDisplayRow[] => {
  const valueRows = value.map((item, index) => ({ key: item.key, item, index }));

  if (isListingAllKeys) {
    const keyedRows = keyOrder.map(key => {
      const index = value.findIndex(item => item.key === key);

      return { key, item: value[index], index };
    });

    return [...keyedRows, ...valueRows.filter(row => !keyOrder.includes(row.key))];
  }

  const rankByKey = new Map(keyOrder.map((key, rank) => [key, rank]));
  const rankOf = (row: IDisplayRow) => rankByKey.get(row.key) ?? keyOrder.length;

  return [...valueRows].sort((left, right) => rankOf(left) - rankOf(right));
};

const ImagesInput = ({
  label,
  addLabel,
  value,
  onChange,
  keyOrder = DEFAULT_KEY_ORDER,
  isCustomKeyAllowed = false,
  isShowingAllKeys = false
}: IImagesInputProps) => {
  const { t } = useTranslation();
  const inputId = useId();

  const isListingAllKeys = !isCustomKeyAllowed && isShowingAllKeys;
  const nextKey = isCustomKeyAllowed
    ? ''
    : keyOrder.find(key => !value.some(item => item.key === key));
  const rows = buildDisplayRows(value, keyOrder, isListingAllKeys);
  const previewUrls = useMemo(
    () =>
      new Map<IImageItem, string>(
        value.filter(hasFile).map(item => [item, URL.createObjectURL(item.file)])
      ),
    [value]
  );

  const updateItem = (index: number, next: Partial<IImageItem>) => {
    onChange(value.map((item, position) => (position === index ? { ...item, ...next } : item)));
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_item, position) => position !== index));
  };

  const pickFile = (row: IDisplayRow, file: File | undefined) => {
    if (!file) return;

    if (row.item) updateItem(row.index, { file });
    else onChange([...value, { key: row.key, value: '', file }]);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <Label>{label}</Label>
        {!isListingAllKeys && (
          <Button
            type="button"
            size="xs"
            disabled={!isCustomKeyAllowed && !nextKey}
            onClick={() => {
              onChange([...value, { key: nextKey ?? '', value: '' }]);
            }}
          >
            {addLabel}
          </Button>
        )}
      </div>
      {rows.map(row => {
        const fileInputId = `${inputId}-${row.key}-${row.index}`;
        const previewUrl = (row.item && previewUrls.get(row.item)) ?? row.item?.value ?? '';

        return (
          <div key={`${row.key}-${row.index}`} className="flex items-center gap-2">
            <Input
              className="flex-1"
              placeholder={t('common.key')}
              readOnly={!isCustomKeyAllowed || !row.item}
              value={row.item?.key ?? row.key}
              onChange={event => {
                if (row.item) updateItem(row.index, { key: event.target.value });
              }}
            />
            <input
              id={fileInputId}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={event => {
                pickFile(row, event.target.files?.[0]);
                event.target.value = '';
              }}
            />
            <Button type="button" size="sm" asChild>
              <label htmlFor={fileInputId} className="cursor-pointer">
                {t('common.uploadImage')}
              </label>
            </Button>
            <ImageHoverButton imgSrc={previewUrl} size="sm" />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-destructive"
              aria-label={t('common.delete')}
              disabled={!row.item || (isListingAllKeys && !hasImage(row.item))}
              onClick={() => {
                removeItem(row.index);
              }}
            >
              <Trash2Icon />
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default ImagesInput;
