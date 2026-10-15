import type { ReactNode } from 'react';

import { FieldGroup } from '@cbt-bo/component-lib/components/ui/field';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@cbt-bo/component-lib/components/ui/tabs';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface ILanguageTab {
  value: string;
  label: string;
}

export interface ILanguageTabsProps {
  languages: readonly ILanguageTab[];
  /**
   * Renders the panel of one language, such as the fields bound to that
   * language's key.
   */
  children: (language: ILanguageTab) => ReactNode;
  className?: string;
}

const TABS_LIST_CLASS_NAME =
  'w-full justify-start gap-0 border-b p-0 group-data-[orientation=horizontal]/tabs:h-8';

const TABS_TRIGGER_CLASS_NAME =
  'h-full flex-none rounded-none px-3 text-xs after:bg-primary group-data-[orientation=horizontal]/tabs:after:bottom-[-1px]';

/**
 * Underlined tabs that switch the panel between languages, one tab per
 * entry of `languages`. Only the selected panel is mounted.
 *
 * @example
 * <LanguageTabs languages={languages}>
 *   {({ value }) => <TextField control={control} name={`titles.${value}`} label={labels.title} />}
 * </LanguageTabs>
 */
const LanguageTabs = ({ languages, children, className }: ILanguageTabsProps) => {
  const [firstLanguage] = languages;

  return (
    <Tabs defaultValue={firstLanguage?.value} className={cn('gap-3', className)}>
      <TabsList variant="line" className={TABS_LIST_CLASS_NAME}>
        {languages.map(({ value, label }) => (
          <TabsTrigger key={value} value={value} className={TABS_TRIGGER_CLASS_NAME}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
      {languages.map(language => (
        <TabsContent key={language.value} value={language.value}>
          <FieldGroup>{children(language)}</FieldGroup>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default LanguageTabs;
