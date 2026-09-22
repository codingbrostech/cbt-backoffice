import { UserIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import AppInfo from '~/components/AppInfo';
import ChangePasswordForm from '~/components/ChangePasswordForm';
import LanguagePicker from '~/components/LanguagePicker';
import ThemeSwitch from '~/components/ThemeSwitch';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu';
import { SidebarTrigger } from '~/components/ui/sidebar';
import { getPortalConfig } from '~/config';
import { useApp } from '~/hooks/use-app';
import { useDisclosure } from '~/hooks/use-disclosure';

const DEFAULT_USER_LABEL = 'User';

export interface IAppHeaderProps {
  isSidebarAvailable: boolean;
}

const AppHeader = ({ isSidebarAvailable }: IAppHeaderProps) => {
  const { isAuth, user, userLogout } = useApp();
  const { t } = useTranslation();
  const [isPasswordDialogOpen, { open: openPasswordDialog, close: closePasswordDialog }] =
    useDisclosure();

  const { portalName } = getPortalConfig();
  const { name: userName = '' } = user ?? {};
  const userLabel = userName === '' ? DEFAULT_USER_LABEL : userName;

  return (
    <header className="flex h-(--app-header-height) shrink-0 items-center gap-2 border-b bg-background px-4">
      {isSidebarAvailable && <SidebarTrigger className="md:hidden" />}
      <h1 className="truncate font-heading text-base font-bold">{portalName}</h1>
      <div className="ml-auto flex items-center gap-1.5">
        <div className="hidden lg:block">
          <AppInfo />
        </div>
        <ThemeSwitch />
        <LanguagePicker variant="collapsed" />
        {isAuth && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full" aria-label={userLabel}>
                <UserIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>{userLabel}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={openPasswordDialog}>
                {t('header.changePw')}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={userLogout}>{t('header.logout')}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <Dialog
        open={isPasswordDialogOpen}
        onOpenChange={isOpen => {
          if (!isOpen) closePasswordDialog();
        }}
      >
        <DialogContent
          showCloseButton={false}
          onInteractOutside={event => {
            event.preventDefault();
          }}
          onEscapeKeyDown={event => {
            event.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>{t('header.changePw')}</DialogTitle>
            <DialogDescription className="sr-only">{t('header.changePw')}</DialogDescription>
          </DialogHeader>
          <ChangePasswordForm
            onRequestClose={closePasswordDialog}
            onUpdateSuccess={closePasswordDialog}
          />
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default AppHeader;
