import React, { useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { useTheme } from '../../hooks/useTheme';

const Header = ({ children, onRefresh, refreshing }) => {
    const { user } = useAuth();
    const { notifications, unreadCount, markAsRead } = useNotifications();
    const { isDark, toggleTheme } = useTheme();
    const [open, setOpen] = useState(false);

    const toggle = () => setOpen(v => !v);

    return (
        <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm transition-colors dark:bg-gray-900 dark:border-gray-700">
            <div className="flex items-center gap-2">
                {children}
            </div>
            <div className="flex items-center space-x-3 relative">
                {onRefresh && (
                    <button 
                        onClick={onRefresh} 
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 shadow-sm transition-all duration-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
                        title="Refresh data"
                    >
                        <ArrowPathIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        <span className="hidden sm:inline">Refresh</span>
                    </button>
                )}
                <button
                    type="button"
                    onClick={toggleTheme}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 shadow-sm transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-yellow-300 dark:hover:bg-gray-700"
                    title={isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
                    aria-label={isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
                >
                    {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                </button>
                <button onClick={toggle} className="relative" aria-label="Buka notifikasi">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z" />
                    </svg>
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">{unreadCount}</span>
                    )}
                </button>

                <span className="text-sm text-gray-600 dark:text-gray-200">{user?.nama_siswa || user?.username || 'Pengguna'}</span>

                {open && (
                    <div className="absolute right-0 mt-10 w-72 bg-white border border-gray-200 shadow-md z-50 dark:bg-gray-900 dark:border-gray-700">
                        <div className="p-2">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifikasi</h3>
                        </div>
                        <div className="max-h-60 overflow-auto">
                            {notifications.length === 0 && <div className="p-4 text-sm text-gray-500 dark:text-gray-400">Tidak ada notifikasi</div>}
                            {notifications.map(n => (
                                <div key={n.notification_id} className={`p-3 border-t border-gray-100 dark:border-gray-700 ${n.is_read ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}`}>
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{n.title}</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-300">{n.body}</div>
                                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{new Date(n.created_at).toLocaleString()}</div>
                                    {!n.is_read && (
                                        <button onClick={() => markAsRead(n.notification_id)} className="mt-2 text-xs text-blue-600 dark:text-blue-400">Tandai dibaca</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
