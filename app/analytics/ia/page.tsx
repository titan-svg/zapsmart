'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import {
  BrainIcon,
  ChevronRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  TargetIcon,
  LightningIcon,
  CheckIcon,
  XIcon,
} from '@/components/Icons';
import { mockIntents, mockDashboardStats } from '@/lib/data';

const dateRanges = [
  { label: 'Hoje', value: 'today' },
  { label: '7 dias', value: '7d' },
  { label: '30 dias', value: '30d' },
  { label: '90 dias', value: '90d' },
];

// Mock confidence distribution data
const confidenceDistribution = [
  { range: '90-100%', count: 450, color: 'bg-emerald-500' },
  { range: '80-89%', count: 280, color: 'bg-indigo-500' },
  { range: '70-79%', count: 120, color: 'bg-amber-500' },
  { range: '60-69%', count: 45, color: 'bg-orange-500' },
  { range: '<60%', count: 25, color: 'bg-red-500' },
];

// Mock training recommendations
const trainingRecommendations = [
  {
    id: '1',
    type: 'add_phrases',
    intent: 'rastrear_pedido',
    description: 'Adicionar mais frases de treinamento para variações de "onde está meu pedido"',
    priority: 'alta',
    impact: '+5% precisão estimada',
  },
  {
    id: '2',
    type: 'merge_intents',
    intent: 'reclamacao',
    description: 'Considerar separar reclamações de produto e serviço em intenções distintas',
    priority: 'media',
    impact: '+3% precisão estimada',
  },
  {
    id: '3',
    type: 'review_responses',
    intent: 'preco_plano',
    description: 'Atualizar respostas com novos valores de planos',
    priority: 'alta',
    impact: 'Melhoria na experiência',
  },
  {
    id: '4',
    type: 'add_intent',
    intent: null,
    description: 'Criar nova intenção para perguntas sobre integração com APIs',
    priority: 'media',
    impact: '+8% cobertura estimada',
  },
];

// Calculate intent accuracy data
const intentAccuracyData = mockIntents.map(intent => ({
  ...intent,
  accuracy: Math.round(intent.confidence * 100),
  trend: Math.random() > 0.5 ? 'up' : 'down',
  trendValue: Math.floor(Math.random() * 5) + 1,
})).sort((a, b) => b.accuracy - a.accuracy);

