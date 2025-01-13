import { Route } from 'react-router-dom';
import RequireAuth from './RequireAuth';

const ProtectedRoute = ({ element, ...props }) => (
  <Route
    {...props}
    element={
      <RequireAuth>
        {element}
      </RequireAuth>
    }
  />
);

export default ProtectedRoute;
