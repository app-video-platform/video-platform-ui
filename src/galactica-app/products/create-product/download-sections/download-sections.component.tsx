import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import { DownloadSection } from '../../../../models/product/download-section';
import FormInput from '../../../../components/form-input/form-input.component';

import './download-sections.styles.scss';
import UppyFileUploader from '../../../../components/uppy-file-uploader/uppy-file-uploader.component';

interface DynamicSectionsProps {
  sections: DownloadSection[];
  // eslint-disable-next-line no-unused-vars
  onChangeSections: (updated: DownloadSection[]) => void;
  // eslint-disable-next-line no-unused-vars
  handleFilesChange: (files: File[]) => void;
}

const DownloadSections: React.FC<DynamicSectionsProps> = ({ sections, onChangeSections, handleFilesChange }) => {

  const uniqueId = uuidv4();

  const handleSectionChange = (
    id: string | undefined,
    field: keyof DownloadSection,
    value: string
  ) => {
    if (!id) { return; }
    // Create a new array so we don't mutate the original
    const updated = sections.map(section => {
      // If this is the matching section, update the specified field
      if (section.id === id) {
        return { ...section, [field]: value };
      }
      // Otherwise, leave it as-is
      return section;
    });

    // Pass the updated array back to the parent (or local) state
    onChangeSections(updated);
  };

  const addSection = () => {
    onChangeSections([
      ...sections,
      { id: uniqueId, title: '', description: '', position: sections.length + 1 }
    ]);
  };

  const removeSection = (id: string | undefined) => {
    if (sections.length === 1 || !id) { return; }
    const updated = sections.filter((section) => section.id !== id);
    onChangeSections(
      updated.map((section, idx) => ({
        ...section,
        position: idx + 1
      }))
    );
  };

  return (

    <div className='download-sections'>
      {sections.map((section) => (
        <div key={section.id} className='download-section'>
          <div className='section-header-line'>
            <h3>Section {section.position}</h3>
            <button onClick={() => removeSection(section.id)}>Remove</button>
          </div>

          <FormInput label="Section Title"
            type="text"
            name="title"
            // placeholder="Section Title"
            value={section.title}
            onChange={(e: { target: { value: string; }; }) =>
              handleSectionChange(section.id, 'title', e.target.value)
            } />

          <FormInput label="Section Description"
            type="text"
            name="description"
            // placeholder="Section Description"
            value={section.description}
            onChange={(e: { target: { value: string; }; }) =>
              handleSectionChange(section.id, 'description', e.target.value)
            } />

          <UppyFileUploader onFilesChange={handleFilesChange} />
        </div>
      ))}

      <button type='button' onClick={addSection}>Add Section</button>

    </div>
  );
};

export default DownloadSections;