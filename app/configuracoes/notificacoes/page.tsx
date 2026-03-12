'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import {
  BellIcon,
  ChevronRightIcon,
  CheckIcon,
  ChatIcon,
  TeamIcon,
  StarIcon,
} from '@/components/Icons';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  category: 'chat' | 'team' | 'system';
}

export default function NotificacoesConfigPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState(70);
  const [selectedSound, setSelectedSound] = useState('default');

  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    { id: '1', label: 'Nova conversa', description: 'Quando um novo contato inicia uma conversa', enabled: true, category: 'chat' },
    { id: '2', label: 'Mensagem recebida', description: 'Quando uma mensagem e recebida em conversas ativas', enabled: true, category: 'chat' },
    { id: '3', label: 'Conversa escalada', description: 'Quando a IA transfere para atendimento humano', enabled: true, category: 'chat' },
    { id: '4', label: 'Conversa sem resposta', description: 'Quando uma conversa fica sem resposta por muito tempo', enabled: true, category: 'chat' },
    { id: '5', label: 'Novo membro', description: 'Quando um novo membro entra na equipe', enabled: true, category: 'team' },
    { id: '6', label: 'Membro offline', description: 'Quando um membro da equipe fica offline', enabled: false, category: 'team' },
    { id: '7', label: 'Feedback recebido', description: 'Quando um cliente envia avaliacao', enabled: true, category: 'system' },
    { id: '8', label: 'Erro de integracao', description: 'Quando ocorre erro na conexao WhatsApp', enabled: true, category: 'system' },
    { id: '9', label: 'Relatorio diario', description: 'Resumo das metricas do dia', enabled: true, category: 'system' },
  ]);

  const toggleNotification = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n)
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'chat': return ChatIcon;
      case 'team': return TeamIcon;
      case 'system': return BellIcon;
      default: return BellIcon;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'chat': return 'Conversas';
      case 'team': return 'Equipe';
      case 'system': return 'Sistema';
      default: return category;
    }
  };

  const groupedNotifications = {
    chat: notifications.filter(n => n.category === 'chat'),
    team: notifications.filter(n => n.category === 'team'),
    system: notifications.filter(n => n.category === 'system'),
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar />
      <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-6">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-slate-500 mb-6"
          >
            <Link href="/configuracoes" className="hover:text-indigo-600 transition-colors">
              Configuracoes
            </Link>
            <ChevronRightIcon className="w-4 h-4" />
            <span className="text-slate-800">Notificacoes</span>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <BellIcon className="w-7 h-7 text-indigo-600" />
              Configuracoes de Notificacoes
            </h1>
            <p className="text-slate-500 mt-1">Personalize como e quando voce recebe notificacoes</p>
          </motion.div>

          {/* Email Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-slate-200 p-6 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Notificacoes por Email</h2>
                  <p className="text-sm text-slate-500">Receba um resumo das notificacoes por email</p>
                </div>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  emailNotifications ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    emailNotifications ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            {emailNotifications && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Frequencia de emails
                </label>
                <select className="w-full md:w-64 px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">
                  <option value="instant">Instantaneo</option>
                  <option value="hourly">A cada hora</option>
                  <option value="daily">Diario</option>
                  <option value="weekly">Semanal</option>
                </select>
              </div>
            )}
          </motion.div>

          {/* Sound Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-xl border border-slate-200 p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Sons de Notificacao</h2>
                  <p className="text-sm text-slate-500">Configure os sons de alerta</p>
                </div>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  soundEnabled ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    soundEnabled ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            {soundEnabled && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Som de notificacao
                  </label>
                  <div className="flex gap-3">
                    <select
                      value={selectedSound}
                      onChange={(e) => setSelectedSound(e.target.value)}
                      className="flex-1 md:w-64 px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                    >
                      <option value="default">Padrao</option>
                      <option value="chime">Chime</option>
                      <option value="ding">Ding</option>
                      <option value="pop">Pop</option>
                      <option value="none">Nenhum</option>
                    </select>
                    <button className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                      Testar
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Volume: {soundVolume}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={soundVolume}
                    onChange={(e) => setSoundVolume(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>
            )}
          </motion.div>

          {/* Notification Types */}
          {(['chat', 'team', 'system'] as const).map((category, categoryIndex) => {
            const Icon = getCategoryIcon(category);
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + categoryIndex * 0.1 }}
                className="bg-white rounded-xl border border-slate-200 p-6 mb-6"
              >
                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Icon className="w-5 h-5 text-indigo-600" />
                  {getCategoryLabel(category)}
                </h2>
                <div className="space-y-4">
                  {groupedNotifications[category].map(notification => (
                    <div
                      key={notification.id}
                      className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium text-slate-800">{notification.label}</p>
                        <p className="text-sm text-slate-500">{notification.description}</p>
                      </div>
                      <button
                        onClick={() => toggleNotification(notification.id)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          notification.enabled ? 'bg-indigo-600' : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                            notification.enabled ? 'translate-x-6' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-end"
          >
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4" />
                  Salvar Configuracoes
                </>
              )}
            </button>
          </motion.div>

          {/* Footer */}
          <footer className="mt-8 pt-6 border-t border-slate-200 text-center text-sm text-slate-500">
            2026 ZapSmart
          </footer>
        </div>
      </main>
    </div>
  );
}
