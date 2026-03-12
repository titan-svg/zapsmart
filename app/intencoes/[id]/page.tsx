'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  SendIcon,
  TrashIcon,
  RefreshIcon,
} from '@/components/Icons';
import { mockIntents, Intent, IntentCategory } from '@/lib/data';

const categoryLabels: Record<IntentCategory, string> = {
  greeting: 'Saudacao',
  faq: 'FAQ',
  support: 'Suporte',
  sales: 'Vendas',
  complaint: 'Reclamacao',
  other: 'Outros',
};

export default function IntentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [intent, setIntent] = useState<Intent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
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

  // Testing state
  const [testInput, setTestInput] = useState('');
  const [testResult, setTestResult] = useState<{
    detected: boolean;
    confidence: number;
    response: string;
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    const foundIntent = mockIntents.find(i => i.id === params.id);
    if (foundIntent) {
      setIntent(foundIntent);
      setFormData({
        name: foundIntent.name,
        description: foundIntent.description,
        category: foundIntent.category,
      });
      setTrainingPhrases(foundIntent.trainingPhrases);
      setResponses(foundIntent.responses);
    }
  }, [params.id]);

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

    // Update local state
    if (intent) {
      setIntent({
        ...intent,
        ...formData,
        trainingPhrases,
        responses,
      });
    }

    setIsSubmitting(false);
    setIsEditing(false);
  };

  const handleTest = async () => {
    if (!testInput.trim()) return;
    setIsTesting(true);

    // Simulate AI testing
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check if input matches any training phrase (simple similarity)
    const inputLower = testInput.toLowerCase();
    const matchFound = trainingPhrases.some(phrase =>
      inputLower.includes(phrase.toLowerCase()) ||
      phrase.toLowerCase().includes(inputLower)
    );

    const confidence = matchFound ? 0.85 + Math.random() * 0.12 : Math.random() * 0.3;

    setTestResult({
      detected: confidence > 0.7,
      confidence,
      response: confidence > 0.7
        ? responses[Math.floor(Math.random() * responses.length)] || 'Resposta nao definida'
        : 'Intencao nao detectada',
    });

    setIsTesting(false);
  };

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja excluir esta intencao? Esta acao nao pode ser desfeita.')) {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push('/intencoes');
    }
  };

  if (!intent) {
    return (
      <div className="min-h-screen bg-slate-50 lg:flex">
        <Sidebar />
        <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-6 flex items-center justify-center">
          <div className="text-center">
            <BrainIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Intencao nao encontrada</h2>
            <Link href="/intencoes" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Voltar para lista
            </Link>
          </div>
        </main>
      </div>
    );
  }

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
            <span className="text-slate-800 font-medium">{intent.name}</span>
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center">
                <BrainIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">{intent.name}</h1>
                <p className="text-slate-500">{intent.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          {!isEditing && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <p className="text-2xl font-bold text-slate-800">{trainingPhrases.length}</p>
                <p className="text-sm text-slate-500">Frases de Treinamento</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <p className="text-2xl font-bold text-slate-800">{responses.length}</p>
                <p className="text-sm text-slate-500">Respostas</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <p className="text-2xl font-bold text-emerald-600">{(intent.confidence * 100).toFixed(0)}%</p>
                <p className="text-sm text-slate-500">Confianca</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <p className="text-2xl font-bold text-indigo-600">{intent.usageCount}</p>
                <p className="text-sm text-slate-500">Usos Totais</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Informacoes Basicas</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nome da Intencao
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2.5 rounded-lg border border-slate-200 outline-none transition-all ${
                      isEditing
                        ? 'focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                        : 'bg-slate-50 text-slate-600'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Categoria
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as IntentCategory })}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2.5 rounded-lg border border-slate-200 outline-none transition-all ${
                      isEditing
                        ? 'focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                        : 'bg-slate-50 text-slate-600'
                    }`}
                  >
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Descricao
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                  className={`w-full px-4 py-2.5 rounded-lg border border-slate-200 outline-none transition-all resize-none ${
                    isEditing
                      ? 'focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                      : 'bg-slate-50 text-slate-600'
                  }`}
                />
              </div>
            </div>

            {/* Training Phrases Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Frases de Treinamento</h2>
                  <p className="text-sm text-slate-500">Frases que os usuarios podem usar para acionar esta intencao</p>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
                  {trainingPhrases.length} frases
                </span>
              </div>

              {isEditing && (
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
              )}

              <div className="flex flex-wrap gap-2">
                {trainingPhrases.map((phrase, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm"
                  >
                    {phrase}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeTrainingPhrase(index)}
                        className="text-indigo-400 hover:text-indigo-600 transition-colors"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Responses Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Respostas da IA</h2>
                  <p className="text-sm text-slate-500">Respostas que a IA pode usar quando detectar esta intencao</p>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700">
                  {responses.length} respostas
                </span>
              </div>

              {isEditing && (
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
              )}

              <div className="space-y-2">
                {responses.map((response, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <p className="flex-1 text-sm text-slate-700">{response}</p>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeResponse(index)}
                        className="text-slate-400 hover:text-red-500 transition-colors shrink-0"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Test Section */}
            {!isEditing && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center">
                    <LightningIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800">Testar Intencao</h2>
                    <p className="text-sm text-slate-500">Digite uma mensagem para testar a deteccao</p>
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    placeholder="Digite uma mensagem de teste..."
                    className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleTest();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleTest}
                    disabled={isTesting || !testInput.trim()}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isTesting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <SendIcon className="w-5 h-5" />
                    )}
                    Testar
                  </button>
                </div>

                {testResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg ${
                      testResult.detected
                        ? 'bg-emerald-50 border border-emerald-200'
                        : 'bg-amber-50 border border-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${
                        testResult.detected ? 'text-emerald-700' : 'text-amber-700'
                      }`}>
                        {testResult.detected ? 'Intencao Detectada!' : 'Intencao Nao Detectada'}
                      </span>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        testResult.confidence >= 0.8 ? 'bg-emerald-100 text-emerald-700' :
                        testResult.confidence >= 0.5 ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {(testResult.confidence * 100).toFixed(0)}% confianca
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm">
                      <strong>Resposta:</strong> {testResult.response}
                    </p>
                    <button
                      type="button"
                      onClick={() => setTestResult(null)}
                      className="mt-2 text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
                    >
                      <RefreshIcon className="w-4 h-4" />
                      Testar novamente
                    </button>
                  </motion.div>
                )}
              </div>
            )}

            {/* Save Button (when editing) */}
            {isEditing && (
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
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
                      Salvando...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="w-5 h-5" />
                      Salvar Alteracoes
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </motion.div>
      </main>
    </div>
  );
}
