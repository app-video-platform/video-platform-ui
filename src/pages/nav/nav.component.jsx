import { Fragment } from "react";
import { Outlet } from "react-router-dom";

import './nav.styles.scss';

const Navigation = () => {
	return (
		<Fragment>
			<nav>
				<div className="logo-container"></div>
				<div className="nav-links">
					<ul className="nav-link-list">
						<li>Home</li>
						<li>About</li>
						<li>Contact</li>
					</ul>
				</div>
				<div className="user-buttons">
					<ul className="nav-link-list">
						<li>Sign In</li>
						<li>Sign Up</li>
					</ul>
				</div>
			</nav>
			<Outlet />
		</Fragment>
	);
};

export default Navigation;
