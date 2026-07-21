import React, { useState, useEffect } from 'react';
import { Search, X, Code2, Cpu, FileText, ExternalLink, Copy, Check, ArrowRight } from 'lucide-react';

interface SearchResult {
  id: string;
  title: str;
  category: string;
  description: string;
  badge?: string;
  target_tab?: string;
  snippet?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: 'pods' | 'serverless' | 'sdk') => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectTab }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      performSearch('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const performSearch = async (qText: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(qText)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    performSearch(val);
  };

  const handleCopySnippet = (snippet: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(snippet);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleItemClick = (item: SearchResult) => {
    if (item.target_tab === 'docs') {
      window.open('/docs', '_blank');
    } else if (item.target_tab === 'pods' || item.target_tab === 'serverless' || item.target_tab === 'sdk') {
      onSelectTab(item.target_tab);
    }
    onClose();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'API Endpoint': return <Code2 size={16} color="#38bdf8" />;
      case 'SDK Method': return <Code2 size={16} color="#c084fc" />;
      case 'GPU Hardware': return <Cpu size={16} color="#10b981" />;
      default: return <FileText size={16} color="#f59e0b" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(7, 4, 18, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      paddingTop: '6vh',
      zIndex: 400
    }} onClick={onClose}>
      <div
        className="glass-panel"
        style={{
          width: '100%', maxWidth: '680px',
          background: 'rgba(14, 8, 38, 0.98)',
          border: '1px solid rgba(123, 63, 228, 0.5)',
          borderRadius: '16px',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.9), 0 0 40px rgba(123, 63, 228, 0.3)',
          overflow: 'hidden'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '1.1rem 1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Search size={20} color="#9a66f4" />
          <input
            type="text"
            placeholder="Search RunPod API, SDK methods, GPUs (H100, A100, vLLM)..."
            value={query}
            onChange={handleInputChange}
            autoFocus
            style={{
              flex: 1, background: 'transparent !important', border: 'none !important',
              boxShadow: 'none !important', fontSize: '1.05rem', color: '#fff'
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', border: '1px solid rgba(255, 255, 255, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>ESC</span>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '440px', overflowY: 'auto', padding: '0.75rem' }}>
          {results.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No API or SDK results found for "{query}".
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {results.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(123, 63, 228, 0.15)', e.currentTarget.style.borderColor = 'rgba(123, 63, 228, 0.4)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)', e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {getCategoryIcon(item.category)}
                      <strong style={{ fontSize: '0.95rem', color: '#ffffff' }}>{item.title}</strong>
                      {item.badge && <span className="badge-tag">{item.badge}</span>}
                    </div>

                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      Jump to <ArrowRight size={12} />
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.description}</p>

                  {item.snippet && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#04020a', padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#c084fc', marginTop: '0.2rem' }}>
                      <span>{item.snippet}</span>
                      <button onClick={(e) => handleCopySnippet(item.snippet!, item.id, e)} style={{ background: 'transparent', border: 'none', color: '#9a66f4', cursor: 'pointer', fontSize: '0.7rem' }}>
                        {copiedId === item.id ? <Check size={12} style={{ display: 'inline' }} /> : <Copy size={12} style={{ display: 'inline' }} />} Copy
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '0.75rem 1.25rem', background: 'rgba(7, 4, 18, 0.8)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)'
        }}>
          <span>Press <strong>Cmd + K</strong> or <strong>Esc</strong> to toggle search</span>
          <a href="/docs" target="_blank" rel="noreferrer" style={{ color: '#c084fc', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Open OpenAPI Docs <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
};
