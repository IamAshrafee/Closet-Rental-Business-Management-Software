# Rentiva: Technical Deep Dive (GEMINI.md)

This document provides a comprehensive technical overview of the Rentiva application, intended for developers. It covers architecture, feature implementation, key components, and development workflows.

---

## 1. Core Architecture

Rentiva is a modern single-page application (SPA) designed for managing a closet rental business. Its architecture prioritizes a clear separation of concerns, maintainable state, and a responsive user experience.

### 1.1. Technology Stack

-   **Frontend Framework**: [React](https://reactjs.org/) (v19) with Vite for a fast development experience.
-   **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) for centralized, predictable, and robust state management.
-   **Routing**: [React Router](https://reactrouter.com/) (v6) for client-side routing and protected routes.
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) for a utility-first styling approach, enabling rapid and consistent UI development.
-   **Animations**: [Framer Motion](https://www.framer.com/motion/) for fluid and declarative UI animations.
-   **Backend & Database**: [Firebase](https://firebase.google.com/) for user authentication and a real-time NoSQL database.
-   **Image Management**: [Cloudinary](https://cloudinary.com/) for cloud-based image uploads, storage, and delivery.

### 1.2. Directory Structure (`/src`)

The `/src` directory is organized by feature and responsibility to ensure a scalable and logical codebase.

```
/src
├── App.jsx             # Main component, sets up routing.
├── main.jsx            # Application entry point, renders App.
├── store.js            # Redux store configuration.
├── index.css           # Global styles and Tailwind CSS imports.
│
├── /assets             # Static assets like images and SVGs.
│
├── /authentication/    # Logic related to user auth.
│   ├── firebaseConfig.js # Firebase initialization config.
│   └── PrivateRoute.jsx  # Higher-order component to protect routes.
│
├── /cards/             # Complex, reusable components for displaying data entities.
│   ├── StockItemCard.jsx
│   ├── CustomerCard.jsx
│   └── BookingsCard.jsx
│
├── /components/        # Generic, reusable UI components.
│   ├── CustomDatePicker.jsx
│   └── EmptyState.jsx
│
├── /hooks/             # Custom React hooks for shared logic.
│   ├── useFormatDate.js
│   └── useAutoscrollOnFocus.js
│
├── /layout/            # Major layout structures.
│   └── Sidebar.jsx       # The main navigation sidebar and content wrapper.
│
├── /modals/            # Popup forms and dialogs for creating/editing data.
│   ├── AddItemsForm.jsx
│   ├── AddCustomerPopup.jsx
│   └── AddNewBookingForm.jsx
│
├── /pages/             # Top-level components for each application route.
│   ├── Home.jsx          # Dashboard
│   ├── Stock.jsx
│   ├── Customers.jsx
│   ├── Bookings.jsx
│   └── ... (Login, Registration, etc.)
│
└── /slice/             # Redux Toolkit state slices.
    ├── userSlice.js
    ├── currencySlice.js
    └── ... (category, color, etc.)
```

---

## 2. Feature Breakdown & Implementation

### 2.1. Authentication

-   **Files**: `pages/Login.jsx`, `pages/Registration.jsx`, `authentication/PrivateRoute.jsx`
-   **Flow**: The application uses Firebase Authentication for email/password sign-in. New users are created via the registration page and are required to verify their email. The `PrivateRoute.jsx` component wraps all protected routes, checking for a logged-in user in the Redux store and redirecting to `/login` if no user is found.

### 2.2. State Management (Redux)

-   **Files**: `store.js`, `/slice/*.js`
-   **Implementation**: The Redux store is configured in `store.js`. Each slice in the `/slice` directory manages a specific piece of the application's state (e.g., `userSlice` for auth info, `categorySlice` and `colorSlice` for inventory metadata). This centralization allows components to access and dispatch actions from anywhere in the component tree.

### 2.3. Inventory, Customers, & Bookings (CRUD & Drafts)

This is the core functionality of the application. Each module follows a similar pattern:

1.  **Page (`pages/*.jsx`)**: The main view for listing and filtering data (e.g., `Stock.jsx`). It fetches data from Firebase and handles filtering, sorting, and search logic.
2.  **Card (`cards/*.jsx`)**: A display component that renders a single item (e.g., `StockItemCard.jsx`). It receives data via props and handles displaying statuses, badges, and key information.
3.  **Form Modal (`modals/*.jsx`)**: A popup form for creating and editing data (e.g., `AddItemsForm.jsx`). It manages its own form state and performs validation.

-   **Draft Functionality**: A key feature across all modules is the ability to save items, customers, or bookings as a "draft." This is handled by:
    -   A `status` field (`'draft'` or `'published'/'complete'`) in the Firebase data.
    -   A "Save as Draft" button in the form modal, which triggers a save handler with lenient validation.
    -   The main submit button (`Publish`, `Save Customer`) triggers a save handler with strict validation.
    -   A dedicated "Drafts" filter/view on the main list page to easily access and manage incomplete records.

### 2.4. Partner Payouts

-   **Files**: `pages/Partners.jsx`, `pages/PartnerPayouts.jsx`, `modals/AddPartnerPopup.jsx`
-   **Logic**: The system supports "collaborated items" owned by partners. When a collaborated item is rented, the system calculates the partner's share (e.g., 60%). The `PartnerPayouts.jsx` page aggregates this data, showing total revenue generated by a partner's items and the total amount owed to them.

---

## 3. Key Components & Hooks

### 3.1. Reusable Components

-   `layout/Sidebar.jsx`: The persistent sidebar providing navigation. It acts as a wrapper for all main pages, ensuring a consistent layout.
-   `modals/*`: All modals use `framer-motion` for smooth entry/exit animations and a backdrop overlay. They are designed to be self-contained and handle their own submission logic.
-   `cards/*`: These components are the primary way data is displayed in lists. They are optimized with `React.memo` where applicable and designed to be information-dense yet readable.

### 3.2. Custom Hooks

-   `hooks/useAutoscrollOnFocus.js`: A crucial UX enhancement for forms. This hook takes a ref to a form element and adds an event listener. When any input inside the form is focused, it smoothly scrolls the element into the center of the viewport, preventing the on-screen keyboard from hiding inputs on mobile devices.
-   `hooks/useFormatDate.js`: Centralizes all date and time formatting logic. It pulls the user's preferred date format from the Redux store and provides `formatDate` and `formatTime` functions to the rest of the app, ensuring consistency.

---

## 4. Build & Deployment

### 4.1. Local Development

1.  **Install Dependencies**: `npm install`
2.  **Firebase Setup**: Create a `firebaseConfig.js` file in `/src/authentication/` with your Firebase project credentials. A template is provided in the existing file.
3.  **Run Server**: `npm run dev`. The app will be available at `http://localhost:5173`.

### 4.2. Available Scripts

-   `npm run dev`: Starts the Vite development server with Hot Module Replacement (HMR).
-   `npm run build`: Compiles the application for production into the `/dist` directory.
-   `npm run lint`: Runs ESLint to check for code quality and style issues.
-   `npm run preview`: Serves the production build locally to test before deployment.

### 4.3. Deployment

The `npm run build` command generates a static build of the application. This `/dist` folder can be deployed to any static hosting service such as Vercel, Netlify, or Firebase Hosting.