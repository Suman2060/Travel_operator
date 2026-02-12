import { useState, useEffect } from 'react';
import { Calendar, Users, CheckCircle, ChevronRight, AlertCircle, MapPin } from 'lucide-react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { formatNPR } from '../lib/currency';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

const Booking = () => {
    const [searchParams] = useSearchParams();
    const packageId = searchParams.get('package');
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();

    const [packageData, setPackageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        date: '',
        adults: 2,
    });

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
            return;
        }

        const fetchPackage = async () => {
            if (!packageId) {
                navigate('/');
                return;
            }
            try {
                const response = await api.get(`/packages/${packageId}/`);
                setPackageData(response.data);
            } catch (err) {
                console.error("Failed to fetch package", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPackage();
    }, [packageId, user, authLoading, navigate]);

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleCompleteBooking = async () => {
        setError('');
        setBookingLoading(true);
        try {
            await api.post('/bookings/', {
                package: packageId,
                travel_date: formData.date,
                num_travelers: formData.adults
            });
            setSuccess(true);
        } catch (err) {
            // Handle various error response formats
            const errorMessage =
                err.response?.data?.non_field_errors?.[0] ||
                err.response?.data?.detail ||
                (typeof err.response?.data === 'string' ? err.response.data : null) ||
                'Booking failed. Please try a different date.';
            setError(errorMessage);
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-screen pt-28 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="bg-gray-50 min-h-screen pt-40 px-6 text-center">
                <div className="max-w-md mx-auto bg-white p-12 rounded-xl shadow-md border border-gray-100">
                    <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Successful!</h2>
                    <p className="text-gray-600 mb-8">Your trip to {packageData.title} is confirmed. See you soon!</p>
                    <Link to="/" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const totalUSD = (packageData.price * formData.adults);

    return (
        <div className="bg-gray-50 min-h-screen pt-28 pb-20 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

                <div className="lg:col-span-2">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Complete Your Booking</h1>
                        <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-gray-600">
                            <span className={step >= 1 ? "text-blue-600" : ""}>1. Trip Date</span>
                            <ChevronRight size={14} />
                            <span className={step >= 2 ? "text-blue-600" : ""}>2. Travelers</span>
                            <ChevronRight size={14} />
                            <span className={step >= 3 ? "text-blue-600" : ""}>3. Review</span>
                        </div>
                    </header>

                    {error && (
                        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6 flex items-center gap-3 border border-red-100 text-sm">
                            <AlertCircle size={18} />
                            <span className="font-medium">{error}</span>
                        </div>
                    )}

                    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm min-h-[400px]">
                        {step === 1 && (
                            <div className="space-y-8 animate-fade-in">
                                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-50 pb-4">Trip Schedule</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-3 uppercase tracking-widest">Planned Arrival Date</label>
                                        <input
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full p-4 rounded-lg border border-gray-200 outline-none focus:border-blue-600 font-bold text-gray-900"
                                        />
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="text-xs font-bold text-gray-600 mb-1">Duration</div>
                                        <div className="text-lg font-black text-gray-900">{packageData.duration}</div>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-6">
                                    <button
                                        disabled={!formData.date}
                                        onClick={nextStep}
                                        className="bg-blue-600 text-white px-10 py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-30 transition-all flex items-center gap-2"
                                    >
                                        Next Component <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8 animate-fade-in">
                                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-50 pb-4">Group Confirmation</h2>
                                <div className="p-8 border border-gray-100 rounded-xl bg-gray-50/50 flex items-center justify-between">
                                    <div>
                                        <div className="font-bold text-gray-900">Travelers Count</div>
                                        <div className="text-xs text-gray-600 mt-1">Total people in your group</div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <button
                                            className="w-10 h-10 border border-gray-200 rounded bg-white text-gray-900 font-bold hover:bg-gray-50 disabled:opacity-30"
                                            onClick={() => setFormData({ ...formData, adults: Math.max(1, formData.adults - 1) })}
                                            disabled={formData.adults <= 1}
                                        >-</button>
                                        <span className="text-2xl font-black text-gray-900 w-6 text-center">{formData.adults}</span>
                                        <button
                                            className="w-10 h-10 border border-gray-200 rounded bg-white text-gray-900 font-bold hover:bg-gray-50 disabled:opacity-30"
                                            onClick={() => setFormData({ ...formData, adults: Math.min(packageData.max_travelers || 10, formData.adults + 1) })}
                                            disabled={formData.adults >= (packageData.max_travelers || 10)}
                                        >+</button>
                                    </div>
                                    {formData.adults >= (packageData.max_travelers || 10) && (
                                        <div className="absolute bottom-2 left-8 text-[10px] text-orange-500 font-bold uppercase">Maximum limit reached</div>
                                    )}
                                </div>
                                <div className="flex justify-between pt-6">
                                    <button onClick={prevStep} className="font-bold text-gray-600 hover:text-gray-900 underline">Back</button>
                                    <button onClick={nextStep} className="bg-blue-600 text-white px-10 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all">
                                        Final Review
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-8 animate-fade-in">
                                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-50 pb-4">Final Submission</h2>
                                <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-xl flex items-start gap-4">
                                    <CheckCircle className="text-blue-600 shrink-0" size={24} />
                                    <div>
                                        <div className="font-bold text-gray-900">Confirmation Notice</div>
                                        <p className="text-sm text-gray-600 mt-1">This booking will be officially logged in the system. Payment is collected on the first day of the trip.</p>
                                    </div>
                                </div>
                                <div className="flex justify-between pt-6">
                                    <button onClick={prevStep} className="font-bold text-gray-600 hover:text-gray-900 underline">Modify Details</button>
                                    <button
                                        onClick={handleCompleteBooking}
                                        disabled={bookingLoading}
                                        className="bg-blue-600 text-white px-12 py-4 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md disabled:opacity-50"
                                    >
                                        {bookingLoading ? "Processing..." : "Confirm Booking"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <aside className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-28">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-600 mb-6 border-b border-gray-50 pb-4">Booking Summary</h3>
                        <div className="flex gap-4 mb-8">
                            <img src={packageData.image} alt="Trip" className="w-20 h-20 rounded-lg object-cover border border-gray-50" />
                            <div>
                                <h4 className="font-bold text-gray-900 leading-tight line-clamp-2">{packageData.title}</h4>
                                <div className="flex items-center gap-1 text-[10px] uppercase font-black text-gray-600 mt-2">
                                    <MapPin size={10} /> {packageData.location}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600 font-medium">Group Size</span>
                                <span className="font-bold text-gray-900">{formData.adults} Travelers</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 font-medium">Rate per traveler</span>
                                <span className="font-bold text-gray-900">{formatNPR(packageData.price)}</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-xl text-right">
                            <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Total Trip Value</div>
                            <div className="text-3xl font-black text-blue-600">{formatNPR(totalUSD)}</div>

                        </div>
                    </aside>
                </div>

            </div>
        </div >
    );
};

export default Booking;
