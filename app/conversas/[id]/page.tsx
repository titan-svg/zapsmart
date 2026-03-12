'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import {
  ChatIcon,
  SendIcon,
  ChevronRightIcon,
  RobotIcon,
  UserIcon,
  PhoneIcon,
  TagIcon,
  ClockIcon,
  StarIcon,
  XIcon,
  CheckIcon,
  BrainIcon,
} from '@/components/Icons';
import {
  mockConversations,
  getStatusColor,
  getStatusLabel,
  formatTime,
  formatDate,
  getRelativeTime,
  Message,
  Conversation,
} from '@/lib/data';

export default function ConversaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [message, setMessage] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isTakingOver, setIsTakingOver] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAiMode, setIsAiMode] = useState(true);

  const conversation = useMemo(() => {
    return mockConversations.find((c) => c.id === params.id);
  }, [params.id]);

  useEffect(() => {
    if (conversation) {
      setMessages(conversation.messages);
      setIsAiMode(conversation.aiHandled);
    }
  }, [conversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!conversation) {
    return (
      <div className="min-h-screen bg-slate-50 lg:flex">
        <Sidebar />
        <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
              <ChatIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-700 mb-2">
                Conversa nao encontrada
              </h2>
              <p className="text-slate-500 mb-4">
                A conversa que voce esta procurando nao existe ou foi removida.
              </p>
              <Link
                href="/conversas"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Voltar para Conversas
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsSending(true);

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content: message.trim(),
      sender: 'agent',
      timestamp: new Date().toISOString(),
      read: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage('');

    // Simulate sending delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSending(false);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTakeOver = async () => {
    setIsTakingOver(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsAiMode(false);
    setIsTakingOver(false);
  };

  const handleReturnToAi = async () => {
    setIsTakingOver(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsAiMode(true);
    setIsTakingOver(false);
  };

  const getMessageBubbleStyles = (sender: Message['sender']) => {
    switch (sender) {
      case 'user':
        return 'bg-slate-200 text-slate-800 ml-auto rounded-br-sm';
      case 'ai':
        return 'bg-indigo-600 text-white mr-auto rounded-bl-sm';
      case 'agent':
        return 'bg-emerald-600 text-white mr-auto rounded-bl-sm';
      default:
        return 'bg-slate-200 text-slate-800';
    }
  };

  const getSenderLabel = (sender: Message['sender']) => {
    switch (sender) {
      case 'user':
        return conversation.contact.name;
      case 'ai':
        return 'ZapSmart IA';
      case 'agent':
        return 'Voce';
      default:
        return '';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-emerald-400';
    if (confidence >= 0.7) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar />
      <main className="flex-1 min-w-0 pt-14 lg:pt-0 flex flex-col h-screen lg:h-auto">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
          <Link
            href="/conversas"
            className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ChevronRightIcon className="w-5 h-5 rotate-180" />
          </Link>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-semibold shrink-0">
              {conversation.contact.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold text-slate-800 truncate">
                {conversation.contact.name}
              </h2>
              <p className="text-xs text-slate-500">
                {conversation.contact.phone}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors lg:hidden"
          >
            <UserIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Desktop Header */}
            <div className="hidden lg:flex bg-white border-b border-slate-200 px-6 py-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href="/conversas"
                  className="p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ChevronRightIcon className="w-5 h-5 rotate-180" />
                </Link>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-semibold text-lg">
                    {conversation.contact.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-800">
                      {conversation.contact.name}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500">
                        {conversation.contact.phone}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          conversation.status
                        )}`}
                      >
                        {getStatusLabel(conversation.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* AI/Human Mode Indicator */}
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                    isAiMode
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {isAiMode ? (
                    <>
                      <RobotIcon className="w-4 h-4" />
                      Modo IA
                    </>
                  ) : (
                    <>
                      <UserIcon className="w-4 h-4" />
                      Modo Humano
                    </>
                  )}
                </div>

                {/* Take Over / Return to AI Button */}
                {isAiMode ? (
                  <button
                    onClick={handleTakeOver}
                    disabled={isTakingOver}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    {isTakingOver ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <UserIcon className="w-4 h-4" />
                    )}
                    Assumir Conversa
                  </button>
                ) : (
                  <button
                    onClick={handleReturnToAi}
                    disabled={isTakingOver}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {isTakingOver ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <RobotIcon className="w-4 h-4" />
                    )}
                    Devolver para IA
                  </button>
                )}

                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <UserIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-100">
              <div className="max-w-3xl mx-auto space-y-4">
                {/* Date Header */}
                <div className="flex items-center justify-center">
                  <span className="px-3 py-1 bg-white rounded-full text-xs text-slate-500 shadow-sm">
                    {formatDate(conversation.startedAt)}
                  </span>
                </div>

                <AnimatePresence mode="popLayout">
                  {messages.map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.02 }}
                      className={`flex flex-col max-w-[85%] lg:max-w-[70%] ${
                        msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                      }`}
                    >
                      {/* Sender Label */}
                      <span className="text-xs text-slate-500 mb-1 px-1">
                        {getSenderLabel(msg.sender)}
                      </span>

                      {/* Message Bubble */}
                      <div
                        className={`px-4 py-2.5 rounded-2xl shadow-sm ${getMessageBubbleStyles(
                          msg.sender
                        )}`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {msg.content}
                        </p>
                      </div>

                      {/* Message Meta */}
                      <div className="flex items-center gap-2 mt-1 px-1">
                        <span className="text-xs text-slate-400">
                          {formatTime(msg.timestamp)}
                        </span>
                        {msg.sender !== 'user' && msg.read && (
                          <CheckIcon className="w-3 h-3 text-emerald-500" />
                        )}
                        {/* AI Confidence Score */}
                        {msg.sender === 'ai' && msg.confidence !== undefined && (
                          <span
                            className={`flex items-center gap-1 text-xs ${getConfidenceColor(
                              msg.confidence
                            )}`}
                          >
                            <BrainIcon className="w-3 h-3" />
                            {Math.round(msg.confidence * 100)}%
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Mobile Action Buttons */}
            <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-center gap-2">
              {isAiMode ? (
                <button
                  onClick={handleTakeOver}
                  disabled={isTakingOver}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium disabled:opacity-50"
                >
                  {isTakingOver ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <UserIcon className="w-4 h-4" />
                  )}
                  Assumir Conversa
                </button>
              ) : (
                <button
                  onClick={handleReturnToAi}
                  disabled={isTakingOver}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium disabled:opacity-50"
                >
                  {isTakingOver ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <RobotIcon className="w-4 h-4" />
                  )}
                  Devolver para IA
                </button>
              )}
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-slate-200 p-4 lg:p-6">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-end gap-3">
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Digite sua mensagem..."
                      rows={1}
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      style={{
                        minHeight: '48px',
                        maxHeight: '120px',
                      }}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isSending}
                    className="shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSending ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <SendIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-2 text-center">
                  Pressione Enter para enviar, Shift+Enter para nova linha
                </p>
              </div>
            </div>
          </div>

          {/* Contact Sidebar */}
          <AnimatePresence>
            {showSidebar && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="hidden lg:block bg-white border-l border-slate-200 overflow-hidden shrink-0"
              >
                <div className="w-80 h-full overflow-y-auto">
                  {/* Contact Header */}
                  <div className="p-6 border-b border-slate-100 text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                      {conversation.contact.name.charAt(0)}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      {conversation.contact.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {conversation.contact.phone}
                    </p>
                    {conversation.contact.email && (
                      <p className="text-sm text-slate-500">
                        {conversation.contact.email}
                      </p>
                    )}
                  </div>

                  {/* Contact Details */}
                  <div className="p-6 space-y-6">
                    {/* Status */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                        Status da Conversa
                      </h4>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(
                            conversation.status
                          )}`}
                        >
                          {getStatusLabel(conversation.status)}
                        </span>
                        <span
                          className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                            isAiMode
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {isAiMode ? 'IA' : 'Humano'}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                        Informacoes
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <ClockIcon className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">
                            Iniciada {getRelativeTime(conversation.startedAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <ChatIcon className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">
                            {messages.length} mensagens
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <PhoneIcon className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">
                            {conversation.contact.totalConversations} conversas anteriores
                          </span>
                        </div>
                        {conversation.contact.satisfaction && (
                          <div className="flex items-center gap-3 text-sm">
                            <StarIcon className="w-4 h-4 text-amber-400" />
                            <span className="text-slate-600">
                              Satisfacao: {conversation.contact.satisfaction}/5
                            </span>
                          </div>
                        )}
                        {conversation.assignedTo && (
                          <div className="flex items-center gap-3 text-sm">
                            <UserIcon className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600">
                              Atribuido a: {conversation.assignedTo}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    {conversation.tags.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                          Tags
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {conversation.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm"
                            >
                              <TagIcon className="w-3 h-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contact Tags */}
                    {conversation.contact.tags.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                          Tags do Contato
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {conversation.contact.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Performance */}
                    {conversation.aiHandled && (
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                          Performance da IA
                        </h4>
                        <div className="bg-slate-50 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-600">Confianca Media</span>
                            <span className="text-sm font-semibold text-indigo-600">
                              {Math.round(
                                (messages
                                  .filter((m) => m.sender === 'ai' && m.confidence)
                                  .reduce((acc, m) => acc + (m.confidence || 0), 0) /
                                  messages.filter((m) => m.sender === 'ai' && m.confidence)
                                    .length) *
                                  100
                              )}
                              %
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full transition-all"
                              style={{
                                width: `${
                                  (messages
                                    .filter((m) => m.sender === 'ai' && m.confidence)
                                    .reduce((acc, m) => acc + (m.confidence || 0), 0) /
                                    messages.filter((m) => m.sender === 'ai' && m.confidence)
                                      .length) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                        Acoes Rapidas
                      </h4>
                      <div className="space-y-2">
                        <Link
                          href={`/contatos/${conversation.contact.id}`}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors text-sm font-medium"
                        >
                          <UserIcon className="w-4 h-4" />
                          Ver Perfil Completo
                        </Link>
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors text-sm font-medium">
                          <TagIcon className="w-4 h-4" />
                          Adicionar Tag
                        </button>
                        {conversation.status !== 'resolved' && (
                          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-sm font-medium">
                            <CheckIcon className="w-4 h-4" />
                            Marcar como Resolvido
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Mobile Sidebar Overlay */}
          <AnimatePresence>
            {showSidebar && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowSidebar(false)}
                  className="lg:hidden fixed inset-0 z-50 bg-black/50"
                />
                <motion.aside
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                  className="lg:hidden fixed right-0 top-0 bottom-0 z-50 w-[300px] max-w-[85vw] bg-white shadow-xl overflow-y-auto"
                >
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors z-10"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>

                  {/* Contact Header */}
                  <div className="p-6 pt-16 border-b border-slate-100 text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                      {conversation.contact.name.charAt(0)}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      {conversation.contact.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {conversation.contact.phone}
                    </p>
                  </div>

                  {/* Contact Details */}
                  <div className="p-6 space-y-6">
                    {/* Stats */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                        Informacoes
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <ClockIcon className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">
                            Iniciada {getRelativeTime(conversation.startedAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <ChatIcon className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">
                            {messages.length} mensagens
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    {conversation.tags.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                          Tags
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {conversation.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="space-y-2">
                      <Link
                        href={`/contatos/${conversation.contact.id}`}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors text-sm font-medium"
                      >
                        <UserIcon className="w-4 h-4" />
                        Ver Perfil
                      </Link>
                      {conversation.status !== 'resolved' && (
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-sm font-medium">
                          <CheckIcon className="w-4 h-4" />
                          Marcar como Resolvido
                        </button>
                      )}
                    </div>
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
