import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm, TOPICS } from '@/components/contact/contact-form';
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

  it('moves focus to the first invalid field', async () => {
    const user = userEvent.setup();
    render(<ContactForm email="a@b.co" />);
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus());
  });

  it('shows a mailto fallback when the server action rejects', async () => {
    sendContact.mockRejectedValue(new Error('500'));
    const user = userEvent.setup();
    render(<ContactForm email="a@b.co" />);
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Sam Lee');
    await user.type(screen.getByRole('textbox', { name: 'Email' }), 'sam@example.com');
    await user.type(screen.getByRole('textbox', { name: 'Message' }), 'We would like to talk about a role.');
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent("couldn't be sent");
    expect(alert.querySelector('a[href="mailto:a@b.co"]')).not.toBeNull();
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
    expect(screen.getByRole('status')).toHaveTextContent('Thanks, your message is on its way.');
    window.removeEventListener(TOAST, toastListener);
  });

  it('quick-start chips fill an empty message but never overwrite your own text', async () => {
    const user = userEvent.setup();
    render(<ContactForm email="a@b.co" />);
    const message = screen.getByRole('textbox', { name: 'Message' });
    await user.click(screen.getByRole('button', { name: 'Full-time role' }));
    expect(message).toHaveValue(TOPICS[0].text);
    expect(screen.getByRole('button', { name: 'Full-time role' })).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: 'Contract work' }));
    expect(message).toHaveValue(TOPICS[1].text);
    await user.type(message, ' Budget is flexible.');
    await user.click(screen.getByRole('button', { name: 'Just saying hi' }));
    expect(message).toHaveValue(`${TOPICS[1].text} Budget is flexible.`);
  });

  it('clears a field error as soon as the field is edited', async () => {
    const user = userEvent.setup();
    render(<ContactForm email="a@b.co" />);
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    expect(screen.getByText('Enter your name')).toBeInTheDocument();
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Sa');
    expect(screen.queryByText('Enter your name')).toBeNull();
    expect(screen.getByRole('textbox', { name: 'Name' })).not.toHaveAttribute('aria-invalid');
  });
});
