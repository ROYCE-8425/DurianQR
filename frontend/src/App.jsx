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

// Layout
const Layout = ({ children }) => {
  const location = useLocation();
  const noNavbar = ['/login', '/register'];
  const publicPages = ['/trace'];

  const hideNavbar = noNavbar.includes(location.pathname) ||
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

          {/* Main */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/farming-log" element={<FarmingLogPage />} />
          <Route path="/harvest-request" element={<HarvestRequestPage />} />
          <Route path="/warehouse" element={<WarehousePage />} />
          <Route path="/qr" element={<QRManagement />} />
          <Route path="/guide" element={<GuidePage />} />

          {/* Public */}
          <Route path="/trace" element={<TracePage />} />
          <Route path="/trace/:batchCode" element={<TracePage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
