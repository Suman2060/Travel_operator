import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './pages/Landing';
import AllPackages from './pages/AllPackages';
import PackageDetail from './pages/PackageDetail';
import Booking from './pages/Booking';
import GuideDashboard from './pages/GuideDashboard';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import CreatePackage from './pages/CreatePackage';
import EditPackage from './pages/EditPackage';
import MyBookings from './pages/MyBookings'; // Added import
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="font-outfit text-gray-900 selection:bg-blue-100">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/packages" element={<AllPackages />} />
            <Route path="/package/:id" element={<PackageDetail />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/my-bookings" element={<MyBookings />} /> {/* Added route */}
            <Route path="/guide" element={<GuideDashboard />} />
            <Route path="/create-package" element={<CreatePackage />} />
            <Route path="/edit-package/:id" element={<EditPackage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
