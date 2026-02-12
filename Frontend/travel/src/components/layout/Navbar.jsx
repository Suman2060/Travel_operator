import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Compass } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../NotificationBell';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <Compass className="text-white" size={24} />
                    </div>
                    <span className={`text-2xl font-black tracking-tighter ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                        Chill<span className="text-blue-600">Travel</span>
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className={`font-semibold hover:text-blue-600 transition-colors ${isScrolled ? 'text-gray-600' : 'text-white/80'}`}>Home</Link>
                    <Link to="/packages" className={`font-semibold hover:text-blue-600 transition-colors ${isScrolled ? 'text-gray-600' : 'text-white/80'}`}>Packages</Link>

                    {user ? (
                        <div className="flex items-center gap-6">
                            {user.role === 'guide' ? (
                                <Link to="/guide" className={`font-semibold hover:text-blue-600 transition-colors ${isScrolled ? 'text-gray-600' : 'text-white/80'}`}>Guide Dashboard</Link>
                            ) : (
                                <Link to="/my-bookings" className={`font-semibold hover:text-blue-600 transition-colors ${isScrolled ? 'text-gray-600' : 'text-white/80'}`}>My Bookings</Link>
                            )}
                            <NotificationBell />
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${isScrolled ? 'border-gray-200 text-gray-900' : 'border-white/20 text-white'}`}>
                                <User size={18} />
                                <span className="font-bold">{user.username}</span>
                                <button onClick={handleLogout} className="ml-2 hover:text-red-500 transition-colors">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className={`font-semibold hover:text-blue-600 transition-colors ${isScrolled ? 'text-gray-600' : 'text-white/80'}`}>Login</Link>
                            <Link to="/signup" className="bg-blue-600 text-white px-6 py-2 rounded-md font-bold hover:bg-blue-700 transition-all">Sign Up</Link>
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className={`md:hidden p-2 rounded-md ${isScrolled ? 'text-gray-900' : 'text-white'}`}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute top-full left-0 right-0 p-6 flex flex-col gap-4 shadow-xl">
                    <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2">Home</Link>
                    <Link to="/packages" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2">Packages</Link>

                    {user ? (
                        <>
                            {user.role === 'guide' && (
                                <Link to="/guide" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2">Guide Dashboard</Link>
                            )}
                            <div className="flex items-center justify-between py-2">
                                <span className="font-bold text-gray-900">Hi, {user.username}</span>
                                <button onClick={handleLogout} className="text-red-500 font-bold flex items-center gap-2">
                                    <LogOut size={18} /> Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2">Login</Link>
                            <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="bg-blue-600 text-white py-3 rounded-md font-bold text-center">Sign Up</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
