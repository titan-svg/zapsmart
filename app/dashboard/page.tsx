'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import {
  ChatIcon,
  BrainIcon,
  AnalyticsIcon,
  TeamIcon,
  ClockIcon,
  TrendUpIcon,
  SmileIcon,
  PlusIcon,
  ChevronRightIcon,
  TargetIcon,
  LightningIcon,
  RefreshIcon,
} from '@/components/Icons';
import { useAuth } from '@/context/AuthContext';
import {
  mockDashboardStats,
  mockConversations,
  mockAnalyticsData,
  mockTeamMembers,
  getStatusColor,
  getStatusLabel,
  getRelativeTime,
  getMemberStatusColor,
} from '@/lib/data';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

// Stats card component
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; positive: boolean };
  color: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky';
}

function StatCard({ title, value, subtitle, icon, trend, color }: StatCardProps) {
  const colorClasses = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
    sky: 'bg-sky-50 text-sky-600',
  };

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-slate-800 mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1 truncate">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
              <TrendUpIcon className={`w-3 h-3 ${!trend.positive && 'rotate-180'}`} />
              <span>{trend.positive ? '+' : ''}{trend.value}% vs semana anterior</span>
            </div>
          )}
        </div>
        <div className={`p-2 sm:p-3 rounded-lg ${colorClasses[color]} shrink-0`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

// Conversation activity chart component
function ActivityChart() {
  const maxConversations = Math.max(...mockAnalyticsData.map(d => d.conversations));

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-100"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-slate-800">Atividade de Conversas</h3>
          <p className="text-xs sm:text-sm text-slate-500">Ultimos 7 dias</p>
        </div>
        <div className="flex items-center gap-4 text-xs sm:text-sm">
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

      <div className="flex items-end justify-between gap-1 sm:gap-2 h-40 sm:h-48">
        {mockAnalyticsData.map((day, index) => {
          const aiHeight = (day.aiHandled / maxConversations) * 100;
          const humanHeight = (day.humanHandled / maxConversations) * 100;

          return (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col items-center gap-0.5 sm:gap-1" style={{ height: '140px' }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${aiHeight}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="w-full max-w-[28px] sm:max-w-[40px] bg-indigo-500 rounded-t-md cursor-pointer hover:bg-indigo-600 transition-colors"
                  title={`IA: ${day.aiHandled}`}
                />
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${humanHeight}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  className="w-full max-w-[28px] sm:max-w-[40px] bg-emerald-500 rounded-b-md cursor-pointer hover:bg-emerald-600 transition-colors"
                  title={`Humano: ${day.humanHandled}`}
                />
              </div>
              <span className="text-[10px] sm:text-xs text-slate-500 mt-2">{day.date}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 sm:gap-4 text-center">
        <div>
          <p className="text-lg sm:text-xl font-bold text-slate-800">
            {mockAnalyticsData.reduce((sum, d) => sum + d.conversations, 0)}
          </p>
          <p className="text-[10px] sm:text-xs text-slate-500">Total Conversas</p>
        </div>
        <div>
          <p className="text-lg sm:text-xl font-bold text-indigo-600">
            {Math.round((mockAnalyticsData.reduce((sum, d) => sum + d.aiHandled, 0) / mockAnalyticsData.reduce((sum, d) => sum + d.conversations, 0)) * 100)}%
          </p>
          <p className="text-[10px] sm:text-xs text-slate-500">Resolvido IA</p>
        </div>
        <div>
          <p className="text-lg sm:text-xl font-bold text-emerald-600">
            {(mockAnalyticsData.reduce((sum, d) => sum + d.satisfaction, 0) / mockAnalyticsData.length).toFixed(1)}
          </p>
          <p className="text-[10px] sm:text-xs text-slate-500">Satisfacao Media</p>
        </div>
      </div>
    </motion.div>
  );
}

// Recent conversations component
function RecentConversations() {
  const recentConversations = mockConversations.slice(0, 5);

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-xl shadow-sm border border-slate-100"
    >
      <div className="p-4 sm:p-5 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-800">Conversas Recentes</h3>
            <p className="text-xs sm:text-sm text-slate-500">Ultimas interacoes</p>
          </div>
          <Link
            href="/conversas"
            className="text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            Ver todas
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {recentConversations.map((conversation) => (
          <Link
            key={conversation.id}
            href={`/conversas/${conversation.id}`}
            className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-slate-50 transition-colors"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-semibold text-sm shrink-0">
              {conversation.contact.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-slate-800 truncate">{conversation.contact.name}</p>
                <span className="text-[10px] sm:text-xs text-slate-400 shrink-0">
                  {getRelativeTime(conversation.lastMessageAt)}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 truncate mt-0.5">
                {conversation.messages[conversation.messages.length - 1]?.content}
              </p>
            </div>
            <span className={`px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium shrink-0 ${getStatusColor(conversation.status)}`}>
              {getStatusLabel(conversation.status)}
            </span>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

// AI Performance metrics component
function AIPerformanceMetrics() {
  const metrics = [
    { label: 'Precisao de Intencoes', value: mockDashboardStats.intentAccuracy, target: 95, color: 'indigo' },
    { label: 'Taxa de Resolucao IA', value: mockDashboardStats.aiHandledPercent, target: 80, color: 'emerald' },
    { label: 'Confianca Media', value: 91, target: 90, color: 'sky' },
  ];

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-100"
    >
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-slate-800">Performance da IA</h3>
          <p className="text-xs sm:text-sm text-slate-500">Metricas de precisao e confianca</p>
        </div>
        <div className="p-2 bg-indigo-50 rounded-lg">
          <BrainIcon className="w-5 h-5 text-indigo-600" />
        </div>
      </div>

      <div className="space-y-4 sm:space-y-5">
        {metrics.map((metric) => {
          const colorClasses = {
            indigo: 'bg-indigo-500',
            emerald: 'bg-emerald-500',
            sky: 'bg-sky-500',
          };

          return (
            <div key={metric.label}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm text-slate-600">{metric.label}</span>
                <span className="text-xs sm:text-sm font-semibold text-slate-800">{metric.value}%</span>
              </div>
              <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.value}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`absolute left-0 top-0 h-full rounded-full ${colorClasses[metric.color as keyof typeof colorClasses]}`}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-slate-400"
                  style={{ left: `${metric.target}%` }}
                  title={`Meta: ${metric.target}%`}
                />
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-1">Meta: {metric.target}%</p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 sm:mt-6 pt-4 border-t border-slate-100">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="text-center p-2 sm:p-3 bg-slate-50 rounded-lg">
            <p className="text-lg sm:text-xl font-bold text-slate-800">{mockDashboardStats.messagesProcessed.toLocaleString()}</p>
            <p className="text-[10px] sm:text-xs text-slate-500">Mensagens Processadas</p>
          </div>
          <div className="text-center p-2 sm:p-3 bg-slate-50 rounded-lg">
            <p className="text-lg sm:text-xl font-bold text-emerald-600">12ms</p>
            <p className="text-[10px] sm:text-xs text-slate-500">Tempo de Resposta IA</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Quick actions component
function QuickActions() {
  const actions = [
    {
      label: 'Nova Conversa',
      description: 'Iniciar atendimento manual',
      href: '/conversas',
      icon: <PlusIcon className="w-5 h-5" />,
      color: 'bg-indigo-500 hover:bg-indigo-600',
    },
    {
      label: 'Treinar IA',
      description: 'Adicionar novas intencoes',
      href: '/intencoes/nova',
      icon: <BrainIcon className="w-5 h-5" />,
      color: 'bg-emerald-500 hover:bg-emerald-600',
    },
    {
      label: 'Ver Analytics',
      description: 'Relatorios detalhados',
      href: '/analytics',
      icon: <AnalyticsIcon className="w-5 h-5" />,
      color: 'bg-sky-500 hover:bg-sky-600',
    },
  ];

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-100"
    >
      <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-4">Acoes Rapidas</h3>
      <div className="space-y-3">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all group"
          >
            <div className={`p-2 sm:p-2.5 rounded-lg text-white transition-colors ${action.color}`}>
              {action.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">
                {action.label}
              </p>
              <p className="text-xs text-slate-500">{action.description}</p>
            </div>
            <ChevronRightIcon className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

// Team activity component
function TeamActivity() {
  const onlineMembers = mockTeamMembers.filter(m => m.status === 'online' || m.status === 'away');
  const totalActiveChats = onlineMembers.reduce((sum, m) => sum + m.activeChats, 0);
  const totalResolvedToday = mockTeamMembers.reduce((sum, m) => sum + m.resolvedToday, 0);

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-xl shadow-sm border border-slate-100"
    >
      <div className="p-4 sm:p-5 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-800">Atividade da Equipe</h3>
            <p className="text-xs sm:text-sm text-slate-500">Membros online e atendimentos</p>
          </div>
          <Link
            href="/equipe"
            className="text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            Gerenciar
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="text-center p-2 sm:p-3 bg-emerald-50 rounded-lg">
            <p className="text-lg sm:text-xl font-bold text-emerald-600">{onlineMembers.length}</p>
            <p className="text-[10px] sm:text-xs text-slate-500">Online</p>
          </div>
          <div className="text-center p-2 sm:p-3 bg-indigo-50 rounded-lg">
            <p className="text-lg sm:text-xl font-bold text-indigo-600">{totalActiveChats}</p>
            <p className="text-[10px] sm:text-xs text-slate-500">Chats Ativos</p>
          </div>
          <div className="text-center p-2 sm:p-3 bg-sky-50 rounded-lg">
            <p className="text-lg sm:text-xl font-bold text-sky-600">{totalResolvedToday}</p>
            <p className="text-[10px] sm:text-xs text-slate-500">Resolvidos Hoje</p>
          </div>
        </div>

        <div className="space-y-3">
          {mockTeamMembers.slice(0, 4).map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 p-2 sm:p-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="relative shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                  {member.name.charAt(0)}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-white ${getMemberStatusColor(member.status)}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-slate-800 truncate">{member.name}</p>
                <p className="text-[10px] sm:text-xs text-slate-500 capitalize">{member.role}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-800">{member.activeChats}</p>
                <p className="text-[10px] sm:text-xs text-slate-500">chats</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Main Dashboard Page
export default function DashboardPage() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar />
      <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto space-y-4 sm:space-y-6"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
                {getGreeting()}, {user?.name?.split(' ')[0] || 'Usuario'}!
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Aqui esta o resumo do seu atendimento hoje
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-slate-200 text-sm text-slate-600">
                <ClockIcon className="w-4 h-4" />
                <span>{currentTime}</span>
              </div>
              <button
                onClick={handleRefresh}
                className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                title="Atualizar dados"
              >
                <RefreshIcon className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            <StatCard
              title="Total Conversas"
              value={mockDashboardStats.totalConversations.toLocaleString()}
              subtitle="Este mes"
              icon={<ChatIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
              trend={{ value: 12, positive: true }}
              color="indigo"
            />
            <StatCard
              title="Conversas Ativas"
              value={mockDashboardStats.activeConversations}
              subtitle="Em andamento"
              icon={<LightningIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
              color="emerald"
            />
            <StatCard
              title="Atendido por IA"
              value={`${mockDashboardStats.aiHandledPercent}%`}
              subtitle="Taxa de automacao"
              icon={<BrainIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
              trend={{ value: 5, positive: true }}
              color="sky"
            />
            <StatCard
              title="Tempo Resposta"
              value={`${mockDashboardStats.avgResponseTime}s`}
              subtitle="Media IA"
              icon={<ClockIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
              trend={{ value: 8, positive: true }}
              color="amber"
            />
            <div className="col-span-2 lg:col-span-1">
              <StatCard
                title="Satisfacao"
                value={mockDashboardStats.satisfaction.toFixed(1)}
                subtitle="De 5.0 estrelas"
                icon={<SmileIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                trend={{ value: 3, positive: true }}
                color="rose"
              />
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Activity Chart - spans 2 columns on large screens */}
            <div className="lg:col-span-2">
              <ActivityChart />
            </div>

            {/* AI Performance Metrics */}
            <div className="lg:col-span-1">
              <AIPerformanceMetrics />
            </div>
          </div>

          {/* Secondary Content Grid */}
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Recent Conversations - spans 2 columns on large screens */}
            <div className="lg:col-span-2">
              <RecentConversations />
            </div>

            {/* Quick Actions and Team Activity */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-6">
              <QuickActions />
              <TeamActivity />
            </div>
          </div>

          {/* Footer */}
          <motion.footer
            variants={itemVariants}
            className="text-center py-4 sm:py-6 border-t border-slate-200 mt-6 sm:mt-8"
          >
            <p className="text-xs sm:text-sm text-slate-500">
              2026 ZapSmart
            </p>
          </motion.footer>
        </motion.div>
      </main>
    </div>
  );
}
