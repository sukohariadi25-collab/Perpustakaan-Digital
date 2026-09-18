import React, { FormEventHandler } from 'react';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { BookOpen, Lock, ShieldAlert } from 'lucide-react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
            <Head title="Konfirmasi Sandi - AksaraNet" />
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
                </div>

                <div className="bg-[#111622] rounded-3xl p-6 sm:p-8 border border-slate-800/80 shadow-2xl space-y-5">
                    <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-xs">
                        <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                        <span>Ini adalah area yang dilindungi. Masukkan kata sandi Anda untuk melanjutkan tindakan ini.</span>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Kata Sandi</label>
                            <div className="relative">
                                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    required
                                    placeholder="••••••••"
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-900/90 border border-slate-800 text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                                />
                            </div>
                            <InputError message={errors.password} className="mt-1.5 text-xs text-rose-400" />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            Konfirmasi Kata Sandi
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}