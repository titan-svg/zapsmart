'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import {
  ChatIcon,
  SearchIcon,
  FilterIcon,
  RobotIcon,
  UserIcon,
  ClockIcon,
  ChevronRightIcon,
  RefreshIcon,
} from '@/components/Icons';
import {
  mockConversations,
  getStatusColor,
  getStatusLabel,
  getRelativeTime,
  ConversationStatus,
  Conversation,
} from '@/lib/data';

const statusFilters: { value: ConversationStatus | 'all'; label: string; count?: number }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'active', label: 'Ativas' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'resolved', label: 'Resolvidas' },
  { value: 'escalated', label: 'Escaladas' },
];

export default function ConversasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ConversationStatus | 'all'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredConversations = useMemo(() => {
    return mockConversations.filter((conv) => {
      const matchesSearch =
        searchTerm === '' ||
        conv.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.contact.phone.includes(searchTerm) ||
        conv.messages.some((m) => m.content.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || conv.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: mockConversations.length };
    mockConversations.forEach((conv) => {
      counts[conv.status] = (counts[conv.status] || 0) + 1;
    });
    return counts;
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getLastMessage = (conv: Conversation) => {
    const lastMsg = conv.messages[conv.messages.length - 1];
    return lastMsg ? lastMsg.content : '';
  };

  const hasUnread = (conv: Conversation) => {
    return conv.messages.some((m) => !m.read && m.sender === 'user');
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar />
      <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Conversas</h1>
                <p className="text-slate-500 mt-1">Gerencie suas conversas do WhatsApp</p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50"
              >
                <RefreshIcon className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Atualizar</span>
              </button>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6"
          >
            {/* Search Bar */}
            <div className="relative mb-4">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nome, telefone ou mensagem..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Status Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <FilterIcon className="w-5 h-5 text-slate-400 shrink-0" />
              <div className="flex gap-2">
                {statusFilters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setStatusFilter(filter.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      statusFilter === filter.value
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {filter.label}
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                        statusFilter === filter.value
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {statusCounts[filter.value] || 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Conversations List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
          >
            <AnimatePresence mode="popLayout">
              {filteredConversations.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-16 text-center"
                >
                  <ChatIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-600 mb-2">
                    Nenhuma conversa encontrada
                  </h3>
                  <p className="text-slate-400">
                    Tente ajustar os filtros ou a busca
                  </p>
                </motion.div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredConversations.map((conversation, index) => (
                    <motion.div
                      key={conversation.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      layout
                    >
                      <Link
                        href={`/conversas/${conversation.id}`}
                        className="block hover:bg-slate-50 transition-colors"
                      >
                        <div className="p-4 lg:p-5 flex items-start gap-4">
                          {/* Avatar */}
                          <div className="relative shrink-0">
                            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-semibold text-lg">
                              {conversation.contact.name.charAt(0)}
                            </div>
                            {hasUnread(conversation) && (
                              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="flex items-center gap-2 min-w-0">
                                <h3
                                  className={`font-semibold truncate ${
                                    hasUnread(conversation)
                                      ? 'text-slate-900'
                                      : 'text-slate-700'
                                  }`}
                                >
                                  {conversation.contact.name}
                                </h3>
                                {/* AI/Human Badge */}
                                <span
                                  className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                    conversation.aiHandled
                                      ? 'bg-indigo-100 text-indigo-700'
                                      : 'bg-emerald-100 text-emerald-700'
                                  }`}
                                >
                                  {conversation.aiHandled ? (
                                    <>
                                      <RobotIcon className="w-3 h-3" />
                                      <span className="hidden sm:inline">IA</span>
                                    </>
                                  ) : (
                                    <>
                                      <UserIcon className="w-3 h-3" />
                                      <span className="hidden sm:inline">Humano</span>
                                    </>
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                  <ClockIcon className="w-3.5 h-3.5" />
                                  {getRelativeTime(conversation.lastMessageAt)}
                                </span>
                              </div>
                            </div>

                            <p className="text-sm text-slate-500 mb-2">
                              {conversation.contact.phone}
                            </p>

                            <div className="flex items-center justify-between gap-2">
                              <p
                                className={`text-sm truncate ${
                                  hasUnread(conversation)
                                    ? 'text-slate-700 font-medium'
                                    : 'text-slate-500'
                                }`}
                              >
                                {getLastMessage(conversation)}
                              </p>
                              <div className="flex items-center gap-2 shrink-0">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                    conversation.status
                                  )}`}
                                >
                                  {getStatusLabel(conversation.status)}
                                </span>
                                <ChevronRightIcon className="w-5 h-5 text-slate-400 hidden sm:block" />
                              </div>
                            </div>

                            {/* Tags */}
                            {conversation.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {conversation.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {conversation.tags.length > 3 && (
                                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs">
                                    +{conversation.tags.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Results Count */}
          {filteredConversations.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-slate-500 mt-4 text-center"
            >
              Mostrando {filteredConversations.length} de {mockConversations.length} conversas
            </motion.p>
          )}
        </div>
      </main>
    </div>
  );
}
