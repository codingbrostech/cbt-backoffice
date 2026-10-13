import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import AdminForm, { type IAdminFormLabels } from './AdminForm';

const LABELS = {
  code: 'Login',
  name: 'Name',
  secret: 'Password',
  role: 'Role',
  rolePlaceholder: 'Select a role',
  state: 'State',
  secretPlaceholder: 'Leave blank to keep the current password',
  submit: 'Save',
  cancel: 'Cancel',
  showPassword: 'Show password',
  hidePassword: 'Hide password',
  codeRequiredError: 'Login is required',
  secretRequiredError: 'Password is required',
  roleRequiredError: 'Role is required'
} as const satisfies IAdminFormLabels;

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'ops', label: 'Ops' }
];

describe('AdminForm', () => {
  describe('when submitted with the required fields filled', () => {
    it('should call onSubmit with the values', async () => {
      const onSubmit = vi.fn();
      render(
        <AdminForm
          labels={LABELS}
          roleOptions={ROLE_OPTIONS}
          defaultValues={{ role: 'admin' }}
          onSubmit={onSubmit}
        />
      );

      fireEvent.change(screen.getByLabelText('Login'), { target: { value: 'ada' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } });
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          code: 'ada',
          name: '',
          secret: 'secret',
          role: 'admin',
          state: ''
        });
      });
    });
  });

  describe('when submitted empty', () => {
    it('should show the required messages and not submit', async () => {
      const onSubmit = vi.fn();
      render(<AdminForm labels={LABELS} roleOptions={ROLE_OPTIONS} onSubmit={onSubmit} />);

      fireEvent.click(screen.getByRole('button', { name: 'Save' }));

      expect(await screen.findByText('Login is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
      expect(screen.getByText('Role is required')).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('when onCancel is given', () => {
    it('should render a cancel button that calls it', () => {
      const onCancel = vi.fn();
      render(
        <AdminForm
          labels={LABELS}
          roleOptions={ROLE_OPTIONS}
          onSubmit={vi.fn()}
          onCancel={onCancel}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(onCancel).toHaveBeenCalledOnce();
    });
  });

  describe('when onCancel is not given', () => {
    it('should render no cancel button', () => {
      render(<AdminForm labels={LABELS} roleOptions={ROLE_OPTIONS} onSubmit={vi.fn()} />);

      expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
    });
  });

  describe('when editing', () => {
    it('should keep the login read-only and accept a blank password', async () => {
      const onSubmit = vi.fn();
      render(
        <AdminForm
          isEdit
          labels={LABELS}
          roleOptions={ROLE_OPTIONS}
          defaultValues={{ code: 'ada', name: 'Ada', role: 'admin' }}
          onSubmit={onSubmit}
        />
      );

      expect(screen.getByLabelText('Login')).toBeDisabled();

      fireEvent.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          code: 'ada',
          name: 'Ada',
          secret: '',
          role: 'admin',
          state: ''
        });
      });
    });
  });

  describe('when stateOptions are given', () => {
    it('should render the state select', () => {
      render(
        <AdminForm
          labels={LABELS}
          roleOptions={ROLE_OPTIONS}
          stateOptions={[{ value: 'active', label: 'Active' }]}
          onSubmit={vi.fn()}
        />
      );

      expect(screen.getByRole('combobox', { name: 'State' })).toBeInTheDocument();
    });
  });

  describe('when stateOptions are not given', () => {
    it('should render no state select', () => {
      render(<AdminForm labels={LABELS} roleOptions={ROLE_OPTIONS} onSubmit={vi.fn()} />);

      expect(screen.queryByRole('combobox', { name: 'State' })).not.toBeInTheDocument();
    });
  });
});
