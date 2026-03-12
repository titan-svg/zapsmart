'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import {
  BrainIcon,
  PlusIcon,
  SearchIcon,
  FilterIcon,
  TagIcon,
  LightningIcon,
  TargetIcon,
  TrendUpIcon,
  EditIcon,
  EyeIcon,
} from '@/components/Icons';
import { mockIntents, Intent, IntentCategory } from '@/lib/data';

const categoryLabels: Record<IntentCategory, string> = {
  greeting: 'Saudacao',
  faq: 'FAQ',
  support: 'Suporte',
  sales: 'Vendas',
  complaint: 'Reclamacao',
  other: 'Outros',
};

const categoryColors: Record<IntentCategory, string> = {
  greeting: 'bg-emerald-100 text-emerald-700',
  faq: 'bg-blue-100 text-blue-700',
  support: 'bg-amber-100 text-amber-700',
  sales: 'bg-indigo-100 text-indigo-700',
  complaint: 'bg-red-100 text-red-700',
  other: 'bg-slate-100 text-slate-700',
};

export default function IntentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<IntentCategory | 'all'>('all');
  const [intents, setIntents] = useState<Intent[]>(mockIntents);

  const filteredIntents = intents.filter(intent => {
    const matchesSearch = intent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intent.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || intent.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const toggleActive = (id: string) => {
    setIntents(prev => prev.map(intent =>
      intent.id === id ? { ...intent, isActive: !intent.isActive } : intent
    ));
  };

  const totalUsage = intents.reduce((sum, intent) => sum + intent.usageCount, 0);
  const avgConfidence = intents.reduce((sum, intent) => sum + intent.confidence, 0) / intents.length;
  const activeIntents = intents.filter(intent => intent.isActive).length;

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar />
      <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Intencoes IA</h1>
              <p className="text-slate-500 mt-1">Gerencie as intencoes de treinamento da IA</p>
            </div>
            <Link
              href="/intencoes/nova"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Nova Intencao
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <BrainIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{intents.length}</p>
                  <p className="text-sm text-slate-500">Total Intencoes</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <LightningIcon className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{activeIntents}</p>
                  <p className="text-sm text-slate-500">Ativas</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <TargetIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{(avgConfidence * 100).toFixed(0)}%</p>
                  <p className="text-sm text-slate-500">Confianca Media</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <TrendUpIcon className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{totalUsage.toLocaleString()}</p>
                  <p className="text-sm text-slate-500">Total Usos</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <SearchIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar intencoes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-2">
                <FilterIcon className="w-5 h-5 text-slate-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as IntentCategory | 'all')}
                  className="px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                >
                  <option value="all">Todas Categorias</option>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Intents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredIntents.map((intent, index) => (
              <motion.div
                key={intent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center">
                        <BrainIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{intent.name}</h3>
                        <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${categoryColors[intent.category]}`}>
                          {categoryLabels[intent.category]}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleActive(intent.id)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        intent.isActive ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                          intent.isActive ? 'left-6' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>

                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{intent.description}</p>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-2 bg-slate-50 rounded-lg">
                      <p className="text-lg font-bold text-slate-800">{intent.trainingPhrases.length}</p>
                      <p className="text-xs text-slate-500">Frases</p>
                    </div>
                    <div className="text-center p-2 bg-slate-50 rounded-lg">
                      <p className="text-lg font-bold text-slate-800">{(intent.confidence * 100).toFixed(0)}%</p>
                      <p className="text-xs text-slate-500">Confianca</p>
                    </div>
                    <div className="text-center p-2 bg-slate-50 rounded-lg">
                      <p className="text-lg font-bold text-slate-800">{intent.usageCount}</p>
                      <p className="text-xs text-slate-500">Usos</p>
                    </div>
                  </div>

                  {/* Confidence Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Confianca do Modelo</span>
                      <span>{(intent.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          intent.confidence >= 0.9 ? 'bg-emerald-500' :
                          intent.confidence >= 0.8 ? 'bg-blue-500' :
                          intent.confidence >= 0.7 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${intent.confidence * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Training Phrases Preview */}
                  <div className="mb-4">
                    <p className="text-xs text-slate-500 mb-2">Frases de Treinamento:</p>
                    <div className="flex flex-wrap gap-1">
                      {intent.trainingPhrases.slice(0, 3).map((phrase, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-indigo-50 text-indigo-600 rounded">
                          {phrase}
                        </span>
                      ))}
                      {intent.trainingPhrases.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-slate-100 text-slate-500 rounded">
                          +{intent.trainingPhrases.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-slate-100">
                    <Link
                      href={`/intencoes/${intent.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <EyeIcon className="w-4 h-4" />
                      Ver Detalhes
                    </Link>
                    <Link
                      href={`/intencoes/${intent.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                    >
                      <EditIcon className="w-4 h-4" />
                      Editar
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredIntents.length === 0 && (
            <div className="text-center py-12">
              <BrainIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">Nenhuma intencao encontrada</h3>
              <p className="text-slate-500 mb-4">Tente ajustar os filtros ou crie uma nova intencao</p>
              <Link
                href="/intencoes/nova"
                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                <PlusIcon className="w-5 h-5" />
                Criar Nova Intencao
              </Link>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
