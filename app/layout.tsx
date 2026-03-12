import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'ZapSmart - Sistema de Atendimento Inteligente via WhatsApp',
  description: 'Sistema de respostas automáticas com inteligência artificial para WhatsApp. Otimize seu atendimento ao cliente com IA.',
  keywords: 'whatsapp, chatbot, ia, inteligência artificial, atendimento, automação, crm',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
