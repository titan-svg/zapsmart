'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import {
  ContactsIcon,
  SearchIcon,
  FilterIcon,
  PhoneIcon,
  TagIcon,
  StarIcon,
  ExportIcon,
  ChevronRightIcon,
  ChatIcon,
  ClockIcon,
} from '@/components/Icons';
import { useAuth } from '@/context/AuthContext';
import { mockContacts, Contact, formatDate, getRelativeTime } from '@/lib/data';

type ViewMode = 'table' | 'cards';

const allTags = ['VIP', 'Recorrente', 'Novo', 'Suporte', 'Vendas', 'B2B', 'Reclamacao'];

const avatarGradients = [
  'from-indigo-500 to-purple-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-pink-500 to-rose-500',
  'from-blue-500 to-cyan-500',
  'from-violet-500 to-fuchsia-500',
];

function getAvatarGradient(name: string): string {
  const index = name.charCodeAt(0) % avatarGradients.length;
  return avatarGradients[index];
}

function renderStars(satisfaction: number | undefined) {
  if (!satisfaction) return <span className="text-slate-400 text-sm">-</span>;
  const fullStars = Math.floor(satisfaction);
  const hasHalf = satisfaction % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <StarIcon key={`full-${i}`} className="w-4 h-4 text-amber-400 fill-amber-400" />
      ))}
      {hasHalf && (
        <div className="relative w-4 h-4">
          <StarIcon className="absolute w-4 h-4 text-slate-200 fill-slate-200" />
          <div className="absolute overflow-hidden w-2 h-4">
            <StarIcon className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <StarIcon key={`empty-${i}`} className="w-4 h-4 text-slate-200 fill-slate-200" />
      ))}
      <span className="ml-1 text-sm text-slate-600 font-medium">{satisfaction.toFixed(1)}</span>
    </div>
  );
}

export default function ContatosPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) return null;

  const filteredContacts = mockContacts.filter(contact => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery);

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some(tag => contact.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleExport = () => {
    const headers = ['Nome', 'Telefone', 'Email', 'Tags', 'Ultimo Contato', 'Total Conversas', 'Satisfacao'];
    const csvContent = [
      headers.join(','),
      ...filteredContacts.map(contact =>
        [
          contact.name,
          contact.phone,
          contact.email || '',
          contact.tags.join(';'),
          formatDate(contact.lastContact),
          contact.totalConversations,
          contact.satisfaction?.toFixed(1) || '',
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `contatos_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar />

      <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Contatos</h1>
            <p className="text-slate-500 mt-1">
              {filteredContacts.length} de {mockContacts.length} contatos
            </p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
          >
            <ExportIcon className="w-5 h-5" />
            Exportar CSV
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou telefone..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors ${
                showFilters || selectedTags.length > 0
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FilterIcon className="w-5 h-5" />
              <span className="font-medium">Filtros</span>
              {selectedTags.length > 0 && (
                <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {selectedTags.length}
                </span>
              )}
            </button>

            {/* View Toggle */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                title="Vista de cartoes"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                title="Vista de tabela"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tag Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <p className="text-sm font-medium text-slate-700 mb-3">Filtrar por tags</p>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                    {selectedTags.length > 0 && (
                      <button
                        onClick={() => setSelectedTags([])}
                        className="px-4 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Limpar filtros
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Contacts List */}
        {filteredContacts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <ContactsIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Nenhum contato encontrado</h3>
            <p className="text-slate-500">
              {searchQuery || selectedTags.length > 0
                ? 'Tente ajustar os filtros de busca'
                : 'Nenhum contato cadastrado ainda'}
            </p>
          </div>
        ) : viewMode === 'cards' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredContacts.map((contact, index) => (
                <motion.div
                  key={contact.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/contatos/${contact.id}`}>
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-indigo-200 transition-all cursor-pointer group">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarGradient(contact.name)} flex items-center justify-center`}>
                          <span className="text-white font-semibold text-lg">
                            {contact.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                            {contact.name}
                          </h3>
                          <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                            <PhoneIcon className="w-3 h-3" />
                            {contact.phone}
                          </p>
                        </div>
                        <ChevronRightIcon className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Ultimo contato</p>
                          <p className="text-sm font-medium text-slate-700 flex items-center gap-1">
                            <ClockIcon className="w-3 h-3 text-slate-400" />
                            {getRelativeTime(contact.lastContact)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Conversas</p>
                          <p className="text-sm font-medium text-slate-700 flex items-center gap-1">
                            <ChatIcon className="w-3 h-3 text-slate-400" />
                            {contact.totalConversations}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {contact.tags.slice(0, 2).map(tag => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-full font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                            {contact.tags.length > 2 && (
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full">
                                +{contact.tags.length - 2}
                              </span>
                            )}
                          </div>
                          {renderStars(contact.satisfaction)}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Telefone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Ultimo Contato
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Conversas
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Satisfacao
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Tags
                    </th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredContacts.map((contact, index) => (
                    <motion.tr
                      key={contact.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/contatos/${contact.id}`)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarGradient(contact.name)} flex items-center justify-center`}>
                            <span className="text-white font-semibold">
                              {contact.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{contact.name}</p>
                            {contact.email && (
                              <p className="text-sm text-slate-500">{contact.email}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-900">{contact.phone}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-slate-900">{formatDate(contact.lastContact)}</p>
                          <p className="text-sm text-slate-500">{getRelativeTime(contact.lastContact)}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-slate-900">
                          <ChatIcon className="w-4 h-4 text-slate-400" />
                          {contact.totalConversations}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {renderStars(contact.satisfaction)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {contact.tags.slice(0, 2).map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-full font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                          {contact.tags.length > 2 && (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full">
                              +{contact.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <ChevronRightIcon className="w-5 h-5 text-slate-300" />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
