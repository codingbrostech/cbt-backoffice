import { useTranslation } from 'react-i18next';

import { Button } from '~/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '~/components/ui/hover-card';

export interface IImageHoverButtonProps {
  imgSrc: string;
  size?: React.ComponentProps<typeof Button>['size'];
}

const ImageHoverButton = ({ imgSrc, size = 'xs' }: IImageHoverButtonProps) => {
  const { t } = useTranslation();

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button type="button" size={size} disabled={!imgSrc}>
          {t('common.preview')}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-72 p-2">
        <img src={imgSrc} alt="" className="h-auto w-full rounded-sm" />
      </HoverCardContent>
    </HoverCard>
  );
};

export default ImageHoverButton;
