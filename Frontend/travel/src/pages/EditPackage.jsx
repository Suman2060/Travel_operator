import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin,
    Clock,
    Type,
    DollarSign,
    Image as ImageIcon,
    Plus,
    Trash2,
    Save,
    X,
    Users,
    Calendar as CalendarIcon
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

const EditPackage = () => {
    const { id } = useParams();
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [fetching, setFetching] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        duration: '',
        location: '',
        image: '',
        max_travelers: 10
    });

    const [itinerary, setItinerary] = useState([]);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'guide')) {
            setFetching(false);
            navigate('/login');
            return;
        }

        const fetchPackage = async () => {
            try {
                const response = await api.get(`/packages/${id}/`);
                const data = response.data;

                // Use loose equality (==) to handle potential type mismatch
                // between JWT decoded user_id (number) and API guide field (number)
                // eslint-disable-next-line eqeqeq
                if (data.guide != user.id) {
                    navigate('/guide');
                    return;
                }

                setFormData({
                    title: data.title,
                    description: data.description,
                    price: data.price,
                    duration: data.duration,
                    location: data.location,
                    image: data.image,
                    max_travelers: data.max_travelers || 10
                });
                setItinerary(data.itinerary_days || []);
            } catch (err) {
                console.error("Failed to fetch package for editing", err);
                setError("Could not load trip data.");
            } finally {
                setFetching(false);
            }
        };

        if (user?.role === 'guide') {
            fetchPackage();
        }
    }, [id, user, authLoading, navigate]);

    const handleAddDay = () => {
        setItinerary([
            ...itinerary,
            { day_number: itinerary.length + 1, title: '', description: '' }
        ]);
    };

    const handleRemoveDay = (index) => {
        const newItinerary = itinerary.filter((_, i) => i !== index);
        const renumbered = newItinerary.map((day, i) => ({
            ...day,
            day_number: i + 1
        }));
        setItinerary(renumbered);
    };

    const handleItineraryChange = (index, field, value) => {
        const newItinerary = [...itinerary];
        newItinerary[index][field] = value;
        setItinerary(newItinerary);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('duration', formData.duration);
        data.append('location', formData.location);
        data.append('max_travelers', formData.max_travelers);

        // Only append image if it's a new file object
        if (formData.image && typeof formData.image !== 'string') {
            data.append('image', formData.image);
        }

        data.append('itinerary_days', JSON.stringify(itinerary));

        try {
            await api.put(`/packages/${id}/`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/guide');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to update package.');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || fetching) {
        return (
            <div className="bg-gray-50 min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pt-28 pb-20 px-6">
            <div className="max-w-5xl mx-auto">
                <header className="mb-12 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Journey</h1>
                        <p className="text-gray-600 text-lg">Updating "{formData.title}"</p>
                    </div>
                    <button
                        onClick={() => navigate('/guide')}
                        className="p-3 rounded-full bg-white text-gray-600 hover:text-gray-900 transition-colors shadow-sm"
                    >
                        <X size={24} />
                    </button>
                </header>

                {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-2xl mb-8 font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-12">
                    <section className="bg-white rounded-[40px] p-10 shadow-float">
                        <h2 className="text-xl font-bold text-gray-900 mb-10 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                <Type size={18} />
                            </div>
                            Core Trip Details
                        </h2>

                        <div className="space-y-8">
                            <div>
                                <label className="block text-xs font-black text-gray-600/40 mb-3 uppercase tracking-widest">Package Title</label>
                                <input
                                    type="text"
                                    className="w-full p-4 rounded-2xl border border-gray-100 focus:border-blue-600 outline-none font-bold text-xl text-gray-900 bg-gray-50/30"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-xs font-black text-gray-600/40 mb-3 uppercase tracking-widest flex items-center gap-2">
                                        <MapPin size={12} /> Location
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full p-4 rounded-2xl border border-gray-100 focus:border-blue-600 outline-none font-bold text-gray-900 bg-gray-50/30"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-600/40 mb-3 uppercase tracking-widest flex items-center gap-2">
                                        <Clock size={12} /> Duration
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full p-4 rounded-2xl border border-gray-100 focus:border-blue-600 outline-none font-bold text-gray-900 bg-gray-50/30"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-xs font-black text-gray-600/40 mb-3 uppercase tracking-widest flex items-center gap-2">
                                        <DollarSign size={12} /> Base Price (NPR)
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full p-4 rounded-2xl border border-gray-100 focus:border-blue-600 outline-none font-bold text-gray-900 bg-gray-50/30"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-600/40 mb-3 uppercase tracking-widest flex items-center gap-2">
                                        <Users size={12} /> Max Group Capacity
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full p-4 rounded-2xl border border-gray-100 focus:border-blue-600 outline-none font-bold text-gray-900 bg-gray-50/30"
                                        value={formData.max_travelers}
                                        onChange={(e) => setFormData({ ...formData, max_travelers: e.target.value })}
                                        required
                                        min="1"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-xs font-black text-gray-600/40 mb-3 uppercase tracking-widest flex items-center gap-2">
                                        <ImageIcon size={12} /> Replace Cover Image
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="w-full p-4 rounded-2xl border border-gray-100 focus:border-blue-600 outline-none font-bold text-gray-900 bg-gray-50/30 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white"
                                        onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                    />
                                    {formData.image && typeof formData.image === 'string' && (
                                        <div className="mt-3 flex items-center gap-3">
                                            <img src={formData.image} alt="Current" className="w-12 h-12 rounded-lg object-cover border border-gray-100" />
                                            <span className="text-[10px] font-bold text-gray-600 uppercase">Current Image</span>
                                        </div>
                                    )}
                                    {formData.image && typeof formData.image !== 'string' && (
                                        <p className="text-[10px] text-blue-600 mt-2 font-bold uppercase tracking-widest">New File: {formData.image.name}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-600/40 mb-3 uppercase tracking-widest">Rich Description</label>
                                <textarea
                                    rows={5}
                                    className="w-full p-4 rounded-2xl border border-gray-100 focus:border-blue-600 outline-none font-medium text-gray-900 bg-gray-50/30 resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    <section className="bg-white rounded-[40px] p-10 shadow-float">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                    <CalendarIcon size={18} />
                                </div>
                                Manage Itinerary
                            </h2>
                            <button
                                type="button"
                                onClick={handleAddDay}
                                className="flex items-center gap-2 text-blue-600 font-bold text-sm bg-blue-50 px-6 py-2.5 rounded-xl border-2 border-blue-100 hover:bg-blue-600 hover:text-white transition-all"
                            >
                                <Plus size={16} /> Add Next Day
                            </button>
                        </div>

                        <div className="space-y-10">
                            <AnimatePresence>
                                {itinerary.map((day, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="relative p-8 rounded-3xl bg-gray-50/20 border border-gray-50 group"
                                    >
                                        <div className="absolute -left-4 top-8 w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold shadow-xl border-4 border-white">
                                            {day.day_number}
                                        </div>

                                        <div className="ml-8 space-y-6">
                                            <div className="flex items-center justify-between gap-4">
                                                <input
                                                    type="text"
                                                    placeholder="Focus of the day..."
                                                    className="flex-1 bg-transparent border-b-2 border-gray-100 focus:border-blue-600 outline-none font-bold text-gray-900 py-3 text-lg"
                                                    value={day.title}
                                                    onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveDay(index)}
                                                    className="text-gray-600/40 hover:text-red-500 transition-colors p-2"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                            <textarea
                                                placeholder="Describe the experience..."
                                                rows={2}
                                                className="w-full bg-transparent border-none focus:ring-0 outline-none font-medium text-gray-600 py-2 resize-none"
                                                value={day.description}
                                                onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </section>

                    <div className="flex items-center justify-end gap-8 pt-6">
                        <button
                            type="button"
                            onClick={() => navigate('/guide')}
                            className="font-bold text-gray-600 hover:text-gray-900 transition-colors text-lg"
                        >
                            Discard Changes
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-gray-900 text-white px-12 py-5 rounded-[24px] font-bold text-xl hover:bg-blue-600 hover:shadow-float-hover hover:-translate-y-1 transition-all flex items-center gap-3 disabled:opacity-70"
                        >
                            {loading ? "Updating..." : (
                                <>
                                    <Save size={24} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPackage;
