'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import {
  KnowledgeIcon,
  EditIcon,
  TrashIcon,
  XIcon,
  ChevronRightIcon,
  TrendUpIcon,
  ClockIcon,
  CalendarIcon,
  CheckIcon,
} from '@/components/Icons';
import { mockKnowledgeBase, formatDate, formatDateTime, KnowledgeItem } from '@/lib/data';

const categories = ['Pedidos', 'Pagamentos', 'Assinatura', 'Conta', 'Suporte', 'Geral'];

export default function FAQDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [faq, setFaq] = useState<KnowledgeItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const foundFaq = mockKnowledgeBase.find(item => item.id === resolvedParams.id);
    if (foundFaq) {
      setFaq(foundFaq);
      setFormData({
        question: foundFaq.question,
        answer: foundFaq.answer,
        category: foundFaq.category,
        tags: [...foundFaq.tags],
      });
    }
  }, [resolvedParams.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.question.trim()) {
      newErrors.question = 'A pergunta e obrigatoria';
    }
    if (!formData.answer.trim()) {
      newErrors.answer = 'A resposta e obrigatoria';
    }
    if (!formData.category) {
      newErrors.category = 'Selecione uma categoria';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update local state
    if (faq) {
      const updatedFaq = {
        ...faq,
        ...formData,
        updatedAt: new Date().toISOString(),
      };
      setFaq(updatedFaq);
    }

    setIsEditing(false);
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    router.push('/base-conhecimento');
  };

  const cancelEdit = () => {
    if (faq) {
      setFormData({
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        tags: [...faq.tags],
      });
    }
    setIsEditing(false);
    setErrors({});
  };

  if (!faq) {
    return (
      <div className="min-h-screen bg-slate-50 lg:flex">
        <Sidebar />
        <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-6 flex items-center justify-center">
          <div className="text-center">
            <KnowledgeIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-slate-600 mb-2">FAQ nao encontrada</h2>
            <Link
              href="/base-conhecimento"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Voltar para Base de Conhecimento
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar />
      <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/base-conhecimento" className="hover:text-indigo-600 transition-colors">
              Base de Conhecimento
            </Link>
            <ChevronRightIcon className="w-4 h-4" />
            <span className="text-slate-800 font-medium line-clamp-1">{faq.question}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* FAQ Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <KnowledgeIcon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h1 className="font-semibold text-slate-800">
                      {isEditing ? 'Editar FAQ' : 'Detalhes da FAQ'}
                    </h1>
                  </div>
                  {!isEditing && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <EditIcon className="w-4 h-4" />
                        Editar
                      </button>
                      <button
                        onClick={() => setDeleteModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                        Excluir
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Question */}
                      <div>
                        <label htmlFor="question" className="block text-sm font-medium text-slate-700 mb-1.5">
                          Pergunta <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="question"
                          name="question"
                          value={formData.question}
                          onChange={handleChange}
                          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                            errors.question ? 'border-red-500' : 'border-slate-300'
                          }`}
                        />
                        {errors.question && (
                          <p className="mt-1 text-sm text-red-500">{errors.question}</p>
                        )}
                      </div>

                      {/* Answer */}
                      <div>
                        <label htmlFor="answer" className="block text-sm font-medium text-slate-700 mb-1.5">
                          Resposta <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="answer"
                          name="answer"
                          value={formData.answer}
                          onChange={handleChange}
                          rows={5}
                          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none ${
                            errors.answer ? 'border-red-500' : 'border-slate-300'
                          }`}
                        />
                        {errors.answer && (
                          <p className="mt-1 text-sm text-red-500">{errors.answer}</p>
                        )}
                      </div>

                      {/* Category */}
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1.5">
                          Categoria <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-colors ${
                            errors.category ? 'border-red-500' : 'border-slate-300'
                          }`}
                        >
                          <option value="">Selecione uma categoria</option>
                          {categories.map(category => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                        {errors.category && (
                          <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                        )}
                      </div>

                      {/* Tags */}
                      <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-slate-700 mb-1.5">
                          Tags
                        </label>
                        <div className="flex flex-wrap gap-2 p-3 border border-slate-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-colors">
                          {formData.tags.map(tag => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-md"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="p-0.5 hover:bg-indigo-200 rounded-full transition-colors"
                              >
                                <XIcon className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                          <input
                            type="text"
                            id="tags"
                            value={tagInput}
                            onChange={e => setTagInput(e.target.value)}
                            onKeyDown={handleAddTag}
                            placeholder={formData.tags.length === 0 ? 'Digite e pressione Enter...' : ''}
                            className="flex-1 min-w-[150px] outline-none text-sm"
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Salvando...
                            </>
                          ) : (
                            <>
                              <CheckIcon className="w-4 h-4" />
                              Salvar Alteracoes
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div>
                      <span className="inline-block px-2.5 py-1 bg-indigo-100 text-indigo-600 text-xs font-medium rounded-full mb-3">
                        {faq.category}
                      </span>
                      <h2 className="text-xl font-semibold text-slate-800 mb-4">{faq.question}</h2>
                      <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">{faq.answer}</p>

                      {faq.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-200">
                          {faq.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2.5 py-1 bg-slate-100 text-slate-600 text-sm rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Sidebar - Statistics */}
            <div className="space-y-6">
              {/* Usage Statistics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-5"
              >
                <h3 className="font-semibold text-slate-800 mb-4">Estatisticas de Uso</h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <TrendUpIcon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-emerald-600">{faq.usageCount}</p>
                      <p className="text-xs text-slate-500">Vezes utilizada</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="p-2 bg-slate-200 rounded-lg">
                      <ClockIcon className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {faq.lastUsed ? formatDateTime(faq.lastUsed) : 'Nunca utilizada'}
                      </p>
                      <p className="text-xs text-slate-500">Ultimo uso</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Dates */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-5"
              >
                <h3 className="font-semibold text-slate-800 mb-4">Informacoes</h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Criada em</p>
                      <p className="text-sm font-medium text-slate-800">{formatDate(faq.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <EditIcon className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Ultima atualizacao</p>
                      <p className="text-sm font-medium text-slate-800">{formatDate(faq.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Usage Chart Placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-5"
              >
                <h3 className="font-semibold text-slate-800 mb-4">Uso nos Ultimos 7 Dias</h3>
                <div className="flex items-end gap-1 h-24">
                  {[35, 48, 22, 56, 41, 68, 52].map((value, index) => (
                    <div
                      key={index}
                      className="flex-1 bg-indigo-100 hover:bg-indigo-200 transition-colors rounded-t"
                      style={{ height: `${value}%` }}
                      title={`${Math.round(value * faq.usageCount / 100 / 7)} usos`}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-500">
                  <span>Seg</span>
                  <span>Ter</span>
                  <span>Qua</span>
                  <span>Qui</span>
                  <span>Sex</span>
                  <span>Sab</span>
                  <span>Dom</span>
                </div>
              </motion.div>
            </div>
          </div>
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
                Tem certeza que deseja excluir esta FAQ? Esta acao nao pode ser desfeita.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
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
