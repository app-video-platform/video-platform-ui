import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import ExpansionPanel from './expansion-panel.component';

describe('<ExpansionPanel />', () => {
  it('forwards the id prop to the root element', () => {
    render(
      <ExpansionPanel id="section-section-1" header={<span>Header</span>}>
        <div>Body</div>
      </ExpansionPanel>,
    );

    expect(screen.getByText('Header').closest('#section-section-1')).toBeInTheDocument();
  });
});
