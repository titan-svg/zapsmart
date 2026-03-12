'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import {
  TeamIcon,
  ChevronRightIcon,
  EditIcon,
  ChatIcon,
  CheckIcon,
  ClockIcon,
  StarIcon,
  TrashIcon,
  CalendarIcon,
} from '@/components/Icons';
import { mockTeamMembers, getMemberStatusColor, getRoleLabel } from '@/lib/data';

export default function MembroDetalhePage() {
  const params = useParams();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const member = mockTeamMembers.find(m => m.id === params.id);

  const [formData, setFormData] = useState({
    name: member?.name || '',
    email: member?.email || '',
    role: member?.role || 'agent',
  });

  if (!member) {
    return (
      <div className="min-h-screen bg-slate-50 lg:flex">
        <Sidebar />
        <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-6">
          <div className="max-w-4xl mx-auto text-center py-12">
            <TeamIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Membro nao encontrado</h2>
            <p className="text-slate-500 mb-4">O membro solicitado nao existe ou foi removido</p>
            <Link href="/equipe" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Voltar para Equipe
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'away': return 'Ausente';
      case 'offline': return 'Offline';
      default: return status;
    }
  };

  // Mock activity log
  const activityLog = [
    { id: 1, action: 'Resolveu conversa com Maria Santos', time: '10:45', date: 'Hoje' },
    { id: 2, action: 'Iniciou atendimento com Joao Oliveira', time: '10:30', date: 'Hoje' },
    { id: 3, action: 'Atualizou FAQ sobre pagamentos', time: '09:15', date: 'Hoje' },
    { id: 4, action: 'Resolveu 12 conversas', time: '18:00', date: 'Ontem' },
    { id: 5, action: 'Alterou status para Ausente', time: '12:30', date: 'Ontem' },
    { id: 6, action: 'Realizou login no sistema', time: '08:00', date: 'Ontem' },
  ];

  // Mock performance data
  const performanceData = {
    weekly: {
      resolved: 87,
      avgTime: 42,
      satisfaction: 4.7,
    },
    monthly: {
      resolved: 342,
      avgTime: 45,
      satisfaction: 4.6,
    },
  };

  const handleSave = () => {
    // Simulate save
    setIsEditing(false);
  };

  const handleDelete = () => {
    // Simulate delete
    router.push('/equipe');
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
            <Link href="/equipe" className="hover:text-indigo-600 transition-colors">
              Equipe
            </Link>
            <ChevronRightIcon className="w-4 h-4" />
            <span className="text-slate-800">{member.name}</span>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-slate-200 p-6 mb-6"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-3xl font-semibold">
                    {member.name.charAt(0)}
                  </div>
                  <div className={`absolute bottom-1 right-1 w-5 h-5 ${getMemberStatusColor(member.status)} rounded-full border-3 border-white`}></div>
                </div>
                <div>
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="text-xl font-bold text-slate-800 border border-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="block text-slate-500 border border-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'supervisor' | 'agent' }))}
                        className="block border border-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                      >
                        <option value="agent">Agente</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold text-slate-800">{member.name}</h1>
                      <p className="text-slate-500">{member.email}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          member.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                          member.role === 'supervisor' ? 'bg-indigo-100 text-indigo-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {getRoleLabel(member.role)}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${getMemberStatusColor(member.status)}`}></span>
                          <span className="text-sm text-slate-600">{getStatusLabel(member.status)}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
                    >
                      <CheckIcon className="w-4 h-4" />
                      Salvar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium flex items-center gap-2"
                    >
                      <EditIcon className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium flex items-center gap-2"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Remover
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          >
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <ChatIcon className="w-5 h-5" />
                <span className="text-sm">Chats Ativos</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">{member.activeChats}</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <CheckIcon className="w-5 h-5" />
                <span className="text-sm">Resolvidos Hoje</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">{member.resolvedToday}</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <ClockIcon className="w-5 h-5" />
                <span className="text-sm">Tempo Medio</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">{member.avgResponseTime}s</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <StarIcon className="w-5 h-5" />
                <span className="text-sm">Satisfacao</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">{member.satisfaction.toFixed(1)}</p>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Performance Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl border border-slate-200 p-6"
            >
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Performance</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-3">Ultimos 7 dias</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-emerald-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-emerald-600">{performanceData.weekly.resolved}</p>
                      <p className="text-xs text-emerald-700">Resolvidos</p>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-indigo-600">{performanceData.weekly.avgTime}s</p>
                      <p className="text-xs text-indigo-700">Tempo Medio</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-amber-600">{performanceData.weekly.satisfaction}</p>
                      <p className="text-xs text-amber-700">Satisfacao</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-3">Ultimos 30 dias</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-slate-700">{performanceData.monthly.resolved}</p>
                      <p className="text-xs text-slate-600">Resolvidos</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-slate-700">{performanceData.monthly.avgTime}s</p>
                      <p className="text-xs text-slate-600">Tempo Medio</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-slate-700">{performanceData.monthly.satisfaction}</p>
                      <p className="text-xs text-slate-600">Satisfacao</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Activity Log */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl border border-slate-200 p-6"
            >
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-indigo-600" />
                Atividade Recente
              </h2>

              <div className="space-y-4">
                {activityLog.map((activity, index) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="relative">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                      {index < activityLog.length - 1 && (
                        <div className="absolute top-4 left-0.5 w-0.5 h-full bg-slate-200"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm text-slate-800">{activity.action}</p>
                      <p className="text-xs text-slate-500">{activity.date} as {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Delete Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeleteModal(false)}></div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
              >
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Remover Membro</h3>
                <p className="text-slate-500 mb-6">
                  Tem certeza que deseja remover <strong>{member.name}</strong> da equipe? Esta acao nao pode ser desfeita.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Remover
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-8 pt-6 border-t border-slate-200 text-center text-sm text-slate-500">
            2026 ZapSmart
          </footer>
        </div>
      </main>
    </div>
  );
}
