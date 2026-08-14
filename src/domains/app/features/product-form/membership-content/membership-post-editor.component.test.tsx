import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import MembershipPostEditor from './membership-post-editor.component';
import { MembershipPostDraft } from './models';

const draft: MembershipPostDraft = {
  title: 'Weekly note',
  body: 'Here is what changed this week.',
  status: 'DRAFT',
};

const renderEditor = (value: MembershipPostDraft = draft) => {
  const onChange = jest.fn();
  const onSave = jest.fn();
  const onCancel = jest.fn();

  render(
    <MembershipPostEditor
      value={value}
      onChange={onChange}
      onSave={onSave}
      onCancel={onCancel}
    />,
  );

  return { onChange, onSave, onCancel };
};

describe('<MembershipPostEditor />', () => {
  it('renders title', () => {
    renderEditor();

    expect(screen.getByDisplayValue('Weekly note')).toBeInTheDocument();
  });

  it('renders body', () => {
    renderEditor();

    expect(
      screen.getByDisplayValue('Here is what changed this week.'),
    ).toBeInTheDocument();
  });

  it('default status is DRAFT', () => {
    renderEditor({
      title: '',
      body: '',
      status: 'DRAFT',
    });

    expect(screen.getByLabelText('Status')).toHaveValue('DRAFT');
  });

  it('editing fields calls controlled change handler', () => {
    const { onChange } = renderEditor();

    fireEvent.change(screen.getByPlaceholderText('Post title'), {
      target: { value: 'Updated title' },
    });
    fireEvent.change(screen.getByPlaceholderText('Write a member-only update'), {
      target: { value: 'Updated body' },
    });

    expect(onChange).toHaveBeenCalledWith({
      ...draft,
      title: 'Updated title',
    });
    expect(onChange).toHaveBeenCalledWith({
      ...draft,
      body: 'Updated body',
    });
  });

  it('invalid Post cannot be saved', () => {
    const { onSave } = renderEditor({
      title: '  ',
      body: 'Body',
      status: 'DRAFT',
    });

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSave).not.toHaveBeenCalled();
  });

  it('valid Post can be saved', () => {
    const { onSave } = renderEditor();

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('changing status preserves other values', () => {
    const { onChange } = renderEditor();

    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'PUBLISHED' },
    });

    expect(onChange).toHaveBeenCalledWith({
      ...draft,
      status: 'PUBLISHED',
    });
  });

  it('Cancel works', () => {
    const { onCancel } = renderEditor();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
