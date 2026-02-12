import { useState, useEffect } from 'react';
import api from '../lib/api';
import PackageCard from '../components/ui/PackageCard';
import { Search, MapPin, Calendar } from 'lucide-react';

const AllPackages = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        location: '',
        days: ''
    });

    useEffect(() => {
        fetchPackages();
    }, [filters]);

    const fetchPackages = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (filters.location) params.append('location', filters.location);
            if (filters.days) params.append('days', filters.days);

            const response = await api.get(`/packages/?${params.toString()}`);
            setPackages(response.data);
        } catch (err) {
            console.error("Failed to fetch packages", err);
            setError("Failed to load packages. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <main className="bg-gray-50 min-h-screen pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header Section */}
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Explore Our Packages</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Find your perfect getaway. Filter by location or duration to narrow down your search.
                    </p>
                </div>

                {/* Filter Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Location Filter */}
                        <div className="relative">
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MapPin className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="location"
                                    id="location"
                                    value={filters.location}
                                    onChange={handleFilterChange}
                                    placeholder="Where do you want to go?"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                                />
                            </div>
                        </div>

                        {/* Days Filter */}
                        <div className="relative">
                            <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="days"
                                    id="days"
                                    value={filters.days}
                                    onChange={handleFilterChange}
                                    placeholder="e.g. 5"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Packages Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="h-[400px] bg-white rounded-lg animate-pulse shadow-sm"></div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-red-500">{error}</p>
                    </div>
                ) : packages.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {packages.map((pkg) => (
                            <PackageCard key={pkg.id} packageData={pkg} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                        <Search className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No packages found</h3>
                        <p className="text-gray-500 mt-1">Try adjusting your filters to find what you're looking for.</p>
                    </div>
                )}
            </div>
        </main>
    );
};

export default AllPackages;
