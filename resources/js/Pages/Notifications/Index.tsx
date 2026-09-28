import React from 'react';
import { Link, router, Head, usePage } from '@inertiajs/react';
import { Bell, Trash2, CheckCheck, Info, CheckCircle2, AlertTriangle, AlertCircle, ArrowLeft } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import SiswaLayout from '@/Layouts/SiswaLayout';
import type { Pengguna } from '@/types/perpustakaan';

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

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    notifications: {
        data: NotificationItem[];
        links: PaginationLink[];
    };
}

export default function NotificationsIndex({ notifications }: Props) {
    // Ambil data user yang sedang login dari Inertia Page Props
    const { auth } = usePage<{ auth: { user: Pengguna } }>().props;

    // Aksi Navigasi Kembali
    const handleBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            router.visit(auth?.user?.role === 'admin' ? '/admin/dashboard' : '/siswa/dashboard');
        }
    };

    // Handling Klik Notifikasi
    const handleItemClick = (item: NotificationItem) => {
        if (!item.read_at) {
            router.post(`/notifications/${item.id}/mark-as-read`, {}, {
                preserveScroll: true,
                onSuccess: () => {
                    if (item.data.url && item.data.url !== '#') {
                        router.visit(item.data.url);
                    }
                }
            });
        } else if (item.data.url && item.data.url !== '#') {
            router.visit(item.data.url);
        }
    };

    // Tandai Semua Dibaca
    const markAllAsRead = () => {
        router.post('/notifications/mark-all-read', {}, { preserveScroll: true });
    };

    // Hapus Notifikasi
    const deleteNotification = (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Mencegah terklik navigasi utama
        if (confirm('Hapus notifikasi ini?')) {
            router.delete(`/notifications/${id}`, { preserveScroll: true });
        }
    };

    // Format Tanggal
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Render Ikon berdasarkan tipe
    const renderIcon = (type?: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />;
            case 'danger':
                return <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />;
            default:
                return <Info className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />;
        }
    };

    // Penentuan Layout Secara Dinamis Berdasarkan Role
    const Layout = auth?.user?.role === 'admin' ? AdminLayout : SiswaLayout;

    return (
        <Layout>
            <Head title="Riwayat Notifikasi" />

            <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
                {/* Tombol Kembali & Header Halaman */}
                <div className="space-y-4">
                    <button
                        onClick={handleBack}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-xl transition-all w-fit"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali</span>
                    </button>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Bell className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                                Riwayat Notifikasi
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Kelola seluruh pemberitahuan aktivitas akun Anda.
                            </p>
                        </div>

                        <button
                            onClick={markAllAsRead}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:text-teal-300 dark:hover:bg-teal-900/50 rounded-xl transition-colors self-start sm:self-auto"
                        >
                            <CheckCheck className="w-4 h-4" /> Tandai Semua Dibaca
                        </button>
                    </div>
                </div>

                {/* Container List Notifikasi */}
                <div className="bg-white dark:bg-[#111622] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
                    {notifications.data.length > 0 ? (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {notifications.data.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleItemClick(item)}
                                    className={`p-4 flex items-start justify-between gap-4 transition-colors cursor-pointer group ${
                                        !item.read_at 
                                            ? 'bg-teal-500/5 dark:bg-teal-500/10 hover:bg-teal-500/10 dark:hover:bg-teal-500/15' 
                                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                                    }`}
                                >
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        {/* Status Titik Belum Dibaca */}
                                        <span
                                            className={`w-2 h-2 rounded-full shrink-0 mt-2 ${
                                                !item.read_at ? 'bg-teal-500 ring-4 ring-teal-500/20' : 'bg-transparent'
                                            }`}
                                        />

                                        {renderIcon(item.data.type)}

                                        <div className="space-y-1 flex-1 min-w-0">
                                            <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                                {item.data.title}
                                            </h3>
                                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                                {item.data.message}
                                            </p>
                                            <span className="text-[10px] text-slate-400 dark:text-slate-500 block pt-1">
                                                {formatDate(item.created_at)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Tombol Hapus */}
                                    <button
                                        onClick={(e) => deleteNotification(item.id, e)}
                                        className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                                        title="Hapus Notifikasi"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-slate-400 space-y-2">
                            <Bell className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
                            <p className="text-sm font-medium">Belum ada notifikasi.</p>
                        </div>
                    )}
                </div>

                {/* Paginasi */}
                {notifications.links.length > 3 && (
                    <div className="flex items-center justify-center gap-1 pt-2">
                        {notifications.links.map((link, index) => (
                            link.url ? (
                                <Link
                                    key={index}
                                    href={link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                        link.active
                                            ? 'bg-teal-600 text-white'
                                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                />
                            ) : (
                                <span
                                    key={index}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className="px-3 py-1.5 text-xs text-slate-300 dark:text-slate-600 cursor-not-allowed"
                                />
                            )
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}