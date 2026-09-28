import React, { useState, useRef, useEffect } from 'react';
import { usePage, router, Link } from '@inertiajs/react';
import { 
    Bell, 
    CheckCheck, 
    Info, 
    CheckCircle2, 
    AlertTriangle, 
    AlertCircle 
} from 'lucide-react';

interface NotificationData {
    title: string;
    message: string;
    url?: string;
    type?: 'info' | 'success' | 'warning' | 'danger';
}

interface NotificationItem {
    id: string;
    read_at: string | null;
    data: NotificationData;
    created_at: string;
}

interface PageProps {
    auth: {
        user: any;
        unreadNotifications?: NotificationItem[];
    };
    [key: string]: any;
}

export default function NotificationBell() {
    const { auth } = usePage<PageProps>().props;
    const notifications = auth.unreadNotifications || [];

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Menutup dropdown saat klik di luar elemen
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handling Klik Satu Notifikasi: Tandai Dibaca & Langsung Pindah ke Halaman Riwayat
    const handleItemClick = (item: NotificationItem) => {
        router.post(`/notifications/${item.id}/mark-as-read`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setIsOpen(false);
                router.visit('/notifications');
            }
        });
    };

    // Tandai Semua Sudah Dibaca
    const markAllAsRead = () => {
        router.post('/notifications/mark-all-read', {}, {
            preserveScroll: true,
            onSuccess: () => setIsOpen(false)
        });
    };

    // Format Waktu Singkat
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Icon Berdasarkan Tipe
    const renderIcon = (type?: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />;
            case 'warning':
                return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />;
            case 'danger':
                return <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />;
            default:
                return <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Tombol Lonceng Notifikasi */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                title="Notifikasi"
            >
                <Bell className="w-5 h-5" />

                {/* Badge Jumlah Belum Dibaca */}
                {notifications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-[#111622] animate-pulse">
                        {notifications.length > 9 ? '9+' : notifications.length}
                    </span>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#111622] rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 z-50 overflow-hidden">
                    {/* Header Dropdown */}
                    <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                Notifikasi
                            </h3>
                            {notifications.length > 0 && (
                                <span className="bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    {notifications.length} Baru
                                </span>
                            )}
                        </div>

                        {notifications.length > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                            >
                                <CheckCheck className="w-3.5 h-3.5" /> Tandai Dibaca
                            </button>
                        )}
                    </div>

                    {/* Daftar Notifikasi Belum Dibaca */}
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                        {notifications.length > 0 ? (
                            notifications.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleItemClick(item)}
                                    className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors flex items-start gap-3 group"
                                >
                                    {renderIcon(item.data?.type)}

                                    <div className="flex-1 min-w-0 space-y-0.5">
                                        <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors truncate">
                                            {item.data?.title ?? 'Pemberitahuan'}
                                        </p>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                                            {item.data?.message ?? ''}
                                        </p>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block pt-1">
                                            {formatTime(item.created_at)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center space-y-2">
                                <Bell className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                    Tidak ada notifikasi baru.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer - Link Halaman Utama Notifikasi */}
                    <div className="p-2.5 bg-slate-50/80 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
                        <Link
                            href="/notifications"
                            onClick={() => setIsOpen(false)}
                            className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline block py-1"
                        >
                            Lihat Semua Notifikasi
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}