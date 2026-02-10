import { useState, useEffect } from 'react';
import { MapPin, Users, Plus, Edit2, Trash2, ArrowUpRight, BarChart2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { formatNPR } from '../lib/currency';
import api, { getImageUrl } from '../lib/api';

const GuideDashboard = () => {
    const { user, loading: authLoading } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [myPackages, setMyPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('bookings');
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'guide')) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const [bookingsResp, packagesResp] = await Promise.all([
                    api.get('/bookings/'),
                    api.get('/packages/')
                ]);
                setBookings(bookingsResp.data);
                const filtered = packagesResp.data.filter(pkg => pkg.guide === user.id);
                setMyPackages(filtered);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.role === 'guide') {
            fetchData();
        }
    }, [user, authLoading, navigate]);

    const handleDeletePackage = async (id) => {
        if (window.confirm("Delete this trip? Travelers with active bookings will be notified.")) {
            try {
                await api.delete(`/packages/${id}/`);
                setMyPackages(myPackages.filter(p => p.id !== id));
            } catch (err) {
                alert("Error deleting package.");
            }
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen pt-28 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pt-28 pb-20 px-6">
            <div className="max-w-7xl mx-auto">

                {/* Dashboard Header */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Guide Panel</h1>
                        <p className="text-gray-600 mt-1">Logged in as <span className="text-blue-600 font-bold">{user.username}</span></p>
                    </div>
                    <Link
                        to="/create-package"
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-md"
                    >
                        <Plus size={20} />
                        Add New Package
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Sidebar Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg">
                            <div className="flex items-center gap-3 mb-6">
                                <BarChart2 className="text-blue-600" />
                                <h3 className="font-bold uppercase tracking-wider text-xs">Trip Overview</h3>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <div className="text-xs text-gray-400 mb-1">Total Packages</div>
                                    <div className="text-3xl font-bold">{myPackages.length}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400 mb-1">Total Bookings</div>
                                    <div className="text-3xl font-bold">{bookings.length}</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4 text-sm">System Status</h3>
                            <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                                <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
                                Servers Operational
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Tabs */}
                            <div className="flex border-b border-gray-100">
                                <button
                                    onClick={() => setActiveTab('bookings')}
                                    className={`flex-1 py-4 font-bold text-sm transition-colors ${activeTab === 'bookings' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    Recent Bookings ({bookings.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('packages')}
                                    className={`flex-1 py-4 font-bold text-sm transition-colors ${activeTab === 'packages' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    My Packages ({myPackages.length})
                                </button>
                            </div>

                            <div className="p-6">
                                {activeTab === 'bookings' ? (
                                    <div className="overflow-x-auto">
                                        {bookings.length > 0 ? (
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="text-xs font-bold text-gray-600 uppercase tracking-widest border-b border-gray-100">
                                                        <th className="pb-4">Traveler</th>
                                                        <th className="pb-4">Package</th>
                                                        <th className="pb-4">Date</th>
                                                        <th className="pb-4">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {bookings.map((booking) => (
                                                        <tr key={booking.id} className="group hover:bg-gray-50/50">
                                                            <td className="py-4">
                                                                <div className="font-bold text-gray-900">{booking.user_name}</div>
                                                                <div className="text-xs text-gray-600">{booking.num_travelers} Travelers</div>
                                                            </td>
                                                            <td className="py-4 font-medium text-gray-900">{booking.package_details.title}</td>
                                                            <td className="py-4 text-sm text-gray-600">{booking.travel_date}</td>
                                                            <td className="py-4 font-bold text-blue-600">{formatNPR(booking.total_price / 134.5)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <div className="text-center py-20 text-gray-600 italic text-sm">No traveler bookings yet.</div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {myPackages.length > 0 ? (
                                            myPackages.map((pkg) => (
                                                <div key={pkg.id} className="border border-gray-100 rounded-xl overflow-hidden flex flex-col bg-white hover:border-blue-600/40 transition-colors">
                                                    <div className="h-32 bg-gray-100">
                                                        <img src={getImageUrl(pkg.image)} className="w-full h-full object-cover" alt={pkg.title} />
                                                    </div>
                                                    <div className="p-4 flex-1 flex flex-col">
                                                        <h4 className="font-bold text-gray-900 line-clamp-1 mb-1">{pkg.title}</h4>
                                                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-4">
                                                            <MapPin size={12} /> {pkg.location}
                                                        </div>
                                                        <div className="mt-auto flex items-center gap-2">
                                                            <Link to={`/package/${pkg.id}`} className="p-2 bg-gray-50 rounded text-gray-600 hover:text-blue-600 transition-colors"><ArrowUpRight size={16} /></Link>
                                                            <button onClick={() => navigate(`/edit-package/${pkg.id}`)} className="p-2 bg-gray-50 rounded text-gray-600 hover:text-blue-600 transition-colors"><Edit2 size={16} /></button>
                                                            <button onClick={() => handleDeletePackage(pkg.id)} className="p-2 bg-gray-50 rounded text-gray-600 hover:text-red-500 transition-colors ml-auto"><Trash2 size={16} /></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-full text-center py-20 text-gray-600 italic text-sm">No packages listed.</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuideDashboard;
