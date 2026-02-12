import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { Calendar, MapPin, Users, Ban } from 'lucide-react';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                navigate('/login');
            } else if (user.role === 'guide') {
                navigate('/guide');
            } else {
                fetchBookings();
            }
        }
    }, [user, authLoading, navigate]);

    const fetchBookings = async () => {
        try {
            const response = await api.get('/bookings/');
            setBookings(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching bookings:', err);
            setError('Failed to load your bookings. Please try again.');
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        try {
            const response = await api.delete(`/bookings/${bookingId}/`);
            if (response.status === 204) {
                // Remove the cancelled booking from the list or refresh
                setBookings(bookings.filter(b => b.id !== bookingId));
                alert('Booking cancelled successfully.');
            } else {
                throw new Error('Failed to delete');
            }
        } catch (err) {
            console.error('Error cancelling booking:', err);
            alert('Failed to cancel booking. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <Ban className="h-5 w-5 text-red-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {bookings.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                            <Calendar className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
                        <p className="mt-2 text-gray-500">You haven't booked any trips yet.</p>
                        <div className="mt-6">
                            <a href="/packages" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Browse Packages
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-bold text-gray-900">
                                            {booking.package_details?.title || 'Tour Package'}
                                        </h2>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div className="flex items-center text-gray-600">
                                            <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                                            <span>
                                                Travel Date: <span className="font-semibold text-gray-900">{booking.travel_date}</span>
                                            </span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                                            <span>
                                                Location: <span className="font-semibold text-gray-900">{booking.package_details?.location || 'Unknown'}</span>
                                            </span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Users className="h-5 w-5 mr-2 text-blue-500" />
                                            <span>
                                                Travelers: <span className="font-semibold text-gray-900">{booking.num_travelers} People</span>
                                            </span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-lg font-bold text-green-600">
                                                Rs. {booking.total_price}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                (${(booking.total_price / 133).toFixed(2)} USD)
                                            </span>
                                        </div>
                                    </div>

                                    {booking.status === 'confirmed' && (
                                        <div className="border-t pt-4 flex justify-end">
                                            <button
                                                onClick={() => handleCancelBooking(booking.id)}
                                                className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                            >
                                                Cancel Booking
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
