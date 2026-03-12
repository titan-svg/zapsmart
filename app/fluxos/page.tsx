'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import {
  FlowIcon,
  PlusIcon,
  SearchIcon,
  FilterIcon,
  LightningIcon,
  ClockIcon,
  TagIcon,
  TrendUpIcon,
  EditIcon,
  EyeIcon,
  CalendarIcon,
} from '@/components/Icons';
import { mockFlows, AutoFlow, FlowTrigger, formatDate } from '@/lib/data';

const triggerLabels: Record<FlowTrigger, string> = {
  keyword: 'Palavra-chave',
  intent: 'Intencao',
  time: 'Horario',
  event: 'Evento',
};

const triggerColors: Record<FlowTrigger, string> = {
  keyword: 'bg-blue-100 text-blue-700',
  intent: 'bg-indigo-100 text-indigo-700',
  time: 'bg-amber-100 text-amber-700',
  event: 'bg-emerald-100 text-emerald-700',
};

const triggerIcons: Record<FlowTrigger, React.ComponentType<{ className?: string }>> = {
  keyword: TagIcon,
  intent: LightningIcon,
  time: ClockIcon,
  event: CalendarIcon,
};

export default function FlowsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [triggerFilter, setTriggerFilter] = useState<FlowTrigger | 'all'>('all');
  const [flows, setFlows] = useState<AutoFlow[]>(mockFlows);

  const filteredFlows = flows.filter(flow => {
    const matchesSearch = flow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTrigger = triggerFilter === 'all' || flow.trigger === triggerFilter;
    return matchesSearch && matchesTrigger;
  });

  const toggleActive = (id: string) => {
    setFlows(prev => prev.map(flow =>
      flow.id === id ? { ...flow, isActive: !flow.isActive } : flow
    ));
  };

  const totalUsage = flows.reduce((sum, flow) => sum + flow.usageCount, 0);
  const activeFlows = flows.filter(flow => flow.isActive).length;

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
              <h1 className="text-2xl font-bold text-slate-800">Fluxos Automaticos</h1>
              <p className="text-slate-500 mt-1">Gerencie seus fluxos de automacao</p>
            </div>
            <Link
              href="/fluxos/novo"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Novo Fluxo
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
                  <FlowIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{flows.length}</p>
                  <p className="text-sm text-slate-500">Total Fluxos</p>
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
                  <p className="text-2xl font-bold text-slate-800">{activeFlows}</p>
                  <p className="text-sm text-slate-500">Ativos</p>
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
                  <TrendUpIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{totalUsage.toLocaleString()}</p>
                  <p className="text-sm text-slate-500">Execucoes</p>
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
                  <ClockIcon className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">
                    {flows.length > 0 ? Math.round(totalUsage / flows.length) : 0}
                  </p>
                  <p className="text-sm text-slate-500">Media/Fluxo</p>
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
                  placeholder="Buscar fluxos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-2">
                <FilterIcon className="w-5 h-5 text-slate-400" />
                <select
                  value={triggerFilter}
                  onChange={(e) => setTriggerFilter(e.target.value as FlowTrigger | 'all')}
                  className="px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                >
                  <option value="all">Todos Gatilhos</option>
                  {Object.entries(triggerLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Flows Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredFlows.map((flow, index) => {
              const TriggerIcon = triggerIcons[flow.trigger];
              return (
                <motion.div
                  key={flow.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center">
                          <FlowIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800">{flow.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${triggerColors[flow.trigger]}`}>
                              <TriggerIcon className="w-3 h-3" />
                              {triggerLabels[flow.trigger]}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleActive(flow.id)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          flow.isActive ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                            flow.isActive ? 'left-6' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>

                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">{flow.description}</p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="text-center p-2 bg-slate-50 rounded-lg">
                        <p className="text-lg font-bold text-slate-800">{flow.steps.length}</p>
                        <p className="text-xs text-slate-500">Passos</p>
                      </div>
                      <div className="text-center p-2 bg-slate-50 rounded-lg">
                        <p className="text-lg font-bold text-slate-800">{flow.usageCount}</p>
                        <p className="text-xs text-slate-500">Execucoes</p>
                      </div>
                    </div>

                    {/* Flow Steps Preview */}
                    <div className="mb-4">
                      <p className="text-xs text-slate-500 mb-2">Passos do Fluxo:</p>
                      <div className="flex items-center gap-1 overflow-x-auto pb-1">
                        {flow.steps.slice(0, 4).map((step, i) => (
                          <div key={i} className="flex items-center">
                            <span className={`shrink-0 text-xs px-2 py-1 rounded ${
                              step.type === 'message' ? 'bg-blue-100 text-blue-700' :
                              step.type === 'delay' ? 'bg-amber-100 text-amber-700' :
                              step.type === 'condition' ? 'bg-purple-100 text-purple-700' :
                              'bg-emerald-100 text-emerald-700'
                            }`}>
                              {step.type === 'message' ? 'Msg' :
                               step.type === 'delay' ? `${step.content}s` :
                               step.type === 'condition' ? 'Cond' : 'Acao'}
                            </span>
                            {i < flow.steps.slice(0, 4).length - 1 && (
                              <span className="mx-1 text-slate-300">→</span>
                            )}
                          </div>
                        ))}
                        {flow.steps.length > 4 && (
                          <span className="text-xs text-slate-400 ml-1">+{flow.steps.length - 4}</span>
                        )}
                      </div>
                    </div>

                    {/* Trigger Value */}
                    <div className="mb-4 p-2 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">Gatilho:</p>
                      <p className="text-sm font-medium text-slate-700 truncate">{flow.triggerValue}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-xs text-slate-500">
                        Criado em {formatDate(flow.createdAt)}
                      </span>
                      <div className="flex gap-1">
                        <Link
                          href={`/fluxos/${flow.id}`}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/fluxos/${flow.id}`}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                        >
                          <EditIcon className="w-4 h-4" />
                          Editar
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredFlows.length === 0 && (
            <div className="text-center py-12">
              <FlowIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">Nenhum fluxo encontrado</h3>
              <p className="text-slate-500 mb-4">Tente ajustar os filtros ou crie um novo fluxo</p>
              <Link
                href="/fluxos/novo"
                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                <PlusIcon className="w-5 h-5" />
                Criar Novo Fluxo
              </Link>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
