import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

import GalBreadcrumbs from '../../components/gal-breadcrumb/gal-breadcrumb.component';
import NewGalNotificationsDropdown from '../../components/gal-dropdowns/gal-notifications-dropdown/gal-notifications-dropdown.component';
import GalUserDropdown from '../../components/gal-dropdowns/gal-user-dropdown/gal-user-dropdown.component';
import './dashboard.styles.scss';

//////////////////////////////////////////
/////////// NO LONGER USED //////////////
////////////////////////////////////////

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="dashboard-top">
        <h2>Galactica</h2>
        <div className="app-nav-links">
          <Link to={''}>Overview</Link>
          <Link to={'products'}>Products</Link>
          <Link to={'sales'}>Sales & Analytics</Link>
          <Link to={'marketing'}>Marketing and Communication</Link>
        </div>
        <button onClick={() => navigate('/')}>Go to website</button>
        <NewGalNotificationsDropdown />
        <GalUserDropdown />
      </div>
      <GalBreadcrumbs />
      <div className="dashboard-outlet">
        {/* <UserDashboard /> */}
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
