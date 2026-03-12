'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import {
  CategoryIcon,
  KnowledgeIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  XIcon,
  CheckIcon,
  ChevronRightIcon,
} from '@/components/Icons';
import { mockKnowledgeBase } from '@/lib/data';

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

const initialCategories: Category[] = [
  { id: '1', name: 'Pedidos', description: 'Perguntas sobre rastreamento, entrega e status de pedidos', color: 'bg-blue-500' },
  { id: '2', name: 'Pagamentos', description: 'Formas de pagamento, parcelamento e faturamento', color: 'bg-emerald-500' },
  { id: '3', name: 'Assinatura', description: 'Planos, renovacao e cancelamento de assinaturas', color: 'bg-purple-500' },
  { id: '4', name: 'Conta', description: 'Cadastro, perfil e configuracoes da conta', color: 'bg-amber-500' },
  { id: '5', name: 'Suporte', description: 'Problemas tecnicos e atendimento ao cliente', color: 'bg-red-500' },
  { id: '6', name: 'Geral', description: 'Outras perguntas e informacoes gerais', color: 'bg-slate-500' },
];

const colorOptions = [
  { name: 'Azul', value: 'bg-blue-500' },
  { name: 'Verde', value: 'bg-emerald-500' },
  { name: 'Roxo', value: 'bg-purple-500' },
  { name: 'Amarelo', value: 'bg-amber-500' },
  { name: 'Vermelho', value: 'bg-red-500' },
  { name: 'Indigo', value: 'bg-indigo-500' },
  { name: 'Rosa', value: 'bg-pink-500' },
  { name: 'Cinza', value: 'bg-slate-500' },
];

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'bg-indigo-500',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Count FAQs per category
  const faqCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    mockKnowledgeBase.forEach(faq => {
      counts[faq.category] = (counts[faq.category] || 0) + 1;
    });
    return counts;
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', color: 'bg-indigo-500' });
    setErrors({});
    setModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color,
    });
    setErrors({});
    setModalOpen(true);
  };

  const openDeleteModal = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'O nome e obrigatorio';
    } else if (!editingCategory && categories.some(c => c.name.toLowerCase() === formData.name.toLowerCase())) {
      newErrors.name = 'Ja existe uma categoria com este nome';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'A descricao e obrigatoria';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingCategory) {
      // Update existing category
      setCategories(prev =>
        prev.map(c =>
          c.id === editingCategory.id
            ? { ...c, ...formData }
            : c
        )
      );
    } else {
      // Create new category
      const newCategory: Category = {
        id: Date.now().toString(),
        ...formData,
      };
      setCategories(prev => [...prev, newCategory]);
    }

    setModalOpen(false);
    setEditingCategory(null);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      setCategories(prev => prev.filter(c => c.id !== categoryToDelete.id));
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  const totalFaqs = Object.values(faqCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar />
      <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/base-conhecimento" className="hover:text-indigo-600 transition-colors">
              Base de Conhecimento
            </Link>
            <ChevronRightIcon className="w-4 h-4" />
            <span className="text-slate-800 font-medium">Categorias</span>
          </nav>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <CategoryIcon className="w-6 h-6 text-indigo-600" />
                </div>
                Categorias
              </h1>
              <p className="text-slate-500 mt-1">Organize as FAQs em categorias para facilitar a busca</p>
            </div>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <PlusIcon className="w-5 h-5" />
              Nova Categoria
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <CategoryIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total de Categorias</p>
                  <p className="text-2xl font-bold text-slate-800">{categories.length}</p>
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
                  <KnowledgeIcon className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total de FAQs</p>
                  <p className="text-2xl font-bold text-slate-800">{totalFaqs}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => {
              const faqCount = faqCounts[category.name] || 0;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 overflow-hidden group"
                >
                  <div className={`h-2 ${category.color}`} />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${category.color} bg-opacity-20 flex items-center justify-center`}>
                          <div className={`w-4 h-4 rounded-full ${category.color}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-sm text-slate-500">{faqCount} FAQs</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{category.description}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <Link
                        href={`/base-conhecimento?categoria=${encodeURIComponent(category.name)}`}
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        Ver FAQs
                      </Link>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(category)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(category)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir"
                          disabled={faqCount > 0}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {categories.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <CategoryIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">Nenhuma categoria encontrada</h3>
              <p className="text-slate-500 mb-4">Crie categorias para organizar suas FAQs.</p>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                Nova Categoria
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Create/Edit Modal */}
        <AnimatePresence>
          {modalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800">
                    {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                  </h3>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Nome <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={e => {
                        setFormData(prev => ({ ...prev, name: e.target.value }));
                        if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                      }}
                      placeholder="Ex: Pagamentos"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                        errors.name ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Descricao <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={e => {
                        setFormData(prev => ({ ...prev, description: e.target.value }));
                        if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
                      }}
                      rows={3}
                      placeholder="Descreva o tipo de perguntas desta categoria..."
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none ${
                        errors.description ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                    )}
                  </div>

                  {/* Color */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Cor
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map(color => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                          className={`w-8 h-8 rounded-lg ${color.value} transition-transform hover:scale-110 ${
                            formData.color === color.value ? 'ring-2 ring-offset-2 ring-indigo-500' : ''
                          }`}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-500 mb-2">Pre-visualizacao</p>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${formData.color} bg-opacity-20 flex items-center justify-center`}>
                        <div className={`w-3 h-3 rounded-full ${formData.color}`} />
                      </div>
                      <span className="font-medium text-slate-800">
                        {formData.name || 'Nome da categoria'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                      <CheckIcon className="w-4 h-4" />
                      {editingCategory ? 'Salvar' : 'Criar'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteModalOpen && categoryToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
              >
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Confirmar exclusao</h3>
                {(faqCounts[categoryToDelete.name] || 0) > 0 ? (
                  <>
                    <p className="text-slate-500 mb-6">
                      Esta categoria possui <strong>{faqCounts[categoryToDelete.name]} FAQs</strong> associadas.
                      Remova ou mova as FAQs para outra categoria antes de excluir.
                    </p>
                    <div className="flex justify-end">
                      <button
                        onClick={() => setDeleteModalOpen(false)}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        Entendido
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-slate-500 mb-6">
                      Tem certeza que deseja excluir a categoria &quot;{categoryToDelete.name}&quot;?
                      Esta acao nao pode ser desfeita.
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
                  </>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
