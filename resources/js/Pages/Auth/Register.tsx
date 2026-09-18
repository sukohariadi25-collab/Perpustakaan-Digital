import React, { FormEventHandler } from 'react';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { User, Mail, Lock, BookOpen, UserPlus } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
            <Head title="Pendaftaran Akun - AksaraNet" />

            <div className="absolute top-1/4 -right-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md relative z-10 space-y-6">
                <div className="text-center space-y-2">
                    <Link href="/" className="inline-flex items-center gap-2.5">
                        <div className="p-2.5 bg-gradient-to-tr from-teal-600 to-emerald-400 rounded-2xl shadow-lg shadow-teal-500/20 text-white">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-white">
                            Aksara<span className="text-teal-400">Net</span>
                        </span>
                    </Link>
                    <p className="text-xs text-slate-400">
                        Buat akun baru untuk mulai menjelajahi katalog buku
                    </p>
                </div>

                <div className="bg-[#111622] rounded-3xl p-6 sm:p-8 border border-slate-800/80 shadow-2xl space-y-5">
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                Nama Lengkap
                            </label>
                            <div className="relative">
                                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    required
                                    placeholder="Masukkan nama lengkap"
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-900/90 border border-slate-800 text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                                />
                            </div>
                            <InputError message={errors.name} className="mt-1.5 text-xs text-rose-400" />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                Alamat Email
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    required
                                    placeholder="nama@sekolah.sch.id"
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-900/90 border border-slate-800 text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                                />
                            </div>
                            <InputError message={errors.email} className="mt-1.5 text-xs text-rose-400" />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                Kata Sandi
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    required
                                    placeholder="Minimal 8 karakter"
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-900/90 border border-slate-800 text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                                />
                            </div>
                            <InputError message={errors.password} className="mt-1.5 text-xs text-rose-400" />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                Konfirmasi Kata Sandi
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    required
                                    placeholder="Ulangi kata sandi"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-900/90 border border-slate-800 text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                                />
                            </div>
                            <InputError message={errors.password_confirmation} className="mt-1.5 text-xs text-rose-400" />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <UserPlus className="w-4 h-4" /> Buat Akun Baru
                        </button>
                    </form>

                    <div className="pt-2 text-center border-t border-slate-800/80">
                        <p className="text-xs text-slate-400">
                            Sudah punya akun?{' '}
                            <Link href={route('login')} className="font-bold text-teal-400 hover:underline">
                                Masuk di sini
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}