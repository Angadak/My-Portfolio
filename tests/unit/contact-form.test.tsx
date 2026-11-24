import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from '@/components/contact/contact-form';
import { TOAST } from '@/lib/events';

const { sendContact } = vi.hoisted(() => ({ sendContact: vi.fn() }));
vi.mock('@/app/contact/actions', () => ({ sendContact }));

describe('ContactForm', () => {
  it('shows field errors without calling the server when invalid', async () => {
    const user = userEvent.setup();
    render(<ContactForm email="a@b.co" />);
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    expect(screen.getByText('Enter your name')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('a@b.co');
    expect(sendContact).not.toHaveBeenCalled();
  });

  it('sends, toasts and resets on success', async () => {
    sendContact.mockResolvedValue({ status: 'success', message: 'Thanks, your message is on its way.' });
    const toastListener = vi.fn();
    window.addEventListener(TOAST, toastListener);
    const user = userEvent.setup();
    render(<ContactForm email="a@b.co" />);
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Sam Lee');
    await user.type(screen.getByRole('textbox', { name: 'Email' }), 'sam@example.com');
    await user.type(screen.getByRole('textbox', { name: 'Message' }), 'We would like to talk about a role.');
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    await waitFor(() => expect(toastListener).toHaveBeenCalledTimes(1));
    const sent = sendContact.mock.calls[0][0] as FormData;
    expect(sent.get('email')).toBe('sam@example.com');
    expect(Number(sent.get('elapsedMs'))).toBeGreaterThanOrEqual(0);
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('');
    window.removeEventListener(TOAST, toastListener);
  });
});
