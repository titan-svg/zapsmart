'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import {
  SettingsIcon,
  WhatsAppIcon,
  ChevronRightIcon,
  CheckIcon,
  RefreshIcon,
  PhoneIcon,
  QRCodeIcon,
} from '@/components/Icons';

export default function WhatsAppConfigPage() {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connected');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [formData, setFormData] = useState({
    businessName: 'TechFlow Solutions',
    businessDescription: 'Solucoes inteligentes para seu negocio',
    businessCategory: 'technology',
    businessAddress: 'Sao Paulo, SP - Brasil',
    businessEmail: 'contato@techflow.com.br',
    businessWebsite: 'https://techflow.com.br',
  });

  const phoneNumbers = [
    { id: '1', number: '+55 11 98765-4321', label: 'Principal', isVerified: true, isActive: true },
    { id: '2', number: '+55 11 91234-5678', label: 'Secundario', isVerified: true, isActive: false },
  ];

  const handleRefreshConnection = async () => {
    setIsRefreshing(true);
    setConnectionStatus('connecting');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setConnectionStatus('connected');
    setIsRefreshing(false);
  };

  const handleDisconnect = () => {
    setConnectionStatus('disconnected');
  };

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
            <span className="text-slate-800">WhatsApp</span>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <WhatsAppIcon className="w-7 h-7 text-emerald-600" />
              Integracao WhatsApp
            </h1>
            <p className="text-slate-500 mt-1">Gerencie a conexao e configuracoes do WhatsApp Business</p>
          </motion.div>

          {/* Connection Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-slate-200 p-6 mb-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  connectionStatus === 'connected' ? 'bg-emerald-100' :
                  connectionStatus === 'connecting' ? 'bg-amber-100' :
                  'bg-red-100'
                }`}>
                  <WhatsAppIcon className={`w-7 h-7 ${
                    connectionStatus === 'connected' ? 'text-emerald-600' :
                    connectionStatus === 'connecting' ? 'text-amber-600' :
                    'text-red-600'
                  }`} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Status da Conexao</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-2 h-2 rounded-full ${
                      connectionStatus === 'connected' ? 'bg-emerald-500' :
                      connectionStatus === 'connecting' ? 'bg-amber-500 animate-pulse' :
                      'bg-red-500'
                    }`}></span>
                    <span className={`text-sm font-medium ${
                      connectionStatus === 'connected' ? 'text-emerald-600' :
                      connectionStatus === 'connecting' ? 'text-amber-600' :
                      'text-red-600'
                    }`}>
                      {connectionStatus === 'connected' ? 'Conectado' :
                       connectionStatus === 'connecting' ? 'Conectando...' :
                       'Desconectado'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleRefreshConnection}
                  disabled={isRefreshing}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Atualizar
                </button>
                {connectionStatus === 'connected' ? (
                  <button
                    onClick={handleDisconnect}
                    className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                  >
                    Desconectar
                  </button>
                ) : (
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                    Conectar
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* QR Code Section */}
          {connectionStatus === 'disconnected' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-xl border border-slate-200 p-6 mb-6"
            >
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <QRCodeIcon className="w-5 h-5 text-indigo-600" />
                Escanear QR Code
              </h2>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-48 h-48 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center">
                  <div className="text-center">
                    <QRCodeIcon className="w-16 h-16 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">QR Code aparecera aqui</p>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-slate-800 mb-2">Como conectar:</h3>
                  <ol className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-medium shrink-0">1</span>
                      Abra o WhatsApp no seu celular
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-medium shrink-0">2</span>
                      Toque em Menu ou Configuracoes
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-medium shrink-0">3</span>
                      Selecione &quot;Dispositivos Conectados&quot;
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-medium shrink-0">4</span>
                      Aponte a camera para o QR Code
                    </li>
                  </ol>
                </div>
              </div>
            </motion.div>
          )}

          {/* Phone Numbers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-slate-200 p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <PhoneIcon className="w-5 h-5 text-indigo-600" />
                Numeros de Telefone
              </h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                + Adicionar Numero
              </button>
            </div>
            <div className="space-y-3">
              {phoneNumbers.map(phone => (
                <div
                  key={phone.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    phone.isActive ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      phone.isActive ? 'bg-emerald-100' : 'bg-slate-200'
                    }`}>
                      <PhoneIcon className={`w-5 h-5 ${phone.isActive ? 'text-emerald-600' : 'text-slate-500'}`} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{phone.number}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm text-slate-500">{phone.label}</span>
                        {phone.isVerified && (
                          <span className="flex items-center gap-1 text-xs text-emerald-600">
                            <CheckIcon className="w-3 h-3" /> Verificado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {phone.isActive ? (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                        Ativo
                      </span>
                    ) : (
                      <button className="px-3 py-1 border border-slate-200 text-slate-600 text-sm font-medium rounded-full hover:bg-white transition-colors">
                        Ativar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Business Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-slate-200 p-6"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-indigo-600" />
              Perfil do Negocio
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nome do Negocio
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Categoria
                </label>
                <select
                  value={formData.businessCategory}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessCategory: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                >
                  <option value="technology">Tecnologia</option>
                  <option value="retail">Varejo</option>
                  <option value="services">Servicos</option>
                  <option value="health">Saude</option>
                  <option value="education">Educacao</option>
                  <option value="other">Outro</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Descricao
                </label>
                <textarea
                  value={formData.businessDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessDescription: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.businessEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessEmail: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.businessWebsite}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessWebsite: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Endereco
                </label>
                <input
                  type="text"
                  value={formData.businessAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessAddress: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
              <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2">
                <CheckIcon className="w-4 h-4" />
                Salvar Alteracoes
              </button>
            </div>
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
