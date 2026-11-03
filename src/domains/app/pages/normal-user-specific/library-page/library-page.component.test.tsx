import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  MemoryRouter,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';

import LibraryPage from './library-page.component';

const tabs = [
  ['all-products', 'All products'],
  ['my-courses', 'Courses'],
  ['my-download-packages', 'Download Packages'],
  ['my-consultation', 'Consultation sessions'],
  ['my-wishlist', 'Wishlist'],
];

const HistoryControls = () => {
  const navigate = useNavigate();
  return (
    <>
      <button type="button" onClick={() => navigate(-1)}>Back</button>
      <button type="button" onClick={() => navigate(1)}>Forward</button>
    </>
  );
};

const renderLibrary = (path: string) =>
  render(
    <MemoryRouter initialEntries={[`/app/library/${path}`]}>
      <Routes>
        <Route path="/app/library" element={<LibraryPage />}>
          {tabs.map(([tabPath, label]) => (
            <Route
              key={tabPath}
              path={tabPath}
              element={<p>{label} content</p>}
            />
          ))}
        </Route>
      </Routes>
    </MemoryRouter>,
  );

describe('LibraryPage route-backed tabs', () => {
  it.each(tabs)('selects %s when its child route is active', (path, label) => {
    renderLibrary(path);

    expect(screen.getByRole('tab', { name: label })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByText(`${label} content`)).toBeInTheDocument();
    for (const [, otherLabel] of tabs.filter(([, tabLabel]) => tabLabel !== label)) {
      expect(screen.getByRole('tab', { name: otherLabel })).toHaveAttribute(
        'aria-selected',
        'false',
      );
    }
  });

  it('navigates and moves focus with the tablist arrow keys', () => {
    renderLibrary('all-products');
    const allProductsTab = screen.getByRole('tab', { name: 'All products' });

    fireEvent.keyDown(allProductsTab, { key: 'ArrowRight' });

    const coursesTab = screen.getByRole('tab', { name: 'Courses' });
    expect(coursesTab).toHaveAttribute('aria-selected', 'true');
    expect(coursesTab).toHaveFocus();
    expect(screen.getByText('Courses content')).toBeInTheDocument();
  });

  it('keeps the selected tab synchronized on Back and Forward navigation', () => {
    render(
      <MemoryRouter initialEntries={['/app/library/all-products']}>
        <Routes>
          <Route path="/app/library" element={<LibraryPage />}>
            {tabs.map(([path, label]) => (
              <Route key={path} path={path} element={<p>{label} content</p>} />
            ))}
          </Route>
        </Routes>
        <HistoryControls />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('tab', { name: 'Courses' }));
    expect(screen.getByText('Courses content')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Courses' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByText('All products content')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'All products' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Forward' }));
    expect(screen.getByText('Courses content')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Courses' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
});
