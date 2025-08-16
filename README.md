# Rentiva - Closet Rental Business Management Software

Rentiva is a comprehensive web application designed to help small business owners manage their closet rental operations efficiently. It provides a suite of tools to track inventory, manage customers, handle bookings, and monitor business performance through an intuitive dashboard.

## ✨ Features

-   **Dashboard:** Get a quick overview of your business with key metrics like total customers, items in stock, total bookings, and total revenue. View upcoming deliveries, returns, and recent booking activity at a glance.
-   **Inventory Management:** Add, edit, and delete stock items. Track each item's availability, rental progress, and other important details.
-   **Customer Management:** Maintain a database of your customers, including their contact information and rental history.
-   **Booking Management:** Create, view, edit, and delete bookings. Track the status of each booking (e.g., "Waiting for Delivery," "Waiting for Return," "Completed").
-   **Reminders:** Stay on top of your schedule with dedicated views for upcoming deliveries and returns.
-   **Authentication:** Secure user authentication with email verification, ensuring that only authorized users can access the application.
-   **Responsive Design:** The application is fully responsive and works seamlessly on desktops, tablets, and mobile devices.

## 🛠️ Tech Stack

-   **Frontend:**
    -   [React](https://reactjs.org/)
    -   [Vite](https://vitejs.dev/)
    -   [React Router](https://reactrouter.com/) for routing
    -   [Redux Toolkit](https://redux-toolkit.js.org/) for state management
    -   [Tailwind CSS](https://tailwindcss.com/) for styling
    -   [Framer Motion](https://www.framer.com/motion/) for animations
    -   [React Icons](https://react-icons.github.io/react-icons/) for icons
-   **Backend & Database:**
    -   [Firebase](https://firebase.google.com/) for authentication and real-time database.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v14 or later)
-   npm or yarn

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/closet-rental-business-management-software.git
    cd closet-rental-business-management-software
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up Firebase:**
    -   Create a new project on the [Firebase Console](https://console.firebase.google.com/).
    -   Enable **Authentication** (Email/Password).
    -   Create a **Realtime Database**.
    -   In your project settings, add a new web app and copy the `firebaseConfig` object.
    -   Replace the existing `firebaseConfig` in `src/authentication/firebaseConfig.js` with your own.

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## 📁 Folder Structure

```
/src
├── /assets
├── /authentication
│   ├── firebaseConfig.js
│   └── PrivateRoute.jsx
├── /cards
├── /components
├── /layout
├── /modals
├── /pages
├── /slice
│   └── userSlice.js
├── App.jsx
├── index.css
├── main.jsx
└── store.js
```

-   **/authentication**: Contains Firebase configuration and private route logic.
-   **/cards**: Reusable card components for displaying data.
-   **/components**: Shared UI components (e.g., `EmptyState`).
-   **/layout**: Main layout components, including the sidebar.
-   **/modals**: Popup/modal components for forms and information display.
-   **/pages**: Top-level page components corresponding to routes.
-   **/slice**: Redux Toolkit slices for state management.

## 部署

This application is ready for deployment on platforms like Vercel, Netlify, or Firebase Hosting. Ensure that you have set up the necessary environment variables for your Firebase configuration in your deployment provider's settings.