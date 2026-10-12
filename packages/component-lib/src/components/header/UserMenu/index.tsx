import { LogOutIcon, UserIcon } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@cbt-bo/component-lib/components/ui/dropdown-menu';

export interface IUserMenuProps {
  userName: string;
  userRole?: string;
  logoutLabel: string;
  onLogout: () => void;
}

const UserMenu = ({ userName, userRole, logoutLabel, onLogout }: IUserMenuProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger
      aria-label={userName}
      className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-sidebar-accent outline-hidden transition-colors hover:bg-sidebar-accent/70"
    >
      <UserIcon className="size-4" aria-hidden />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="min-w-40" sideOffset={6}>
      <DropdownMenuGroup>
        <DropdownMenuLabel className="font-normal text-muted-foreground">
          {userRole ? `${userName} · ${userRole}` : userName}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>
          <LogOutIcon aria-hidden />
          {logoutLabel}
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
);

export default UserMenu;
