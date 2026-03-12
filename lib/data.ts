// Types
export type ConversationStatus = 'active' | 'pending' | 'resolved' | 'escalated';
export type MessageSender = 'user' | 'ai' | 'agent';
export type IntentCategory = 'greeting' | 'faq' | 'support' | 'sales' | 'complaint' | 'other';
export type FlowTrigger = 'keyword' | 'intent' | 'time' | 'event';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  tags: string[];
  lastContact: string;
  totalConversations: number;
  satisfaction?: number;
  notes?: string;
}

export interface Message {
  id: string;
  content: string;
  sender: MessageSender;
  timestamp: string;
  read: boolean;
  confidence?: number; // AI confidence score
}

export interface Conversation {
  id: string;
  contact: Contact;
  status: ConversationStatus;
  messages: Message[];
  startedAt: string;
  lastMessageAt: string;
  assignedTo?: string;
  aiHandled: boolean;
  satisfaction?: number;
  tags: string[];
}

export interface KnowledgeItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  usageCount: number;
  lastUsed?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Intent {
  id: string;
  name: string;
  description: string;
  category: IntentCategory;
  trainingPhrases: string[];
  responses: string[];
  confidence: number;
  usageCount: number;
  isActive: boolean;
}

export interface AutoFlow {
  id: string;
  name: string;
  description: string;
  trigger: FlowTrigger;
  triggerValue: string;
  steps: FlowStep[];
  isActive: boolean;
  usageCount: number;
  createdAt: string;
}

export interface FlowStep {
  id: string;
  type: 'message' | 'condition' | 'action' | 'delay';
  content: string;
  nextStepId?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'supervisor' | 'agent';
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  activeChats: number;
  resolvedToday: number;
  avgResponseTime: number;
  satisfaction: number;
}

export interface DashboardStats {
  totalConversations: number;
  activeConversations: number;
  resolvedToday: number;
  aiHandledPercent: number;
  avgResponseTime: number;
  satisfaction: number;
  messagesProcessed: number;
  intentAccuracy: number;
}

export interface AnalyticsData {
  date: string;
  conversations: number;
  aiHandled: number;
  humanHandled: number;
  avgResponseTime: number;
  satisfaction: number;
}

// Mock Data
export const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Maria Santos',
    phone: '+55 11 98765-4321',
    email: 'maria@email.com',
    tags: ['VIP', 'Recorrente'],
    lastContact: '2026-03-12T10:30:00',
    totalConversations: 15,
    satisfaction: 4.8,
  },
  {
    id: '2',
    name: 'João Oliveira',
    phone: '+55 21 99876-5432',
    email: 'joao@empresa.com',
    tags: ['Novo'],
    lastContact: '2026-03-12T09:15:00',
    totalConversations: 2,
    satisfaction: 5.0,
  },
  {
    id: '3',
    name: 'Ana Costa',
    phone: '+55 31 97654-3210',
    tags: ['Suporte'],
    lastContact: '2026-03-11T16:45:00',
    totalConversations: 8,
    satisfaction: 4.2,
  },
  {
    id: '4',
    name: 'Pedro Lima',
    phone: '+55 41 96543-2109',
    email: 'pedro@tech.com',
    tags: ['Vendas', 'B2B'],
    lastContact: '2026-03-12T11:00:00',
    totalConversations: 12,
    satisfaction: 4.5,
  },
  {
    id: '5',
    name: 'Carla Ferreira',
    phone: '+55 51 95432-1098',
    tags: ['Reclamação'],
    lastContact: '2026-03-12T08:30:00',
    totalConversations: 3,
    satisfaction: 3.5,
  },
];

