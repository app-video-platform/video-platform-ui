import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('react-redux', () => ({
  __esModule: true,
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('core/store/product-store', () => ({
  __esModule: true,
  getProductSummariesByOwner: jest.fn(),
  selectProductSummaries: jest.fn((state) => state.products.productSummaries),
  selectProductsLoading: jest.fn((state) => state.products.loading),
  selectProductsError: jest.fn((state) => state.products.error),
}));

jest.mock('@shared/ui', () => {
  const actual = jest.requireActual('@shared/ui');
  type MockUploaderProps = {
    allowedFileTypes?: string[];
    // eslint-disable-next-line no-unused-vars
    onFilesChange?: (files: File[]) => void;
  };

  return {
    __esModule: true,
    ...actual,
    GalUppyFileUploader: ({
      allowedFileTypes = [],
      onFilesChange,
    }: MockUploaderProps) => {
      const isVideoUploader = allowedFileTypes.includes('video/*');
      const selectedFile = isVideoUploader
        ? new File(['video'], 'member-video.mp4', { type: 'video/mp4' })
        : new File(['resource'], 'member-resource.pdf', {
          type: 'application/pdf',
        });

      return (
        <button
          type="button"
          onClick={() => onFilesChange?.([selectedFile])}
        >
          {isVideoUploader ? 'Select video file' : 'Select resource file'}
        </button>
      );
    },
  };
});

import { useDispatch, useSelector } from 'react-redux';
import { ProductMinimised } from 'core/api/models';
import MembershipContentSection from './membership-content.component';
import { useMembershipBuilderState } from './use-membership-builder-state.hook';
import {
  createMembershipPostItem,
  createMembershipResourceItem,
  createMembershipVideoItem,
} from './models';
import { resolveMembershipIncludedProducts } from './utils/membership-readiness.utils';

const productSummaries: ProductMinimised[] = [
  {
    id: 'course-1',
    title: 'Course One',
    description: 'A full course',
    type: 'COURSE',
    status: 'DRAFT',
  },
  {
    id: 'download-1',
    title: 'Download Kit',
    type: 'DOWNLOAD',
    status: 'PUBLISHED',
  },
  {
    id: 'consultation-1',
    title: 'Consulting Call',
    type: 'CONSULTATION',
    status: 'DRAFT',
  },
];

const mockedUseDispatch = useDispatch as jest.MockedFunction<typeof useDispatch>;
const mockedUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;

const renderMembershipContent = () => {
  mockedUseDispatch.mockReturnValue(jest.fn() as never);
  mockedUseSelector.mockImplementation((selector) =>
    selector({
      products: {
        productSummaries,
        loading: false,
        error: null,
      },
    } as never),
  );

  const TestMembershipContent = () => {
    const membershipBuilderState = useMembershipBuilderState();
    const addPersistedNativeContent = (payload: any, addedAt: string) => {
      const id = membershipBuilderState.getNextNativeContentId(payload.type);

      if (payload.type === 'POST') {
        membershipBuilderState.addNativeContentItem(
          createMembershipPostItem(payload, id, addedAt),
          addedAt,
        );
      }

      if (payload.type === 'VIDEO') {
        membershipBuilderState.addNativeContentItem(
          createMembershipVideoItem(
            { ...payload, description: payload.description ?? '' },
            id,
            addedAt,
          ),
          addedAt,
        );
      }

      if (payload.type === 'RESOURCE') {
        membershipBuilderState.addNativeContentItem(
          createMembershipResourceItem(
            { ...payload, description: payload.description ?? '' },
            id,
            addedAt,
          ),
          addedAt,
        );
      }
    };
    const updatePersistedNativeContent = (contentId: string, payload: any) => {
      membershipBuilderState.updateNativeContentItem(contentId, (item) => ({
        ...item,
        ...payload,
        updatedAt: new Date().toISOString(),
      }));
    };

    return (
      <MembershipContentSection
        ownerId="creator-1"
        currentProductId="membership-1"
        nativeContentItems={membershipBuilderState.nativeContentItems}
        feedEntries={membershipBuilderState.feedEntries}
        orderingMode={membershipBuilderState.orderingMode}
        includedProductEntries={membershipBuilderState.includedProductEntries}
        productSummaries={productSummaries}
        includedProducts={resolveMembershipIncludedProducts(
          membershipBuilderState.includedProductEntries,
          productSummaries,
        )}
        isLoadingProducts={false}
        productsError={null}
        onAddNativeContentItem={addPersistedNativeContent}
        onUpdateNativeContentItem={updatePersistedNativeContent}
        onDeleteNativeContentItem={
          membershipBuilderState.deleteNativeContentItem
        }
        onOrderingModeChange={membershipBuilderState.setOrderingMode}
        onAddIncludedProducts={membershipBuilderState.addIncludedProducts}
        onRemoveIncludedProduct={membershipBuilderState.removeIncludedProduct}
        onMoveFeedEntry={membershipBuilderState.moveFeedEntry}
      />
    );
  };

  render(<TestMembershipContent />);
};

const renderSwitchableMembershipContent = () => {
  mockedUseDispatch.mockReturnValue(jest.fn() as never);
  mockedUseSelector.mockImplementation((selector) =>
    selector({
      products: {
        productSummaries,
        loading: false,
        error: null,
      },
    } as never),
  );

  const TestSwitchableMembershipContent = () => {
    const [isContentTabOpen, setIsContentTabOpen] = React.useState(true);
    const membershipBuilderState = useMembershipBuilderState();
    const addPersistedNativeContent = (payload: any, addedAt: string) => {
      const id = membershipBuilderState.getNextNativeContentId(payload.type);

      if (payload.type === 'POST') {
        membershipBuilderState.addNativeContentItem(
          createMembershipPostItem(payload, id, addedAt),
          addedAt,
        );
      }

      if (payload.type === 'VIDEO') {
        membershipBuilderState.addNativeContentItem(
          createMembershipVideoItem(
            { ...payload, description: payload.description ?? '' },
            id,
            addedAt,
          ),
          addedAt,
        );
      }

      if (payload.type === 'RESOURCE') {
        membershipBuilderState.addNativeContentItem(
          createMembershipResourceItem(
            { ...payload, description: payload.description ?? '' },
            id,
            addedAt,
          ),
          addedAt,
        );
      }
    };
    const updatePersistedNativeContent = (contentId: string, payload: any) => {
      membershipBuilderState.updateNativeContentItem(contentId, (item) => ({
        ...item,
        ...payload,
        updatedAt: new Date().toISOString(),
      }));
    };

    return (
      <div>
        <button type="button" onClick={() => setIsContentTabOpen(false)}>
          Pricing
        </button>
        <button type="button" onClick={() => setIsContentTabOpen(true)}>
          Membership Content
        </button>
        {isContentTabOpen && (
          <MembershipContentSection
            ownerId="creator-1"
            currentProductId="membership-1"
            nativeContentItems={membershipBuilderState.nativeContentItems}
            feedEntries={membershipBuilderState.feedEntries}
            orderingMode={membershipBuilderState.orderingMode}
            includedProductEntries={
              membershipBuilderState.includedProductEntries
            }
            productSummaries={productSummaries}
            includedProducts={resolveMembershipIncludedProducts(
              membershipBuilderState.includedProductEntries,
              productSummaries,
            )}
            isLoadingProducts={false}
            productsError={null}
            onAddNativeContentItem={addPersistedNativeContent}
            onUpdateNativeContentItem={updatePersistedNativeContent}
            onDeleteNativeContentItem={
              membershipBuilderState.deleteNativeContentItem
            }
            onOrderingModeChange={membershipBuilderState.setOrderingMode}
            onAddIncludedProducts={membershipBuilderState.addIncludedProducts}
            onRemoveIncludedProduct={
              membershipBuilderState.removeIncludedProduct
            }
            onMoveFeedEntry={membershipBuilderState.moveFeedEntry}
          />
        )}
      </div>
    );
  };

  render(<TestSwitchableMembershipContent />);
};

const getRenderedContentTitles = () =>
  screen
    .getAllByRole('heading', { level: 4 })
    .map((heading) => heading.textContent);

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe('<MembershipContentSection />', () => {
  it('+ Add Content opens the chooser', () => {
    renderMembershipContent();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));

    expect(screen.getByRole('button', { name: /Video/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Existing Product/i }),
    ).toBeInTheDocument();
  });

  it('selecting Post switches to POST creation mode', () => {
    renderMembershipContent();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));
    fireEvent.click(screen.getByRole('button', { name: /Post/i }));

    expect(screen.getByPlaceholderText('Post title')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Write a member-only update'),
    ).toBeInTheDocument();
  });

  it('selecting Video switches to VIDEO creation mode', () => {
    renderMembershipContent();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));
    fireEvent.click(screen.getByRole('button', { name: /Video/i }));

    expect(screen.getByPlaceholderText('Video title')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Describe this member-only video'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Select video file' }),
    ).toBeInTheDocument();
  });

  it('selecting Resource switches to RESOURCE creation mode', () => {
    renderMembershipContent();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));
    fireEvent.click(screen.getByRole('button', { name: /Resource/i }));

    expect(screen.getByPlaceholderText('Resource title')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Describe this member-only resource'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Select resource file' }),
    ).toBeInTheDocument();
  });

  it('cancelling native creation returns to the content list', () => {
    renderMembershipContent();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));
    fireEvent.click(screen.getByRole('button', { name: /Post/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByPlaceholderText('Post title')).not.toBeInTheDocument();
    expect(screen.getByText('No membership content yet.')).toBeInTheDocument();
  });

  it('selecting Existing Product opens the current ProductPicker flow', () => {
    renderMembershipContent();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));
    fireEvent.click(screen.getByRole('button', { name: /Existing Product/i }));

    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Course One')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Download Kit')).toBeInTheDocument();
    expect(screen.queryByText('Consulting Call')).not.toBeInTheDocument();
  });

  it('chooser does not alter existing included products', async () => {
    renderMembershipContent();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));
    fireEvent.click(screen.getByRole('button', { name: /Existing Product/i }));
    fireEvent.click(screen.getByLabelText('Select Course One'));
    fireEvent.click(screen.getByRole('button', { name: 'Add selected' }));

    await waitFor(() => {
      expect(screen.getByText('Course One')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));
    fireEvent.click(screen.getByRole('button', { name: /Post/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByText('Course One')).toBeInTheDocument();
  });

  it('saved Post survives switching away from and back to Membership Content', () => {
    renderSwitchableMembershipContent();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));
    fireEvent.click(screen.getByRole('button', { name: /Post/i }));
    fireEvent.change(screen.getByPlaceholderText('Post title'), {
      target: { value: 'Persistent post' },
    });
    fireEvent.change(screen.getByPlaceholderText('Write a member-only update'), {
      target: { value: 'Still here after tab switch.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    fireEvent.click(screen.getByRole('button', { name: 'Pricing' }));

    expect(screen.queryByText('Persistent post')).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: 'Membership Content' }),
    );

    expect(screen.getByText('Persistent post')).toBeInTheDocument();
    expect(
      screen.getByText('Still here after tab switch.'),
    ).toBeInTheDocument();
  });

  it('included Product survives switching away from and back to Membership Content', async () => {
    renderSwitchableMembershipContent();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));
    fireEvent.click(screen.getByRole('button', { name: /Existing Product/i }));
    fireEvent.click(screen.getByLabelText('Select Course One'));
    fireEvent.click(screen.getByRole('button', { name: 'Add selected' }));

    await waitFor(() => {
      expect(screen.getByText('Course One')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Pricing' }));
    expect(screen.queryByText('Course One')).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: 'Membership Content' }),
    );

    expect(screen.getByText('Course One')).toBeInTheDocument();
  });

  it('manual ordering mode and sequence survive switching away from Membership Content', async () => {
    renderSwitchableMembershipContent();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));
    fireEvent.click(screen.getByRole('button', { name: /Existing Product/i }));
    fireEvent.click(screen.getByLabelText('Select Course One'));
    fireEvent.click(screen.getByRole('button', { name: 'Add selected' }));

    await waitFor(() => {
      expect(screen.getByText('Course One')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));
    fireEvent.click(screen.getByRole('button', { name: /Post/i }));
    fireEvent.change(screen.getByPlaceholderText('Post title'), {
      target: { value: 'Manual post' },
    });
    fireEvent.change(screen.getByPlaceholderText('Write a member-only update'), {
      target: { value: 'Manual body' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(getRenderedContentTitles()).toEqual(['Manual post', 'Course One']);

    fireEvent.click(screen.getByRole('radio', { name: 'Manual' }));
    fireEvent.click(screen.getAllByRole('button', { name: 'Move Down' })[0]);

    expect(getRenderedContentTitles()).toEqual(['Course One', 'Manual post']);

    fireEvent.click(screen.getByRole('button', { name: 'Pricing' }));
    expect(screen.queryByText('Course One')).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: 'Membership Content' }),
    );

    expect(screen.getByRole('radio', { name: 'Manual' })).toBeChecked();
    expect(getRenderedContentTitles()).toEqual(['Course One', 'Manual post']);
  });

  it('newly added native content appears first in NEWEST_FIRST', async () => {
    renderMembershipContent();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));
    fireEvent.click(screen.getByRole('button', { name: /Existing Product/i }));
    fireEvent.click(screen.getByLabelText('Select Course One'));
    fireEvent.click(screen.getByRole('button', { name: 'Add selected' }));

    await waitFor(() => {
      expect(screen.getByText('Course One')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));
    fireEvent.click(screen.getByRole('button', { name: /Post/i }));
    fireEvent.change(screen.getByPlaceholderText('Post title'), {
      target: { value: 'Newest post' },
    });
    fireEvent.change(screen.getByPlaceholderText('Write a member-only update'), {
      target: { value: 'Fresh body' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByRole('radio', { name: 'Newest first' })).toBeChecked();
    expect(getRenderedContentTitles()).toEqual(['Newest post', 'Course One']);
  });

  it('saving creates a local Post and renders it in the unified list', () => {
    renderMembershipContent();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));
    fireEvent.click(screen.getByRole('button', { name: /Post/i }));
    fireEvent.change(screen.getByPlaceholderText('Post title'), {
      target: { value: 'First member post' },
    });
    fireEvent.change(screen.getByPlaceholderText('Write a member-only update'), {
      target: { value: 'Welcome to the membership.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByText('First member post')).toBeInTheDocument();
    expect(screen.getByText('Welcome to the membership.')).toBeInTheDocument();
    expect(screen.getByText('DRAFT')).toBeInTheDocument();
  });

  it('saving creates a local Video and renders it in the unified list', () => {
    renderMembershipContent();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));
    fireEvent.click(screen.getByRole('button', { name: /Video/i }));
    fireEvent.change(screen.getByPlaceholderText('Video title'), {
      target: { value: 'First member video' },
    });
    fireEvent.change(
      screen.getByPlaceholderText('Describe this member-only video'),
      {
        target: { value: 'A private walkthrough.' },
      },
    );
    fireEvent.click(screen.getByRole('button', { name: 'Select video file' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByText('First member video')).toBeInTheDocument();
    expect(screen.getByText('A private walkthrough.')).toBeInTheDocument();
    expect(screen.getByText('member-video.mp4')).toBeInTheDocument();
    expect(screen.getByText('DRAFT')).toBeInTheDocument();
  });

  it('saving creates a local Resource and renders it in the unified list', () => {
    renderMembershipContent();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));
    fireEvent.click(screen.getByRole('button', { name: /Resource/i }));
    fireEvent.change(screen.getByPlaceholderText('Resource title'), {
      target: { value: 'First member resource' },
    });
    fireEvent.change(
      screen.getByPlaceholderText('Describe this member-only resource'),
      {
        target: { value: 'A private worksheet.' },
      },
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'Select resource file' }),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByText('First member resource')).toBeInTheDocument();
    expect(screen.getByText('A private worksheet.')).toBeInTheDocument();
    expect(screen.getByText('member-resource.pdf')).toBeInTheDocument();
    expect(screen.getByText('DRAFT')).toBeInTheDocument();
  });

  it('saving a published Post renders its status', () => {
    renderMembershipContent();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));
    fireEvent.click(screen.getByRole('button', { name: /Post/i }));
    fireEvent.change(screen.getByPlaceholderText('Post title'), {
      target: { value: 'Published post' },
    });
    fireEvent.change(screen.getByPlaceholderText('Write a member-only update'), {
      target: { value: 'This is live.' },
    });
    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'PUBLISHED' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByText('Published post')).toBeInTheDocument();
    expect(screen.getByText('PUBLISHED')).toBeInTheDocument();
  });

  it('Edit opens existing Post values and saving updates the Post', () => {
    renderMembershipContent();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));
    fireEvent.click(screen.getByRole('button', { name: /Post/i }));
    fireEvent.change(screen.getByPlaceholderText('Post title'), {
      target: { value: 'Original post' },
    });
    fireEvent.change(screen.getByPlaceholderText('Write a member-only update'), {
      target: { value: 'Original body' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

    expect(screen.getByDisplayValue('Original post')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Original body')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Post title'), {
      target: { value: 'Updated post' },
    });
    fireEvent.change(screen.getByPlaceholderText('Write a member-only update'), {
      target: { value: 'Updated body' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByText('Updated post')).toBeInTheDocument();
    expect(screen.getByText('Updated body')).toBeInTheDocument();
    expect(screen.queryByText('Original post')).not.toBeInTheDocument();
  });

  it('Edit opens existing Video values and saving updates the Video', () => {
    renderMembershipContent();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));
    fireEvent.click(screen.getByRole('button', { name: /Video/i }));
    fireEvent.change(screen.getByPlaceholderText('Video title'), {
      target: { value: 'Original video' },
    });
    fireEvent.change(
      screen.getByPlaceholderText('Describe this member-only video'),
      {
        target: { value: 'Original description' },
      },
    );
    fireEvent.click(screen.getByRole('button', { name: 'Select video file' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

    expect(screen.getByDisplayValue('Original video')).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('Original description'),
    ).toBeInTheDocument();
    expect(screen.getByText(/Selected video: member-video\.mp4/)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Video title'), {
      target: { value: 'Updated video' },
    });
    fireEvent.change(
      screen.getByPlaceholderText('Describe this member-only video'),
      {
        target: { value: 'Updated description' },
      },
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByText('Updated video')).toBeInTheDocument();
    expect(screen.getByText('Updated description')).toBeInTheDocument();
    expect(screen.queryByText('Original video')).not.toBeInTheDocument();
  });

  it('Edit opens existing Resource values and saving updates the Resource', () => {
    renderMembershipContent();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));
    fireEvent.click(screen.getByRole('button', { name: /Resource/i }));
    fireEvent.change(screen.getByPlaceholderText('Resource title'), {
      target: { value: 'Original resource' },
    });
    fireEvent.change(
      screen.getByPlaceholderText('Describe this member-only resource'),
      {
        target: { value: 'Original description' },
      },
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'Select resource file' }),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

    expect(screen.getByDisplayValue('Original resource')).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('Original description'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Selected file: member-resource\.pdf/),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Resource title'), {
      target: { value: 'Updated resource' },
    });
    fireEvent.change(
      screen.getByPlaceholderText('Describe this member-only resource'),
      {
        target: { value: 'Updated description' },
      },
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByText('Updated resource')).toBeInTheDocument();
    expect(screen.getByText('Updated description')).toBeInTheDocument();
    expect(screen.queryByText('Original resource')).not.toBeInTheDocument();
  });

  it('Cancel Edit leaves original Post unchanged', () => {
    renderMembershipContent();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));
    fireEvent.click(screen.getByRole('button', { name: /Post/i }));
    fireEvent.change(screen.getByPlaceholderText('Post title'), {
      target: { value: 'Keep me' },
    });
    fireEvent.change(screen.getByPlaceholderText('Write a member-only update'), {
      target: { value: 'Original body' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    fireEvent.change(screen.getByPlaceholderText('Post title'), {
      target: { value: 'Do not keep me' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByText('Keep me')).toBeInTheDocument();
    expect(screen.queryByText('Do not keep me')).not.toBeInTheDocument();
  });

  it('Cancel Edit leaves original Video unchanged', () => {
    renderMembershipContent();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));
    fireEvent.click(screen.getByRole('button', { name: /Video/i }));
    fireEvent.change(screen.getByPlaceholderText('Video title'), {
      target: { value: 'Keep this video' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Select video file' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    fireEvent.change(screen.getByPlaceholderText('Video title'), {
      target: { value: 'Do not keep this video' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByText('Keep this video')).toBeInTheDocument();
    expect(screen.queryByText('Do not keep this video')).not.toBeInTheDocument();
  });

  it('Cancel Edit leaves original Resource unchanged', () => {
    renderMembershipContent();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));
    fireEvent.click(screen.getByRole('button', { name: /Resource/i }));
    fireEvent.change(screen.getByPlaceholderText('Resource title'), {
      target: { value: 'Keep this resource' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: 'Select resource file' }),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    fireEvent.change(screen.getByPlaceholderText('Resource title'), {
      target: { value: 'Do not keep this resource' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByText('Keep this resource')).toBeInTheDocument();
    expect(
      screen.queryByText('Do not keep this resource'),
    ).not.toBeInTheDocument();
  });

  it('Delete removes Post', () => {
    renderMembershipContent();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));
    fireEvent.click(screen.getByRole('button', { name: /Post/i }));
    fireEvent.change(screen.getByPlaceholderText('Post title'), {
      target: { value: 'Delete me' },
    });
    fireEvent.change(screen.getByPlaceholderText('Write a member-only update'), {
      target: { value: 'Temporary body' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(screen.queryByText('Delete me')).not.toBeInTheDocument();
    expect(screen.getByText('No membership content yet.')).toBeInTheDocument();
  });

  it('Delete removes Video', () => {
    renderMembershipContent();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));
    fireEvent.click(screen.getByRole('button', { name: /Video/i }));
    fireEvent.change(screen.getByPlaceholderText('Video title'), {
      target: { value: 'Delete video' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Select video file' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(screen.queryByText('Delete video')).not.toBeInTheDocument();
    expect(screen.getByText('No membership content yet.')).toBeInTheDocument();
  });

  it('Delete removes Resource', () => {
    renderMembershipContent();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));
    fireEvent.click(screen.getByRole('button', { name: /Resource/i }));
    fireEvent.change(screen.getByPlaceholderText('Resource title'), {
      target: { value: 'Delete resource' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: 'Select resource file' }),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(screen.queryByText('Delete resource')).not.toBeInTheDocument();
    expect(screen.getByText('No membership content yet.')).toBeInTheDocument();
  });

  it('content list renders normally when no creation mode is active', () => {
    renderMembershipContent();

    expect(screen.getByText('Membership Content')).toBeInTheDocument();
    expect(screen.getByText('No membership content yet.')).toBeInTheDocument();
    expect(screen.queryByText(/editor coming next/i)).not.toBeInTheDocument();
  });
});
