import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    XCircleIcon,
    QrCodeIcon,
    ClipboardDocumentListIcon,
    ArrowPathIcon,
    CalendarDaysIcon,
    UserCircleIcon,
    AcademicCapIcon,
    IdentificationIcon,
} from '@heroicons/react/24/solid';

const API_URL = `${import.meta.env.VITE_API_URL || ''}/siswa/dashboard`;

// --- Helper: format tanggal ---
const formatTanggal = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

// --- Sub-komponen: Kartu Profil & Sapaan ---
const GreetingCard = ({ profile, today }) => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 11) return 'Selamat Pagi';
        if (hour < 15) return 'Selamat Siang';
        if (hour < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    };

    const todayFormatted = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white p-6 md:p-8 shadow-xl">
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />
            
            <div className="relative z-10">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-indigo-200 text-sm font-medium">{getGreeting()} 👋</p>
                        <h1 className="text-2xl md:text-3xl font-bold mt-1">{profile.nama_siswa}</h1>
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                            <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                                <AcademicCapIcon className="w-4 h-4" />
                                {profile.nama_kelas}
                            </span>
                            <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                                <IdentificationIcon className="w-4 h-4" />
                                NISN: {profile.nisn}
                            </span>
                        </div>
                    </div>
                    <UserCircleIcon className="w-16 h-16 text-white/20 hidden sm:block" />
                </div>

                <div className="mt-5 pt-4 border-t border-white/20">
                    <div className="flex items-center gap-2 text-sm text-indigo-200">
                        <CalendarDaysIcon className="w-4 h-4" />
                        <span>{todayFormatted}</span>
                    </div>
                    {today ? (
                        <div className="mt-2 flex items-center gap-2">
                            <CheckCircleIcon className="w-5 h-5 text-green-300" />
                            <span className="text-green-200 font-medium">
                                Sudah absen hari ini pukul {today.waktu} — {today.status_kehadiran}
                            </span>
                        </div>
                    ) : (
                        <div className="mt-2 flex items-center gap-2">
                            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-300" />
                            <span className="text-yellow-200 font-medium">Belum absen hari ini</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Sub-komponen: Kartu Statistik ---
const StatCard = ({ icon: Icon, label, value, color, bgLight }) => (
    <div className={`rounded-xl p-5 shadow-lg border ${bgLight} transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5`}>
        <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${color}`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
            </div>
        </div>
    </div>
);

// --- Sub-komponen: Progress Bar Kehadiran ---
const AttendanceProgress = ({ percentage }) => {
    const getColor = (pct) => {
        if (pct >= 80) return { bar: 'bg-emerald-500', text: 'text-emerald-600', label: 'Sangat Baik 🎉' };
        if (pct >= 60) return { bar: 'bg-amber-500', text: 'text-amber-600', label: 'Cukup Baik' };
        return { bar: 'bg-red-500', text: 'text-red-600', label: 'Perlu Ditingkatkan' };
    };

    const color = getColor(percentage);

    return (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Persentase Kehadiran</h3>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${color.text} bg-opacity-10`} style={{ backgroundColor: `currentColor`, color: color.text.replace('text-', '').includes('emerald') ? '#059669' : color.text.replace('text-', '').includes('amber') ? '#d97706' : '#dc2626', background: color.text.replace('text-', '').includes('emerald') ? '#d1fae5' : color.text.replace('text-', '').includes('amber') ? '#fef3c7' : '#fee2e2' }}>
                    {color.label}
                </span>
            </div>
            <div className="flex items-end gap-3 mb-3">
                <span className="text-4xl font-extrabold text-gray-800">{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                    className={`${color.bar} h-3 rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

// --- Sub-komponen: Riwayat Terbaru ---
const RecentHistory = ({ data }) => {
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Hadir': return { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' };
            case 'Sakit': return { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' };
            case 'Izin': return { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' };
            case 'Alpha': return { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' };
            default: return { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500' };
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <ClipboardDocumentListIcon className="w-5 h-5 text-indigo-500" />
                    Riwayat Absensi Terakhir
                </h3>
            </div>
            
            {data.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                    <ClipboardDocumentListIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">Belum ada riwayat absensi</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-50">
                    {data.map((item) => {
                        const style = getStatusStyle(item.status_kehadiran);
                        return (
                            <div key={item.absensi_id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{formatTanggal(item.tanggal)}</p>
                                        <p className="text-xs text-gray-500">Pukul {item.waktu}</p>
                                    </div>
                                </div>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${style.bg} ${style.text}`}>
                                    {item.status_kehadiran}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}

            {data.length > 0 && (
                <div className="p-3 border-t border-gray-100 bg-gray-50">
                    <Link to="/siswa/riwayat" className="block text-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                        Lihat Semua Riwayat →
                    </Link>
                </div>
            )}
        </div>
    );
};

