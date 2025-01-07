import Navbar from '../components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RequireAuth from '../auth/RequireAuth';


function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <Navbar />
            XD
          </RequireAuth>
        }
      />
    </Routes>
  )
}

export default App;