'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import {
  FlowIcon,
  ChevronRightIcon,
  PlusIcon,
  XIcon,
  CheckIcon,
  TagIcon,
  LightningIcon,
  ClockIcon,
  CalendarIcon,
  ChatIcon,
  TrashIcon,
  ChevronDownIcon,
} from '@/components/Icons';
import { FlowTrigger, FlowStep } from '@/lib/data';

const triggerLabels: Record<FlowTrigger, string> = {
  keyword: 'Palavra-chave',
  intent: 'Intencao',
  time: 'Horario',
  event: 'Evento',
};

const triggerDescriptions: Record<FlowTrigger, string> = {
  keyword: 'Aciona quando o usuario digita uma palavra especifica',
  intent: 'Aciona quando uma intencao IA e detectada',
  time: 'Aciona em horarios especificos',
  event: 'Aciona em eventos do sistema',
};

const triggerIcons: Record<FlowTrigger, React.ComponentType<{ className?: string }>> = {
  keyword: TagIcon,
  intent: LightningIcon,
  time: ClockIcon,
  event: CalendarIcon,
};

const stepTypes = [
  { type: 'message' as const, label: 'Mensagem', icon: ChatIcon, color: 'bg-blue-500' },
  { type: 'delay' as const, label: 'Aguardar', icon: ClockIcon, color: 'bg-amber-500' },
  { type: 'condition' as const, label: 'Condicao', icon: FlowIcon, color: 'bg-purple-500' },
  { type: 'action' as const, label: 'Acao', icon: LightningIcon, color: 'bg-emerald-500' },
];

