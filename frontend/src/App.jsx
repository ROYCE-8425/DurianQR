import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import TracePage from './pages/TracePage';
import QRManagement from './pages/QRManagement';
import HarvestRequestPage from './pages/HarvestRequestPage';
import WarehousePage from './pages/WarehousePage';

// Layout component to conditionally show Navbar
const Layout = ({ children }) => {
  const location = useLocation();
  // Pages without Navbar
  const noNavbarPages = ['/login', '/register'];
  // Pages that are public (also no navbar but different styling)
  const publicPages = ['/trace'];
  
  const isNoNavbar = noNavbarPages.includes(location.pathname);
  const isPublicPage = publicPages.some(p => location.pathname.startsWith(p));

  return (
    <div className="App">
      {!isNoNavbar && !isPublicPage && <Navbar />}
      {children}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/qr" element={<QRManagement />} />
          <Route path="/harvest-request" element={<HarvestRequestPage />} />
          <Route path="/warehouse" element={<WarehousePage />} />
          
          {/* Public routes - Truy xuất nguồn gốc */}
          <Route path="/trace" element={<TracePage />} />
          <Route path="/trace/:batchCode" element={<TracePage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

