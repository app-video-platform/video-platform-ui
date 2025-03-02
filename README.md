# Video Platform UI

A React + TypeScript project with a custom Webpack, Babel, Jest, and ESLint configuration. This project serves as a base for building a video platform UI with state management, routing, and testing.

## Table of Contents

- [Video Platform UI](#video-platform-ui)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Available Scripts](#available-scripts)
      - [Start Development Server](#start-development-server)
      - [Build for Production](#build-for-production)
      - [Run Tests](#run-tests)
      - [Lint the Code](#lint-the-code)
      - [Automatically fix lint issues:](#automatically-fix-lint-issues)
      - [TypeScript Check](#typescript-check)
    - [Project Structure](#project-structure)
    - [Dependencies](#dependencies)
      - [Runtime Dependencies](#runtime-dependencies)
      - [Development Dependencies](#development-dependencies)
    - [Contributing](#contributing)

## Features

- **React & TypeScript:** Modern UI development with type safety.
- **Custom Build Setup:** Configured with Webpack and Babel for flexible bundling and transpilation.
- **Routing:** Powered by React Router.
- **State Management:** Ready for Redux integration via @reduxjs/toolkit.
- **Testing:** Configured with Jest, ts-jest, and React Testing Library.
- **Linting & Code Quality:** ESLint (with Airbnb and TypeScript rules) for consistent code quality.
- **Sass & CSS Modules:** Support for styling with Sass and CSS modules.
- **Performance Monitoring:** Includes Web Vitals for performance tracking.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (version 14.x or above recommended)
- [npm](https://www.npmjs.com/) (or yarn)

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd video-platform-ui
npm install
```

If you prefer yarn, run `yarn install`.

### Available Scripts

In the project directory, you can run:

#### Start Development Server

Starts the app in development mode using Webpack Dev Server:

````bash
npm start
````
Open [http://localhost:8080](https://example.com) to view it in your browser.

#### Build for Production

Builds the app for production into the dist folder:

````bash
npm run build
````

#### Run Tests

Launches the test runner using Jest:

````bash
npm test
````

#### Lint the Code

Checks your source code for linting issues:

````bash
npm run lint
````

#### Automatically fix lint issues:

````bash
npm run lint:fix
````

#### TypeScript Check

Performs a type check without emitting files:

````bash
npm run tsc
````

### Project Structure

````php
video-platform-ui/
├── node_modules/               # Installed packages
├── public/                     # Static assets and HTML template
│   ├── favicon.ico             # Favicon file
│   └── index.html              # HTML template for the app
├── src/                        # Application source code
│   ├── pages/                  # React page components (e.g., Home.tsx)
│   ├── App.test.tsx            # Test file for the App component
│   ├── App.tsx                 # Main App component (routes and layout)
│   ├── index.tsx               # Entry point for the React application
│   └── setupTests.ts           # Global test setup file (imports jest-dom)
├── .eslintrc.js                # ESLint configuration
├── babel.config.js             # Babel configuration
├── jest.config.js              # Jest configuration
├── tsconfig.json               # TypeScript configuration
├── webpack.config.js           # Webpack configuration
└── package.json                # Project metadata and scripts
````

### Dependencies

#### Runtime Dependencies

- React & React-DOM: Core UI libraries.
- React Router: Client-side routing.
- Axios: Promise-based HTTP client.
- Web Vitals: Performance metrics reporting.
- Others: Additional libraries (such as @reduxjs/toolkit, lucide-react, etc.) can be added as needed.

#### Development Dependencies

- Babel & Presets: For transpiling modern JavaScript/TypeScript.
- Webpack & Plugins: For bundling and serving the application.
- Jest & Testing Library: For unit and integration testing.
- ESLint & Plugins: For code quality and style enforcement.
- TypeScript & ts-jest: For type checking and testing with TypeScript.

### Contributing
This project is personal is contributing is forbidden. Thank you for your understanding!