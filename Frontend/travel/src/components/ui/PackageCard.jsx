import { MapPin, Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatNPR } from '../../lib/currency';
import { getImageUrl } from '../../lib/api';

const PackageCard = ({ packageData }) => {
    const { id, title, image, price, duration, location } = packageData;

    return (
        <Link
            to={`/package/${id}`}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow cursor-pointer group no-underline"
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={getImageUrl(image) || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>

            <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center text-gray-500 text-xs mb-1 uppercase tracking-wider font-bold">
                    <MapPin size={12} className="mr-1" />
                    {location}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {title}
                </h3>

                <div className="flex items-center text-gray-500 text-sm mb-4">
                    <Clock size={14} className="mr-1" />
                    <span>{duration}</span>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <span className="text-xs text-gray-500 block">Price per person</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-xl font-black text-blue-600">{formatNPR(price || 0)}</span>
                            <span className="text-xs text-gray-500">(${((price || 0) / 133).toFixed(2)})</span>
                        </div>
                    </div>

                    <span
                        className="bg-gray-900 text-white px-4 py-2 rounded text-sm font-bold group-hover:bg-blue-600 transition-colors inline-block"
                    >
                        View Details
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default PackageCard;
