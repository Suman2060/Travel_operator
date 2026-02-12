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
    // CHANGE: Default to 'packages' tab so guide sees their work immediately
    const [activeTab, setActiveTab] = useState('packages');
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

                // Filter packages by guide
                const allPackages = packagesResp.data;
                const userId = user?.id;

                // Robust filtering using loose equality (==)
                const filtered = allPackages.filter(pkg => {
                    const guideId = typeof pkg.guide === 'object' ? pkg.guide.id : pkg.guide;
                    // eslint-disable-next-line eqeqeq
                    return guideId == userId;
                });

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

    const handleApproveBooking = async (id) => {
        try {
            await api.post(`/bookings/${id}/approve/`);
            // Refresh bookings
            const response = await api.get('/bookings/');
            setBookings(response.data);
            alert('Booking approved! Traveler will be notified.');
        } catch (err) {
            console.error('Error approving booking:', err);
            alert('Failed to approve booking.');
        }
    };

    const handleRejectBooking = async (id) => {
        if (window.confirm('Are you sure you want to reject this booking request?')) {
            try {
                await api.post(`/bookings/${id}/reject/`);
                // Refresh bookings
                const response = await api.get('/bookings/');
                setBookings(response.data);
                alert('Booking rejected. Traveler will be notified.');
            } catch (err) {
                console.error('Error rejecting booking:', err);
                alert('Failed to reject booking.');
            }
        }
    };

    const pendingBookings = bookings.filter(b => b.status === 'pending');
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed');


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
                                    onClick={() => setActiveTab('packages')}
                                    className={`flex-1 py-4 font-bold text-sm transition-colors ${activeTab === 'packages' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    My Packages ({myPackages.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('pending')}
                                    className={`flex-1 py-4 font-bold text-sm transition-colors ${activeTab === 'pending' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    Pending Requests ({pendingBookings.length})
                                    {pendingBookings.length > 0 && (
                                        <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">{pendingBookings.length}</span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('bookings')}
                                    className={`flex-1 py-4 font-bold text-sm transition-colors ${activeTab === 'bookings' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    All Bookings ({bookings.length})
                                </button>
                            </div>

                            <div className="p-6">
                                {activeTab === 'pending' ? (
                                    <div className="space-y-4">
                                        {pendingBookings.length > 0 ? (
                                            pendingBookings.map((booking) => (
                                                <div key={booking.id} className="border border-yellow-200 bg-yellow-50 rounded-lg p-6">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h4 className="font-bold text-gray-900 text-lg">{booking.package_details.title}</h4>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                Requested by <span className="font-semibold">{booking.user_name}</span>
                                                            </p>
                                                        </div>
                                                        <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">Pending</span>
                                                    </div>

                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                        <div>
                                                            <div className="text-xs text-gray-500">Travel Date</div>
                                                            <div className="font-semibold">{booking.travel_date}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-500">Travelers</div>
                                                            <div className="font-semibold">{booking.num_travelers} people</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-500">Total Price</div>
                                                            <div className="font-semibold text-blue-600">{formatNPR(booking.total_price)}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-500">Booked On</div>
                                                            <div className="font-semibold">{new Date(booking.created_at).toLocaleDateString()}</div>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-3 pt-4 border-t border-yellow-200">
                                                        <button
                                                            onClick={() => handleApproveBooking(booking.id)}
                                                            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                                                        >
                                                            Approve Booking
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectBooking(booking.id)}
                                                            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12 text-gray-500">
                                                No pending booking requests
                                            </div>
                                        )}
                                    </div>
                                ) : activeTab === 'bookings' ? (
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
                                                            <td className="py-4 font-bold text-blue-600">{formatNPR(booking.total_price)}</td>
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
                                                <div key={pkg.id} className="border border-gray-200 rounded-xl overflow-hidden flex flex-col bg-white hover:shadow-lg transition-all">
                                                    <div className="h-40 bg-gray-100 relative">
                                                        {pkg.image ? (
                                                            <img src={getImageUrl(pkg.image)} className="w-full h-full object-cover" alt={pkg.title} />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                                                                <MapPin size={48} />
                                                            </div>
                                                        )}
                                                        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-xs font-bold text-blue-600">
                                                            {formatNPR(pkg.price)}
                                                        </div>
                                                    </div>
                                                    <div className="p-5 flex-1 flex flex-col">
                                                        <h4 className="font-bold text-gray-900 text-lg mb-2">{pkg.title}</h4>
                                                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                                            <div className="flex items-center gap-1">
                                                                <MapPin size={14} />
                                                                <span>{pkg.location}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Users size={14} />
                                                                <span>{pkg.duration} days</span>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{pkg.description}</p>
                                                        <div className="mt-auto flex items-center gap-3 pt-4 border-t border-gray-100">
                                                            <Link
                                                                to={`/package/${pkg.id}`}
                                                                className="flex-1 px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors text-center text-sm font-medium flex items-center justify-center gap-2"
                                                            >
                                                                <ArrowUpRight size={16} />
                                                                View
                                                            </Link>
                                                            <button
                                                                onClick={() => navigate(`/edit-package/${pkg.id}`)}
                                                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                                                            >
                                                                <Edit2 size={16} />
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeletePackage(pkg.id)}
                                                                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-full text-center py-20">
                                                <div className="text-gray-400 mb-4">
                                                    <Plus size={48} className="mx-auto" />
                                                </div>
                                                <p className="text-gray-600 font-medium mb-2">No packages yet</p>
                                                <p className="text-gray-500 text-sm mb-6">Create your first tour package to get started</p>
                                                <Link
                                                    to="/create-package"
                                                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all"
                                                >
                                                    <Plus size={20} />
                                                    Add New Package
                                                </Link>
                                            </div>
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
