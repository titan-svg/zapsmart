'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import {
  SmileIcon,
  StarIcon,
  ChevronRightIcon,
  ArrowUpIcon,
  UserIcon,
  ChatIcon,
} from '@/components/Icons';
import { mockAnalyticsData, mockConversations } from '@/lib/data';

const dateRanges = [
  { label: 'Hoje', value: 'today' },
  { label: '7 dias', value: '7d' },
  { label: '30 dias', value: '30d' },
  { label: '90 dias', value: '90d' },
];

// Mock rating distribution
const ratingDistribution = [
  { stars: 5, count: 245, label: 'Excelente' },
  { stars: 4, count: 128, label: 'Bom' },
  { stars: 3, count: 42, label: 'Regular' },
  { stars: 2, count: 15, label: 'Ruim' },
  { stars: 1, count: 8, label: 'Pessimo' },
];

// Mock feedback comments
const feedbackComments = [
  {
    id: '1',
    name: 'Maria Santos',
    rating: 5,
    comment: 'Atendimento rapido e eficiente! A IA entendeu minha duvida perfeitamente.',
    date: '12/03/2026',
    type: 'ai',
  },
  {
    id: '2',
    name: 'Joao Oliveira',
    rating: 5,
    comment: 'Lucas foi muito atencioso, resolveu meu problema em minutos.',
    date: '12/03/2026',
    type: 'human',
  },
  {
    id: '3',
    name: 'Ana Costa',
    rating: 4,
    comment: 'Bom atendimento, mas demorou um pouco para ser transferido para um humano.',
    date: '11/03/2026',
    type: 'human',
  },
  {
    id: '4',
    name: 'Pedro Lima',
    rating: 5,
    comment: 'Impressionante como a IA conseguiu resolver minha solicitacao sem precisar de ajuda humana!',
    date: '11/03/2026',
    type: 'ai',
  },
  {
    id: '5',
    name: 'Carla Ferreira',
    rating: 3,
    comment: 'O tempo de espera poderia ser menor, mas o problema foi resolvido.',
    date: '10/03/2026',
    type: 'human',
  },
];