export const mockConversations: Conversation[] = [
  {
    id: '1',
    contact: mockContacts[0],
    status: 'active',
    messages: [
      { id: '1', content: 'Olá! Preciso de ajuda com meu pedido', sender: 'user', timestamp: '2026-03-12T10:30:00', read: true },
      { id: '2', content: 'Olá Maria! Claro, ficarei feliz em ajudar. Pode me informar o número do pedido?', sender: 'ai', timestamp: '2026-03-12T10:30:05', read: true, confidence: 0.95 },
      { id: '3', content: 'É o pedido #12345', sender: 'user', timestamp: '2026-03-12T10:31:00', read: true },
      { id: '4', content: 'Encontrei seu pedido! Ele está em trânsito e deve chegar até amanhã. Posso ajudar com mais alguma coisa?', sender: 'ai', timestamp: '2026-03-12T10:31:05', read: true, confidence: 0.92 },
    ],
    startedAt: '2026-03-12T10:30:00',
    lastMessageAt: '2026-03-12T10:31:05',
    aiHandled: true,
    tags: ['Pedido', 'Rastreamento'],
  },
  {
    id: '2',
    contact: mockContacts[1],
    status: 'pending',
    messages: [
      { id: '1', content: 'Boa tarde! Gostaria de saber sobre os planos disponíveis', sender: 'user', timestamp: '2026-03-12T09:15:00', read: true },
      { id: '2', content: 'Boa tarde João! Temos 3 planos disponíveis: Básico (R$99/mês), Profissional (R$199/mês) e Enterprise (personalizado). Qual deles gostaria de conhecer melhor?', sender: 'ai', timestamp: '2026-03-12T09:15:08', read: true, confidence: 0.88 },
      { id: '3', content: 'Quero falar com um vendedor sobre o Enterprise', sender: 'user', timestamp: '2026-03-12T09:16:00', read: false },
    ],
    startedAt: '2026-03-12T09:15:00',
    lastMessageAt: '2026-03-12T09:16:00',
    aiHandled: false,
    tags: ['Vendas', 'Enterprise'],
  },
  {
    id: '3',
    contact: mockContacts[2],
    status: 'resolved',
    messages: [
      { id: '1', content: 'Como faço para resetar minha senha?', sender: 'user', timestamp: '2026-03-11T16:45:00', read: true },
      { id: '2', content: 'Para resetar sua senha, acesse nosso site, clique em "Esqueci minha senha" e siga as instruções enviadas por email. Precisa de mais ajuda?', sender: 'ai', timestamp: '2026-03-11T16:45:03', read: true, confidence: 0.98 },
      { id: '3', content: 'Perfeito, consegui! Obrigada!', sender: 'user', timestamp: '2026-03-11T16:50:00', read: true },
    ],
    startedAt: '2026-03-11T16:45:00',
    lastMessageAt: '2026-03-11T16:50:00',
    aiHandled: true,
    satisfaction: 5,
    tags: ['Suporte', 'Senha'],
  },
  {
    id: '4',
    contact: mockContacts[3],
    status: 'escalated',
    messages: [
      { id: '1', content: 'Preciso de uma proposta para 500 usuários', sender: 'user', timestamp: '2026-03-12T11:00:00', read: true },
      { id: '2', content: 'Olá Pedro! Para propostas corporativas acima de 100 usuários, vou transferir você para nosso especialista em vendas B2B. Um momento, por favor.', sender: 'ai', timestamp: '2026-03-12T11:00:05', read: true, confidence: 0.85 },
      { id: '3', content: 'Olá Pedro, aqui é o Lucas da equipe comercial. Vi que você precisa de uma proposta para 500 usuários. Podemos agendar uma call?', sender: 'agent', timestamp: '2026-03-12T11:02:00', read: true },
    ],
    startedAt: '2026-03-12T11:00:00',
    lastMessageAt: '2026-03-12T11:02:00',
    assignedTo: 'Lucas Mendes',
    aiHandled: false,
    tags: ['B2B', 'Enterprise', 'Proposta'],
  },
  {
    id: '5',
    contact: mockContacts[4],
    status: 'active',
    messages: [
      { id: '1', content: 'Estou com problema no app, não consigo acessar', sender: 'user', timestamp: '2026-03-12T08:30:00', read: true },
      { id: '2', content: 'Sinto muito pelo inconveniente! Pode me descrever o erro que está aparecendo?', sender: 'ai', timestamp: '2026-03-12T08:30:05', read: true, confidence: 0.90 },
      { id: '3', content: 'Aparece "erro de conexão" toda hora', sender: 'user', timestamp: '2026-03-12T08:31:00', read: true },
      { id: '4', content: 'Entendi. Tente limpar o cache do app e reiniciar. Se persistir, tente reinstalar. Isso deve resolver na maioria dos casos. Funcionou?', sender: 'ai', timestamp: '2026-03-12T08:31:10', read: true, confidence: 0.87 },
      { id: '5', content: 'Vou tentar agora', sender: 'user', timestamp: '2026-03-12T08:32:00', read: false },
    ],
    startedAt: '2026-03-12T08:30:00',
    lastMessageAt: '2026-03-12T08:32:00',
    aiHandled: true,
    tags: ['Suporte', 'App', 'Erro'],
  },
];

