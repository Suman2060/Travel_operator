import { useState, useEffect } from 'react';
import { MapPin, Clock, Type, DollarSign, Image as ImageIcon, Plus, Trash2, Save, X, Calendar as CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

const CreatePackage = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

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

    const [itinerary, setItinerary] = useState([
        { day_number: 1, title: '', description: '' }
    ]);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'guide')) {
            navigate('/login');
        }
    }, [user, authLoading, navigate]);

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
        if (formData.image) {
            data.append('image', formData.image);
        }
        data.append('itinerary_days', JSON.stringify(itinerary));

        try {
            await api.post('/packages/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/guide');
        } catch (err) {
            const errorData = err.response?.data;
            if (errorData && typeof errorData === 'object') {
                const errorMessages = Object.entries(errorData).map(([field, msgs]) => {
                    const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ');
                    return `${fieldName}: ${Array.isArray(msgs) ? msgs.join(' ') : msgs}`;
                });
                setError(errorMessages.join(' | '));
            } else {
                setError('Failed to create package. Verify all fields.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return (
        <div className="min-h-screen pt-28 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen pt-28 pb-20 px-6 font-sans">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">New Tour Entry</h1>
                        <p className="text-gray-600 text-sm mt-1">Listing a new journey in the database.</p>
                    </div>
                </header>

                {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-8 text-sm border border-red-100 font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info */}
                    <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-blue-600 mb-8 flex items-center gap-2 border-b border-gray-50 pb-4 uppercase tracking-wider">
                            <Type size={18} /> General Information
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-gray-600/60 mb-2 uppercase tracking-widest">Journey Title</label>
                                <input
                                    type="text"
                                    className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-600 outline-none font-bold text-gray-900"
                                    placeholder="Enter trip name"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-gray-600/60 mb-2 uppercase tracking-widest">Location</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-600 outline-none font-bold text-gray-900"
                                        placeholder="City, Country"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-600/60 mb-2 uppercase tracking-widest">Duration (Days)</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-600 outline-none font-bold text-gray-900"
                                        placeholder="e.g. 7 Days"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-gray-600/60 mb-2 uppercase tracking-widest">Price in USD (Converts to Nepali Rs.)</label>
                                    <input
                                        type="number"
                                        className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-600 outline-none font-bold text-gray-900"
                                        placeholder="500"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-600/60 mb-2 uppercase tracking-widest">Max Travelers Capacity</label>
                                    <input
                                        type="number"
                                        className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-600 outline-none font-bold text-gray-900"
                                        placeholder="10"
                                        value={formData.max_travelers}
                                        onChange={(e) => setFormData({ ...formData, max_travelers: e.target.value })}
                                        required
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-600/60 mb-2 uppercase tracking-widest">Cover Image (Upload)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-600 outline-none font-bold text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                    onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                />
                                {formData.image && typeof formData.image !== 'string' && (
                                    <p className="text-[10px] text-blue-600 mt-1 font-bold">Selected: {formData.image.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-600/60 mb-2 uppercase tracking-widest">Detailed Write-up</label>
                                <textarea
                                    className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-600 outline-none font-medium text-gray-900 bg-gray-50"
                                    rows={4}
                                    placeholder="Describe the trip..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    {/* Itinerary */}
                    <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-4">
                            <h2 className="text-lg font-bold text-blue-600 flex items-center gap-2 uppercase tracking-wider">
                                <CalendarIcon size={18} /> Day-by-Day Plan
                            </h2>
                            <button
                                type="button"
                                onClick={handleAddDay}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <Plus size={14} /> Add Day
                            </button>
                        </div>

                        <div className="space-y-6">
                            {itinerary.map((day, index) => (
                                <div key={index} className="p-6 rounded-lg bg-gray-50 border border-gray-100 relative">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="font-black text-blue-600 text-xl">Day {day.day_number}</div>
                                        {itinerary.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveDay(index)}
                                                className="text-red-400 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            className="w-full p-3 rounded-lg border border-gray-200 outline-none font-bold text-gray-900"
                                            placeholder="Plan title (e.g. Arrival and Dinner)"
                                            value={day.title}
                                            onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                                            required
                                        />
                                        <textarea
                                            className="w-full p-3 rounded-lg border border-gray-200 outline-none font-medium text-gray-600 bg-white"
                                            rows={2}
                                            placeholder="Activity description"
                                            value={day.description}
                                            onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="flex items-center justify-end gap-6 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/guide')}
                            className="font-bold text-gray-600 hover:underline text-sm uppercase tracking-widest"
                        >
                            Discard
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-12 py-4 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Verify and Publish"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePackage;
