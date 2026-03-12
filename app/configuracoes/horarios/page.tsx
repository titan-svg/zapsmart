'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import {
  ClockIcon,
  ChevronRightIcon,
  CheckIcon,
} from '@/components/Icons';

interface DaySchedule {
  day: string;
  enabled: boolean;
  start: string;
  end: string;
}

export default function HorariosConfigPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);
  const [autoReplyMessage, setAutoReplyMessage] = useState(
    'Ola! Nosso horario de atendimento e de segunda a sexta, das 9h as 18h. Deixe sua mensagem que responderemos assim que possivel.'
  );

  const [schedule, setSchedule] = useState<DaySchedule[]>([
    { day: 'Segunda-feira', enabled: true, start: '09:00', end: '18:00' },
    { day: 'Terca-feira', enabled: true, start: '09:00', end: '18:00' },
    { day: 'Quarta-feira', enabled: true, start: '09:00', end: '18:00' },
    { day: 'Quinta-feira', enabled: true, start: '09:00', end: '18:00' },
    { day: 'Sexta-feira', enabled: true, start: '09:00', end: '18:00' },
    { day: 'Sabado', enabled: false, start: '09:00', end: '13:00' },
    { day: 'Domingo', enabled: false, start: '00:00', end: '00:00' },
  ]);

  const [timezone, setTimezone] = useState('America/Sao_Paulo');

  const toggleDay = (index: number) => {
    setSchedule(prev =>
      prev.map((d, i) => i === index ? { ...d, enabled: !d.enabled } : d)
    );
  };

  const updateTime = (index: number, field: 'start' | 'end', value: string) => {
    setSchedule(prev =>
      prev.map((d, i) => i === index ? { ...d, [field]: value } : d)
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
  };

  const copyToAll = (index: number) => {
    const source = schedule[index];
    setSchedule(prev =>
      prev.map(d => ({ ...d, start: source.start, end: source.end }))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar />
      <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-6">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-slate-500 mb-6"
          >
            <Link href="/configuracoes" className="hover:text-indigo-600 transition-colors">
              Configuracoes
            </Link>
            <ChevronRightIcon className="w-4 h-4" />
            <span className="text-slate-800">Horarios</span>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <ClockIcon className="w-7 h-7 text-indigo-600" />
              Horarios de Atendimento
            </h1>
            <p className="text-slate-500 mt-1">Configure os horarios de funcionamento e respostas automaticas</p>
          </motion.div>

          {/* Timezone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-slate-200 p-6 mb-6"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Fuso Horario</h2>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full md:w-80 px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
            >
              <option value="America/Sao_Paulo">Brasilia (GMT-3)</option>
              <option value="America/Manaus">Manaus (GMT-4)</option>
              <option value="America/Fortaleza">Fernando de Noronha (GMT-2)</option>
              <option value="America/Rio_Branco">Acre (GMT-5)</option>
            </select>
            <p className="text-sm text-slate-500 mt-2">
              Os horarios serao exibidos de acordo com este fuso horario
            </p>
          </motion.div>

          {/* Weekly Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-slate-200 p-6 mb-6"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Horario Semanal</h2>
            <div className="space-y-4">
              {schedule.map((day, index) => (
                <div
                  key={day.day}
                  className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border transition-colors ${
                    day.enabled ? 'border-indigo-200 bg-indigo-50/50' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:w-40">
                    <button
                      onClick={() => toggleDay(index)}
                      className={`relative w-10 h-5 rounded-full transition-colors ${
                        day.enabled ? 'bg-indigo-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          day.enabled ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                    <span className={`font-medium ${day.enabled ? 'text-slate-800' : 'text-slate-400'}`}>
                      {day.day}
                    </span>
                  </div>
                  {day.enabled && (
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={day.start}
                          onChange={(e) => updateTime(index, 'start', e.target.value)}
                          className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                        />
                        <span className="text-slate-400">ate</span>
                        <input
                          type="time"
                          value={day.end}
                          onChange={(e) => updateTime(index, 'end', e.target.value)}
                          className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                        />
                      </div>
                      <button
                        onClick={() => copyToAll(index)}
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium whitespace-nowrap"
                      >
                        Copiar para todos
                      </button>
                    </div>
                  )}
                  {!day.enabled && (
                    <span className="text-sm text-slate-400">Fechado</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Auto Reply Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-slate-200 p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Resposta Automatica</h2>
                <p className="text-sm text-slate-500">Mensagem enviada fora do horario de atendimento</p>
              </div>
              <button
                onClick={() => setAutoReplyEnabled(!autoReplyEnabled)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  autoReplyEnabled ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    autoReplyEnabled ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            {autoReplyEnabled && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Mensagem de Resposta Automatica
                  </label>
                  <textarea
                    value={autoReplyMessage}
                    onChange={(e) => setAutoReplyMessage(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                    placeholder="Digite a mensagem que sera enviada automaticamente..."
                  />
                  <p className="text-sm text-slate-500 mt-2">
                    Variaveis disponiveis: {'{nome}'}, {'{empresa}'}, {'{horario_abertura}'}
                  </p>
                </div>

                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                  <h4 className="font-medium text-indigo-800 mb-2">Pre-visualizacao</h4>
                  <div className="bg-white rounded-lg p-3 border border-indigo-200">
                    <p className="text-sm text-slate-700">{autoReplyMessage}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Additional Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl border border-slate-200 p-6 mb-6"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Configuracoes Adicionais</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div>
                  <p className="font-medium text-slate-800">IA ativa 24/7</p>
                  <p className="text-sm text-slate-500">Permitir que a IA responda fora do horario comercial</p>
                </div>
                <button className="relative w-12 h-6 rounded-full bg-indigo-600 transition-colors">
                  <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow translate-x-6" />
                </button>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div>
                  <p className="font-medium text-slate-800">Feriados nacionais</p>
                  <p className="text-sm text-slate-500">Considerar feriados como dias fechados</p>
                </div>
                <button className="relative w-12 h-6 rounded-full bg-indigo-600 transition-colors">
                  <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow translate-x-6" />
                </button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-slate-800">Notificar equipe no inicio do expediente</p>
                  <p className="text-sm text-slate-500">Enviar lembrete para membros da equipe</p>
                </div>
                <button className="relative w-12 h-6 rounded-full bg-slate-200 transition-colors">
                  <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow translate-x-0.5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-end"
          >
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4" />
                  Salvar Configuracoes
                </>
              )}
            </button>
          </motion.div>

          {/* Footer */}
          <footer className="mt-8 pt-6 border-t border-slate-200 text-center text-sm text-slate-500">
            2026 ZapSmart
          </footer>
        </div>
      </main>
    </div>
  );
}
