import React, { useState } from 'react';
import { X, Send, Bot, User, Code2, Cpu, Copy, Check, Sparkles } from 'lucide-react';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  code_snippet?: string | null;
  language?: string;
  suggested_actions?: string[];
  gpu_recommendation?: string | null;
}

interface AskRunpodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: 'pods' | 'serverless' | 'sdk') => void;
}

export const AskRunpodModal: React.FC<AskRunpodModalProps> = ({ isOpen, onClose, onSelectTab }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: "👋 Hi, I'm the RunPod AI Assistant! Ask me anything about deploying GPU Pods, serverless vLLM autoscaling, compute pricing, or SDK integration.",
      suggested_actions: ["Deploy vLLM Serverless", "Compare H100 vs A100 Costs", "Python SDK Code Snippet"]
    }
  ]);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/assistant/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: textToSend })
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [
          ...prev,
          {
            sender: 'assistant',
            text: data.answer,
            code_snippet: data.code_snippet,
            language: data.language,
            suggested_actions: data.suggested_actions,
            gpu_recommendation: data.gpu_recommendation
          }
        ]);
      }
    } catch (e) {
      setMessages(prev => [
        ...prev,
        { sender: 'assistant', text: 'Apologies, unable to process request. Please try again.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleActionClick = (action: string) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('serverless') || actionLower.includes('vllm')) {
      onSelectTab('serverless');
      onClose();
    } else if (actionLower.includes('sdk') || actionLower.includes('code')) {
      onSelectTab('sdk');
      onClose();
    } else {
      onSelectTab('pods');
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      width: '440px',
      height: '620px',
      maxHeight: '85vh',
      background: 'rgba(12, 7, 32, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(123, 63, 228, 0.5)',
      borderRadius: '20px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(123, 63, 228, 0.3)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 300,
      overflow: 'hidden'
    }}>
      {/* Drawer Header */}
      <div style={{
        padding: '1rem 1.25rem',
        background: 'linear-gradient(90deg, rgba(28, 17, 72, 0.9), rgba(18, 11, 48, 0.9))',
        borderBottom: '1px solid rgba(123, 63, 228, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #7b3fe4, #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 12px rgba(123, 63, 228, 0.6)'
          }}>
            <Bot size={18} color="#fff" />
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              Ask RunPod AI <Sparkles size={14} color="#c084fc" />
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Infrastructure & SDK Co-Pilot</p>
          </div>
        </div>

        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>

      {/* Messages Feed */}
      <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            display: 'flex', gap: '0.65rem',
            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
          }}>
            {msg.sender === 'assistant' && (
              <div style={{
                width: '28px', height: '28px', borderRadius: '8px',
                background: 'rgba(123, 63, 228, 0.2)', border: '1px solid rgba(123, 63, 228, 0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Bot size={14} color="#c084fc" />
              </div>
            )}

            <div style={{ maxWidth: '85%' }}>
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: '14px',
                fontSize: '0.85rem',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
                background: msg.sender === 'user' ? 'linear-gradient(135deg, #7b3fe4, #6366f1)' : 'rgba(255, 255, 255, 0.06)',
                border: msg.sender === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff'
              }}>
                {msg.text}
              </div>

              {/* Code Snippet if present */}
              {msg.code_snippet && (
                <div style={{ marginTop: '0.5rem', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#04020a', padding: '0.3rem 0.6rem', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '0.7rem', color: '#a7b0cf' }}>
                    <span><Code2 size={12} style={{ display: 'inline', marginRight: '4px' }} /> Python SDK</span>
                    <button onClick={() => handleCopyCode(msg.code_snippet!, idx)} style={{ background: 'transparent', border: 'none', color: '#c084fc', cursor: 'pointer', fontSize: '0.7rem' }}>
                      {copiedIdx === idx ? <Check size={12} style={{ display: 'inline' }} /> : <Copy size={12} style={{ display: 'inline' }} />} Copy
                    </button>
                  </div>
                  <div className="code-block" style={{ fontSize: '0.75rem', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                    {msg.code_snippet}
                  </div>
                </div>
              )}

              {/* GPU Recommendation Badge */}
              {msg.gpu_recommendation && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', padding: '0.4rem 0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Cpu size={14} /> <strong>Recommended:</strong> {msg.gpu_recommendation}
                </div>
              )}

              {/* Action Chip Shortcuts */}
              {msg.suggested_actions && msg.suggested_actions.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.6rem' }}>
                  {msg.suggested_actions.map((act, aIdx) => (
                    <button
                      key={aIdx}
                      onClick={() => handleActionClick(act)}
                      style={{
                        fontSize: '0.72rem', fontWeight: 600, padding: '0.3rem 0.65rem',
                        borderRadius: '16px', background: 'rgba(123, 63, 228, 0.18)',
                        border: '1px solid rgba(123, 63, 228, 0.4)', color: '#d8b4fe',
                        cursor: 'pointer'
                      }}
                    >
                      ⚡ {act}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div style={{
                width: '28px', height: '28px', borderRadius: '8px',
                background: 'linear-gradient(135deg, #7b3fe4, #6366f1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <User size={14} color="#fff" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            <Bot size={16} color="#c084fc" /> RunPod AI is thinking...
          </div>
        )}
      </div>

      {/* Input Box */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{
        padding: '0.85rem 1rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(7, 4, 18, 0.9)',
        display: 'flex',
        gap: '0.5rem'
      }}>
        <input
          type="text"
          placeholder="Ask RunPod AI (e.g. vLLM setup, H100 pricing)..."
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ flex: 1, fontSize: '0.85rem' }}
        />
        <button type="submit" className="btn-primary-glow" style={{ padding: '0.6rem 1rem', borderRadius: '12px' }}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
