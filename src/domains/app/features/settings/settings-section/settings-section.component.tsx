import React from 'react';

import './settings-section.styles.scss';

interface SettingsSectionProps {
  title: string;
  subTitle: string;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  subTitle,
  children,
}) => (
  <section className="settings-section">
    <div className="section-header">
      <h3>{title}</h3>
      <p style={{ fontSize: 14 }}>{subTitle}</p>
    </div>
    <div className="section-content">{children}</div>
  </section>
);

export default SettingsSection;
