import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; 
import { EyeIcon, EyeSlashIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline'; 
import { useTheme } from '../../hooks/useTheme';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); 

    const { isAuthenticated, user, login } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && user) {
            const path = `/${user.role}`;
            navigate(path, { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!username || !password) {
            setError('Username dan Password wajib diisi.');
            return;
        }

        setIsLoading(true);
        try {
            const userData = await login(username, password);
            
            const path = `/${userData.role}`;
            navigate(path, { replace: true });

        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Login gagal. Cek username dan password Anda.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(prev => !prev);
    };

    return (
        <div className="relative flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-950">
            <button
                type="button"
                onClick={toggleTheme}
                className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-yellow-300 dark:hover:bg-gray-800"
                title={isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
                aria-label={isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
            >
                {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>

            <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-xl dark:bg-gray-900 dark:border dark:border-gray-700">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-extrabold text-primary">Login Absensi QR</h1>
                </div>
    
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-950 dark:border-red-800 dark:text-red-200" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition duration-150 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                            placeholder="Masukkan username atau ID"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                            Password
                        </label>
                        <div className="relative"> 
                            <input
                                id="password"
                                type={isPasswordVisible ? 'text' : 'password'} 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition duration-150 pr-10 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                                placeholder="********"
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                aria-label={isPasswordVisible ? 'Sembunyikan password' : 'Tampilkan password'}
                            >
                                {isPasswordVisible ? (
                                    <EyeSlashIcon className="h-5 w-5" /> // Ikon mata dicoret
                                ) : (
                                    <EyeIcon className="h-5 w-5" /> // Ikon mata
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition duration-200 ${
                            isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-primary hover:bg-blue-800 shadow-md'
                        } flex items-center justify-center`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Sedang Memproses...
                            </div>
                        ) : 'LOGIN'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