export const mockKnowledgeBase: KnowledgeItem[] = [
  {
    id: '1',
    question: 'Como rastrear meu pedido?',
    answer: 'Para rastrear seu pedido, acesse nosso site, clique em "Meus Pedidos" e insira o número do pedido. Você também pode usar o link de rastreamento enviado por email.',
    category: 'Pedidos',
    tags: ['rastreamento', 'pedido', 'entrega'],
    usageCount: 245,
    lastUsed: '2026-03-12T10:31:00',
    createdAt: '2026-01-15T00:00:00',
    updatedAt: '2026-03-01T00:00:00',
  },
  {
    id: '2',
    question: 'Quais são as formas de pagamento?',
    answer: 'Aceitamos cartão de crédito (até 12x), débito, boleto bancário, PIX e transferência. Para empresas, também oferecemos faturamento mensal.',
    category: 'Pagamentos',
    tags: ['pagamento', 'cartão', 'pix', 'boleto'],
    usageCount: 189,
    lastUsed: '2026-03-12T09:15:00',
    createdAt: '2026-01-15T00:00:00',
    updatedAt: '2026-02-20T00:00:00',
  },
  {
    id: '3',
    question: 'Como cancelar minha assinatura?',
    answer: 'Para cancelar sua assinatura, acesse Configurações > Assinatura > Cancelar. O acesso permanece ativo até o fim do período pago. Não há multa por cancelamento.',
    category: 'Assinatura',
    tags: ['cancelamento', 'assinatura', 'conta'],
    usageCount: 78,
    lastUsed: '2026-03-11T14:20:00',
    createdAt: '2026-01-20T00:00:00',
    updatedAt: '2026-03-05T00:00:00',
  },
  {
    id: '4',
    question: 'Qual o prazo de entrega?',
    answer: 'O prazo de entrega varia de acordo com a região: Capitais (2-3 dias úteis), Interior (4-7 dias úteis). Após o envio, você receberá o código de rastreamento por email.',
    category: 'Pedidos',
    tags: ['entrega', 'prazo', 'envio'],
    usageCount: 312,
    lastUsed: '2026-03-12T11:45:00',
    createdAt: '2026-01-10T00:00:00',
    updatedAt: '2026-02-28T00:00:00',
  },
  {
    id: '5',
    question: 'Como alterar meus dados cadastrais?',
    answer: 'Para alterar seus dados, acesse Minha Conta > Perfil. Você pode atualizar nome, email, telefone e endereço. Alterações de CPF/CNPJ precisam de contato com o suporte.',
    category: 'Conta',
    tags: ['cadastro', 'dados', 'perfil', 'atualizar'],
    usageCount: 156,
    lastUsed: '2026-03-12T08:10:00',
    createdAt: '2026-01-18T00:00:00',
    updatedAt: '2026-03-10T00:00:00',
  },
];

