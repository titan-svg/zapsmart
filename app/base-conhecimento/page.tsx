'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import {
  KnowledgeIcon,
  SearchIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  FilterIcon,
  TagIcon,
  TrendUpIcon,
} from '@/components/Icons';
import { mockKnowledgeBase, formatDate, KnowledgeItem } from '@/lib/data';

const categories = ['Todos', 'Pedidos', 'Pagamentos', 'Assinatura', 'Conta', 'Suporte'];

export default function KnowledgeBasePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [faqs, setFaqs] = useState<KnowledgeItem[]>(mockKnowledgeBase);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<KnowledgeItem | null>(null);

  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesSearch =
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'Todos' || faq.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [faqs, searchTerm, selectedCategory]);

  const handleDeleteClick = (faq: KnowledgeItem) => {
    setFaqToDelete(faq);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (faqToDelete) {
      setFaqs(prev => prev.filter(f => f.id !== faqToDelete.id));
      setDeleteModalOpen(false);
      setFaqToDelete(null);
    }
  };

  const totalUsage = faqs.reduce((sum, faq) => sum + faq.usageCount, 0);

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar />
      <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <KnowledgeIcon className="w-6 h-6 text-indigo-600" />
                </div>
                Base de Conhecimento
              </h1>
              <p className="text-slate-500 mt-1">Gerencie as perguntas frequentes e respostas do assistente</p>
            </div>
            <Link
              href="/base-conhecimento/nova"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <PlusIcon className="w-5 h-5" />
              Nova FAQ
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <KnowledgeIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total de FAQs</p>
                  <p className="text-2xl font-bold text-slate-800">{faqs.length}</p>
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
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <TrendUpIcon className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total de Usos</p>
                  <p className="text-2xl font-bold text-slate-800">{totalUsage.toLocaleString('pt-BR')}</p>
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
                <div className="p-2 bg-amber-100 rounded-lg">
                  <TagIcon className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Categorias</p>
                  <p className="text-2xl font-bold text-slate-800">{categories.length - 1}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por pergunta, resposta ou tag..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              <div className="flex items-center gap-2">
                <FilterIcon className="w-5 h-5 text-slate-400" />
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* FAQ Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 overflow-hidden group"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-semibold text-slate-800 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {faq.question}
                    </h3>
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full whitespace-nowrap">
                      {faq.category}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-4">{faq.answer}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {faq.tags.slice(0, 4).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                    {faq.tags.length > 4 && (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md">
                        +{faq.tags.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <TrendUpIcon className="w-4 h-4" />
                        {faq.usageCount} usos
                      </span>
                      <span>Atualizado: {formatDate(faq.updatedAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/base-conhecimento/${faq.id}`}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <EditIcon className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(faq)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <KnowledgeIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">Nenhuma FAQ encontrada</h3>
              <p className="text-slate-500 mb-4">Tente ajustar os filtros ou criar uma nova FAQ.</p>
              <Link
                href="/base-conhecimento/nova"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                Nova FAQ
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Confirmar exclusao</h3>
              <p className="text-slate-500 mb-6">
                Tem certeza que deseja excluir a FAQ &quot;{faqToDelete?.question}&quot;? Esta acao nao pode ser desfeita.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
