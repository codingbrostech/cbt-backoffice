import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import LoginForm, { type ILoginFormLabels } from './LoginForm';

const LABELS = {
  account: 'Admin ID',
  password: 'Password',
  remember: 'Remember login information',
  submit: 'Login',
  showPassword: 'Show password',
  hidePassword: 'Hide password',
  accountRequiredError: 'Admin ID is required',
  passwordRequiredError: 'Password is required'
} as const satisfies ILoginFormLabels;

describe('LoginForm', () => {
  describe('when submitted with both fields filled', () => {
    it('should call onSubmit with the values and the remember-me flag', async () => {
      const onSubmit = vi.fn();
      render(<LoginForm labels={LABELS} onSubmit={onSubmit} />);

      fireEvent.change(screen.getByLabelText('Admin ID'), { target: { value: 'ada' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } });
      fireEvent.click(screen.getByRole('checkbox', { name: 'Remember login information' }));
      fireEvent.click(screen.getByRole('button', { name: 'Login' }));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          username: 'ada',
          password: 'secret',
          isRememberMe: true
        });
      });
    });
  });

  describe('when submitted empty', () => {
    it('should show the required messages and not submit', async () => {
      const onSubmit = vi.fn();
      render(<LoginForm labels={LABELS} onSubmit={onSubmit} />);

      fireEvent.click(screen.getByRole('button', { name: 'Login' }));

      expect(await screen.findByText('Admin ID is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('when default values are given', () => {
    it('should prefill the username and check remember-me', () => {
      render(
        <LoginForm
          labels={LABELS}
          defaultValues={{ username: 'ada', isRememberMe: true }}
          onSubmit={vi.fn()}
        />
      );

      expect(screen.getByLabelText('Admin ID')).toHaveValue('ada');
      expect(screen.getByRole('checkbox', { name: 'Remember login information' })).toBeChecked();
    });
  });

  describe('when the password toggle is pressed', () => {
    it('should reveal the password', () => {
      render(<LoginForm labels={LABELS} onSubmit={vi.fn()} />);

      fireEvent.click(screen.getByRole('button', { name: 'Show password' }));

      expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text');
    });
  });
});
