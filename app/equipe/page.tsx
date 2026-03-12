'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import {
  TeamIcon,
  PlusIcon,
  SearchIcon,
  ChatIcon,
  CheckIcon,
  ClockIcon,
  StarIcon,
  FilterIcon,
} from '@/components/Icons';
import { mockTeamMembers, getMemberStatusColor, getRoleLabel } from '@/lib/data';

export default function EquipePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredMembers = mockTeamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'away': return 'Ausente';
      case 'offline': return 'Offline';
      default: return status;
    }
  };

  const stats = {
    total: mockTeamMembers.length,
    online: mockTeamMembers.filter(m => m.status === 'online').length,
    activeChats: mockTeamMembers.reduce((sum, m) => sum + m.activeChats, 0),
    resolvedToday: mockTeamMembers.reduce((sum, m) => sum + m.resolvedToday, 0),
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar />
      <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
          >
            <div>
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <TeamIcon className="w-7 h-7 text-indigo-600" />
                Equipe
              </h1>
              <p className="text-slate-500 mt-1">Gerencie os membros da sua equipe de atendimento</p>
            </div>
            <Link
              href="/equipe/novo"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <PlusIcon className="w-5 h-5" />
              Novo Membro
            </Link>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          >
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <TeamIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                  <p className="text-sm text-slate-500">Total de Membros</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{stats.online}</p>
                  <p className="text-sm text-slate-500">Online Agora</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <ChatIcon className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{stats.activeChats}</p>
                  <p className="text-sm text-slate-500">Chats Ativos</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <CheckIcon className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{stats.resolvedToday}</p>
                  <p className="text-sm text-slate-500">Resolvidos Hoje</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-slate-200 p-4 mb-6"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                >
                  <option value="all">Todas as Funcoes</option>
                  <option value="admin">Administrador</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="agent">Agente</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                >
                  <option value="all">Todos os Status</option>
                  <option value="online">Online</option>
                  <option value="away">Ausente</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Team Members Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {filteredMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link href={`/equipe/${member.id}`}>
                  <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                            {member.name.charAt(0)}
                          </div>
                          <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 ${getMemberStatusColor(member.status)} rounded-full border-2 border-white`}></div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800">{member.name}</h3>
                          <p className="text-sm text-slate-500">{member.email}</p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        member.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        member.role === 'supervisor' ? 'bg-indigo-100 text-indigo-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {getRoleLabel(member.role)}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`w-2 h-2 rounded-full ${getMemberStatusColor(member.status)}`}></span>
                      <span className="text-sm text-slate-600">{getStatusLabel(member.status)}</span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-slate-500 mb-1">
                          <ChatIcon className="w-4 h-4" />
                          <span className="text-xs">Chats Ativos</span>
                        </div>
                        <p className="text-lg font-semibold text-slate-800">{member.activeChats}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-slate-500 mb-1">
                          <CheckIcon className="w-4 h-4" />
                          <span className="text-xs">Resolvidos Hoje</span>
                        </div>
                        <p className="text-lg font-semibold text-slate-800">{member.resolvedToday}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-slate-500 mb-1">
                          <ClockIcon className="w-4 h-4" />
                          <span className="text-xs">Tempo Medio</span>
                        </div>
                        <p className="text-lg font-semibold text-slate-800">{member.avgResponseTime}s</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-slate-500 mb-1">
                          <StarIcon className="w-4 h-4" />
                          <span className="text-xs">Satisfacao</span>
                        </div>
                        <p className="text-lg font-semibold text-slate-800">{member.satisfaction.toFixed(1)}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {filteredMembers.length === 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <TeamIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">Nenhum membro encontrado</h3>
              <p className="text-slate-500">Tente ajustar os filtros ou adicione novos membros</p>
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
