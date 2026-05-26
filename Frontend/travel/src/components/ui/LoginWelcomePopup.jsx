import React, { useEffect } from 'react';
import { Compass, X } from 'lucide-react';

const LoginWelcomePopup = ({ user, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    if (!user) return null;

    const isGuide = user.role === 'guide';

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300">
            <div className="relative w-full max-w-sm overflow-hidden bg-white rounded-2xl shadow-xl border border-gray-100 transform transition-all duration-300 scale-100 animate-in fade-in zoom-in-95">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-50"
                >
                    <X size={16} />
                </button>

                <div className="p-8 text-center flex flex-col items-center">
                    {/* Unified Clean Icon Container */}
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-blue-50 text-blue-600">
                        <Compass size={24} />
                    </div>

                    {/* Unified Role Badge */}
                    <div className="text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 inline-block bg-blue-50 text-blue-700 border border-blue-100">
                        {isGuide ? 'Guide' : 'Traveler'} • {user.username}
                    </div>

                    {/* Welcome Title */}
                    <h2 className="text-xl font-bold text-gray-900 leading-tight mb-2 tracking-tight">
                        Welcome back
                    </h2>

                    {/* Custom Message based on role */}
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 font-medium">
                        {isGuide 
                            ? "Ready to design unforgettable journeys? Create new tour packages, review traveler bookings, and manage your trips from your Guide Dashboard."
                            : "Where are we heading next? Browse the most stunning travel destinations, check itineraries, and book your next dream adventure today."
                        }
                    </p>

                    {/* Unified Action Button */}
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 px-6 rounded-xl font-semibold text-white transition-all text-sm shadow-sm bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                    >
                        {isGuide ? "Go to Dashboard" : "Let's Explore"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginWelcomePopup;