// --- Sub-komponen: Aksi Cepat ---
const QuickActions = () => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Aksi Cepat</h3>
        <div className="grid grid-cols-2 gap-3">
            <Link
                to="/siswa/my-qr"
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 hover:from-indigo-100 hover:to-purple-100 transition-all duration-300 hover:shadow-md group"
            >
                <QrCodeIcon className="w-8 h-8 text-indigo-600 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-indigo-700">QR Code Saya</span>
            </Link>
            <Link
                to="/siswa/riwayat"
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 hover:from-emerald-100 hover:to-teal-100 transition-all duration-300 hover:shadow-md group"
            >
                <ClipboardDocumentListIcon className="w-8 h-8 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-emerald-700">Riwayat Absensi</span>
            </Link>
        </div>
    </div>
);

// ==================================
//  KOMPONEN UTAMA: Dashboard Siswa
// ==================================
const DashboardSiswa = () => {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboard = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = user?.token || localStorage.getItem('token');
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDashboardData(response.data);
        } catch (err) {
            console.error('Error fetching siswa dashboard:', err);
            setError(err.response?.data?.message || 'Gagal memuat data dashboard.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // --- Loading State ---
    if (loading) {
        return (
            <div className="p-4 md:p-8 space-y-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-2xl" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded-xl" />)}
                </div>
                <div className="h-32 bg-gray-200 rounded-xl" />
                <div className="h-64 bg-gray-200 rounded-xl" />
            </div>
        );
    }

    // --- Error State ---
    if (error) {
        return (
            <div className="p-4 md:p-8">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <XCircleIcon className="w-12 h-12 text-red-400 mx-auto mb-3" />
                    <p className="text-red-600 font-medium">{error}</p>
                    <button 
                        onClick={fetchDashboard}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    const { profile, summary, today, recent } = dashboardData || {};

    return (
        <div className="p-4 md:p-8 space-y-6 bg-gray-50 min-h-screen">
            {/* Header & Refresh */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 md:hidden">Dashboard</h2>
                <button 
                    onClick={fetchDashboard} 
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 shadow-sm transition ml-auto"
                >
                    <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Refresh</span>
                </button>
            </div>

            {/* 1. Kartu Sapaan & Profil */}
            <GreetingCard profile={profile} today={today} />

            {/* 2. Statistik Kehadiran */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard 
                    icon={CheckCircleIcon} 
                    label="Hadir" 
                    value={summary?.total_hadir || 0}
                    color="bg-emerald-500"
                    bgLight="bg-white border-emerald-100"
                />
                <StatCard 
                    icon={ExclamationTriangleIcon} 
                    label="Sakit" 
                    value={summary?.total_sakit || 0}
                    color="bg-blue-500"
                    bgLight="bg-white border-blue-100"
                />
                <StatCard 
                    icon={ClockIcon} 
                    label="Izin" 
                    value={summary?.total_izin || 0}
                    color="bg-amber-500"
                    bgLight="bg-white border-amber-100"
                />
                <StatCard 
                    icon={XCircleIcon} 
                    label="Alpha" 
                    value={summary?.total_alpha || 0}
                    color="bg-red-500"
                    bgLight="bg-white border-red-100"
                />
            </div>

            {/* 3. Progress Kehadiran + Aksi Cepat */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <AttendanceProgress percentage={summary?.persentase_hadir || 0} />
                </div>
                <QuickActions />
            </div>

            {/* 4. Riwayat Terakhir */}
            <RecentHistory data={recent || []} />
        </div>
    );
};

export default DashboardSiswa;