import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog';
import { useDisclosure } from '~/hooks/use-disclosure';

export interface IImageModalButtonProps {
  buttonLabel: string;
  imgSrc: string;
  size?: React.ComponentProps<typeof Button>['size'];
}

const ImageModalButton = ({ buttonLabel, imgSrc, size = 'xs' }: IImageModalButtonProps) => {
  const [isOpen, { open, close }] = useDisclosure();

  return (
    <>
      <Button type="button" size={size} disabled={!imgSrc} onClick={open}>
        {buttonLabel}
      </Button>
      <Dialog
        open={isOpen}
        onOpenChange={isNextOpen => {
          if (!isNextOpen) close();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{buttonLabel}</DialogTitle>
            <DialogDescription className="sr-only">{buttonLabel}</DialogDescription>
          </DialogHeader>
          <img src={imgSrc} alt="" className="h-auto w-full rounded-sm" />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageModalButton;
