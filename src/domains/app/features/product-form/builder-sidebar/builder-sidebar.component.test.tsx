import { getProductTabs } from './builder-sidebar.component';

describe('getProductTabs', () => {
  it.each([
    ['COURSE', ['basics', 'pricing', 'sections', 'media', 'readiness'], 'Curriculum'],
    ['DOWNLOAD', ['basics', 'pricing', 'sections', 'media', 'readiness'], 'Files'],
    [
      'CONSULTATION',
      ['basics', 'pricing', 'consultation-details', 'media', 'readiness'],
      'Availability',
    ],
    [
      'MEMBERSHIP',
      ['basics', 'pricing', 'membership-content', 'media', 'readiness'],
      'Content',
    ],
  ] as const)(
    'gives %s the Phase 1 workspace destinations',
    (productType, expectedIds, typeSpecificLabel) => {
      const tabs = getProductTabs(productType);

      expect(tabs.map((tab) => tab.id)).toEqual(expectedIds);
      expect(tabs.map((tab) => tab.label)).toContain(typeSpecificLabel);
      expect(tabs.map((tab) => tab.label)).toContain('Readiness');
    },
  );

  it('gives Membership an explicit content tab without sections', () => {
    const tabs = getProductTabs('MEMBERSHIP');

    expect(tabs.map((tab) => tab.id)).toEqual([
      'basics',
      'pricing',
      'membership-content',
      'media',
      'readiness',
    ]);
    expect(tabs).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'sections' })]),
    );
  });
});
