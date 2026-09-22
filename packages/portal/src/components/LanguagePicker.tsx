import { useSelector } from '@tanstack/react-store';
import { ChevronDownIcon } from 'lucide-react';

import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu';
import { settingStore } from '~/store/setting-store';

interface ILanguageItem {
  label: string;
  flag: string;
  language: string;
}

export interface ILanguagePickerProps {
  variant: 'collapsed' | 'expanded';
}

const LANGUAGES = [
  { label: 'English', flag: '🇺🇸', language: 'en' },
  { label: '繁體中文', flag: '🇹🇼', language: 'zh' }
] as const satisfies readonly ILanguageItem[];

const [DEFAULT_LANGUAGE] = LANGUAGES;

const LanguagePicker = ({ variant }: ILanguagePickerProps) => {
  const language = useSelector(settingStore, state => state.language);

  const selected = LANGUAGES.find(item => item.language === language) ?? DEFAULT_LANGUAGE;
  const isExpanded = variant === 'expanded';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={isExpanded ? 'default' : 'icon'} aria-label="Language">
          <span aria-hidden="true">{selected.flag}</span>
          {isExpanded && <span>{selected.label}</span>}
          {isExpanded && <ChevronDownIcon className="text-muted-foreground" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map(item => (
          <DropdownMenuItem
            key={item.language}
            onSelect={() => {
              settingStore.actions.setLanguage(item.language);
            }}
          >
            <span aria-hidden="true">{item.flag}</span>
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguagePicker;
