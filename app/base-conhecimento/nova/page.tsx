'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import {
  KnowledgeIcon,
  PlusIcon,
  XIcon,
  ChevronRightIcon,
} from '@/components/Icons';

const categories = ['Pedidos', 'Pagamentos', 'Assinatura', 'Conta', 'Suporte', 'Geral'];

export default function NovaFAQPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    // In a real app, you would save to backend here
    console.log('FAQ criada:', formData);

    router.push('/base-conhecimento');
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar />
      <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/base-conhecimento" className="hover:text-indigo-600 transition-colors">
              Base de Conhecimento
            </Link>
            <ChevronRightIcon className="w-4 h-4" />
            <span className="text-slate-800 font-medium">Nova FAQ</span>
          </nav>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <KnowledgeIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Nova FAQ</h1>
              <p className="text-slate-500">Adicione uma nova pergunta frequente a base de conhecimento</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Informacoes da FAQ</h2>

              {/* Question */}
              <div className="mb-5">
                <label htmlFor="question" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Pergunta <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="question"
                  name="question"
                  value={formData.question}
                  onChange={handleChange}
                  placeholder="Ex: Como rastrear meu pedido?"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                    errors.question ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {errors.question && (
                  <p className="mt-1 text-sm text-red-500">{errors.question}</p>
                )}
              </div>

              {/* Answer */}
              <div className="mb-5">
                <label htmlFor="answer" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Resposta <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="answer"
                  name="answer"
                  value={formData.answer}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Escreva a resposta detalhada para a pergunta..."
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none ${
                    errors.answer ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {errors.answer && (
                  <p className="mt-1 text-sm text-red-500">{errors.answer}</p>
                )}
                <p className="mt-1 text-xs text-slate-500">
                  Dica: Escreva respostas claras e objetivas que o assistente de IA possa usar.
                </p>
              </div>

              {/* Category */}
              <div className="mb-5">
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
                <p className="mt-1 text-xs text-slate-500">
                  Pressione Enter ou virgula para adicionar uma tag
                </p>
              </div>
            </motion.div>

            {/* Preview */}
            {(formData.question || formData.answer) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
              >
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Pre-visualizacao</h2>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  {formData.category && (
                    <span className="inline-block px-2.5 py-1 bg-indigo-100 text-indigo-600 text-xs font-medium rounded-full mb-2">
                      {formData.category}
                    </span>
                  )}
                  <h3 className="font-semibold text-slate-800 mb-2">
                    {formData.question || 'Sua pergunta aparecera aqui...'}
                  </h3>
                  <p className="text-slate-600 text-sm whitespace-pre-wrap">
                    {formData.answer || 'Sua resposta aparecera aqui...'}
                  </p>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-200">
                      {formData.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-slate-200 text-slate-600 text-xs rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <Link
                href="/base-conhecimento"
                className="px-6 py-2.5 text-slate-600 bg-white border border-slate-300 rounded-lg font-medium hover:bg-slate-50 transition-colors text-center"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <PlusIcon className="w-5 h-5" />
                    Criar FAQ
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
