import { useState } from 'react';
import { User, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const loginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
});

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const onSubmit = async (data) => {
        setServerError('');
        setLoading(true);
        try {
            await login(data.username, data.password);
            navigate('/');
        } catch (err) {
            setServerError(err.response?.data?.detail || 'Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pt-40 pb-20 px-6 flex items-start justify-center">
            <div className="bg-white p-10 rounded-xl shadow-md border border-gray-100 max-w-md w-full">
                <div className="mb-10 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Member Login</h1>
                    <p className="text-gray-600 text-sm">Please enter your credentials to access your account.</p>
                </div>

                {serverError && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-8 text-sm border border-red-100 font-medium">
                        {serverError}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-widest">Username</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <User size={18} />
                            </span>
                            <input
                                type="text"
                                {...register('username')}
                                className={`w-full pl-12 pr-4 py-3 rounded-lg border outline-none font-medium transition-all ${
                                    errors.username ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-600'
                                }`}
                                placeholder="Username"
                            />
                        </div>
                        {errors.username && <p className="mt-1 text-xs text-red-500 font-medium">{errors.username.message}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-widest">Password</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <Lock size={18} />
                            </span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                {...register('password')}
                                className={`w-full pl-12 pr-12 py-3 rounded-lg border outline-none font-medium transition-all ${
                                    errors.password ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-600'
                                }`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && <p className="mt-1 text-xs text-red-500 font-medium">{errors.password.message}</p>}
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-md"
                    >
                        {loading ? (
                            'Please wait...'
                        ) : (
                            <>
                                <LogIn size={20} />
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-600">
                        New to Chill Travel?{' '}
                        <Link to="/signup" className="text-blue-600 font-bold hover:underline">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
