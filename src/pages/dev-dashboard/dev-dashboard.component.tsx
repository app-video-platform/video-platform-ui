/* eslint-disable indent */
import React from 'react';
import { Link } from 'react-router-dom';

import GalExpansionPanel from '../../components/gal-expansion-panel/gal-expansion-panel.component';
import rawData from './../../utils/dashboard-details.json';
import GalUserProfileDropdown from '../../components/gal-user-profile/gal-user-profile.component';

import './dev-dashboard.styles.scss';

// Tell TypeScript how the JSON is shaped
export interface DetailText {
  type: 'text';
  text: string;
}
export interface DetailLink {
  type: 'link';
  text: string;
  url: string;
}
export interface DetailList {
  type: 'orderedList' | 'unorderedList';
  items: string[];
}
export type DetailItem = DetailText | DetailLink | DetailList;

export interface DevItem {
  title: string;
  path: string;
  details: DetailItem[];
}

export interface Subsection {
  header: string;
  items: DevItem[];
}

// Now allow two shapes of “Section”:
export interface IntroSection {
  header: string;
  paragraphs: string[];
}

export interface RoutesSection {
  header: string;
  subsections: Subsection[];
}

export type Section = IntroSection | RoutesSection;

export interface DevDashboardData {
  sections: Section[];
}

const data = rawData as DevDashboardData;

const DevDashboard: React.FC = () => (
  <div className="dev-dashboard">
    <nav className="dev-dashboard-nav">
      <div className="logo" />
      <div className="nav-links">
        <Link to={'/dashboard'}>Normal Dashboard</Link>
        <Link to={'/'}>Landing page</Link>
      </div>
      <GalUserProfileDropdown />
    </nav>
    <main className="dev-dashboard-main">
      <h1>Developer Dashboard</h1>

      {data.sections.map((section, sIdx) => {
        // If this is the intro section:
        if ('paragraphs' in section) {
          const intro = section as IntroSection;
          return (
            <GalExpansionPanel key={sIdx} header={intro.header}>
              <div className="dev-dashboard-hello">
                {intro.paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>
            </GalExpansionPanel>
          );
        }

        // Otherwise it must be a RoutesSection
        const routesSection = section as RoutesSection;
        return (
          <GalExpansionPanel key={sIdx} header={routesSection.header}>
            <div className="dev-dash-routes">
              {routesSection.subsections.map((sub, subIdx) => (
                <GalExpansionPanel key={subIdx} header={sub.header}>
                  <div className="dev-panel-content">
                    {sub.items.map((item, iIdx) => (
                      <div key={iIdx} className="dev-item-box">
                        <h3 className="item-box-header">{item.title}</h3>
                        <Link className="route-info" to={item.path}>
                          {item.path !== '/' ? item.path : 'Galactica'}
                        </Link>

                        {/* render details array */}
                        <div className="item-box-content">
                          {item.details.map((detail, dIdx) => {
                            switch (detail.type) {
                              case 'text':
                                return <li key={dIdx}>{detail.text}</li>;

                              case 'link':
                                return (
                                  <li key={dIdx}>
                                    <a
                                      href={detail.url}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      {detail.text}
                                    </a>
                                  </li>
                                );

                              case 'orderedList':
                                return (
                                  <ol key={dIdx}>
                                    {detail.items.map((line, lIdx) => (
                                      <li key={lIdx}>{line}</li>
                                    ))}
                                  </ol>
                                );

                              case 'unorderedList':
                                return (
                                  <ul key={dIdx}>
                                    {detail.items.map((line, lIdx) => (
                                      <li key={lIdx}>{line}</li>
                                    ))}
                                  </ul>
                                );

                              default:
                                return null;
                            }
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </GalExpansionPanel>
              ))}
            </div>
          </GalExpansionPanel>
        );
      })}
    </main>
  </div>
);

export default DevDashboard;