export const mockIntents: Intent[] = [
  {
    id: '1',
    name: 'saudacao',
    description: 'Detecta saudações e cumprimentos',
    category: 'greeting',
    trainingPhrases: ['oi', 'olá', 'bom dia', 'boa tarde', 'boa noite', 'hey', 'e aí'],
    responses: ['Olá! Como posso ajudar você hoje?', 'Oi! Em que posso ser útil?', 'Olá! Estou aqui para ajudar!'],
    confidence: 0.98,
    usageCount: 1250,
    isActive: true,
  },
  {
    id: '2',
    name: 'rastrear_pedido',
    description: 'Identifica intenção de rastrear pedidos',
    category: 'faq',
    trainingPhrases: ['onde está meu pedido', 'rastrear pedido', 'cadê minha encomenda', 'status do pedido', 'meu pedido chegou'],
    responses: ['Claro! Para rastrear seu pedido, preciso do número. Pode me informar?'],
    confidence: 0.95,
    usageCount: 890,
    isActive: true,
  },
  {
    id: '3',
    name: 'falar_humano',
    description: 'Detecta quando usuário quer falar com atendente',
    category: 'support',
    trainingPhrases: ['quero falar com pessoa', 'atendente humano', 'falar com alguém', 'não quero robô', 'transferir atendimento'],
    responses: ['Entendido! Vou transferir você para um de nossos atendentes. Aguarde um momento.'],
    confidence: 0.97,
    usageCount: 234,
    isActive: true,
  },
  {
    id: '4',
    name: 'reclamacao',
    description: 'Identifica reclamações e problemas',
    category: 'complaint',
    trainingPhrases: ['não estou satisfeito', 'péssimo serviço', 'quero reclamar', 'problema com produto', 'insatisfeito'],
    responses: ['Sinto muito pela experiência negativa. Pode me contar mais sobre o problema para que eu possa ajudar?'],
    confidence: 0.92,
    usageCount: 156,
    isActive: true,
  },
  {
    id: '5',
    name: 'preco_plano',
    description: 'Perguntas sobre preços e planos',
    category: 'sales',
    trainingPhrases: ['quanto custa', 'qual o preço', 'valores dos planos', 'tabela de preços', 'planos disponíveis'],
    responses: ['Temos 3 planos: Básico (R$99/mês), Profissional (R$199/mês) e Enterprise (personalizado). Qual gostaria de conhecer?'],
    confidence: 0.94,
    usageCount: 567,
    isActive: true,
  },
];

export const mockFlows: AutoFlow[] = [
  {
    id: '1',
    name: 'Boas-vindas',
    description: 'Mensagem automática para novos contatos',
    trigger: 'event',
    triggerValue: 'first_contact',
    steps: [
      { id: '1', type: 'message', content: 'Olá! Bem-vindo ao nosso atendimento. Sou o assistente virtual da TechFlow.', nextStepId: '2' },
      { id: '2', type: 'delay', content: '2', nextStepId: '3' },
      { id: '3', type: 'message', content: 'Como posso ajudar você hoje?' },
    ],
    isActive: true,
    usageCount: 450,
    createdAt: '2026-01-10T00:00:00',
  },
  {
    id: '2',
    name: 'Fora do Horário',
    description: 'Resposta automática fora do expediente',
    trigger: 'time',
    triggerValue: 'after_hours',
    steps: [
      { id: '1', type: 'message', content: 'Olá! Nosso horário de atendimento é de segunda a sexta, das 9h às 18h.', nextStepId: '2' },
      { id: '2', type: 'message', content: 'Deixe sua mensagem que responderemos assim que possível. Ou consulte nossa FAQ: exemplo.com/faq' },
    ],
    isActive: true,
    usageCount: 189,
    createdAt: '2026-01-15T00:00:00',
  },
  {
    id: '3',
    name: 'Coleta de Feedback',
    description: 'Solicita avaliação após resolução',
    trigger: 'event',
    triggerValue: 'conversation_resolved',
    steps: [
      { id: '1', type: 'delay', content: '5', nextStepId: '2' },
      { id: '2', type: 'message', content: 'Sua conversa foi encerrada. Como você avalia nosso atendimento?', nextStepId: '3' },
      { id: '3', type: 'message', content: 'Responda com uma nota de 1 a 5 ⭐' },
    ],
    isActive: true,
    usageCount: 312,
    createdAt: '2026-02-01T00:00:00',
  },
];

