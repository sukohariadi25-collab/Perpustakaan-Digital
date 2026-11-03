import React, { ReactNode, useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import NotificationBell from '@/Components/NotificationsBell';
import type { Pengguna } from '@/types/perpustakaan';
import {
    LayoutDashboard,
    ArrowLeftRight,
    BookOpen,
    Tag,
    Inbox,
    User,
    Library,
    ChevronLeft,
    Sun,
    Moon,
    LogOut,
    Menu,
    X,
    Bell,
    Sparkles,
    ChevronDown,
    Coins, // <-- 1. Import ikon Coins untuk menu Denda
} from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { props, url } = usePage<{ auth: { user: Pengguna } }>();
    const { auth } = props;

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return (
                localStorage.getItem('theme') === 'dark' ||
                (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
            );
        }
        return false;
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    // Tutup menu mobile atau dropdown saat navigasi berpindah URL
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsProfileOpen(false);
    }, [url]);

    const menuSections = [
        {
            title: 'OVERVIEW',
            items: [
                { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
                { name: 'Transaksi Peminjaman', href: '/admin/peminjaman', icon: ArrowLeftRight },
                { name: 'Rekap Denda', href: '/admin/denda', icon: Coins }, // <-- 2. Tambahkan menu Rekap Denda di sini
            ],
        },
        {
            title: 'KATALOG',
            items: [
                { name: 'Kelola Buku', href: '/admin/buku', icon: BookOpen },
                { name: 'Kategori', href: '/admin/kategori', icon: Tag },
                { name: 'Pemesanan', href: '/admin/pemesanan', icon: Inbox },
            ],
        },
        {
            title: 'PEMBERITAHUAN & AKUN',
            items: [
                { name: 'Notifikasi', href: '/notifications', icon: Bell },
                { name: 'Profil Saya', href: '/profile', icon: User },
            ],
        },
    ];

    const renderNavItems = (collapsedState: boolean) => (
        <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto overflow-x-hidden custom-scrollbar">
            {menuSections.map((section) => (
                <div key={section.title} className="space-y-1.5">
                    {!collapsedState && (
                        <p className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase mb-2">
                            {section.title}
                        </p>
                    )}
                    <div className="space-y-1">
                        {section.items.map((item) => {
                            const IconComponent = item.icon;
                            // Menggunakan perbandingan akurat agar tidak bentrok dengan rute lain
                            const isActive = url === item.href || (item.href !== '/admin/dashboard' && url.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    title={collapsedState ? item.name : ''}
                                    className={`flex items-center gap-3 py-2.5 rounded-2xl text-xs font-medium transition-all group relative ${
                                        collapsedState ? 'justify-center px-0' : 'px-3.5'
                                    } ${
                                        isActive
                                            ? 'bg-teal-500/10 dark:bg-teal-500/15 text-teal-600 dark:text-teal-400 font-semibold shadow-sm'
                                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                                    }`}
                                >
                                    <IconComponent
                                        className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                                            isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                                        }`}
                                    />
                                    {!collapsedState && <span className="whitespace-nowrap tracking-wide">{item.name}</span>}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-slate-800 dark:text-slate-200 flex transition-colors duration-300 font-sans">
            
            {/* 1. SIDEBAR DESKTOP */}
            <aside
                className={`hidden lg:flex bg-white/90 dark:bg-[#111622]/90 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80 flex-col shrink-0 transition-all duration-300 ease-in-out relative ${
                    isCollapsed ? 'w-20' : 'w-64'
                }`}
            >
                {/* Header Logo / Brand */}
                <div
                    className={`h-16 flex items-center border-b border-slate-100 dark:border-slate-800/60 ${
                        isCollapsed ? 'justify-center px-2' : 'justify-between px-5'
                    }`}
                >
                    {!isCollapsed ? (
                        <>
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-9 h-9 rounded-2xl border border-teal-500/30 bg-teal-500/10 flex items-center justify-center text-teal-500 shrink-0 shadow-inner">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <div className="whitespace-nowrap">
                                    <h2 className="font-bold text-xs tracking-tight text-slate-900 dark:text-white">
                                        AksaraNet Admin
                                    </h2>
                                    <p className="text-[10px] font-medium text-slate-400">Pustakawan Portal</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsCollapsed(true)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title="Kecilkan Sidebar"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsCollapsed(false)}
                            className="w-10 h-10 rounded-2xl border border-teal-500/30 bg-teal-500/10 flex items-center justify-center text-teal-500 hover:bg-teal-500/20 transition-all shadow-inner"
                            title="Buka Sidebar"
                        >
                            <Sparkles className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {renderNavItems(isCollapsed)}

                {/* Footer Sidebar (Theme Switcher & Logout) */}
                <div className="p-3 border-t border-slate-100 dark:border-slate-800/60 space-y-3">
                    <div
                        className={`bg-slate-100/80 dark:bg-slate-900/90 p-1 rounded-2xl flex items-center justify-between ${
                            isCollapsed ? 'flex-col gap-1.5' : ''
                        }`}
                    >
                        <button
                            onClick={() => setDarkMode(false)}
                            className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                                !darkMode ? 'bg-white text-amber-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                            } ${!isCollapsed ? 'flex-1' : 'w-full'}`}
                            title="Light Mode"
                        >
                            <Sun className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setDarkMode(true)}
                            className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                                darkMode ? 'bg-slate-800 text-teal-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                            } ${!isCollapsed ? 'flex-1' : 'w-full'}`}
                            title="Dark Mode"
                        >
                            <Moon className="w-4 h-4" />
                        </button>
                    </div>

                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        title={isCollapsed ? 'Log out' : ''}
                        className={`w-full flex items-center gap-3 py-2.5 rounded-2xl text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors ${
                            isCollapsed ? 'justify-center px-0' : 'px-3.5'
                        }`}
                    >
                        <LogOut className="w-4 h-4 shrink-0" />
                        {!isCollapsed && <span>Log out</span>}
                    </Link>
                </div>
            </aside>

            {/* 2. AREA KONTEN UTAMA & NAVBAR MOBILE */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                
                {/* Header Navbar */}
                <header className="h-16 bg-white/80 dark:bg-[#111622]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/dashboard" className="flex items-center gap-2.5 lg:hidden">
                            <div className="w-8 h-8 rounded-xl border border-teal-500/30 bg-teal-500/10 flex items-center justify-center text-teal-500 shrink-0">
                                <Library className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-xs tracking-tight text-slate-900 dark:text-white">
                                AksaraNet Admin
                            </span>
                        </Link>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 hidden lg:inline tracking-wide">
                            Administrator Panel
                        </span>
                    </div>

                    {/* Area Kanan */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors lg:hidden"
                            aria-label="Toggle Theme"
                        >
                            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                        </button>

                        <NotificationBell />

                        {auth?.user && (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2.5 p-1.5 sm:pr-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 hover:border-teal-500/50 transition-all shadow-sm group"
                                >
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 font-bold flex items-center justify-center text-xs">
                                        {auth.user.name.charAt(0)}
                                    </div>
                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 hidden sm:inline max-w-[100px] truncate">
                                        {auth.user.name}
                                    </span>
                                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-3 w-60 bg-white dark:bg-[#111622] rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-4 space-y-3 z-50">
                                        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                                            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-500 font-bold flex items-center justify-center text-xs">
                                                {auth.user.name.charAt(0)}
                                            </div>
                                            <div className="overflow-hidden">
                                                <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                                    {auth.user.name}
                                                </h4>
                                                <p className="text-[10px] text-slate-400 truncate">Administrator</p>
                                            </div>
                                        </div>
                                        <div className="space-y-1 text-xs">
                                            <Link
                                                href="/profile"
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                                            >
                                                <User className="w-4 h-4 text-slate-400" /> Profil Saya
                                            </Link>
                                        </div>
                                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                                            <Link
                                                href="/logout"
                                                method="post"
                                                as="button"
                                                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                            >
                                                <LogOut className="w-4 h-4" /> Log out
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 lg:hidden hover:text-teal-500 transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </header>

                {/* Dropdown Menu Navigasi Mobile */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden bg-white dark:bg-[#111622] border-b border-slate-200/80 dark:border-slate-800 px-4 py-3 space-y-1 z-20 shadow-lg">
                        {menuSections.map((sec) =>
                            sec.items.map((it) => {
                                const IconComp = it.icon;
                                const isActive = url === it.href || (it.href !== '/admin/dashboard' && url.startsWith(it.href));
                                return (
                                    <Link
                                        key={it.href}
                                        href={it.href}
                                        className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                                            isActive
                                                ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold'
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                                        }`}
                                    >
                                        <IconComp className="w-4 h-4" /> {it.name}
                                    </Link>
                                );
                            })
                        )}
                    </div>
                )}

                {/* Konten Halaman */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}