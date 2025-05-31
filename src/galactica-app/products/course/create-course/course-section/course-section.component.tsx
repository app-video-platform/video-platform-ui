import React from 'react';

import './course-section.styles.scss';
import { CourseSection } from '../../../../../models/product/course-section';

const CourseSection: React.FC = () => (
  <div className="course-section-container">
    <h2>Course Section</h2>
    <p>This is a placeholder for the course section component.</p>
    {/* Add your section content here */}
  </div>
);

export default CourseSection;




interface DynamicSectionsProps {
  sections: CourseSection[];
  // eslint-disable-next-line no-unused-vars
  onChangeSections: (updated: CourseSection[]) => void;
  // eslint-disable-next-line no-unused-vars
}

const DownloadSections: React.FC<DynamicSectionsProps> = ({ sections, onChangeSections, handleFilesChange }) => {

  const handleSectionChange = (
    localId: string | undefined,
    field: keyof DownloadSection,
    value: string
  ) => {
    if (!localId) { return; }
    // Create a new array so we don't mutate the original
    const updated = sections.map(section => {
      // If this is the matching section, update the specified field
      if (section.localId === localId) {
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
      { localId: uuidv4(), title: '', description: '', position: sections.length + 1 }
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
            <Button onClick={() => removeSection(section.id)} text='Remove' type='secondary' />
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

          <UppyFileUploader onFilesChange={(files: File[]) =>
            handleFilesChange({ sectionLocalId: section.localId || '', files })
          } />
        </div>
      ))}

      <Button type='primary' htmlType='button' onClick={addSection} text='Add Section' />
    </div>
  );
};
