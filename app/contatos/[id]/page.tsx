'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import {
  ContactsIcon,
  PhoneIcon,
  TagIcon,
  StarIcon,
  ChatIcon,
  ClockIcon,
  ChevronRightIcon,
  PlusIcon,
  XIcon,
  EditIcon,
  TrashIcon,
  CheckIcon,
} from '@/components/Icons';
import { useAuth } from '@/context/AuthContext';
import {
  mockContacts,
  mockConversations,
  Contact,
  Conversation,
  formatDate,
  formatTime,
  formatDateTime,
  getRelativeTime,
  getStatusColor,
  getStatusLabel,
} from '@/lib/data';

const allTags = ['VIP', 'Recorrente', 'Novo', 'Suporte', 'Vendas', 'B2B', 'Reclamacao', 'Prioritario', 'Inativo'];

const avatarGradients = [
  'from-indigo-500 to-purple-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-pink-500 to-rose-500',
  'from-blue-500 to-cyan-500',
  'from-violet-500 to-fuchsia-500',
];

function getAvatarGradient(name: string): string {
  const index = name.charCodeAt(0) % avatarGradients.length;
  return avatarGradients[index];
}

interface Note {
  id: string;
  content: string;
  createdAt: string;
}

const initialNotes: Note[] = [
  { id: '1', content: 'Cliente prefere contato via WhatsApp no periodo da manha.', createdAt: '2026-03-10T14:30:00' },
  { id: '2', content: 'Interesse em plano empresarial para equipe de 10 pessoas.', createdAt: '2026-03-08T09:15:00' },
];