export default function NewFlowPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trigger: 'keyword' as FlowTrigger,
    triggerValue: '',
  });
  const [steps, setSteps] = useState<FlowStep[]>([]);
  const [showStepPicker, setShowStepPicker] = useState(false);
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addStep = (type: FlowStep['type']) => {
    const newStep: FlowStep = {
      id: `step-${Date.now()}`,
      type,
      content: type === 'delay' ? '3' : '',
    };
    setSteps([...steps, newStep]);
    setShowStepPicker(false);
    setEditingStepIndex(steps.length);
  };

  const updateStep = (index: number, content: string) => {
    setSteps(steps.map((step, i) => i === index ? { ...step, content } : step));
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
    if (editingStepIndex === index) {
      setEditingStepIndex(null);
    }
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= steps.length) return;
    const newSteps = [...steps];
    [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];
    setSteps(newSteps);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log({
      ...formData,
      steps,
    });

    router.push('/fluxos');
  };

  const TriggerIcon = triggerIcons[formData.trigger];
  const isFormValid = formData.name && formData.description && formData.triggerValue && steps.length >= 1;

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
            <Link href="/fluxos" className="hover:text-indigo-600 transition-colors">
              Fluxos
            </Link>
            <ChevronRightIcon className="w-4 h-4" />
            <span className="text-slate-800 font-medium">Novo Fluxo</span>
          </div>

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center">
              <FlowIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Novo Fluxo</h1>
              <p className="text-slate-500">Crie um novo fluxo de automacao</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Informacoes Basicas</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nome do Fluxo *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ex: Boas-vindas Novos Clientes"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tipo de Gatilho *
                  </label>
                  <select
                    value={formData.trigger}
                    onChange={(e) => setFormData({ ...formData, trigger: e.target.value as FlowTrigger, triggerValue: '' })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  >
                    {Object.entries(triggerLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Descricao *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva o que este fluxo faz..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                  required
                />
              </div>

              {/* Trigger Configuration */}
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <TriggerIcon className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{triggerLabels[formData.trigger]}</p>
                    <p className="text-xs text-slate-500">{triggerDescriptions[formData.trigger]}</p>
                  </div>
                </div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Valor do Gatilho *
                </label>
                {formData.trigger === 'keyword' && (
                  <input
                    type="text"
                    value={formData.triggerValue}
                    onChange={(e) => setFormData({ ...formData, triggerValue: e.target.value })}
                    placeholder="ex: #promocao, ajuda, suporte"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    required
                  />
                )}
                {formData.trigger === 'intent' && (
                  <select
                    value={formData.triggerValue}
                    onChange={(e) => setFormData({ ...formData, triggerValue: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    required
                  >
                    <option value="">Selecione uma intencao</option>
                    <option value="saudacao">saudacao</option>
                    <option value="rastrear_pedido">rastrear_pedido</option>
                    <option value="falar_humano">falar_humano</option>
                    <option value="reclamacao">reclamacao</option>
                    <option value="preco_plano">preco_plano</option>
                  </select>
                )}
                {formData.trigger === 'time' && (
                  <select
                    value={formData.triggerValue}
                    onChange={(e) => setFormData({ ...formData, triggerValue: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    required
                  >
                    <option value="">Selecione um horario</option>
                    <option value="after_hours">Fora do Horario Comercial</option>
                    <option value="business_hours">Durante Horario Comercial</option>
                    <option value="weekends">Fins de Semana</option>
                  </select>
                )}
                {formData.trigger === 'event' && (
                  <select
                    value={formData.triggerValue}
                    onChange={(e) => setFormData({ ...formData, triggerValue: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    required
                  >
                    <option value="">Selecione um evento</option>
                    <option value="first_contact">Primeiro Contato</option>
                    <option value="conversation_resolved">Conversa Resolvida</option>
                    <option value="conversation_escalated">Conversa Escalada</option>
                    <option value="inactivity">Inatividade do Usuario</option>
                  </select>
                )}
              </div>
            </div>

            {/* Steps Builder Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Passos do Fluxo</h2>
                  <p className="text-sm text-slate-500">Defina a sequencia de acoes do fluxo</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  steps.length >= 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {steps.length} passos
                </span>
              </div>

              {/* Steps List */}
              <div className="space-y-3 mb-4">
                <AnimatePresence>
                  {steps.map((step, index) => {
                    const stepConfig = stepTypes.find(s => s.type === step.type)!;
                    const StepIcon = stepConfig.icon;
                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="border border-slate-200 rounded-lg overflow-hidden"
                      >
                        <div className="flex items-center gap-3 p-3 bg-slate-50">
                          <div className={`w-8 h-8 rounded-lg ${stepConfig.color} flex items-center justify-center`}>
                            <StepIcon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <span className="font-medium text-slate-800">
                              {index + 1}. {stepConfig.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => moveStep(index, 'up')}
                              disabled={index === 0}
                              className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                            >
                              <ChevronDownIcon className="w-4 h-4 rotate-180" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveStep(index, 'down')}
                              disabled={index === steps.length - 1}
                              className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                            >
                              <ChevronDownIcon className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingStepIndex(editingStepIndex === index ? null : index)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600"
                            >
                              <ChevronRightIcon className={`w-4 h-4 transition-transform ${editingStepIndex === index ? 'rotate-90' : ''}`} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeStep(index)}
                              className="p-1.5 text-slate-400 hover:text-red-600"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <AnimatePresence>
                          {editingStepIndex === index && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-3 border-t border-slate-200">
                                {step.type === 'message' && (
                                  <textarea
                                    value={step.content}
                                    onChange={(e) => updateStep(index, e.target.value)}
                                    placeholder="Digite a mensagem..."
                                    rows={3}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none text-sm"
                                  />
                                )}
                                {step.type === 'delay' && (
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="number"
                                      value={step.content}
                                      onChange={(e) => updateStep(index, e.target.value)}
                                      min="1"
                                      max="60"
                                      className="w-24 px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                                    />
                                    <span className="text-sm text-slate-500">segundos</span>
                                  </div>
                                )}
                                {step.type === 'condition' && (
                                  <input
                                    type="text"
                                    value={step.content}
                                    onChange={(e) => updateStep(index, e.target.value)}
                                    placeholder="ex: usuario.tags.includes('VIP')"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                                  />
                                )}
                                {step.type === 'action' && (
                                  <select
                                    value={step.content}
                                    onChange={(e) => updateStep(index, e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                                  >
                                    <option value="">Selecione uma acao</option>
                                    <option value="assign_agent">Atribuir a Agente</option>
                                    <option value="add_tag">Adicionar Tag</option>
                                    <option value="send_notification">Enviar Notificacao</option>
                                    <option value="close_conversation">Encerrar Conversa</option>
                                  </select>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Add Step Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowStepPicker(!showStepPicker)}
                  className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                >
                  <PlusIcon className="w-5 h-5" />
                  Adicionar Passo
                </button>

                <AnimatePresence>
                  {showStepPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg p-2 z-10"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        {stepTypes.map(({ type, label, icon: Icon, color }) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => addStep(type)}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left"
                          >
                            <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-medium text-slate-700">{label}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {steps.length === 0 && (
                <div className="text-center py-6 text-slate-500 text-sm">
                  Adicione pelo menos um passo para criar o fluxo
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Link
                href="/fluxos"
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
                    Criar Fluxo
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
