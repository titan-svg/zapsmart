'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoIcon, WhatsAppIcon } from '@/components/Icons';

type Step = 'email' | 'sent' | 'reset' | 'success';

export default function RecuperarSenhaPage() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStep('sent');
    } catch {
      setError('Ocorreu um erro ao enviar o email. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError('Digite o codigo completo');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStep('reset');
    } catch {
      setError('Codigo invalido. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('As senhas nao coincidem');
      return;
    }

    if (newPassword.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStep('success');
    } catch {
      setError('Ocorreu um erro ao redefinir a senha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailStep = () => (
    <motion.div
      key="email"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Esqueceu sua senha?</h2>
        <p className="text-gray-500 mt-2">
          Sem problemas! Digite seu e-mail e enviaremos um codigo para redefinir sua senha.
        </p>
      </div>

      <form onSubmit={handleEmailSubmit} className="space-y-5">
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
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="seu@email.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 outline-none"
          />
        </div>

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Enviando...
            </>
          ) : (
            'Enviar codigo'
          )}
        </motion.button>
      </form>
    </motion.div>
  );

  const renderSentStep = () => (
    <motion.div
      key="sent"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-800">Verifique seu e-mail</h2>
        <p className="text-gray-500 mt-2">
          Enviamos um codigo de 6 digitos para <span className="font-medium text-gray-700">{email}</span>
        </p>
      </div>

      <form onSubmit={handleCodeSubmit} className="space-y-5">
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
          <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
            Digite o codigo
          </label>
          <div className="flex justify-center gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => handleCodeKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 outline-none"
              />
            ))}
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Verificando...
            </>
          ) : (
            'Verificar codigo'
          )}
        </motion.button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setStep('email')}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Nao recebeu o codigo? Reenviar
          </button>
        </div>
      </form>
    </motion.div>
  );

  const renderResetStep = () => (
    <motion.div
      key="reset"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Nova senha</h2>
        <p className="text-gray-500 mt-2">
          Crie uma nova senha segura para sua conta
        </p>
      </div>

      <form onSubmit={handleResetSubmit} className="space-y-5">
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
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
            Nova senha
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
          <p className="text-xs text-gray-500 mt-1">Minimo de 8 caracteres</p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
            Confirmar nova senha
          </label>
          <input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 outline-none"
          />
        </div>

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Salvando...
            </>
          ) : (
            'Redefinir senha'
          )}
        </motion.button>
      </form>
    </motion.div>
  );

  const renderSuccessStep = () => (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
        className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">Senha redefinida!</h2>
      <p className="text-gray-500 mb-8">
        Sua senha foi alterada com sucesso. Voce ja pode fazer login com sua nova senha.
      </p>

      <Link href="/login">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200"
        >
          Ir para o login
        </motion.button>
      </Link>
    </motion.div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-emerald-600 p-12 flex-col justify-between relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-40 right-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-40 left-10 w-80 h-80 bg-emerald-400 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <Link href="/login" className="flex items-center gap-3 w-fit">
            <LogoIcon className="w-12 h-12" />
            <span className="text-2xl font-bold text-white">ZapSmart</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              Seguranca em primeiro lugar
            </h1>
            <p className="text-indigo-100 text-lg leading-relaxed">
              Sua seguranca e nossa prioridade. Use senhas fortes e nunca
              compartilhe suas credenciais de acesso.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-4"
          >
            <h3 className="text-white font-semibold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Dicas de seguranca
            </h3>
            <ul className="space-y-2 text-indigo-100 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                Use uma senha com pelo menos 8 caracteres
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                Combine letras maiusculas, minusculas e numeros
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                Evite usar informacoes pessoais obvias
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                Nao reutilize senhas de outros servicos
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-white/70">
          <WhatsAppIcon className="w-5 h-5" />
          <span className="text-sm">Seus dados estao protegidos com criptografia</span>
        </div>
      </motion.div>

      {/* Right Panel - Password Recovery Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <LogoIcon className="w-10 h-10" />
            <span className="text-xl font-bold text-gray-800">ZapSmart</span>
          </div>

          <AnimatePresence mode="wait">
            {step === 'email' && renderEmailStep()}
            {step === 'sent' && renderSentStep()}
            {step === 'reset' && renderResetStep()}
            {step === 'success' && renderSuccessStep()}
          </AnimatePresence>

          {step !== 'success' && (
            <div className="mt-8 text-center">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-800 text-sm flex items-center justify-center gap-1 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar para o login
              </Link>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 text-center text-sm text-gray-400">
            2026 ZapSmart
          </div>
        </motion.div>
      </div>
    </div>
  );
}
