'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogoIcon } from '@/components/Icons';

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-indigo-700 to-emerald-600 flex items-center justify-center">
      <div className="text-center">
        <LogoIcon className="w-20 h-20 mx-auto mb-6 animate-pulse" />
        <h1 className="text-3xl font-bold text-white mb-2">ZapSmart</h1>
        <p className="text-indigo-200 mb-8">Atendimento Inteligente via WhatsApp</p>
        <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}