export default function SatisfactionAnalyticsPage() {
  const [selectedRange, setSelectedRange] = useState('7d');

  const analyticsData = mockAnalyticsData;

  // Calculate overall satisfaction
  const avgSatisfaction = (analyticsData.reduce((sum, d) => sum + d.satisfaction, 0) / analyticsData.length);
  const totalRatings = ratingDistribution.reduce((sum, r) => sum + r.count, 0);
  const maxCount = Math.max(...ratingDistribution.map(r => r.count));

  // NPS calculation (simplified)
  const promoters = ratingDistribution.filter(r => r.stars >= 4).reduce((sum, r) => sum + r.count, 0);
  const detractors = ratingDistribution.filter(r => r.stars <= 2).reduce((sum, r) => sum + r.count, 0);
  const nps = Math.round(((promoters - detractors) / totalRatings) * 100);

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
            <span className="text-slate-800">Satisfacao</span>
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <SmileIcon className="w-8 h-8 text-emerald-600" />
                Satisfacao do Cliente
              </h1>
              <p className="text-slate-500 mt-1">Acompanhe a satisfacao dos seus clientes</p>
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
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <SmileIcon className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-emerald-600 flex items-center gap-1">
                  <ArrowUpIcon className="w-4 h-4" />
                  +5%
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-800">{avgSatisfaction.toFixed(1)}</p>
              <p className="text-sm text-slate-500 mt-1">Satisfacao Media</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white rounded-xl border border-slate-200 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <StarIcon className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-800">{totalRatings}</p>
              <p className="text-sm text-slate-500 mt-1">Total de Avaliacoes</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white rounded-xl border border-slate-200 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${nps >= 50 ? 'bg-emerald-100' : nps >= 0 ? 'bg-amber-100' : 'bg-red-100'} flex items-center justify-center`}>
                  <UserIcon className={`w-5 h-5 ${nps >= 50 ? 'text-emerald-600' : nps >= 0 ? 'text-amber-600' : 'text-red-600'}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-800">{nps}</p>
              <p className="text-sm text-slate-500 mt-1">NPS Score</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-white rounded-xl border border-slate-200 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <ChatIcon className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-800">{Math.round((promoters / totalRatings) * 100)}%</p>
              <p className="text-sm text-slate-500 mt-1">Taxa de Promotores</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Overall Score Display */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-6">Nota Geral</h2>

              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  {/* Circular progress */}
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="#E2E8F0"
                      strokeWidth="12"
                      fill="none"
                    />
                    <motion.circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="url(#satisfaction-gradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: '0 553' }}
                      animate={{ strokeDasharray: `${(avgSatisfaction / 5) * 553} 553` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                    <defs>
                      <linearGradient id="satisfaction-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#4F46E5" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-slate-800">{avgSatisfaction.toFixed(1)}</p>
                      <div className="flex items-center justify-center gap-0.5 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={`w-5 h-5 ${
                              star <= Math.round(avgSatisfaction) ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparison */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-indigo-50 rounded-lg">
                  <p className="text-xl font-bold text-indigo-600">4.8</p>
                  <p className="text-sm text-slate-600">Atendimento IA</p>
                </div>
                <div className="text-center p-3 bg-emerald-50 rounded-lg">
                  <p className="text-xl font-bold text-emerald-600">4.6</p>
                  <p className="text-sm text-slate-600">Atendimento Humano</p>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-6">Distribuicao de Notas</h2>

              <div className="space-y-4">
                {ratingDistribution.map((rating, index) => {
                  const percentage = Math.round((rating.count / totalRatings) * 100);

                  return (
                    <motion.div
                      key={rating.stars}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center gap-4"
                    >
                      <div className="flex items-center gap-1 w-24">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-4 h-4 ${
                              i < rating.stars ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(rating.count / maxCount) * 100}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className={`h-full rounded-full ${
                            rating.stars >= 4 ? 'bg-emerald-500' :
                            rating.stars === 3 ? 'bg-amber-500' :
                            'bg-red-500'
                          }`}
                        ></motion.div>
                      </div>
                      <div className="w-20 text-right">
                        <span className="text-sm font-medium text-slate-700">{rating.count}</span>
                        <span className="text-sm text-slate-400 ml-1">({percentage}%)</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-emerald-600">{promoters}</p>
                  <p className="text-xs text-slate-500">Promotores (4-5)</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-amber-600">{ratingDistribution[2].count}</p>
                  <p className="text-xs text-slate-500">Neutros (3)</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-red-600">{detractors}</p>
                  <p className="text-xs text-slate-500">Detratores (1-2)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Satisfaction Trend */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-6">Tendencia de Satisfacao</h2>

            {/* Area chart representation */}
            <div className="relative h-48">
              {/* Y-axis */}
              <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-xs text-slate-400">
                <span>5.0</span>
                <span>4.0</span>
                <span>3.0</span>
              </div>

              {/* Chart */}
              <div className="ml-10 h-full flex items-end">
                <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
                  {/* Grid lines */}
                  <line x1="0" y1="50" x2="700" y2="50" stroke="#E2E8F0" strokeDasharray="4" />
                  <line x1="0" y1="100" x2="700" y2="100" stroke="#E2E8F0" strokeDasharray="4" />
                  <line x1="0" y1="150" x2="700" y2="150" stroke="#E2E8F0" strokeDasharray="4" />

                  {/* Area */}
                  <motion.path
                    d={`M0,${200 - ((analyticsData[0].satisfaction - 3) / 2) * 200} ${analyticsData.map((d, i) => `L${(i / (analyticsData.length - 1)) * 700},${200 - ((d.satisfaction - 3) / 2) * 200}`).join(' ')} L700,200 L0,200 Z`}
                    fill="url(#area-gradient)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ duration: 0.5 }}
                  />

                  {/* Line */}
                  <motion.path
                    d={`M0,${200 - ((analyticsData[0].satisfaction - 3) / 2) * 200} ${analyticsData.map((d, i) => `L${(i / (analyticsData.length - 1)) * 700},${200 - ((d.satisfaction - 3) / 2) * 200}`).join(' ')}`}
                    fill="none"
                    stroke="url(#line-gradient)"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />

                  {/* Points */}
                  {analyticsData.map((d, i) => (
                    <motion.circle
                      key={d.date}
                      cx={(i / (analyticsData.length - 1)) * 700}
                      cy={200 - ((d.satisfaction - 3) / 2) * 200}
                      r="6"
                      fill="white"
                      stroke="#4F46E5"
                      strokeWidth="2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                    />
                  ))}

                  <defs>
                    <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4F46E5" />
                      <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4F46E5" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* X-axis labels */}
            <div className="ml-10 mt-2 flex justify-between text-xs text-slate-500">
              {analyticsData.map((data) => (
                <span key={data.date}>{data.date}</span>
              ))}
            </div>
          </div>

          {/* Recent Feedback */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-800">Comentarios Recentes</h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                Ver todos
              </button>
            </div>

            <div className="space-y-4">
              {feedbackComments.map((feedback, index) => (
                <motion.div
                  key={feedback.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-semibold">
                        {feedback.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{feedback.name}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`w-3 h-3 ${
                                  i < feedback.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            feedback.type === 'ai'
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {feedback.type === 'ai' ? 'IA' : 'Humano'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-slate-500">{feedback.date}</span>
                  </div>
                  <p className="text-slate-600 ml-13">{feedback.comment}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
