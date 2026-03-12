'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LogoIcon, WhatsAppIcon } from '@/components/Icons';

export default function RegistroPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'A senha deve ter pelo menos 8 caracteres';
    }
    if (!/[A-Z]/.test(password)) {
      return 'A senha deve conter pelo menos uma letra maiuscula';
    }
    if (!/[0-9]/.test(password)) {
      return 'A senha deve conter pelo menos um numero';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas nao coincidem');
      return;
    }

    // Validate password strength
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // Validate terms acceptance
    if (!acceptTerms) {
      setError('Voce precisa aceitar os termos de uso');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Store registration data (in a real app, this would be an API call)
      localStorage.setItem('zapsmart_registration', JSON.stringify({
        company: formData.companyName,
        name: formData.name,
        email: formData.email,
      }));

      router.push('/login?registered=true');
    } catch {
      setError('Ocorreu um erro ao criar sua conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const getStrengthColor = () => {
    const strength = passwordStrength();
    if (strength <= 25) return 'bg-red-500';
    if (strength <= 50) return 'bg-orange-500';
    if (strength <= 75) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };

  const getStrengthText = () => {
    const strength = passwordStrength();
    if (strength <= 25) return 'Fraca';
    if (strength <= 50) return 'Media';
    if (strength <= 75) return 'Boa';
    return 'Forte';
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-500 via-emerald-600 to-indigo-700 p-12 flex-col justify-between relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-32 left-10 w-80 h-80 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-indigo-400 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <LogoIcon className="w-12 h-12" />
            <span className="text-2xl font-bold text-white">ZapSmart</span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              Comece sua jornada de automacao
            </h1>
            <p className="text-emerald-50 text-lg leading-relaxed">
              Crie sua conta e tenha acesso a plataforma mais inteligente de
              atendimento via WhatsApp do mercado.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="space-y-4"
          >
            {[
              { icon: '✓', text: '14 dias de teste gratuito' },
              { icon: '✓', text: 'Sem necessidade de cartao de credito' },
              { icon: '✓', text: 'Suporte em portugues' },
              { icon: '✓', text: 'Integracao em minutos' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                className="flex items-center gap-3 text-white"
              >
                <span className="flex items-center justify-center w-6 h-6 bg-white/20 rounded-full text-sm">
                  {feature.icon}
                </span>
                <span className="font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-white/70">
          <WhatsAppIcon className="w-5 h-5" />
          <span className="text-sm">Mais de 5.000 empresas confiam no ZapSmart</span>
        </div>
      </motion.div>

      {/* Right Panel - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md py-8"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <LogoIcon className="w-10 h-10" />
            <span className="text-xl font-bold text-gray-800">ZapSmart</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Crie sua conta</h2>
            <p className="text-gray-500 mt-2">Preencha os dados abaixo para comecar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1.5">
                Nome da Empresa
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                value={formData.companyName}
                onChange={handleChange}
                required
                placeholder="Sua Empresa LTDA"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 outline-none"
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Seu Nome
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Joao Silva"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 outline-none"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="seu@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 outline-none pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {/* Password Strength Indicator */}
              {formData.password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${passwordStrength()}%` }}
                        className={`h-full ${getStrengthColor()} transition-all duration-300`}
                      />
                    </div>
                    <span className={`text-xs font-medium ${
                      passwordStrength() <= 50 ? 'text-orange-500' : 'text-emerald-500'
                    }`}>
                      {getStrengthText()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Use 8+ caracteres, maiusculas e numeros
                  </p>
                </motion.div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirmar Senha
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 outline-none pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-red-500 mt-1"
                >
                  As senhas nao coincidem
                </motion.p>
              )}
            </div>

            <div className="flex items-start gap-2">
              <input
                id="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                Li e aceito os{' '}
                <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  Termos de Uso
                </a>{' '}
                e a{' '}
                <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  Politica de Privacidade
                </a>
              </label>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Criando conta...
                </>
              ) : (
                'Criar minha conta'
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Ja tem uma conta?{' '}
              <Link
                href="/login"
                className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                Fazer login
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-sm text-gray-400">
            2026 ZapSmart
          </div>
        </motion.div>
      </div>
    </div>
  );
}
