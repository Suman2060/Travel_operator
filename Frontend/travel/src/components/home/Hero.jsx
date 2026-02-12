import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

const Hero = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSearch = (e) => {
        const val = e.target.value;
        setQuery(val);
        if (onSearch) onSearch(val);
    };

    return (
        <section className="relative py-32 bg-gray-900">
            {/* Simple Background Pattern or Image */}
            <div className="absolute inset-0 opacity-40">
                <img
                    src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                    alt="Majestic Nepal Mountains"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
                        Find Your Next Adventure
                    </h1>
                    <p className="text-xl text-gray-200 mb-10 leading-relaxed">
                        The easiest way to discover and book tour packages curated by professional guides.
                    </p>

                    {/* Simple Search Bar */}
                    <div className="bg-white p-2 rounded-lg shadow-lg flex flex-col md:flex-row items-center gap-2 max-w-2xl mx-auto">
                        <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r border-gray-100">
                            <MapPin size={22} className="text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search destinations (e.g. Nepal, Paris)"
                                className="w-full outline-none text-gray-900"
                                value={query}
                                onChange={handleSearch}
                            />
                        </div>
                        <button
                            onClick={() => onSearch && onSearch(query)}
                            className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-md font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                        >
                            <Search size={20} />
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
