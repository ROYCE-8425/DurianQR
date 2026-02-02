import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import TracePage from './pages/TracePage';
import QRManagement from './pages/QRManagement';
import HarvestRequestPage from './pages/HarvestRequestPage';
import WarehousePage from './pages/WarehousePage';
import GuidePage from './pages/GuidePage';
import FarmingLogPage from './pages/FarmingLogPage';
import FarmerDashboard from './pages/FarmerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TraceabilityPage from './pages/TraceabilityPage';

// Layout - Xác định khi nào hiển thị Navbar
const Layout = ({ children }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // Các trang không có Navbar
  const noNavbar = ['/login', '/register', '/farmer', '/admin', '/traceability'];
  const publicPages = ['/trace'];

  const hideNavbar = noNavbar.some(p => location.pathname.startsWith(p)) ||
    publicPages.some(p => location.pathname.startsWith(p));

  return (
    <div className="App">
      {!hideNavbar && <Navbar />}
      {children}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Main Dashboard */}
          <Route path="/" element={<Dashboard />} />

          {/* Farmer Interface - Mobile First */}
          <Route path="/farmer" element={<FarmerDashboard />} />
          <Route path="/farming-log" element={<FarmingLogPage />} />
          <Route path="/harvest-request" element={<HarvestRequestPage />} />

          {/* Admin Interface - Desktop Dashboard */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/warehouse" element={<WarehousePage />} />
          <Route path="/qr" element={<QRManagement />} />

          {/* Guide */}
          <Route path="/guide" element={<GuidePage />} />

          {/* Public - Traceability */}
          <Route path="/trace" element={<TracePage />} />
          <Route path="/trace/:batchCode" element={<TracePage />} />
          <Route path="/traceability" element={<TraceabilityPage />} />
          <Route path="/traceability/:batchCode" element={<TraceabilityPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