export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    email: 'carlos@empresa.com.br',
    role: 'admin',
    status: 'online',
    activeChats: 0,
    resolvedToday: 5,
    avgResponseTime: 45,
    satisfaction: 4.9,
  },
  {
    id: '2',
    name: 'Ana Rodrigues',
    email: 'ana@empresa.com.br',
    role: 'supervisor',
    status: 'online',
    activeChats: 3,
    resolvedToday: 12,
    avgResponseTime: 38,
    satisfaction: 4.7,
  },
  {
    id: '3',
    name: 'Lucas Mendes',
    email: 'lucas@empresa.com.br',
    role: 'agent',
    status: 'online',
    activeChats: 5,
    resolvedToday: 18,
    avgResponseTime: 52,
    satisfaction: 4.5,
  },
  {
    id: '4',
    name: 'Fernanda Lima',
    email: 'fernanda@empresa.com.br',
    role: 'agent',
    status: 'away',
    activeChats: 2,
    resolvedToday: 8,
    avgResponseTime: 41,
    satisfaction: 4.8,
  },
  {
    id: '5',
    name: 'Roberto Costa',
    email: 'roberto@empresa.com.br',
    role: 'agent',
    status: 'offline',
    activeChats: 0,
    resolvedToday: 15,
    avgResponseTime: 35,
    satisfaction: 4.6,
  },
];

export const mockDashboardStats: DashboardStats = {
  totalConversations: 1247,
  activeConversations: 23,
  resolvedToday: 58,
  aiHandledPercent: 78,
  avgResponseTime: 12,
  satisfaction: 4.7,
  messagesProcessed: 4892,
  intentAccuracy: 94,
};

export const mockAnalyticsData: AnalyticsData[] = [
  { date: '06/03', conversations: 145, aiHandled: 112, humanHandled: 33, avgResponseTime: 14, satisfaction: 4.5 },
  { date: '07/03', conversations: 167, aiHandled: 134, humanHandled: 33, avgResponseTime: 11, satisfaction: 4.6 },
  { date: '08/03', conversations: 132, aiHandled: 98, humanHandled: 34, avgResponseTime: 15, satisfaction: 4.4 },
  { date: '09/03', conversations: 189, aiHandled: 151, humanHandled: 38, avgResponseTime: 12, satisfaction: 4.7 },
  { date: '10/03', conversations: 156, aiHandled: 125, humanHandled: 31, avgResponseTime: 10, satisfaction: 4.8 },
  { date: '11/03', conversations: 178, aiHandled: 142, humanHandled: 36, avgResponseTime: 13, satisfaction: 4.6 },
  { date: '12/03', conversations: 198, aiHandled: 158, humanHandled: 40, avgResponseTime: 11, satisfaction: 4.7 },
];

// Helper functions
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function formatDateTime(dateString: string): string {
  return `${formatDate(dateString)} ${formatTime(dateString)}`;
}

export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'agora';
  if (diffMins < 60) return `${diffMins}min`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return formatDate(dateString);
}

export function getStatusColor(status: ConversationStatus): string {
  switch (status) {
    case 'active': return 'bg-emerald-100 text-emerald-700';
    case 'pending': return 'bg-amber-100 text-amber-700';
    case 'resolved': return 'bg-slate-100 text-slate-700';
    case 'escalated': return 'bg-indigo-100 text-indigo-700';
    default: return 'bg-slate-100 text-slate-700';
  }
}

export function getStatusLabel(status: ConversationStatus): string {
  switch (status) {
    case 'active': return 'Ativo';
    case 'pending': return 'Pendente';
    case 'resolved': return 'Resolvido';
    case 'escalated': return 'Escalado';
    default: return status;
  }
}

export function getMemberStatusColor(status: TeamMember['status']): string {
  switch (status) {
    case 'online': return 'bg-emerald-500';
    case 'away': return 'bg-amber-500';
    case 'offline': return 'bg-slate-400';
    default: return 'bg-slate-400';
  }
}

export function getRoleLabel(role: TeamMember['role']): string {
  switch (role) {
    case 'admin': return 'Administrador';
    case 'supervisor': return 'Supervisor';
    case 'agent': return 'Agente';
    default: return role;
  }
}
