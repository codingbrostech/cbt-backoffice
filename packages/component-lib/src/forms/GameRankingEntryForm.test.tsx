import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useFormContext } from 'react-hook-form';

import GameRankingEntryForm, {
  type IGameRankingEntryFormLabels,
  type IGameRankingEntryFormProps
} from './GameRankingEntryForm';

const LABELS = {
  rank: 'Rank',
  title: 'Title',
  description: 'Description',
  previousGame: 'Previous game',
  nextGame: 'Next game',
  position: '1 / 2',
  cancel: 'Cancel',
  submit: 'Confirm',
  noResults: 'No results found',
  gameRankedError: 'Ranked'
} as const satisfies IGameRankingEntryFormLabels;

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文' }
];

const GameIdField = () => {
  const { register } = useFormContext();

  return <input aria-label="Game" {...register('gameId')} />;
};

const buildProps = (
  overrides: Partial<IGameRankingEntryFormProps> = {}
): IGameRankingEntryFormProps => ({
  labels: LABELS,
  languages: LANGUAGES,
  gameFields: <GameIdField />,
  rankedGameIds: ['g1', 'g2'],
  position: 0,
  total: 2,
  onSubmit: vi.fn(),
  onStep: vi.fn(),
  onCancel: vi.fn(),
  ...overrides
});

const EDIT_PROPS = {
  isEdit: true,
  values: { gameId: 'g1', titles: { en: 'First' } },
  position: 1
} as const satisfies Partial<IGameRankingEntryFormProps>;

describe('GameRankingEntryForm', () => {
  describe('when adding an entry', () => {
    it('should submit at the rank one past the total', async () => {
      const onSubmit = vi.fn();
      render(<GameRankingEntryForm {...buildProps({ onSubmit })} />);

      fireEvent.change(screen.getByLabelText('Game'), { target: { value: 'g3' } });
      fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ rank: '3', gameId: 'g3' }));
      });
    });

    it('should render no step buttons', () => {
      render(<GameRankingEntryForm {...buildProps()} />);

      expect(screen.queryByRole('button', { name: 'Previous game' })).not.toBeInTheDocument();
    });
  });

  describe('when the texts are padded or blank', () => {
    it('should submit the trimmed texts without the blank ones', async () => {
      const onSubmit = vi.fn();
      render(<GameRankingEntryForm {...buildProps({ onSubmit })} />);

      fireEvent.change(screen.getByLabelText('Game'), { target: { value: 'g3' } });
      fireEvent.change(screen.getByLabelText('Title'), { target: { value: '  Top pick  ' } });
      fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ titles: { en: 'Top pick' }, descriptions: {} })
        );
      });
    });
  });

  describe('when the picked game is already ranked', () => {
    it('should show the ranked error and disable confirm', () => {
      render(<GameRankingEntryForm {...buildProps()} />);

      fireEvent.change(screen.getByLabelText('Game'), { target: { value: 'g2' } });

      expect(screen.getByText('Ranked')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled();
    });
  });

  describe('when editing an entry', () => {
    it('should accept the entry keeping its own game', () => {
      render(<GameRankingEntryForm {...buildProps(EDIT_PROPS)} />);

      expect(screen.queryByText('Ranked')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Confirm' })).toBeEnabled();
    });

    it('should disable the previous button on the first entry', () => {
      render(<GameRankingEntryForm {...buildProps(EDIT_PROPS)} />);

      expect(screen.getByRole('button', { name: 'Previous game' })).toBeDisabled();
    });
  });

  describe('when the next button is clicked', () => {
    it('should call onStep with the values and an offset of 1', async () => {
      const onStep = vi.fn();
      render(<GameRankingEntryForm {...buildProps({ ...EDIT_PROPS, onStep })} />);

      fireEvent.click(screen.getByRole('button', { name: 'Next game' }));

      await waitFor(() => {
        expect(onStep).toHaveBeenCalledWith(
          expect.objectContaining({ rank: '1', gameId: 'g1', titles: { en: 'First' } }),
          1
        );
      });
    });
  });

  describe('when cancel is clicked', () => {
    it('should call onCancel', () => {
      const onCancel = vi.fn();
      render(<GameRankingEntryForm {...buildProps({ onCancel })} />);

      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(onCancel).toHaveBeenCalledOnce();
    });
  });
});
