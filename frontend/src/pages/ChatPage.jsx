import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, Bot, User, ArrowLeft, AlertTriangle } from 'lucide-react';

const ChatPage = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const bottomRef = useRef(null);

  // AnalysisPanel'den gelen bağlam (risk verisi)
  const context = location.state ?? {};

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        context.risk_percentage != null
          ? `Merhaba! Analiz sonucunuza göre risk seviyeniz **%${context.risk_percentage}** (${context.risk_level ?? ''}). Bu sonuç veya risk faktörleriniz hakkında sormak istediğiniz bir şey var mı?`
          : 'Merhaba! İnme riski, sağlık verileriniz veya risk azaltma yöntemleri hakkında sorularınızı yanıtlayabilirim.',
    },
  ]);
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    document.title = 'AI Asistan — StrokePredict AI';
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const updated = [...messages, { role: 'user', content: text }];
    setMessages(updated);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://127.0.0.1:8000/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          messages: updated,
          risk_level:      context.risk_level      ?? 'unknown',
          risk_percentage: context.risk_percentage ?? 0,
          patient_data:    context.patient_data    ?? {},
        }),
      });

      const data = await res.json();
      setMessages([...updated, { role: 'assistant', content: data.response }]);
    } catch {
      setError('Sunucuya bağlanılamadı. Backend çalışıyor mu?');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="bg-[#f6f6f8] min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-4 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft size={18} className="text-slate-500" />
        </button>
        <div className="w-9 h-9 rounded-xl bg-[#143db8] flex items-center justify-center">
          <Bot size={20} className="text-white" />
        </div>
        <div>
          <h1 className="font-black text-slate-900 text-sm">AI Sağlık Asistanı</h1>
          <p className="text-[11px] text-slate-400">İnme riski ve sağlık sorularınız için</p>
        </div>
        {context.risk_percentage != null && (
          <span className={`ml-auto px-3 py-1 rounded-full text-[10px] font-bold ${
            context.risk_percentage >= 70 ? 'bg-red-100 text-red-700'
            : context.risk_percentage >= 35 ? 'bg-amber-100 text-amber-700'
            : 'bg-emerald-100 text-emerald-700'
          }`}>
            Risk: %{context.risk_percentage}
          </span>
        )}
      </div>

      {/* Mesajlar */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-3xl w-full mx-auto space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-[#143db8]' : 'bg-slate-200'
            }`}>
              {msg.role === 'user'
                ? <User size={16} className="text-white" />
                : <Bot  size={16} className="text-slate-600" />
              }
            </div>
            {/* Balon */}
            <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-[#143db8] text-white rounded-tr-sm'
                : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Yazıyor animasyonu */}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
              <Bot size={16} className="text-slate-600" />
            </div>
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1 items-center h-4">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <AlertTriangle size={14} /> {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-slate-100 px-4 py-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Mesajınızı yazın... (Enter ile gönder)"
            className="flex-1 resize-none p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#143db8]/30 focus:border-[#143db8] text-sm transition-all"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="w-11 h-11 bg-[#143db8] rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Send size={18} className="text-white" />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-2">
          Bu asistan tıbbi teşhis koymaz. Acil durumlarda 112'yi arayın.
        </p>
      </div>
    </div>
  );
};

export default ChatPage;
