import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, Calendar, Users, ChevronRight, Star, Phone } from 'lucide-react';
import { formatNPR } from '../lib/currency';
import api, { getImageUrl } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const PackageDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [packageData, setPackageData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                const response = await api.get(`/packages/${id}/`);
                setPackageData(response.data);
            } catch (err) {
                console.error("Failed to fetch package details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPackage();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen pt-28 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!packageData) {
        return (
            <div className="min-h-screen pt-40 px-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Package not found</h2>
                <Link to="/" className="text-blue-600 underline">Back to Home</Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pt-24 pb-20">
            {/* Simple Hero */}
            <div className="h-[400px] w-full relative">
                <img src={getImageUrl(packageData.image)} alt={packageData.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute bottom-10 left-0 right-0 max-w-7xl mx-auto px-6">
                    <div className="flex items-center gap-2 text-white/80 text-sm mb-2 uppercase tracking-widest font-bold">
                        <MapPin size={16} /> {packageData.location}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white">{packageData.title}</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">About this journey</h2>
                        <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
                            {packageData.description}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Daily Itinerary</h2>
                        <div className="space-y-6">
                            {packageData.itinerary_days && packageData.itinerary_days.length > 0 ? (
                                packageData.itinerary_days.map((day) => (
                                    <div key={day.id} className="flex gap-6 p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
                                        <div className="shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                                            {day.day_number}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{day.title}</h3>
                                            <p className="text-gray-600 leading-relaxed">{day.description}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-600 italic">Detailed itinerary for this package is coming soon.</p>
                            )}
                        </div>
                    </section>
                </div>

                {/* Sidebar Booking Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 sticky top-28">
                        <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-100">
                            <div>
                                <span className="text-sm text-gray-600 uppercase tracking-wider font-bold">Starting from</span>
                                <div className="text-3xl font-black text-gray-900 mt-1">{formatNPR(packageData.price)}</div>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <span className="text-xs text-gray-600 italic">per person</span>
                                    <span className="text-xs text-gray-500">(${(packageData.price / 133).toFixed(2)} USD)</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-4 text-gray-600 font-medium">
                                <Clock size={20} className="text-blue-600" /> {packageData.duration}
                            </div>
                            <div className="flex items-center gap-4 text-gray-600 font-medium">
                                <Users size={20} className="text-blue-600" /> Max Group: {packageData.max_travelers || 10}
                            </div>
                            <div className="flex items-center gap-4 text-gray-600 font-medium">
                                <Calendar size={20} className="text-blue-600" /> Flexible Dates
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Certified Guide</h4>
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-600">
                                    <Users size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-gray-900">{packageData.guide_name || 'Expert Guide'}</div>
                                    {packageData.guide_phone && (
                                        <div className="text-xs text-blue-600 font-bold mt-0.5 flex items-center gap-1">
                                            <Phone size={12} className="shrink-0" />
                                            {packageData.guide_phone}
                                        </div>
                                    )}
                                    <div className="text-[10px] text-gray-600 font-medium uppercase mt-1">Verified Professional</div>
                                </div>
                            </div>
                        </div>

                        {user?.role === 'guide' ? (
                            <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-center">
                                <p className="text-yellow-800 text-sm font-bold">Guide Account Detected</p>
                                <p className="text-yellow-700 text-xs mt-1">
                                    Guides cannot book trips. Please use a traveler account to make a booking.
                                </p>
                            </div>
                        ) : (
                            <Link
                                to={`/booking?package=${packageData.id}`}
                                className="block w-full bg-blue-600 text-white text-center py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all transform hover:-translate-y-1 shadow-lg mt-8"
                            >
                                Book This Journey
                            </Link>
                        )}

                        <p className="text-center text-gray-600 text-xs mt-4">No payment required until you arrive</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PackageDetail;
