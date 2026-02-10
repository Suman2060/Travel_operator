import { useState, useEffect } from 'react';
import Hero from '../components/home/Hero';
import PackageCard from '../components/ui/PackageCard';
import api from '../lib/api';

const Landing = () => {
    const [packages, setPackages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await api.get('/packages/');
                setPackages(response.data);
            } catch (err) {
                console.error("Failed to fetch packages", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPackages();
    }, []);

    const filteredPackages = packages.filter(pkg =>
        pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="bg-gray-50 min-h-screen">
            <Hero onSearch={setSearchTerm} />

            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Featured Tour Packages</h2>
                        <p className="text-gray-600">Handpicked journeys for your next great experience.</p>
                    </div>
                    <div className="h-1 w-20 bg-blue-600 rounded-full hidden md:block"></div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="h-[400px] bg-white rounded-lg animate-pulse shadow-sm"></div>
                        ))}
                    </div>
                ) : filteredPackages.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPackages.map((pkg) => (
                            <PackageCard key={pkg.id} packageData={pkg} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-600 text-lg italic">
                            {searchTerm ? `No results found for "${searchTerm}"` : "No packages available at the moment."}
                        </p>
                    </div>
                )}
            </section>

            {/* Simple Footer */}
            <footer className="bg-gray-900 text-white py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Chill Travel</h3>
                        <p className="text-gray-400 text-sm">Your reliable tour operator project.</p>
                    </div>
                    <div className="flex gap-8 text-sm text-gray-400">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Support</a>
                    </div>
                    <p className="text-gray-500 text-xs">© 2026 Chill Travel College Project.</p>
                </div>
            </footer>
        </main>
    );
};

export default Landing;
