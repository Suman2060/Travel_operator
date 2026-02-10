import { useState } from 'react';
import { User, Lock, Mail, UserPlus, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'traveler'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.username?.[0] || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pt-32 pb-20 px-6 flex items-start justify-center">
            <div className="bg-white p-10 rounded-xl shadow-md border border-gray-100 max-w-lg w-full">
                <div className="mb-10 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
                    <p className="text-gray-600 text-sm">Join Chill Travel today and start your adventure.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-8 text-sm border border-red-100 font-medium">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>

                    {/* Role Selection */}
                    <div className="grid grid-cols-2 gap-4 p-1 bg-gray-50 rounded-lg">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'traveler' })}
                            className={`py-3 rounded-md text-sm font-bold transition-all ${formData.role === 'traveler' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            Traveler
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'guide' })}
                            className={`py-3 rounded-md text-sm font-bold transition-all ${formData.role === 'guide' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            Professional Guide
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-widest">Username</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <User size={18} />
                                </span>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-blue-600 font-medium shadow-sm"
                                    placeholder="e.g. wanderer123"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-widest">Email Address</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Mail size={18} />
                                </span>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-blue-600 font-medium shadow-sm"
                                    placeholder="you@email.com"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-widest">Password</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <Lock size={18} />
                            </span>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-blue-600 font-medium shadow-sm"
                                placeholder="Min. 8 characters"
                                required
                            />
                        </div>
                    </div>

                    <p className="text-xs text-gray-600 italic">
                        By creating an account, you agree to follow the Chill Travel community guidelines.
                    </p>

                    <button
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg"
                    >
                        {loading ? "Creating account..." : (
                            <>
                                <UserPlus size={20} />
                                Register Now
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign In here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