export default function ContatoDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading } = useAuth();
  const [contact, setContact] = useState<Contact | null>(null);
  const [contactConversations, setContactConversations] = useState<Conversation[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [showAddTag, setShowAddTag] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteContent, setEditingNoteContent] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (params.id) {
      const foundContact = mockContacts.find(c => c.id === params.id);
      if (foundContact) {
        setContact(foundContact);
        setTags(foundContact.tags);
        // Find conversations for this contact
        const conversations = mockConversations.filter(
          conv => conv.contact.id === foundContact.id
        );
        setContactConversations(conversations);
      }
    }
  }, [params.id]);

  // Calculate satisfaction data for chart
  const satisfactionData = useMemo(() => {
    // Generate mock monthly data
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    const data = months.map((month, index) => ({
      month,
      value: 3.5 + Math.random() * 1.5,
    }));
    // Set last month to current satisfaction
    if (contact?.satisfaction) {
      data[data.length - 1].value = contact.satisfaction;
    }
    return data;
  }, [contact?.satisfaction]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) return null;

  if (!contact) {
    return (
      <div className="min-h-screen bg-slate-50 lg:flex">
        <Sidebar />
        <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <ContactsIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Contato nao encontrado</h2>
            <p className="text-slate-500 mb-6">O contato que voce procura nao existe ou foi removido.</p>
            <Link
              href="/contatos"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
            >
              Voltar para Contatos
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setShowAddTag(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        content: newNote,
        createdAt: new Date().toISOString(),
      };
      setNotes([note, ...notes]);
      setNewNote('');
      setShowAddNote(false);
    }
  };

  const handleEditNote = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setEditingNoteId(noteId);
      setEditingNoteContent(note.content);
    }
  };

  const handleSaveEdit = () => {
    if (editingNoteId && editingNoteContent.trim()) {
      setNotes(notes.map(note =>
        note.id === editingNoteId
          ? { ...note, content: editingNoteContent }
          : note
      ));
      setEditingNoteId(null);
      setEditingNoteContent('');
    }
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  const availableTags = allTags.filter(tag => !tags.includes(tag));

  const renderStars = (satisfaction: number | undefined, size: 'sm' | 'lg' = 'sm') => {
    if (!satisfaction) return <span className="text-slate-400 text-sm">-</span>;
    const iconClass = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
    const fullStars = Math.floor(satisfaction);
    const hasHalf = satisfaction % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <StarIcon key={`full-${i}`} className={`${iconClass} text-amber-400 fill-amber-400`} />
        ))}
        {hasHalf && (
          <div className={`relative ${iconClass}`}>
            <StarIcon className={`absolute ${iconClass} text-slate-200 fill-slate-200`} />
            <div className="absolute overflow-hidden w-1/2 h-full">
              <StarIcon className={`${iconClass} text-amber-400 fill-amber-400`} />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <StarIcon key={`empty-${i}`} className={`${iconClass} text-slate-200 fill-slate-200`} />
        ))}
        <span className={`ml-1 font-semibold ${size === 'lg' ? 'text-lg' : 'text-sm'} text-slate-700`}>
          {satisfaction.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar />

      <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-6">
        {/* Back Button */}
        <Link
          href="/contatos"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ChevronRightIcon className="w-5 h-5 rotate-180" />
          Voltar para Contatos
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Contact Info & Tags */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getAvatarGradient(contact.name)} flex items-center justify-center mb-4`}>
                  <span className="text-white font-bold text-2xl">
                    {contact.name.charAt(0)}
                  </span>
                </div>
                <h1 className="text-xl font-bold text-slate-900">{contact.name}</h1>
                <p className="text-slate-500 flex items-center gap-2 mt-1">
                  <PhoneIcon className="w-4 h-4" />
                  {contact.phone}
                </p>
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-indigo-600 hover:text-indigo-700 text-sm mt-1"
                  >
                    {contact.email}
                  </a>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Ultimo contato</span>
                  <span className="text-sm font-medium text-slate-900">
                    {getRelativeTime(contact.lastContact)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Total de conversas</span>
                  <span className="text-sm font-medium text-slate-900">
                    {contact.totalConversations}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Satisfacao</span>
                  {renderStars(contact.satisfaction)}
                </div>
              </div>
            </motion.div>

            {/* Tags Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Tags</h2>
                <button
                  onClick={() => setShowAddTag(!showAddTag)}
                  className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <motion.span
                    key={tag}
                    layout
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm rounded-full font-medium group"
                  >
                    <TagIcon className="w-3 h-3" />
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 p-0.5 hover:bg-indigo-200 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </motion.span>
                ))}
                {tags.length === 0 && !showAddTag && (
                  <p className="text-sm text-slate-400">Nenhuma tag adicionada</p>
                )}
              </div>

              <AnimatePresence>
                {showAddTag && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-sm text-slate-500 mb-2">Adicionar tag:</p>
                      <div className="flex flex-wrap gap-2">
                        {availableTags.map(tag => (
                          <button
                            key={tag}
                            onClick={() => handleAddTag(tag)}
                            className="px-3 py-1.5 bg-slate-100 text-slate-600 text-sm rounded-full hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Satisfaction Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Evolucao da Satisfacao</h2>

              <div className="flex items-center justify-center mb-4">
                {renderStars(contact.satisfaction, 'lg')}
              </div>

              {/* Simple Bar Chart */}
              <div className="flex items-end justify-between h-32 mt-6">
                {satisfactionData.map((item, index) => {
                  const height = (item.value / 5) * 100;
                  const isLast = index === satisfactionData.length - 1;
                  return (
                    <div key={item.month} className="flex flex-col items-center flex-1">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className={`w-6 rounded-t-lg ${
                          isLast
                            ? 'bg-gradient-to-t from-indigo-600 to-emerald-500'
                            : 'bg-slate-200'
                        }`}
                        title={`${item.value.toFixed(1)}`}
                      />
                      <span className="text-xs text-slate-500 mt-2">{item.month}</span>
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-slate-400 text-center mt-4">
                Historico dos ultimos 6 meses
              </p>
            </motion.div>
          </div>

          {/* Right Column - Conversations & Notes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Conversation History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">Historico de Conversas</h2>
                <span className="text-sm text-slate-500">
                  {contactConversations.length} conversa{contactConversations.length !== 1 ? 's' : ''}
                </span>
              </div>

              {contactConversations.length === 0 ? (
                <div className="text-center py-8">
                  <ChatIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Nenhuma conversa</h3>
                  <p className="text-slate-500">Este contato ainda nao iniciou nenhuma conversa.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contactConversations.map((conversation, index) => (
                    <motion.div
                      key={conversation.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-slate-200 rounded-xl p-4 hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer"
                      onClick={() => router.push(`/conversas/${conversation.id}`)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(conversation.status)}`}>
                            {getStatusLabel(conversation.status)}
                          </span>
                          {conversation.aiHandled && (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                              IA
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500">
                          {formatDateTime(conversation.startedAt)}
                        </span>
                      </div>

                      <p className="text-sm text-slate-600 line-clamp-2">
                        {conversation.messages[conversation.messages.length - 1]?.content || 'Sem mensagens'}
                      </p>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                        <div className="flex flex-wrap gap-1">
                          {conversation.tags.slice(0, 3).map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <ChatIcon className="w-3 h-3" />
                          {conversation.messages.length} mensagens
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Notes Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">Notas</h2>
                <button
                  onClick={() => setShowAddNote(!showAddNote)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  Nova Nota
                </button>
              </div>

              <AnimatePresence>
                {showAddNote && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-4"
                  >
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <textarea
                        value={newNote}
                        onChange={e => setNewNote(e.target.value)}
                        placeholder="Escreva uma nota sobre este contato..."
                        className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm"
                        rows={3}
                      />
                      <div className="flex justify-end gap-2 mt-3">
                        <button
                          onClick={() => {
                            setShowAddNote(false);
                            setNewNote('');
                          }}
                          className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-sm"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleAddNote}
                          disabled={!newNote.trim()}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Salvar
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {notes.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Nenhuma nota</h3>
                  <p className="text-slate-500">Adicione notas para registrar informacoes importantes.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notes.map((note, index) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-slate-50 rounded-xl p-4 border border-slate-200 group"
                    >
                      {editingNoteId === note.id ? (
                        <div>
                          <textarea
                            value={editingNoteContent}
                            onChange={e => setEditingNoteContent(e.target.value)}
                            className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm"
                            rows={3}
                          />
                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              onClick={() => {
                                setEditingNoteId(null);
                                setEditingNoteContent('');
                              }}
                              className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-sm"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={handleSaveEdit}
                              className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                            >
                              Salvar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between gap-4">
                            <p className="text-sm text-slate-700 flex-1">{note.content}</p>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEditNote(note.id)}
                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              >
                                <EditIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteNote(note.id)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                            <ClockIcon className="w-3 h-3" />
                            {formatDateTime(note.createdAt)}
                          </p>
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
