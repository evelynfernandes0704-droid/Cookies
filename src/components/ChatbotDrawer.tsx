import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { CookieProduct } from '../data/cookiesData';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  stockSnapshotCount?: number;
  engineUsed?: string;
}

interface ChatbotDrawerProps {
  isOpen: boolean;
  onToggleOpen: () => void;
  products: CookieProduct[];
  stockPreset: 'filled' | 'zero' | 'custom';
  externalPrompt: string | null;
  onClearExternalPrompt: () => void;
  onSetFilledStock: () => void;
  onSetZeroStock: () => void;
  groqApiKey?: string;
  onChangeGroqApiKey?: (key: string) => void;
}

const SUGGESTED_QUESTIONS = [
  'Quais cookies estão disponíveis em estoque agora?',
  'Qual a ficha técnica e estoque do Pistache Iraniano?',
  'Quais são as opções veganas, sem glúten ou proteicas?',
  'Quais são as variações de caixas e latas e seus valores?',
  'Qual cookie tem recheio de Gianduia e como aquecer?',
];

export const ChatbotDrawer: React.FC<ChatbotDrawerProps> = ({
  isOpen,
  onToggleOpen,
  products,
  stockPreset,
  externalPrompt,
  onClearExternalPrompt,
  onSetFilledStock,
  onSetZeroStock,
  groqApiKey = '',
}) => {
  const totalStoreStock = products.reduce(
    (sum, p) => sum + p.variations.reduce((vSum, v) => vSum + v.stock, 0),
    0
  );

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content:
        'Olá! Sou o especialista técnico de atendimento do **Atelier Crumb**. Consulto nosso estoque e fichas técnicas em tempo real para todas as **4 categorias e 20 sabores**.\n\nVocê pode perguntar sobre disponibilidade de variações, gramatura, forneamento, alérgenos ou valores!',
      timestamp: 'Agora',
      stockSnapshotCount: totalStoreStock,
    },
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (externalPrompt && isOpen) {
      handleSendMessage(externalPrompt);
      onClearExternalPrompt();
    }
  }, [externalPrompt, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend ?? inputValue).trim();
    if (!query || isLoading) return;

    if (!textToSend) {
      setInputValue('');
    }

    const nowTime = new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: nowTime,
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          inventory: products,
          stockPreset,
          clientGroqKey: groqApiKey.trim(),
        }),
      });

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content:
          data.reply ||
          'Consultei nosso catálogo, mas não consegui formatar a resposta. Pode reformular sua dúvida?',
        timestamp: new Date().toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        stockSnapshotCount: totalStoreStock,
        engineUsed: data.engine,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content:
          totalStoreStock === 0
            ? 'Consultei o estoque local: atenção, **nosso estoque encontra-se ZERADO (0 unidades)** em todas as categorias no momento. Ative o botão **"Estoque Preenchido"** para liberar a pronta entrega!'
            : `Consultei nosso estoque local: temos **${totalStoreStock} unidades disponíveis** distribuídas nas 4 categorias (Clássicos, Recheados, Gourmet e Veganos).`,
        timestamp: nowTime,
        stockSnapshotCount: totalStoreStock,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormattedContent = (content: string) => {
    return content.split('\n').map((line, lineIdx) => {
      if (line.trim() === '---') {
        return <hr key={lineIdx} className="my-2.5 border-[#18181B]/12" />;
      }
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={lineIdx} className={`${line.trim() === '' ? 'h-2' : 'leading-relaxed'}`}>
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={i} className="font-semibold text-inherit">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return <span key={i}>{part}</span>;
          })}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Action Button when closed */}
      {!isOpen && (
        <button
          type="button"
          onClick={onToggleOpen}
          className="fixed bottom-5 right-5 z-40 px-4 py-3 bg-[#2C1A12] hover:bg-[#18181B] text-[#FAF9F6] shadow-xl border border-[#FAF9F6]/15 flex items-center gap-3 transition-transform duration-150 hover:-translate-y-0.5"
        >
          <MessageSquare className="w-4 h-4 shrink-0" />
          <div className="text-left">
            <div className="text-xs font-semibold whitespace-nowrap">
              Bot de Atendimento · Consulta Estoque
            </div>
            <div className="text-[10px] font-mono opacity-80 tabular-nums whitespace-nowrap">
              {totalStoreStock === 0
                ? 'Alerta: Estoque Zerado (0 un.)'
                : `Estoque Ativo (${totalStoreStock} un. disponíveis)`}
            </div>
          </div>
        </button>
      )}

      {/* Slide-over Chatbot Panel */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-[#FAF9F6] border-l border-[#18181B]/15 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 bg-[#2C1A12] text-[#FAF9F6] flex items-center justify-between border-b border-[#FAF9F6]/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-base font-semibold">
                  Concierge Técnico Atelier Crumb
                </span>
              </div>
              <div className="text-[11px] text-[#FAF9F6]/80 font-mono mt-0.5">
                Agente Inteligente Groq · Estoque em Tempo Real
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() =>
                  setMessages([
                    {
                      id: `welcome-${Date.now()}`,
                      role: 'assistant',
                      content:
                        totalStoreStock === 0
                          ? 'Conversa reiniciada! Notei que o **estoque está ZERADO (0 unidades)** no momento. Posso tirar dúvidas sobre fichas técnicas, alérgenos e valores, ou você pode clicar em **"Preencher Estoque"** abaixo.'
                          : `Conversa reiniciada! Nosso estoque atual conta com **${totalStoreStock} unidades prontas** nos 20 sabores. Como posso ajudar?`,
                      timestamp: 'Agora',
                      stockSnapshotCount: totalStoreStock,
                    },
                  ])
                }
                title="Limpar histórico de conversa"
                className="w-8 h-8 flex items-center justify-center text-[#FAF9F6]/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onToggleOpen}
                aria-label="Fechar chat"
                className="w-8 h-8 flex items-center justify-center text-[#FAF9F6]/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Live Stock Context Strip inside Chat */}
          <div className="px-4 py-2.5 bg-[#F3F1EC] border-b border-[#18181B]/10 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              {totalStoreStock === 0 ? (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-[#DC2626] shrink-0" />
                  <span className="text-[#991B1B] font-medium truncate">
                    Leitura do Bot: Estoque Zerado (0 un.)
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                  <span className="text-[#18181B] font-medium truncate font-mono tabular-nums">
                    Leitura do Bot: {totalStoreStock} un. em estoque
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={onSetFilledStock}
                className={`px-2 py-1 text-[11px] font-medium border transition-colors ${
                  totalStoreStock > 0
                    ? 'bg-[#16A34A] text-white border-[#16A34A]'
                    : 'bg-white text-[#18181B] border-[#18181B]/20 hover:border-[#18181B]'
                }`}
              >
                Preenchido
              </button>
              <button
                type="button"
                onClick={onSetZeroStock}
                className={`px-2 py-1 text-[11px] font-medium border transition-colors ${
                  totalStoreStock === 0
                    ? 'bg-[#DC2626] text-white border-[#DC2626]'
                    : 'bg-white text-[#18181B] border-[#18181B]/20 hover:border-[#DC2626]'
                }`}
              >
                Zerado
              </button>
            </div>
          </div>

          {/* Messages Viewport */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[90%] p-3.5 text-xs ${
                    msg.role === 'user'
                      ? 'bg-[#2C1A12] text-[#FAF9F6]'
                      : 'bg-white text-[#18181B] border border-[#18181B]/12'
                  }`}
                >
                  <div className="space-y-1">{renderFormattedContent(msg.content)}</div>
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-[#64615A] font-mono tabular-nums">
                  <span>{msg.role === 'user' ? 'Você' : 'Atendimento Groq'}</span>
                  <span>·</span>
                  <span>{msg.timestamp}</span>
                  {msg.role === 'assistant' && msg.stockSnapshotCount !== undefined && (
                    <>
                      <span>·</span>
                      <span>Estoque lido: {msg.stockSnapshotCount} un.</span>
                    </>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start">
                <div className="p-3.5 bg-white border border-[#18181B]/12 text-xs text-[#64615A] font-mono">
                  Consultando estoque em tempo real e fichas técnicas...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggested Questions */}
          <div className="px-4 py-2.5 bg-[#F3F1EC] border-t border-[#18181B]/10">
            <div className="text-[11px] font-medium text-[#64615A] mb-1.5">
              Perguntas rápidas ao estoque e catálogo:
            </div>
            <div className="flex overflow-x-auto gap-1.5 pb-1">
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(q)}
                  disabled={isLoading}
                  className="px-2.5 py-1.5 bg-white hover:bg-[#2C1A12] hover:text-[#FAF9F6] text-[#18181B] border border-[#18181B]/15 text-[11px] whitespace-nowrap transition-colors flex items-center gap-1 shrink-0"
                >
                  <span>{q}</span>
                  <ChevronRight className="w-3 h-3 opacity-60" />
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-[#18181B]/15 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Pergunte sobre sabores, estoque, alérgenos ou preços..."
              className="flex-1 px-3 py-2.5 text-xs bg-[#FAF9F6] border border-[#18181B]/20 focus:outline-none focus:border-[#2C1A12]"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="h-9 px-4 bg-[#2C1A12] hover:bg-[#18181B] disabled:opacity-40 text-[#FAF9F6] text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
};
