# GEMINI.md

## Project Overview

This project is a **Closet Rental Business Management Software** called **Rentiva**. It's a comprehensive web application designed to help small business owners manage their closet rental operations efficiently. It provides a suite of tools to track inventory, manage customers, handle bookings, and monitor business performance through an intuitive dashboard.

The application is built with the following technologies:

*   **Frontend:** React, Vite, React Router, Redux Toolkit, Tailwind CSS
*   **Backend & Database:** Firebase (Authentication and Realtime Database)

The project is structured with a clear separation of concerns, with dedicated folders for components, pages, modals, slices, and authentication logic.

## Building and Running

To get the project up and running, follow these steps:

1.  **Install dependencies:**
    ```sh
    npm install
    ```

2.  **Set up Firebase:**
    *   Create a new project on the [Firebase Console](https://console.firebase.google.com/).
    *   Enable **Authentication** (Email/Password).
    *   Create a **Realtime Database**.
    *   In your project settings, add a new web app and copy the `firebaseConfig` object.
    *   Replace the existing `firebaseConfig` in `src/authentication/firebaseConfig.js` with your own.

3.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

Other available scripts:

*   `npm run build`: Builds the application for production.
*   `npm run lint`: Lints the codebase.
*   `npm run preview`: Serves the production build locally.

## Development Conventions

*   **State Management:** The project uses Redux Toolkit for state management. Slices are defined in the `src/slice` directory.
*   **Routing:** The project uses React Router for routing. Routes are defined in `src/App.jsx`.
*   **Styling:** The project uses Tailwind CSS for styling.
*   **Authentication:** The project uses Firebase Authentication. Private routes are handled by the `PrivateRoute` component.
*   **Linting:** The project uses ESLint for linting. The configuration is in `eslint.config.js`.