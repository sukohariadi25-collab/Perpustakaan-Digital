import React, { ReactNode, useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Pengguna } from '@/types/perpustakaan';
import {
    LayoutDashboard,
    ArrowLeftRight,
    BookOpen,
    Tag,
    Inbox,
    User,
    Library,
    ChevronLeft,
    ChevronDown,
    Sun,
    Moon,
    LogOut,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { props, url } = usePage<{ auth: { user: Pengguna } }>();
    const { auth } = props;

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
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

    const menuSections = [
        {
            title: 'OVERVIEW',
            items: [
                { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
                { name: 'Transaksi Peminjaman', href: '/admin/peminjaman', icon: ArrowLeftRight },
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
            title: 'AKUN',
            items: [
                { name: 'Profil Saya', href: '/profile', icon: User },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-slate-800 dark:text-slate-200 flex transition-colors duration-300 font-sans">
            {/* Sidebar Left */}
            <aside
                className={`bg-white dark:bg-[#111622] border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col shrink-0 transition-all duration-300 ease-in-out relative ${
                    isCollapsed ? 'w-20' : 'w-64'
                }`}
            >
                {/* Header Logo */}
                <div
                    className={`h-20 flex items-center border-b border-slate-100 dark:border-slate-800/60 ${
                        isCollapsed ? 'justify-center px-2' : 'justify-between px-5'
                    }`}
                >
                    {!isCollapsed ? (
                        <>
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-10 h-10 rounded-xl border border-teal-500/30 bg-teal-500/10 flex items-center justify-center text-teal-500 shrink-0">
                                    <Library className="w-5 h-5" />
                                </div>
                                <div className="whitespace-nowrap">
                                    <h2 className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
                                        AksaraNet Admin
                                    </h2>
                                    <p className="text-[11px] font-medium text-slate-400">AksaraNet System</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsCollapsed(true)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsCollapsed(false)}
                            className="w-10 h-10 rounded-xl border border-teal-500/30 bg-teal-500/10 flex items-center justify-center text-teal-500 hover:bg-teal-500/20 transition-colors"
                            title="Buka Sidebar"
                        >
                            <Library className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex-1 px-3 py-6 space-y-6 overflow-y-auto overflow-x-hidden">
                    {menuSections.map((section) => (
                        <div key={section.title} className="space-y-2">
                            {!isCollapsed && (
                                <p className="px-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                                    {section.title}
                                </p>
                            )}
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const IconComponent = item.icon;
                                    const isActive = url.startsWith(item.href);
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            title={isCollapsed ? item.name : ''}
                                            className={`flex items-center gap-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                                                isCollapsed ? 'justify-center px-0' : 'px-3'
                                            } ${
                                                isActive
                                                    ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold'
                                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                                            }`}
                                        >
                                            {!isCollapsed && (
                                                <span
                                                    className={`text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 ${
                                                        isActive ? 'text-teal-500' : ''
                                                    }`}
                                                >
                                                    ›
                                                </span>
                                            )}
                                            <IconComponent
                                                className={`w-4 h-4 shrink-0 ${
                                                    isActive ? 'text-teal-500' : ''
                                                }`}
                                            />
                                            {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Switcher & Logout */}
                <div className="p-3 border-t border-slate-100 dark:border-slate-800/60 space-y-3">
                    <div
                        className={`bg-slate-100 dark:bg-slate-900/90 p-1 rounded-2xl flex items-center justify-between ${
                            isCollapsed ? 'flex-col gap-1.5' : ''
                        }`}
                    >
                        <button
                            onClick={() => setDarkMode(false)}
                            className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                                !darkMode ? 'bg-white text-amber-500 shadow-sm' : 'text-slate-400'
                            } ${!isCollapsed ? 'flex-1' : 'w-full'}`}
                        >
                            <Sun className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setDarkMode(true)}
                            className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                                darkMode ? 'bg-slate-800 text-teal-400 shadow-sm' : 'text-slate-400'
                            } ${!isCollapsed ? 'flex-1' : 'w-full'}`}
                        >
                            <Moon className="w-4 h-4" />
                        </button>
                    </div>

                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className={`w-full flex items-center gap-3 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors ${
                            isCollapsed ? 'justify-center px-0' : 'px-3'
                        }`}
                    >
                        <LogOut className="w-4 h-4 shrink-0" />
                        {!isCollapsed && <span>Log out</span>}
                    </Link>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white/80 dark:bg-[#111622]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-30">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Admin Dashboard
                    </span>
                </header>

                <main className="flex-1 overflow-y-auto p-8">{children}</main>
            </div>
        </div>
    );
}