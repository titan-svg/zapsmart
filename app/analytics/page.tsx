'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import {
  AnalyticsIcon,
  TrendUpIcon,
  SmileIcon,
  BrainIcon,
  ChatIcon,
  ClockIcon,
  CalendarIcon,
  ChevronRightIcon,
} from '@/components/Icons';
import { mockAnalyticsData, mockDashboardStats, mockIntents } from '@/lib/data';

const dateRanges = [
  { label: 'Hoje', value: 'today' },
  { label: '7 dias', value: '7d' },
  { label: '30 dias', value: '30d' },
  { label: '90 dias', value: '90d' },
];

export default function AnalyticsOverviewPage() {
  const [selectedRange, setSelectedRange] = useState('7d');

  const stats = mockDashboardStats;
  const analyticsData = mockAnalyticsData;

  // Calculate totals from analytics data
  const totalConversations = analyticsData.reduce((sum, d) => sum + d.conversations, 0);
  const totalAiHandled = analyticsData.reduce((sum, d) => sum + d.aiHandled, 0);
  const totalHumanHandled = analyticsData.reduce((sum, d) => sum + d.humanHandled, 0);
  const avgResponseTime = Math.round(analyticsData.reduce((sum, d) => sum + d.avgResponseTime, 0) / analyticsData.length);
  const avgSatisfaction = (analyticsData.reduce((sum, d) => sum + d.satisfaction, 0) / analyticsData.length).toFixed(1);

  // Get max conversations for chart scaling
  const maxConversations = Math.max(...analyticsData.map(d => d.conversations));

  // Top intents by usage
  const topIntents = [...mockIntents].sort((a, b) => b.usageCount - a.usageCount).slice(0, 5);

  const metricCards = [
    {
      label: 'Total de Conversas',
      value: totalConversations.toLocaleString('pt-BR'),
      icon: ChatIcon,
      color: 'bg-indigo-500',
      change: '+12%',
      positive: true,
    },
    {
      label: 'Tempo Medio Resposta',
      value: `${avgResponseTime}s`,
      icon: ClockIcon,
      color: 'bg-emerald-500',
      change: '-8%',
      positive: true,
    },
    {
      label: 'Satisfacao Media',
      value: avgSatisfaction,
      icon: SmileIcon,
      color: 'bg-amber-500',
      change: '+5%',
      positive: true,
    },
    {
      label: 'Precisao da IA',
      value: `${stats.intentAccuracy}%`,
      icon: BrainIcon,
      color: 'bg-purple-500',
      change: '+2%',
      positive: true,
    },
  ];

  const aiPercentage = Math.round((totalAiHandled / totalConversations) * 100);
  const humanPercentage = 100 - aiPercentage;

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
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <AnalyticsIcon className="w-8 h-8 text-indigo-600" />
                Analytics
              </h1>
              <p className="text-slate-500 mt-1">Visao geral das metricas do sistema</p>
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

          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { href: '/analytics/respostas', label: 'Tempo de Resposta', icon: TrendUpIcon, color: 'indigo' },
              { href: '/analytics/satisfacao', label: 'Satisfacao', icon: SmileIcon, color: 'emerald' },
              { href: '/analytics/ia', label: 'Performance IA', icon: BrainIcon, color: 'purple' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-${link.color}-300 hover:shadow-md transition-all group`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-${link.color}-100 flex items-center justify-center`}>
                    <link.icon className={`w-5 h-5 text-${link.color}-600`} />
                  </div>
                  <span className="font-medium text-slate-700">{link.label}</span>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </Link>
            ))}
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {metricCards.map((card, index) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl border border-slate-200 p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center`}>
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-sm font-medium ${card.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                    {card.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-800">{card.value}</p>
                <p className="text-sm text-slate-500 mt-1">{card.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations Trend Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-800">Tendencia de Conversas</h2>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <span className="text-slate-600">IA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-slate-600">Humano</span>
                  </div>
                </div>
              </div>

              {/* Bar Chart using divs */}
              <div className="flex items-end justify-between gap-2 h-48">
                {analyticsData.map((data, index) => (
                  <div key={data.date} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.conversations / maxConversations) * 100}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="w-full flex flex-col justify-end rounded-t-md overflow-hidden"
                    >
                      <div
                        className="bg-emerald-500 w-full"
                        style={{ height: `${(data.humanHandled / data.conversations) * 100}%` }}
                      ></div>
                      <div
                        className="bg-indigo-500 w-full"
                        style={{ height: `${(data.aiHandled / data.conversations) * 100}%` }}
                      ></div>
                    </motion.div>
                    <span className="text-xs text-slate-500 mt-2">{data.date}</span>
                  </div>
                ))}
              </div>

              {/* Chart Summary */}
              <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-800">{totalConversations}</p>
                  <p className="text-sm text-slate-500">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">{totalAiHandled}</p>
                  <p className="text-sm text-slate-500">Atendidas por IA</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">{totalHumanHandled}</p>
                  <p className="text-sm text-slate-500">Atendidas por Humanos</p>
                </div>
              </div>
            </div>

            {/* AI vs Human Handling */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-6">Atendimento IA vs Humano</h2>

              {/* Pie representation using CSS */}
              <div className="relative w-48 h-48 mx-auto mb-6">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(
                      #4F46E5 0deg ${aiPercentage * 3.6}deg,
                      #10B981 ${aiPercentage * 3.6}deg 360deg
                    )`,
                  }}
                ></div>
                <div className="absolute inset-6 bg-white rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-indigo-600">{aiPercentage}%</p>
                    <p className="text-sm text-slate-500">IA</p>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <span className="text-sm font-medium text-slate-700">Atendido por IA</span>
                  </div>
                  <span className="text-sm font-semibold text-indigo-600">{totalAiHandled}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-sm font-medium text-slate-700">Atendido por Humanos</span>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600">{totalHumanHandled}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Intents Used */}
          <div className="mt-6 bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-800">Intencoes Mais Usadas</h2>
              <Link
                href="/intencoes"
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
              >
                Ver todas
                <ChevronRightIcon className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {topIntents.map((intent, index) => {
                const maxUsage = topIntents[0].usageCount;
                const percentage = (intent.usageCount / maxUsage) * 100;

                return (
                  <motion.div
                    key={intent.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-sm font-semibold text-indigo-600">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-slate-700 truncate">{intent.name}</span>
                        <span className="text-sm text-slate-500">{intent.usageCount.toLocaleString('pt-BR')} usos</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"
                        ></motion.div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-slate-600 w-16 text-right">
                      {(intent.confidence * 100).toFixed(0)}%
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
