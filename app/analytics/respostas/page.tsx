'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import {
  TrendUpIcon,
  ClockIcon,
  ChevronRightIcon,
  ArrowDownIcon,
  ArrowUpIcon,
} from '@/components/Icons';
import { mockAnalyticsData, mockTeamMembers } from '@/lib/data';

const dateRanges = [
  { label: 'Hoje', value: 'today' },
  { label: '7 dias', value: '7d' },
  { label: '30 dias', value: '30d' },
  { label: '90 dias', value: '90d' },
];

// Mock hourly response time data
const hourlyData = [
  { hour: '00h', time: 8 },
  { hour: '02h', time: 6 },
  { hour: '04h', time: 5 },
  { hour: '06h', time: 7 },
  { hour: '08h', time: 15 },
  { hour: '10h', time: 18 },
  { hour: '12h', time: 22 },
  { hour: '14h', time: 16 },
  { hour: '16h', time: 14 },
  { hour: '18h', time: 12 },
  { hour: '20h', time: 9 },
  { hour: '22h', time: 7 },
];

export default function ResponseTimeAnalyticsPage() {
  const [selectedRange, setSelectedRange] = useState('7d');

  const analyticsData = mockAnalyticsData;
  const teamMembers = mockTeamMembers.filter(m => m.role === 'agent' || m.role === 'supervisor');

  // Calculate averages
  const avgResponseTime = Math.round(analyticsData.reduce((sum, d) => sum + d.avgResponseTime, 0) / analyticsData.length);
  const minResponseTime = Math.min(...analyticsData.map(d => d.avgResponseTime));
  const maxResponseTime = Math.max(...analyticsData.map(d => d.avgResponseTime));

  // Peak hour
  const peakHour = hourlyData.reduce((prev, curr) => (curr.time > prev.time ? curr : prev));
  const lowHour = hourlyData.reduce((prev, curr) => (curr.time < prev.time ? curr : prev));

  const maxHourlyTime = Math.max(...hourlyData.map(h => h.time));

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
            <span className="text-slate-800">Tempo de Resposta</span>
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <TrendUpIcon className="w-8 h-8 text-indigo-600" />
                Tempo de Resposta
              </h1>
              <p className="text-slate-500 mt-1">Analise detalhada dos tempos de resposta</p>
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
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <ClockIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="text-sm font-medium text-emerald-600 flex items-center gap-1">
                  <ArrowDownIcon className="w-4 h-4" />
                  -8%
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-800">{avgResponseTime}s</p>
              <p className="text-sm text-slate-500 mt-1">Tempo Medio</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white rounded-xl border border-slate-200 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <TrendUpIcon className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-800">{minResponseTime}s</p>
              <p className="text-sm text-slate-500 mt-1">Melhor Tempo</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white rounded-xl border border-slate-200 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <ClockIcon className="w-5 h-5 text-amber-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-800">{maxResponseTime}s</p>
              <p className="text-sm text-slate-500 mt-1">Pior Tempo</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-white rounded-xl border border-slate-200 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <ClockIcon className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-800">{peakHour.hour}</p>
              <p className="text-sm text-slate-500 mt-1">Horario de Pico</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Response Time Trend */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-6">Tendencia do Tempo de Resposta</h2>

              {/* Line chart representation using divs */}
              <div className="relative h-48 mb-4">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-xs text-slate-400">
                  <span>{maxResponseTime}s</span>
                  <span>{Math.round(maxResponseTime / 2)}s</span>
                  <span>0s</span>
                </div>

                {/* Chart area */}
                <div className="ml-10 h-full flex items-end gap-2">
                  {analyticsData.map((data, index) => (
                    <div key={data.date} className="flex-1 flex flex-col items-center">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(data.avgResponseTime / maxResponseTime) * 100}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="w-full max-w-[40px] bg-gradient-to-t from-indigo-500 to-indigo-300 rounded-t-md relative"
                      >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-indigo-600">
                          {data.avgResponseTime}s
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>

              {/* X-axis labels */}
              <div className="ml-10 flex justify-between text-xs text-slate-500">
                {analyticsData.map((data) => (
                  <span key={data.date}>{data.date}</span>
                ))}
              </div>
            </div>

            {/* Response Time by Hour */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-6">Tempo de Resposta por Horario</h2>

              <div className="space-y-3">
                {hourlyData.map((hour, index) => (
                  <motion.div
                    key={hour.hour}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <span className="w-10 text-sm text-slate-500">{hour.hour}</span>
                    <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(hour.time / maxHourlyTime) * 100}%` }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        className={`h-full rounded-full ${
                          hour.time >= 20 ? 'bg-red-400' :
                          hour.time >= 15 ? 'bg-amber-400' :
                          hour.time >= 10 ? 'bg-indigo-400' :
                          'bg-emerald-400'
                        }`}
                      ></motion.div>
                    </div>
                    <span className="w-10 text-sm font-medium text-slate-700 text-right">{hour.time}s</span>
                  </motion.div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  <span className="text-slate-600">Otimo (&lt;10s)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
                  <span className="text-slate-600">Bom (10-15s)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <span className="text-slate-600">Regular (15-20s)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <span className="text-slate-600">Lento (&gt;20s)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Agent Comparison */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-6">Comparacao por Agente</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Agente</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Tempo Medio</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Resolvidos Hoje</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.sort((a, b) => a.avgResponseTime - b.avgResponseTime).map((member, index) => {
                    const bestTime = Math.min(...teamMembers.map(m => m.avgResponseTime));
                    const worstTime = Math.max(...teamMembers.map(m => m.avgResponseTime));
                    const performancePercent = 100 - ((member.avgResponseTime - bestTime) / (worstTime - bestTime)) * 100;

                    return (
                      <motion.tr
                        key={member.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-semibold">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">{member.name}</p>
                              <p className="text-sm text-slate-500 capitalize">{member.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                            member.status === 'online' ? 'bg-emerald-100 text-emerald-700' :
                            member.status === 'away' ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            <span className={`w-2 h-2 rounded-full ${
                              member.status === 'online' ? 'bg-emerald-500' :
                              member.status === 'away' ? 'bg-amber-500' :
                              'bg-slate-400'
                            }`}></span>
                            {member.status === 'online' ? 'Online' :
                             member.status === 'away' ? 'Ausente' : 'Offline'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`font-semibold ${
                            member.avgResponseTime <= 40 ? 'text-emerald-600' :
                            member.avgResponseTime <= 50 ? 'text-amber-600' :
                            'text-red-600'
                          }`}>
                            {member.avgResponseTime}s
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium text-slate-700">{member.resolvedToday}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  performancePercent >= 80 ? 'bg-emerald-500' :
                                  performancePercent >= 50 ? 'bg-amber-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${performancePercent}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-slate-600">{Math.round(performancePercent)}%</span>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
