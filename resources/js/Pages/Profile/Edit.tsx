import React from 'react';
import SiswaLayout from '@/Layouts/SiswaLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { User, ShieldCheck, Trash2, Sparkles, Shield } from 'lucide-react';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const { auth } = usePage<PageProps>().props;
    const isAdmin = auth.user?.role === 'admin';

    const Content = (
        <div className="space-y-6">
            {/* Hero Header Teal - Adaptive Light & Dark Mode */}
            <div
                className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-xl transition-all ${
                    isAdmin
                        ? 'bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 dark:from-slate-900 dark:via-teal-950 dark:to-slate-900 text-white dark:border dark:border-teal-500/20'
                        : 'bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 dark:from-slate-900 dark:via-teal-950 dark:to-slate-900 text-white dark:border dark:border-teal-500/20'
                }`}
            >
                {/* Decorative Glow Effect */}
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-2.5 max-w-2xl">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 dark:bg-teal-500/20 text-white dark:text-teal-300 text-xs font-semibold rounded-full backdrop-blur-md border border-white/25 dark:border-teal-500/30 shadow-sm">
                        {isAdmin ? (
                            <Shield className="w-3.5 h-3.5 text-amber-300" />
                        ) : (
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        )}
                        {isAdmin ? 'AksaraNet Admin Console' : 'AksaraNet Portal Siswa'}
                    </span>

                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                        Pengaturan Profil {isAdmin ? 'Administrator' : 'Siswa'}
                    </h1>

                    <p className="text-teal-50 dark:text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
                        Kelola informasi akun, alamat email terdaftar, dan pembaruan kata sandi keamanan Anda.
                    </p>
                </div>
            </div>

            {/* Form Panels */}
            <div className="space-y-6">
                {/* Informasi Profil */}
                <div className="bg-white dark:bg-[#111622] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="p-2 bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 rounded-xl">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                Informasi Data Diri
                            </h2>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Ubah nama pengguna dan email akun AksaraNet Anda.
                            </p>
                        </div>
                    </div>
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl text-xs"
                    />
                </div>

                {/* Ubah Password */}
                <div className="bg-white dark:bg-[#111622] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="p-2 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-xl">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                Pembaruan Kata Sandi
                            </h2>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Pastikan akun menggunakan kata sandi yang aman dan kuat.
                            </p>
                        </div>
                    </div>
                    <UpdatePasswordForm className="max-w-xl text-xs" />
                </div>

                {/* Hapus Akun */}
                <div className="bg-white dark:bg-[#111622] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="p-2 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-xl">
                            <Trash2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                Hapus Akun
                            </h2>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Tindakan permanen untuk menghapus akun Anda dari sistem AksaraNet.
                            </p>
                        </div>
                    </div>
                    <DeleteUserForm className="max-w-xl text-xs" />
                </div>
            </div>
        </div>
    );

    return isAdmin ? (
        <AdminLayout>
            <Head title="Profil Admin - AksaraNet" />
            <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {Content}
            </div>
        </AdminLayout>
    ) : (
        <SiswaLayout>
            <Head title="Profil Saya - AksaraNet" />
            {Content}
        </SiswaLayout>
    );
}