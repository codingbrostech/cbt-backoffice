import { ClientOnly } from '@tanstack/react-router';
import { Editor as TinyMceEditor } from '@tinymce/tinymce-react';
import { Trash2Icon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { Skeleton } from '~/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
import {
  type ILocaleEntry,
  buildOrderedLocaleEntries,
  getSiteLocales,
  normalizeLocaleKey
} from '~/utils/site-locales';

export interface IRichTextLocaleValuesInputProps {
  label: string;
  addLabel: string;
  value: ILocaleEntry[];
  onChange: (value: ILocaleEntry[]) => void;
  /**
   * Changing it remounts the editors with the current values.
   */
  resetKey?: string;
}

const TINYMCE_SCRIPT_SRC = 'https://cdn.jsdelivr.net/npm/tinymce@8/tinymce.min.js';
const TINYMCE_I18N_BASE = 'https://cdn.jsdelivr.net/npm/tinymce-i18n@26.4.6/langs8';
const EDITOR_HEIGHT = 260;

const buildUiLocale = (language: string) =>
  language === 'zh' || language.startsWith('zh-')
    ? { language: 'zh-TW', language_url: `${TINYMCE_I18N_BASE}/zh-TW.js` }
    : {};

interface ILocaleEditorProps {
  initialValue: string;
  init: React.ComponentProps<typeof TinyMceEditor>['init'];
  onChange: (html: string) => void;
}

/**
 * One TinyMCE instance. The initial HTML is captured on mount so later
 * value updates never reset the editor content while typing.
 */
const LocaleEditor = ({ initialValue, init, onChange }: ILocaleEditorProps) => {
  const [initialHtml] = useState(initialValue);

  return (
    <TinyMceEditor
      licenseKey="gpl"
      tinymceScriptSrc={TINYMCE_SCRIPT_SRC}
      scriptLoading={{ async: true, defer: true }}
      initialValue={initialHtml}
      onEditorChange={onChange}
      init={init}
    />
  );
};

/**
 * One HTML value per site locale, edited in TinyMCE behind locale tabs.
 */
const RichTextLocaleValuesInput = ({
  label,
  addLabel,
  value,
  onChange,
  resetKey = 'default'
}: IRichTextLocaleValuesInputProps) => {
  const { t, i18n } = useTranslation();
  const [activeKey, setActiveKey] = useState<string>();

  const language = i18n.resolvedLanguage ?? i18n.language;
  const siteLocales = getSiteLocales();
  const nextKey = siteLocales.find(
    locale => !value.some(entry => normalizeLocaleKey(entry.key) === locale)
  );
  const orderedEntries = buildOrderedLocaleEntries(value, siteLocales);
  const [firstEntry] = orderedEntries;
  const activeEntry = orderedEntries.find(({ entry }) => entry.key === activeKey) ?? firstEntry;
  const editorInit = useMemo(
    () => ({
      height: EDITOR_HEIGHT,
      ...buildUiLocale(language),
      menubar: false,
      branding: false,
      promotion: false,
      statusbar: false,
      plugins: ['autolink', 'code', 'link', 'lists'],
      toolbar:
        'undo redo | blocks fontsize | bold italic underline | bullist numlist | link | removeformat | code',
      toolbar_mode: 'sliding' as const,
      font_size_formats: '10px 12px 14px 16px 18px 20px 24px 32px',
      block_formats: 'Paragraph=p; Heading 2=h2; Heading 3=h3',
      browser_spellcheck: true,
      contextmenu: false as const,
      content_style:
        'body { font-family: Inter, Arial, sans-serif; font-size: 14px; line-height: 1.5; }'
    }),
    [language]
  );

  const localeLabel = (key: string) => t(`richTextLocale.${key}`, { defaultValue: key });

  const updateValue = (index: number, html: string) => {
    onChange(
      value.map((entry, position) => (position === index ? { ...entry, value: html } : entry))
    );
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
            if (!nextKey) return;

            onChange([...value, { key: nextKey, value: '' }]);
            setActiveKey(nextKey);
          }}
        >
          {addLabel}
        </Button>
      </div>
      {!value.length && <p className="text-sm text-muted-foreground">{addLabel}</p>}
      {activeEntry && (
        <Tabs value={activeEntry.entry.key} onValueChange={setActiveKey}>
          <TabsList>
            {orderedEntries.map(({ entry }) => (
              <TabsTrigger key={entry.key} value={entry.key}>
                {localeLabel(entry.key)}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="mt-2 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">{localeLabel(activeEntry.entry.key)}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-destructive"
                aria-label={t('common.delete')}
                onClick={() => {
                  removeEntry(activeEntry.index);
                }}
              >
                <Trash2Icon />
              </Button>
            </div>
            <ClientOnly fallback={<Skeleton style={{ height: EDITOR_HEIGHT }} />}>
              <LocaleEditor
                key={`${activeEntry.entry.key}-${resetKey}-${language}`}
                initialValue={activeEntry.entry.value}
                init={editorInit}
                onChange={html => {
                  updateValue(activeEntry.index, html);
                }}
              />
            </ClientOnly>
          </div>
        </Tabs>
      )}
    </div>
  );
};

export default RichTextLocaleValuesInput;
