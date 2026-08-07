import { getProductTabs } from './builder-sidebar.component';

describe('getProductTabs', () => {
  it('gives Membership an explicit content tab without sections', () => {
    const tabs = getProductTabs('MEMBERSHIP');

    expect(tabs.map((tab) => tab.id)).toEqual([
      'basics',
      'pricing',
      'media',
      'membership-content',
    ]);
    expect(tabs).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'sections' })]),
    );
  });
});
