import React, { FormEventHandler } from 'react';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { BookOpen, Mail, ArrowLeft, Send } from 'lucide-react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
            <Head title="Lupa Sandi - AksaraNet" />

            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

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
                        Reset kata sandi akun perpustakaanmu
                    </p>
                </div>

                <div className="bg-[#111622] rounded-3xl p-6 sm:p-8 border border-slate-800/80 shadow-2xl space-y-5">
                    <p className="text-xs text-slate-300 leading-relaxed">
                        Masukkan alamat email yang terdaftar. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi milikmu.
                    </p>

                    {status && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-semibold">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <div>
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

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Send className="w-4 h-4" /> Kirim Tautan Reset
                        </button>
                    </form>

                    <div className="pt-2 text-center border-t border-slate-800/80">
                        <Link href={route('login')} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Halaman Masuk
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}