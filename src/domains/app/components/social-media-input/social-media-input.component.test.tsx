import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import SocialMediaInput from './social-media-input.component';
import { SocialMediaLink, SocialPlatforms } from 'core/api/models';

jest.mock('@shared/ui', () => {
  const actual = jest.requireActual('@shared/ui');
  return { ...actual, Icon: () => null };
});

const originalLink: SocialMediaLink = {
  id: 'link-1',
  platform: SocialPlatforms.FB,
  url: 'https://example.invalid/original',
};

const openPlatform = async () => {
  fireEvent.click(screen.getByTitle('Facebook'));
  return screen.findByPlaceholderText('Enter value...');
};

const confirmWithEnter = (input: HTMLElement) =>
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

describe('SocialMediaInput current-value restoration', () => {
  it('restores the original link after changing it', async () => {
    const onChange = jest.fn();
    render(
      <SocialMediaInput initialSocialLinks={[originalLink]} onChange={onChange} />,
    );

    const edit = await openPlatform();
    fireEvent.change(edit, {
      target: { value: 'https://example.invalid/changed' },
    });
    confirmWithEnter(edit);
    await waitFor(() =>
      expect(onChange).toHaveBeenLastCalledWith([
        expect.objectContaining({ url: 'https://example.invalid/changed' }),
      ]),
    );
    await waitFor(() =>
      expect(screen.queryByPlaceholderText('Enter value...')).not.toBeInTheDocument(),
    );

    const restore = await openPlatform();
    fireEvent.change(restore, { target: { value: originalLink.url } });
    confirmWithEnter(restore);

    await waitFor(() =>
      expect(onChange).toHaveBeenLastCalledWith([
        expect.objectContaining({ url: originalLink.url }),
      ]),
    );
  });

  it('restores the original link after clearing it through the button', async () => {
    const onChange = jest.fn();
    render(
      <SocialMediaInput initialSocialLinks={[originalLink]} onChange={onChange} />,
    );

    const clear = await openPlatform();
    fireEvent.change(clear, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(onChange).toHaveBeenLastCalledWith([]));
    await waitFor(() =>
      expect(screen.queryByPlaceholderText('Enter value...')).not.toBeInTheDocument(),
    );

    const restore = await openPlatform();
    fireEvent.change(restore, { target: { value: originalLink.url } });
    confirmWithEnter(restore);
    await waitFor(() =>
      expect(onChange).toHaveBeenLastCalledWith([
        expect.objectContaining({ url: originalLink.url }),
      ]),
    );
  });

  it('updates one platform entry instead of adding a duplicate', async () => {
    const onChange = jest.fn();
    render(<SocialMediaInput onChange={onChange} />);

    const first = await openPlatform();
    fireEvent.change(first, { target: { value: 'https://example.invalid/one' } });
    confirmWithEnter(first);
    await waitFor(() =>
      expect(onChange).toHaveBeenLastCalledWith([
        expect.objectContaining({ url: 'https://example.invalid/one' }),
      ]),
    );
    await waitFor(() =>
      expect(screen.queryByPlaceholderText('Enter value...')).not.toBeInTheDocument(),
    );

    const second = await openPlatform();
    fireEvent.change(second, { target: { value: 'https://example.invalid/two' } });
    confirmWithEnter(second);
    await waitFor(() =>
      expect(onChange).toHaveBeenLastCalledWith([
        expect.objectContaining({ url: 'https://example.invalid/two' }),
      ]),
    );
  });
});
