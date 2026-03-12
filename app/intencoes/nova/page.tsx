'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import {
  BrainIcon,
  ChevronRightIcon,
  PlusIcon,
  XIcon,
  CheckIcon,
  LightningIcon,
} from '@/components/Icons';
import { IntentCategory } from '@/lib/data';

const categoryLabels: Record<IntentCategory, string> = {
  greeting: 'Saudacao',
  faq: 'FAQ',
  support: 'Suporte',
  sales: 'Vendas',
  complaint: 'Reclamacao',
  other: 'Outros',
};

export default function NewIntentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'faq' as IntentCategory,
  });
  const [trainingPhrases, setTrainingPhrases] = useState<string[]>([]);
  const [newPhrase, setNewPhrase] = useState('');
  const [responses, setResponses] = useState<string[]>([]);
  const [newResponse, setNewResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addTrainingPhrase = () => {
    if (newPhrase.trim() && !trainingPhrases.includes(newPhrase.trim())) {
      setTrainingPhrases([...trainingPhrases, newPhrase.trim()]);
      setNewPhrase('');
    }
  };

  const removeTrainingPhrase = (index: number) => {
    setTrainingPhrases(trainingPhrases.filter((_, i) => i !== index));
  };

  const addResponse = () => {
    if (newResponse.trim() && !responses.includes(newResponse.trim())) {
      setResponses([...responses, newResponse.trim()]);
      setNewResponse('');
    }
  };

  const removeResponse = (index: number) => {
    setResponses(responses.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real app, you would send the data to the API
    console.log({
      ...formData,
      trainingPhrases,
      responses,
    });

    router.push('/intencoes');
  };

  const isFormValid = formData.name && formData.description && trainingPhrases.length >= 3 && responses.length >= 1;

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar />
      <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/intencoes" className="hover:text-indigo-600 transition-colors">
              Intencoes
            </Link>
            <ChevronRightIcon className="w-4 h-4" />
            <span className="text-slate-800 font-medium">Nova Intencao</span>
          </div>

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center">
              <BrainIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Nova Intencao</h1>
              <p className="text-slate-500">Crie uma nova intencao para treinar a IA</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Informacoes Basicas</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nome da Intencao *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ex: rastrear_pedido"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">Use snake_case sem espacos ou acentos</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Categoria *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as IntentCategory })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  >
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Descricao *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva quando esta intencao deve ser detectada..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                  required
                />
              </div>
            </div>

            {/* Training Phrases Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Frases de Treinamento</h2>
                  <p className="text-sm text-slate-500">Adicione pelo menos 3 frases que os usuarios podem usar</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  trainingPhrases.length >= 3 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {trainingPhrases.length} frases
                </span>
              </div>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newPhrase}
                  onChange={(e) => setNewPhrase(e.target.value)}
                  placeholder="Digite uma frase de exemplo..."
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTrainingPhrase();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addTrainingPhrase}
                  className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>

              {trainingPhrases.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {trainingPhrases.map((phrase, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm"
                    >
                      {phrase}
                      <button
                        type="button"
                        onClick={() => removeTrainingPhrase(index)}
                        className="text-indigo-400 hover:text-indigo-600 transition-colors"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </motion.span>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                  <LightningIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">Adicione frases de exemplo para treinar a IA</p>
                </div>
              )}
            </div>

            {/* Responses Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Respostas da IA</h2>
                  <p className="text-sm text-slate-500">Defina as respostas que a IA deve dar quando detectar esta intencao</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  responses.length >= 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {responses.length} respostas
                </span>
              </div>

              <div className="flex gap-2 mb-4">
                <textarea
                  value={newResponse}
                  onChange={(e) => setNewResponse(e.target.value)}
                  placeholder="Digite uma resposta da IA..."
                  rows={2}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                />
                <button
                  type="button"
                  onClick={addResponse}
                  className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors self-end"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>

              {responses.length > 0 ? (
                <div className="space-y-2">
                  {responses.map((response, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <p className="flex-1 text-sm text-slate-700">{response}</p>
                      <button
                        type="button"
                        onClick={() => removeResponse(index)}
                        className="text-slate-400 hover:text-red-500 transition-colors shrink-0"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                  <BrainIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">Adicione respostas que a IA deve usar</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Link
                href="/intencoes"
                className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors text-center"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                  isFormValid && !isSubmitting
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-5 h-5" />
                    Criar Intencao
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
