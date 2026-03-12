'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import {
  KeyIcon,
  ChevronRightIcon,
  CheckIcon,
  EyeIcon,
  RefreshIcon,
} from '@/components/Icons';

export default function APIConfigPage() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isRegeneratingKey, setIsRegeneratingKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const apiKey = 'zs_live_sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0';
  const maskedApiKey = 'zs_live_sk_****************************t0';

  const [webhooks, setWebhooks] = useState([
    { id: '1', url: 'https://api.meusite.com/webhook/zapsmart', events: ['message.received', 'conversation.started'], active: true },
    { id: '2', url: 'https://crm.empresa.com/integrations/zapsmart', events: ['contact.created', 'conversation.resolved'], active: true },
  ]);

  const [newWebhookUrl, setNewWebhookUrl] = useState('');

  const usageStats = {
    currentMonth: {
      apiCalls: 15420,
      limit: 50000,
      messages: 8932,
      webhookDeliveries: 4521,
    },
    lastMonth: {
      apiCalls: 12350,
      messages: 7245,
      webhookDeliveries: 3890,
    },
  };

  const handleCopyKey = async () => {
    await navigator.clipboard.writeText(apiKey);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRegenerateKey = async () => {
    setIsRegeneratingKey(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRegeneratingKey(false);
  };

  const handleAddWebhook = () => {
    if (!newWebhookUrl) return;
    setWebhooks(prev => [
      ...prev,
      { id: Date.now().toString(), url: newWebhookUrl, events: ['message.received'], active: true }
    ]);
    setNewWebhookUrl('');
  };

  const toggleWebhook = (id: string) => {
    setWebhooks(prev =>
      prev.map(w => w.id === id ? { ...w, active: !w.active } : w)
    );
  };

  const removeWebhook = (id: string) => {
    setWebhooks(prev => prev.filter(w => w.id !== id));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
  };

  const usagePercentage = (usageStats.currentMonth.apiCalls / usageStats.currentMonth.limit) * 100;

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar />
      <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
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
            <span className="text-slate-800">API</span>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <KeyIcon className="w-7 h-7 text-indigo-600" />
              Configuracoes de API
            </h1>
            <p className="text-slate-500 mt-1">Gerencie chaves de API, webhooks e monitore o uso</p>
          </motion.div>

          {/* API Key Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-slate-200 p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Chave de API</h2>
                <p className="text-sm text-slate-500">Use esta chave para autenticar requisicoes a API</p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                Producao
              </span>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex items-center justify-between gap-4">
                <code className="font-mono text-sm text-slate-700 flex-1 break-all">
                  {showApiKey ? apiKey : maskedApiKey}
                </code>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                    title={showApiKey ? 'Ocultar' : 'Mostrar'}
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleCopyKey}
                    className={`px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors ${
                      isCopied
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                        : 'border-slate-200 text-slate-600 hover:bg-white'
                    }`}
                  >
                    {isCopied ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleRegenerateKey}
                disabled={isRegeneratingKey}
                className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RefreshIcon className={`w-4 h-4 ${isRegeneratingKey ? 'animate-spin' : ''}`} />
                {isRegeneratingKey ? 'Regenerando...' : 'Regenerar Chave'}
              </button>
            </div>

            <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
              <p className="text-sm text-amber-800">
                <strong>Atencao:</strong> Regenerar a chave invalidara a chave atual imediatamente.
                Todas as integracoes que usam a chave antiga precisarao ser atualizadas.
              </p>
            </div>
          </motion.div>

          {/* Webhooks Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-slate-200 p-6 mb-6"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Webhooks</h2>
            <p className="text-sm text-slate-500 mb-4">
              Receba notificacoes em tempo real quando eventos ocorrerem
            </p>

            {/* Add New Webhook */}
            <div className="flex gap-3 mb-6">
              <input
                type="url"
                value={newWebhookUrl}
                onChange={(e) => setNewWebhookUrl(e.target.value)}
                placeholder="https://seusite.com/webhook"
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
              <button
                onClick={handleAddWebhook}
                disabled={!newWebhookUrl}
                className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Adicionar
              </button>
            </div>

            {/* Webhook List */}
            <div className="space-y-3">
              {webhooks.map(webhook => (
                <div
                  key={webhook.id}
                  className={`p-4 rounded-lg border ${
                    webhook.active ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm text-slate-700 truncate">{webhook.url}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {webhook.events.map(event => (
                          <span
                            key={event}
                            className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                          >
                            {event}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => toggleWebhook(webhook.id)}
                        className={`relative w-10 h-5 rounded-full transition-colors ${
                          webhook.active ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                            webhook.active ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => removeWebhook(webhook.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {webhooks.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                Nenhum webhook configurado
              </div>
            )}

            {/* Available Events */}
            <div className="mt-6 pt-4 border-t border-slate-200">
              <h3 className="text-sm font-medium text-slate-700 mb-3">Eventos Disponiveis</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['message.received', 'message.sent', 'conversation.started', 'conversation.resolved', 'contact.created', 'contact.updated'].map(event => (
                  <div key={event} className="text-sm text-slate-600 font-mono bg-slate-50 px-3 py-1.5 rounded">
                    {event}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Usage Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-slate-200 p-6 mb-6"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Uso da API</h2>

            {/* Current Month */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Chamadas de API (Mes Atual)</span>
                <span className="text-sm text-slate-500">
                  {usageStats.currentMonth.apiCalls.toLocaleString()} / {usageStats.currentMonth.limit.toLocaleString()}
                </span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    usagePercentage > 90 ? 'bg-red-500' :
                    usagePercentage > 70 ? 'bg-amber-500' :
                    'bg-indigo-500'
                  }`}
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                />
              </div>
              <p className="text-sm text-slate-500 mt-1">{usagePercentage.toFixed(1)}% utilizado</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-500 mb-1">Chamadas de API</p>
                <p className="text-2xl font-bold text-slate-800">{usageStats.currentMonth.apiCalls.toLocaleString()}</p>
                <p className="text-xs text-emerald-600 mt-1">
                  +{((usageStats.currentMonth.apiCalls - usageStats.lastMonth.apiCalls) / usageStats.lastMonth.apiCalls * 100).toFixed(1)}% vs mes anterior
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-500 mb-1">Mensagens Enviadas</p>
                <p className="text-2xl font-bold text-slate-800">{usageStats.currentMonth.messages.toLocaleString()}</p>
                <p className="text-xs text-emerald-600 mt-1">
                  +{((usageStats.currentMonth.messages - usageStats.lastMonth.messages) / usageStats.lastMonth.messages * 100).toFixed(1)}% vs mes anterior
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-500 mb-1">Webhooks Entregues</p>
                <p className="text-2xl font-bold text-slate-800">{usageStats.currentMonth.webhookDeliveries.toLocaleString()}</p>
                <p className="text-xs text-emerald-600 mt-1">
                  +{((usageStats.currentMonth.webhookDeliveries - usageStats.lastMonth.webhookDeliveries) / usageStats.lastMonth.webhookDeliveries * 100).toFixed(1)}% vs mes anterior
                </p>
              </div>
            </div>
          </motion.div>

          {/* Documentation Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-xl p-6 mb-6 text-white"
          >
            <h2 className="text-lg font-semibold mb-2">Documentacao da API</h2>
            <p className="text-white/80 mb-4">
              Consulte nossa documentacao completa para integrar o ZapSmart ao seu sistema
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-white/90 transition-colors"
            >
              Acessar Documentacao
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </motion.div>

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
