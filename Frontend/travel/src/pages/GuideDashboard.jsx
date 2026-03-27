import { useState, useEffect } from 'react';
import { MapPin, Users, Plus, Edit2, Trash2, Calendar, ClipboardList, Layout } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { formatNPR } from '../lib/currency';
import api, { getImageUrl } from '../lib/api';

const GuideDashboard = () => {
    const { user, loading: authLoading } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [myPackages, setMyPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('trips');
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

                const allPackages = packagesResp.data;
                const userId = user?.id;

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
        if (window.confirm("Are you sure you want to remove this trip?")) {
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
            const response = await api.get('/bookings/');
            setBookings(response.data);
        } catch (err) {
            alert('Failed to approve booking.');
        }
    };

    const handleRejectBooking = async (id) => {
        if (window.confirm('Reject this booking request?')) {
            try {
                await api.post(`/bookings/${id}/reject/`);
                const response = await api.get('/bookings/');
                setBookings(response.data);
            } catch (err) {
                alert('Failed to reject booking.');
            }
        }
    };

    const pendingBookings = bookings.filter(b => b.status === 'pending');

    if (authLoading || loading) {
        return (
            <div className="min-h-screen pt-28 flex justify-center items-center bg-white">
                <div className="animate-pulse text-gray-400 font-medium">Loading your dashboard...</div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pt-28 pb-32 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Simple Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Hi, {user.username}!</h1>
                        <p className="text-gray-500 mt-2 text-lg font-medium">Manage your trips and traveler bookings from one place.</p>
                    </div>
                    <Link
                        to="/create-package"
                        className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-sm"
                    >
                        <Plus size={20} />
                        Create New Trip
                    </Link>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 transition-all hover:border-gray-200">
                        <div className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Your Trips</div>
                        <div className="text-4xl font-black text-gray-900">{myPackages.length}</div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 transition-all hover:border-gray-200">
                        <div className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Total Bookings</div>
                        <div className="text-4xl font-black text-gray-900">{bookings.length}</div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 transition-all hover:border-gray-200">
                        <div className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Pending Requests</div>
                        <div className="text-4xl font-black text-blue-600">{pendingBookings.length}</div>
                    </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
                    <button
                        onClick={() => setActiveTab('trips')}
                        className={`px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                            activeTab === 'trips' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <Layout size={16} />
                            My Trips
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                            activeTab === 'bookings' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            Client Bookings
                            {pendingBookings.length > 0 && (
                                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            )}
                        </div>
                    </button>
                </div>

                {/* Content Section */}
                <div>
                    {activeTab === 'trips' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {myPackages.length > 0 ? (
                                myPackages.map((pkg) => (
                                    <div key={pkg.id} className="bg-white group">
                                        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 mb-4 relative">
                                            {pkg.image ? (
                                                <img src={getImageUrl(pkg.image)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={pkg.title} />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <MapPin size={40} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-gray-900 text-xl leading-snug">{pkg.title}</h3>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                                                <span className="flex items-center gap-1"><MapPin size={14} />{pkg.location}</span>
                                                <span className="flex items-center gap-1"><Calendar size={14} />{pkg.duration} Days</span>
                                            </div>
                                            <div className="pt-4 flex items-center gap-3">
                                                <button
                                                    onClick={() => navigate(`/edit-package/${pkg.id}`)}
                                                    className="flex-1 bg-gray-100 text-gray-900 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Edit2 size={14} />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeletePackage(pkg.id)}
                                                    className="p-2.5 bg-gray-50 text-red-500 rounded-xl hover:bg-red-50 transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                                    <h4 className="font-bold text-gray-900 mb-2">Ready to start?</h4>
                                    <p className="text-gray-500 mb-6 font-medium">Create your first tour package and share it with travelers.</p>
                                    <Link to="/create-package" className="text-blue-600 font-bold hover:underline">Click here to create trip</Link>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {bookings.length > 0 ? (
                                bookings.sort((a, b) => (a.status === 'pending' ? -1 : 1)).map((booking) => (
                                    <div key={booking.id} className={`p-6 rounded-2xl border transition-all ${booking.status === 'pending' ? 'bg-blue-50/30 border-blue-100 shadow-sm' : 'bg-gray-50 border-gray-100'}`}>
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-400 border border-gray-100 font-bold">
                                                    {booking.user_name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <h4 className="font-bold text-gray-900">{booking.user_name}</h4>
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                            booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                                                            booking.status === 'pending' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
                                                        }`}>
                                                            {booking.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-500 text-sm mt-1">{booking.package_details.title} • {booking.travel_date}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col md:items-end">
                                                <div className="text-lg font-black text-gray-900">{formatNPR(booking.total_price)}</div>
                                                <div className="text-xs text-gray-500 font-medium">{booking.num_travelers} Travelers</div>
                                            </div>

                                            <div className="flex gap-2 w-full md:w-auto">
                                                {booking.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApproveBooking(booking.id)}
                                                            className="flex-1 md:flex-none bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-black transition-all"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectBooking(booking.id)}
                                                            className="flex-1 md:flex-none bg-white text-red-500 border border-red-100 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-50 transition-all"
                                                        >
                                                            Decline
                                                        </button>
                                                    </>
                                                )}
                                                {booking.status === 'confirmed' && (
                                                    <div className="text-green-600 text-xs font-bold flex items-center gap-1">
                                                        <ClipboardList size={14} />
                                                        Trip In Schedule
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center text-gray-500 font-medium">No bookings received yet.</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GuideDashboard;

