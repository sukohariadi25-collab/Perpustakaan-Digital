import React, { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { BookOpen, MailCheck, LogOut, Send } from 'lucide-react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
            <Head title="Verifikasi Email - AksaraNet" />
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
                    <div className="text-center space-y-3">
                        <div className="w-12 h-12 bg-teal-500/10 text-teal-400 rounded-2xl mx-auto flex items-center justify-center border border-teal-500/20">
                            <MailCheck className="w-6 h-6" />
                        </div>
                        <h2 className="text-base font-bold text-white">Verifikasi Alamat Email Anda</h2>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Terima kasih telah mendaftar di AksaraNet! Silakan periksa kotak masuk email Anda dan klik tautan konfirmasi yang kami kirimkan.
                        </p>
                    </div>

                    {status === 'verification-link-sent' && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-semibold text-center">
                            Tautan verifikasi baru telah dikirimkan ke email Anda.
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-3 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Send className="w-4 h-4" /> Kirim Ulang Email Verifikasi
                        </button>

                        <div className="text-center pt-2">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="text-xs text-slate-400 hover:text-rose-400 transition-colors inline-flex items-center gap-1.5"
                            >
                                <LogOut className="w-3.5 h-3.5" /> Keluar
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}