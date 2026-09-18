import React, { ReactNode, useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import type { Pengguna } from '@/types/perpustakaan';
import { BookOpen, LayoutDashboard, Inbox, Sun, Moon, LogOut, ChevronDown } from 'lucide-react';

export default function SiswaLayout({ children }: { children: ReactNode }) {
    const { props, url } = usePage<{ auth: { user: Pengguna } }>();
    const { auth } = props;

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

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-slate-800 dark:text-slate-200 flex flex-col font-sans transition-colors duration-300">
            <header className="bg-white/80 dark:bg-[#111622]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-8">
                            <Link href="/" className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl border border-teal-500/30 bg-teal-500/10 flex items-center justify-center text-teal-500">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
                                    AksaraNet
                                </span>
                            </Link>

                            <nav className="hidden md:flex items-center gap-1">
                                <Link
                                    href="/"
                                    className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                                        url === '/'
                                            ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold'
                                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                                    }`}
                                >
                                    Katalog Buku
                                </Link>
                                {auth?.user && (
                                    <>
                                        <Link
                                            href="/siswa/dashboard"
                                            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                                                url.startsWith('/siswa/dashboard')
                                                    ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold'
                                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                                            }`}
                                        >
                                            Dasbor Saya
                                        </Link>
                                        <Link
                                            href="/siswa/pesanan"
                                            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                                                url.startsWith('/siswa/pesanan')
                                                    ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold'
                                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                                            }`}
                                        >
                                            Pesanan Saya
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                            >
                                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                            </button>

                            {auth?.user ? (
                                <div className="relative">
                                    {/* Unified Profil Card Button */}
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-3 p-1.5 pr-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 hover:border-teal-500/50 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all shadow-sm group"
                                    >
                                        <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 font-bold flex items-center justify-center text-xs group-hover:scale-105 transition-transform">
                                            {auth.user.name.charAt(0)}
                                        </div>
                                        <div className="flex flex-col text-left">
                                            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                                {auth.user.name}
                                            </span>
                                            <span className="text-[10px] font-medium text-slate-400 -mt-0.5">
                                                Siswa
                                            </span>
                                        </div>
                                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-[#111622] rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-4 space-y-4 z-50">
                                            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                                                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-500 font-bold flex items-center justify-center text-sm">
                                                    {auth.user.name.charAt(0)}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                                        {auth.user.name}
                                                    </h4>
                                                    <p className="text-[11px] text-slate-400 truncate">{auth.user.email || 'Siswa'}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-1 text-xs">
                                                <Link
                                                    href="/profile"
                                                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                                                >
                                                    <LayoutDashboard className="w-4 h-4 text-slate-400" /> Profil
                                                </Link>
                                            </div>

                                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                                                <Link
                                                    href="/logout"
                                                    method="post"
                                                    as="button"
                                                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                                >
                                                    <LogOut className="w-4 h-4" /> Log out
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link href="/login" className="text-xs font-semibold px-3 py-2 text-slate-600 dark:text-slate-300">
                                        Masuk
                                    </Link>
                                    <Link href="/register" className="text-xs font-semibold bg-teal-500 text-white px-4 py-2 rounded-xl shadow-sm">
                                        Daftar
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
        </div>
    );
}