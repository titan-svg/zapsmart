'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import {
  TeamIcon,
  ChevronRightIcon,
  UserIcon,
  CheckIcon,
} from '@/components/Icons';

export default function NovoMembroPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'agent',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome e obrigatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email e obrigatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha e obrigatoria';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas nao conferem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    router.push('/equipe');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar />
      <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-6">
        <div className="max-w-2xl mx-auto">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-slate-500 mb-6"
          >
            <Link href="/equipe" className="hover:text-indigo-600 transition-colors">
              Equipe
            </Link>
            <ChevronRightIcon className="w-4 h-4" />
            <span className="text-slate-800">Novo Membro</span>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <TeamIcon className="w-7 h-7 text-indigo-600" />
              Adicionar Novo Membro
            </h1>
            <p className="text-slate-500 mt-1">Preencha os dados para adicionar um novo membro a equipe</p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-xl border border-slate-200 p-6"
          >
            <div className="space-y-6">
              {/* Avatar Preview */}
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : <UserIcon className="w-10 h-10" />}
                </div>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Digite o nome completo"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors ${
                    errors.name ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@empresa.com.br"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-2">
                  Funcao *
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                >
                  <option value="agent">Agente</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="admin">Administrador</option>
                </select>
                <p className="mt-1 text-sm text-slate-500">
                  {formData.role === 'admin' && 'Acesso total ao sistema, incluindo configuracoes'}
                  {formData.role === 'supervisor' && 'Acesso a equipe, analytics e gestao de fluxos'}
                  {formData.role === 'agent' && 'Acesso a conversas, contatos e base de conhecimento'}
                </p>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Senha Inicial *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimo 8 caracteres"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                  Confirmar Senha *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Digite a senha novamente"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors ${
                    errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Info Box */}
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                <h4 className="font-medium text-indigo-800 mb-2">Informacoes Importantes</h4>
                <ul className="text-sm text-indigo-700 space-y-1">
                  <li>O membro recebera um email de boas-vindas com as credenciais</li>
                  <li>A senha devera ser alterada no primeiro acesso</li>
                  <li>O status inicial sera definido como &quot;Offline&quot;</li>
                </ul>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Link
                  href="/equipe"
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-center font-medium"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="w-5 h-5" />
                      Adicionar Membro
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.form>

          {/* Footer */}
          <footer className="mt-8 pt-6 border-t border-slate-200 text-center text-sm text-slate-500">
            2026 ZapSmart
          </footer>
        </div>
      </main>
    </div>
  );
}
