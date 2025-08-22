import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import PrivateRoute from '../authentication/PrivateRoute';

const AppLayout = () => (
  <PrivateRoute>
    <Sidebar>
      <Outlet /> {/* This will render the nested page component */}
    </Sidebar>
  </PrivateRoute>
);

export default AppLayout;