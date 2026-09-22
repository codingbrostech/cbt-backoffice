import { EyeIcon, EyeOffIcon } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { useDisclosure } from '~/hooks/use-disclosure';
import { cn } from '~/lib/utils';

export type TPasswordInputProps = Omit<React.ComponentProps<typeof Input>, 'type'>;

const PasswordInput = ({ className, ...props }: TPasswordInputProps) => {
  const [isVisible, { toggle }] = useDisclosure();

  return (
    <div className="relative">
      <Input type={isVisible ? 'text' : 'password'} className={cn('pr-9', className)} {...props} />
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground"
        aria-label={isVisible ? 'Hide password' : 'Show password'}
        onClick={toggle}
      >
        {isVisible ? <EyeOffIcon /> : <EyeIcon />}
      </Button>
    </div>
  );
};

export default PasswordInput;
