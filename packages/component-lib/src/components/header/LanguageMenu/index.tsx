import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@cbt-bo/component-lib/components/ui/dropdown-menu';

export interface ILanguageOption {
  value: string;
  label: string;
  shortLabel: string;
}

export interface ILanguageMenuProps {
  currentLanguage: string;
  options: ILanguageOption[];
  onChange: (language: string) => void;
}

const LanguageMenu = ({ currentLanguage, options, onChange }: ILanguageMenuProps) => {
  const { shortLabel = currentLanguage.toUpperCase() } =
    options.find(option => option.value === currentLanguage) ?? {};

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex size-8 cursor-pointer items-center justify-center rounded-md text-sm font-medium outline-hidden hover:bg-sidebar-accent">
        {shortLabel}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={10}>
        <DropdownMenuRadioGroup value={currentLanguage} onValueChange={onChange}>
          {options.map(option => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageMenu;
