'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  LogoIcon,
  DashboardIcon,
  ChatIcon,
  KnowledgeIcon,
  BrainIcon,
  FlowIcon,
  ContactsIcon,
  AnalyticsIcon,
  TeamIcon,
  SettingsIcon,
  ChevronDownIcon,
  LogoutIcon,
  WhatsAppIcon,
  BellIcon,
  ClockIcon,
  KeyIcon,
  TrendUpIcon,
  SmileIcon,
  MenuIcon,
  XIcon,
  CategoryIcon,
} from './Icons';

interface NavItem {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { name: string; href: string; icon: React.ComponentType<{ className?: string }> }[];
  roles?: ('admin' | 'supervisor' | 'agent')[];
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
  { name: 'Conversas', href: '/conversas', icon: ChatIcon },
  {
    name: 'Base de Conhecimento',
    icon: KnowledgeIcon,
    children: [
      { name: 'Todas as FAQs', href: '/base-conhecimento', icon: KnowledgeIcon },
      { name: 'Nova FAQ', href: '/base-conhecimento/nova', icon: KnowledgeIcon },
      { name: 'Categorias', href: '/base-conhecimento/categorias', icon: CategoryIcon },
    ],
  },
  {
    name: 'Intenções IA',
    icon: BrainIcon,
    roles: ['admin', 'supervisor'],
    children: [
      { name: 'Todas Intenções', href: '/intencoes', icon: BrainIcon },
      { name: 'Nova Intenção', href: '/intencoes/nova', icon: BrainIcon },
    ],
  },
  {
    name: 'Fluxos Automáticos',
    icon: FlowIcon,
    roles: ['admin', 'supervisor'],
    children: [
      { name: 'Todos Fluxos', href: '/fluxos', icon: FlowIcon },
      { name: 'Novo Fluxo', href: '/fluxos/novo', icon: FlowIcon },
    ],
  },
  { name: 'Contatos', href: '/contatos', icon: ContactsIcon },
  {
    name: 'Analytics',
    icon: AnalyticsIcon,
    roles: ['admin', 'supervisor'],
    children: [
      { name: 'Visão Geral', href: '/analytics', icon: AnalyticsIcon },
      { name: 'Tempo de Resposta', href: '/analytics/respostas', icon: TrendUpIcon },
      { name: 'Satisfação', href: '/analytics/satisfacao', icon: SmileIcon },
      { name: 'Performance IA', href: '/analytics/ia', icon: BrainIcon },
    ],
  },
  {
    name: 'Equipe',
    icon: TeamIcon,
    roles: ['admin', 'supervisor'],
    children: [
      { name: 'Membros', href: '/equipe', icon: TeamIcon },
      { name: 'Novo Membro', href: '/equipe/novo', icon: TeamIcon },
    ],
  },
  {
    name: 'Configurações',
    icon: SettingsIcon,
    roles: ['admin'],
    children: [
      { name: 'WhatsApp', href: '/configuracoes/whatsapp', icon: WhatsAppIcon },
      { name: 'Notificações', href: '/configuracoes/notificacoes', icon: BellIcon },
      { name: 'Horários', href: '/configuracoes/horarios', icon: ClockIcon },
      { name: 'API', href: '/configuracoes/api', icon: KeyIcon },
    ],
  },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, logout, hasPermission } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    navigation.forEach(item => {
      if (item.children?.some(child => pathname.startsWith(child.href))) {
        setExpandedItems(prev => (prev.includes(item.name) ? prev : [...prev, item.name]));
      }
    });
  }, [pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isParentActive = (children?: { href: string }[]) =>
    children?.some(child => pathname.startsWith(child.href));

  const canAccess = (item: NavItem) => {
    if (!item.roles) return true;
    return item.roles.some(role => hasPermission(role));
  };

  const filteredNavigation = navigation.filter(canAccess);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-5 border-b border-indigo-100 shrink-0">
        <LogoIcon className="w-10 h-10 shrink-0" />
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-slate-800 truncate">ZapSmart</h1>
          <p className="text-xs text-slate-500 truncate">Atendimento Inteligente</p>
        </div>
      </div>

      {user && (
        <div className="px-4 py-4 border-b border-indigo-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-semibold shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {filteredNavigation.map(item => (
          <div key={item.name}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleExpanded(item.name)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isParentActive(item.children)
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </span>
                  <ChevronDownIcon
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      expandedItems.includes(item.name) ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {expandedItems.includes(item.name) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 mt-1 space-y-1">
                        {item.children.map(child => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                              isActive(child.href)
                                ? 'bg-indigo-600 text-white'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                            }`}
                          >
                            <child.icon className="w-4 h-4 shrink-0" />
                            <span className="truncate">{child.name}</span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link
                href={item.href!}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href!)
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="truncate">{item.name}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-indigo-100 shrink-0">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogoutIcon className="w-5 h-5 shrink-0" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-indigo-100 shadow-sm">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <LogoIcon className="w-8 h-8" />
            <span className="font-bold text-slate-800">ZapSmart</span>
          </Link>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white text-sm font-semibold">
            {user?.name.charAt(0)}
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/50"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-[260px] max-w-[85vw] bg-white shadow-xl"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors z-10"
              >
                <XIcon className="w-5 h-5" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside
        className="hidden lg:flex flex-col bg-white border-r border-indigo-100 h-screen sticky top-0 shrink-0"
        style={{ width: '260px' }}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