export default function AIPerformancePage() {
  const [selectedRange, setSelectedRange] = useState('7d');

  const stats = mockDashboardStats;
  const totalConfidence = confidenceDistribution.reduce((sum, c) => sum + c.count, 0);
  const maxConfidenceCount = Math.max(...confidenceDistribution.map(c => c.count));

  // Calculate metrics
  const highConfidenceRate = Math.round(
    (confidenceDistribution.filter(c => c.range.includes('90') || c.range.includes('80')).reduce((sum, c) => sum + c.count, 0) / totalConfidence) * 100
  );

  const avgAccuracy = Math.round(intentAccuracyData.reduce((sum, i) => sum + i.accuracy, 0) / intentAccuracyData.length);

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar />
      <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Link href="/analytics" className="hover:text-indigo-600">Analytics</Link>
            <ChevronRightIcon className="w-4 h-4" />
            <span className="text-slate-800">Performance IA</span>
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <BrainIcon className="w-8 h-8 text-purple-600" />
                Performance da IA
              </h1>
              <p className="text-slate-500 mt-1">Monitore a precisao e eficiencia do assistente virtual</p>
            </div>

            {/* Date Range Selector */}
            <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1">
              {dateRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setSelectedRange(range.value)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    selectedRange === range.value
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl border border-slate-200 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <TargetIcon className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-emerald-600 flex items-center gap-1">
                  <ArrowUpIcon className="w-4 h-4" />
                  +2%
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-800">{stats.intentAccuracy}%</p>
              <p className="text-sm text-slate-500 mt-1">Precisao de Intencoes</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white rounded-xl border border-slate-200 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <LightningIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="text-sm font-medium text-emerald-600 flex items-center gap-1">
                  <ArrowUpIcon className="w-4 h-4" />
                  +3%
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-800">{highConfidenceRate}%</p>
              <p className="text-sm text-slate-500 mt-1">Alta Confianca (&gt;80%)</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white rounded-xl border border-slate-200 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <BrainIcon className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-800">{stats.aiHandledPercent}%</p>
              <p className="text-sm text-slate-500 mt-1">Resolvidos por IA</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-white rounded-xl border border-slate-200 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <CheckIcon className="w-5 h-5 text-amber-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-800">{mockIntents.filter(i => i.isActive).length}</p>
              <p className="text-sm text-slate-500 mt-1">Intencoes Ativas</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Confidence Distribution */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-6">Distribuicao de Confianca</h2>

              <div className="space-y-4">
                {confidenceDistribution.map((item, index) => (
                  <motion.div
                    key={item.range}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <span className="w-20 text-sm font-medium text-slate-600">{item.range}</span>
                    <div className="flex-1 h-8 bg-slate-100 rounded-lg overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.count / maxConfidenceCount) * 100}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`h-full ${item.color} rounded-lg flex items-center justify-end pr-2`}
                      >
                        <span className="text-xs font-medium text-white">{item.count}</span>
                      </motion.div>
                    </div>
                    <span className="w-12 text-sm text-slate-500 text-right">
                      {Math.round((item.count / totalConfidence) * 100)}%
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Total de classificacoes</span>
                  <span className="font-semibold text-slate-800">{totalConfidence.toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </div>

            {/* Accuracy Gauge */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-6">Taxa de Precisao Geral</h2>

              <div className="flex justify-center mb-6">
                <div className="relative">
                  {/* Semi-circular gauge */}
                  <svg className="w-64 h-32" viewBox="0 0 200 100">
                    {/* Background arc */}
                    <path
                      d="M 10 100 A 90 90 0 0 1 190 100"
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                    {/* Value arc */}
                    <motion.path
                      d="M 10 100 A 90 90 0 0 1 190 100"
                      fill="none"
                      stroke="url(#gauge-gradient)"
                      strokeWidth="20"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: '0 283' }}
                      animate={{ strokeDasharray: `${(stats.intentAccuracy / 100) * 283} 283` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                    <defs>
                      <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#EF4444" />
                        <stop offset="50%" stopColor="#F59E0B" />
                        <stop offset="100%" stopColor="#10B981" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                    <p className="text-4xl font-bold text-slate-800">{stats.intentAccuracy}%</p>
                    <p className="text-sm text-slate-500">Precisao</p>
                  </div>
                </div>
              </div>

              {/* Scale labels */}
              <div className="flex justify-between text-sm text-slate-500 px-4">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>

              {/* Status */}
              <div className="mt-6 p-4 bg-emerald-50 rounded-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckIcon className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-emerald-700">Excelente Performance</p>
                  <p className="text-sm text-emerald-600">A precisao esta acima da meta de 90%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Intent Accuracy Table */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-800">Precisao por Intencao</h2>
              <Link
                href="/intencoes"
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
              >
                Gerenciar intencoes
                <ChevronRightIcon className="w-4 h-4" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Intencao</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Categoria</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Usos</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Precisao</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Tendencia</th>
                  </tr>
                </thead>
                <tbody>
                  {intentAccuracyData.map((intent, index) => (
                    <motion.tr
                      key={intent.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg ${
                            intent.accuracy >= 95 ? 'bg-emerald-100' :
                            intent.accuracy >= 90 ? 'bg-indigo-100' :
                            intent.accuracy >= 85 ? 'bg-amber-100' :
                            'bg-red-100'
                          } flex items-center justify-center`}>
                            <BrainIcon className={`w-4 h-4 ${
                              intent.accuracy >= 95 ? 'text-emerald-600' :
                              intent.accuracy >= 90 ? 'text-indigo-600' :
                              intent.accuracy >= 85 ? 'text-amber-600' :
                              'text-red-600'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{intent.name}</p>
                            <p className="text-sm text-slate-500">{intent.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          intent.category === 'greeting' ? 'bg-blue-100 text-blue-700' :
                          intent.category === 'faq' ? 'bg-purple-100 text-purple-700' :
                          intent.category === 'support' ? 'bg-amber-100 text-amber-700' :
                          intent.category === 'sales' ? 'bg-emerald-100 text-emerald-700' :
                          intent.category === 'complaint' ? 'bg-red-100 text-red-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {intent.category}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-slate-700">{intent.usageCount.toLocaleString('pt-BR')}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                intent.accuracy >= 95 ? 'bg-emerald-500' :
                                intent.accuracy >= 90 ? 'bg-indigo-500' :
                                intent.accuracy >= 85 ? 'bg-amber-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${intent.accuracy}%` }}
                            ></div>
                          </div>
                          <span className={`font-semibold ${
                            intent.accuracy >= 95 ? 'text-emerald-600' :
                            intent.accuracy >= 90 ? 'text-indigo-600' :
                            intent.accuracy >= 85 ? 'text-amber-600' :
                            'text-red-600'
                          }`}>
                            {intent.accuracy}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 text-sm font-medium ${
                          intent.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {intent.trend === 'up' ? (
                            <ArrowUpIcon className="w-4 h-4" />
                          ) : (
                            <ArrowDownIcon className="w-4 h-4" />
                          )}
                          {intent.trendValue}%
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Training Recommendations */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-800">Recomendacoes de Treinamento</h2>
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                {trainingRecommendations.length} sugestoes
              </span>
            </div>

            <div className="space-y-4">
              {trainingRecommendations.map((rec, index) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${
                    rec.priority === 'alta' ? 'border-red-200 bg-red-50' :
                    rec.priority === 'media' ? 'border-amber-200 bg-amber-50' :
                    'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        rec.type === 'add_phrases' ? 'bg-indigo-100' :
                        rec.type === 'merge_intents' ? 'bg-purple-100' :
                        rec.type === 'review_responses' ? 'bg-amber-100' :
                        'bg-emerald-100'
                      }`}>
                        {rec.type === 'add_phrases' ? (
                          <LightningIcon className="w-5 h-5 text-indigo-600" />
                        ) : rec.type === 'merge_intents' ? (
                          <BrainIcon className="w-5 h-5 text-purple-600" />
                        ) : rec.type === 'review_responses' ? (
                          <CheckIcon className="w-5 h-5 text-amber-600" />
                        ) : (
                          <TargetIcon className="w-5 h-5 text-emerald-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {rec.intent && (
                            <span className="px-2 py-0.5 bg-white rounded text-xs font-medium text-slate-700 border border-slate-200">
                              {rec.intent}
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            rec.priority === 'alta' ? 'bg-red-100 text-red-700' :
                            rec.priority === 'media' ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            Prioridade {rec.priority}
                          </span>
                        </div>
                        <p className="text-slate-700">{rec.description}</p>
                        <p className="text-sm text-slate-500 mt-1">Impacto: {rec.impact}</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shrink-0">
                      Aplicar
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
