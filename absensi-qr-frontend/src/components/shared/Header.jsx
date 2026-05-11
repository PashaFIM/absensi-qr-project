import React, { useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';

const Header = ({ children, onRefresh, refreshing }) => {
    const { user } = useAuth();
    const { notifications, unreadCount, markAsRead } = useNotifications();
    const [open, setOpen] = useState(false);

    const toggle = () => setOpen(v => !v);

    return (
        <header className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
            <div className="flex items-center gap-2">
                {children}
            </div>
            <div className="flex items-center space-x-3 relative">
                {onRefresh && (
                    <button 
                        onClick={onRefresh} 
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 shadow-sm transition-all duration-200"
                        title="Refresh data"
                    >
                        <ArrowPathIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        <span className="hidden sm:inline">Refresh</span>
                    </button>
                )}
                <button onClick={toggle} className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z" />
                    </svg>
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">{unreadCount}</span>
                    )}
                </button>

                <span className="text-sm text-gray-600">{user?.nama_siswa || user?.username || 'Pengguna'}</span>

                {open && (
                    <div className="absolute right-0 mt-10 w-72 bg-white border shadow-md z-50">
                        <div className="p-2">
                            <h3 className="font-semibold">Notifikasi</h3>
                        </div>
                        <div className="max-h-60 overflow-auto">
                            {notifications.length === 0 && <div className="p-4 text-sm text-gray-500">Tidak ada notifikasi</div>}
                            {notifications.map(n => (
                                <div key={n.notification_id} className={`p-3 border-t ${n.is_read ? 'bg-white' : 'bg-gray-50'}`}>
                                    <div className="text-sm font-medium">{n.title}</div>
                                    <div className="text-xs text-gray-600">{n.body}</div>
                                    <div className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</div>
                                    {!n.is_read && (
                                        <button onClick={() => markAsRead(n.notification_id)} className="mt-2 text-xs text-blue-600">Tandai dibaca</button>
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