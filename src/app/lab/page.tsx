"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/lib/supabase';
import {
  Plus,
  Menu,
  Search,
  History,
  ChevronRight,
  MessageSquare,
  FileText,
  Upload,
  X,
  Zap,
  ArrowRight,
  Shield,
  Trash2,
  AlertCircle,
  Copy,
  Check,
  Edit2,
  Save
} from 'lucide-react';
import { toast, Toaster } from 'sonner';

interface Article {
  id: string;
  title: string;
  content: string;
  source_url: string;
  is_updated: boolean;
  original_id: string | null;
  reference_links: { url: string; title: string }[];
  created_at: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [enhancing, setEnhancing] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'view' | 'compare' | 'chat'>('view');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success('Content copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const fetchArticles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setArticles(data);
      if (data.length > 0 && !selectedArticleId) {
        setSelectedArticleId(data[0].id);
      }
    }
    setLoading(false);
  };

  const handleScrape = async () => {
    setScraping(true);
    const promise = fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'scrape' })
    });

    toast.promise(promise, {
      loading: 'Scanning BeyondChats blog...',
      success: (res) => {
        fetchArticles();
        return 'Intelligence report successfully compiled.';
      },
      error: 'Data extraction failed.'
    });

    await promise;
    setScraping(false);
  };

  const handleEnhance = async (id: string) => {
    setEnhancing(id);
    const promise = fetch(`/api/articles/${id}/enhance`, {
      method: 'POST'
    });

    toast.promise(promise, {
      loading: 'Synthesizing advanced intelligence...',
      success: (res) => {
        fetchArticles();
        return 'Content successfully optimized and cross-referenced.';
      },
      error: 'Enhancement sequence interrupted.'
    });

    await promise;
    setEnhancing(null);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (!error) {
      setArticles(articles.filter((a: Article) => a.id !== id));
      if (selectedArticleId === id) setSelectedArticleId(articles[0]?.id || null);
      toast.success('Data purged from archives.');
    }
  };

  const handleEdit = (content: string) => {
    setEditContent(content);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent('');
  };

  const handleSave = async (id: string) => {
    if (!editContent.trim()) return;
    setIsSaving(true);

    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent })
      });

      if (res.ok) {
        const updated = await res.json();
        setArticles(articles.map((a: Article) => a.id === id ? { ...a, content: updated.content } : a));
        setIsEditing(false);
        setEditContent('');
        toast.success('Article updated successfully.');
      } else {
        toast.error('Failed to save changes.');
      }
    } catch (err) {
      toast.error('Save operation failed.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isChatLoading || !selectedArticleId) return;

    const selectedArticle = articles.find((a: Article) => a.id === selectedArticleId);
    const userMessage: ChatMessage = { role: 'user', content: inputMessage };
    setChatMessages((prev: ChatMessage[]) => [...prev, userMessage]);
    setInputMessage('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          history: chatMessages,
          context: selectedArticle?.content || ''
        })
      });

      const data = await res.json();
      if (data.response) {
        setChatMessages((prev: ChatMessage[]) => [...prev, { role: 'assistant', content: data.response }]);
      }
    } catch (err) {
      toast.error('Neural link lost.');
    } finally {
      setIsChatLoading(false);
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      const promise = fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: file.name.replace(/\.[^/.]+$/, ""),
          content: text,
          source_url: 'Local Upload',
          is_updated: false
        })
      });

      toast.promise(promise, {
        loading: 'Uploading document...',
        success: () => {
          fetchArticles();
          setIsUploadOpen(false);
          return 'Document integrated into database.';
        },
        error: 'Upload failed.'
      });
    };
    reader.readAsText(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/plain': ['.txt'], 'text/markdown': ['.md'] },
    multiple: false
  });

  const selectedArticle = articles.find((a: Article) => a.id === selectedArticleId);
  const enhancedVersion = articles.find((a: Article) => a.original_id === selectedArticleId);
  const originalVersion = articles.find((a: Article) => a.id === selectedArticle?.original_id);

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black flex overflow-hidden font-sans">
      <Toaster theme="dark" position="bottom-right" />

      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed md:relative top-0 left-0 h-screen w-[85vw] sm:w-80 max-w-80 bg-[#080808] border-r border-white/5 flex flex-col z-50 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>
        <div className="p-6 border-b border-white/5 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2 mb-8 group">
            <div className="w-8 h-8 flex items-center justify-center">
              <Image
                src="/beyondchats-logo.png"
                alt="BeyondChats Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase">BeyondChats Lab</span>
          </Link>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleScrape}
              disabled={scraping}
              className="w-full flex items-center justify-between px-4 py-3 bg-white text-black font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-white/90 transition-all disabled:opacity-50"
            >
              <span>{scraping ? 'Scanning...' : 'Scrape Data'}</span>
              <Zap className={`w-3 h-3 ${scraping ? 'animate-pulse' : ''}`} />
            </button>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="w-full flex items-center justify-between px-4 py-3 border border-white/10 font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-white/5 transition-all"
            >
              <span>Upload Doc</span>
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto archives-scrollbar p-3">
          <div className="px-2 mb-3 font-mono text-[8px] tracking-[0.4em] text-white/30 uppercase">
            Archives
          </div>

          <div className="flex flex-col gap-1">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 animate-shimmer rounded-sm mb-1" />
              ))
            ) : (
              articles.filter((a: Article) => !a.is_updated).map((article: Article) => {
                const isEnhanced = articles.some((a: Article) => a.original_id === article.id);
                return (
                  <button
                    key={article.id}
                    onClick={() => {
                      setSelectedArticleId(article.id);
                      setChatMessages([]);
                      setViewMode('view');
                      setIsSidebarOpen(false);
                    }}
                    className={`group w-full text-left p-3 rounded-sm transition-all relative ${selectedArticleId === article.id
                      ? 'bg-white/5 border border-white/10'
                      : 'hover:bg-white/[0.03] border border-transparent'
                      }`}
                  >
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-6 transition-all ${selectedArticleId === article.id ? 'bg-white' : 'bg-transparent group-hover:bg-white/20'
                      }`} />
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium leading-tight line-clamp-1">
                          {article.title}
                        </span>
                        {isEnhanced && <div className="w-1.5 h-1.5 rounded-full bg-sky-500 pulse-glow" />}
                      </div>
                      <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest">
                        {new Date(article.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        <div className="p-4 border-t border-white/5 flex-shrink-0">
          <div className="flex items-center gap-3 px-3 py-2 bg-sky-500/5 border border-sky-500/10 rounded-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
            <span className="font-mono text-[8px] text-sky-500 uppercase tracking-[0.2em]">Neural Link Online</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="flex-1 flex flex-col h-screen relative bg-[#050505]">
        {selectedArticle ? (
          <>
            {/* Context Header */}
            <header className="h-14 md:h-12 border-b border-white/5 flex items-center justify-between px-4 md:px-6 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-30">
              <div className="flex items-center gap-4 md:gap-8">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="md:hidden p-1 text-white/60 hover:text-white"
                  aria-label="Toggle Sidebar"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <nav className="flex items-center gap-0 sm:gap-1">
                  {(['view', 'compare', 'chat'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`px-2 sm:px-4 py-2 font-mono text-[9px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-all relative ${viewMode === mode ? 'text-white' : 'text-white/40 hover:text-white/60'
                        }`}
                    >
                      {mode}
                      {viewMode === mode && (
                        <motion.div layoutId="mode-underline" className="absolute bottom-0 left-4 right-4 h-[1px] bg-white" />
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Header Button Logic */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEnhance(selectedArticle.id)}
                  disabled={!!enhancing || selectedArticle.is_updated || !!enhancedVersion}
                  className={`flex items-center gap-2 px-3 py-1.5 border transition-all rounded-sm ${selectedArticle.is_updated || !!enhancedVersion
                    ? 'border-sky-500/20 bg-sky-500/5 text-sky-500/50 cursor-not-allowed'
                    : 'border-sky-500/20 bg-sky-500/10 text-sky-500 hover:bg-sky-500/20'
                    }`}
                >
                  <Zap className={`w-3 h-3 ${enhancing ? 'animate-pulse' : ''}`} />
                  <span className="font-mono text-[9px] uppercase tracking-widest hidden md:inline">
                    {enhancing ? 'Enhancing...' : (selectedArticle.is_updated || !!enhancedVersion) ? 'Enhanced' : 'Enhance'}
                  </span>
                </button>

                {/* Edit/Save/Cancel Buttons - Only when enhanced version exists and not in chat mode */}
                {!!enhancedVersion && viewMode !== 'chat' && (
                  isEditing ? (
                    <>
                      <button
                        onClick={() => handleSave(enhancedVersion.id)}
                        disabled={isSaving}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 border border-green-500/30 text-green-500 rounded-sm hover:bg-green-500/30 transition-all disabled:opacity-50"
                        title="Save Changes"
                      >
                        <Save className={`w-3 h-3 ${isSaving ? 'animate-pulse' : ''}`} />
                        <span className="font-mono text-[9px] uppercase tracking-widest">
                          {isSaving ? 'Saving...' : 'Save'}
                        </span>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                        className="p-2 text-white/40 hover:text-white transition-colors"
                        title="Cancel Edit"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEdit(enhancedVersion.content)}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 text-white/60 rounded-sm hover:bg-white/5 hover:text-white transition-all"
                      title="Edit Enhanced Article"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span className="font-mono text-[9px] uppercase tracking-widest">Edit</span>
                    </button>
                  )
                )}

                <button
                  onClick={() => handleCopy(selectedArticle.content)}
                  className="p-2 text-white/20 hover:text-white transition-colors"
                  title="Copy Content"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => handleDelete(selectedArticle.id)}
                  className="p-2 text-white/20 hover:text-red-500 transition-colors"
                  title="Purge Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* Content Area - Fixed Layout for View/Compare/Chat */}
            <div className="flex-1 relative overflow-hidden flex flex-col">
              <AnimatePresence mode="wait">
                {viewMode === 'view' && (
                  <motion.div
                    key="view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex-1 overflow-y-auto custom-scrollbar"
                  >
                    <div className="max-w-3xl mx-auto py-6 px-4 md:py-8 md:px-8">
                      <div className="mb-6 md:mb-8">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-2 py-0.5 border border-white/10 bg-white/5 font-mono text-[8px] uppercase tracking-[0.3em] text-white/40">
                            {!!enhancedVersion ? 'Enhanced' : 'Raw'}
                          </span>
                          {selectedArticle.source_url !== 'Local Upload' && (
                            <a href={selectedArticle.source_url} target="_blank" rel="noopener noreferrer" className="font-mono text-[8px] text-white/20 hover:text-white flex items-center gap-1 transition-colors">
                              Source <ArrowRight className="w-2 h-2" />
                            </a>
                          )}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-display uppercase tracking-tight leading-none mb-6">
                          {selectedArticle.title}
                        </h1>
                      </div>

                      <div className="prose prose-invert prose-lg max-w-none leading-loose text-white/90">
                        {!!enhancedVersion && isEditing ? (
                          <div className="not-prose">
                            <div className="mb-3 flex items-center gap-2">
                              <Edit2 className="w-4 h-4 text-white/40" />
                              <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
                                Editing Enhanced Article (Markdown)
                              </span>
                            </div>
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="w-full min-h-[500px] bg-white/[0.03] border border-white/10 rounded-lg p-6 text-white/90 font-mono text-sm leading-relaxed resize-y focus:outline-none focus:border-white/30 transition-colors"
                              placeholder="Enter markdown content..."
                              spellCheck={false}
                            />
                            <p className="mt-3 font-mono text-[9px] text-white/30 uppercase tracking-widest">
                              Tip: Use markdown syntax for formatting. Changes are saved via the Save button above.
                            </p>
                          </div>
                        ) : !!enhancedVersion ? (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{enhancedVersion.content}</ReactMarkdown>
                        ) : (
                          <p className="text-white/80 leading-relaxed whitespace-pre-wrap font-sans">
                            {selectedArticle.content}
                          </p>
                        )}
                      </div>

                      {!enhancedVersion && !selectedArticle.is_updated && (
                        <div className="mt-12 p-8 border border-white/10 bg-white/[0.02] flex flex-col items-center text-center">
                          <Zap className="w-8 h-8 text-sky-500 mb-4" />
                          <h3 className="text-xl font-display uppercase mb-2">Enhancement Available</h3>
                          <p className="text-white/40 text-sm max-w-md mb-8">
                            Leverage neural networks to cross-reference and restructure this content.
                          </p>
                          <button
                            onClick={() => handleEnhance(selectedArticle.id)}
                            disabled={!!enhancing}
                            className="px-8 py-4 bg-white text-black font-mono text-xs tracking-[0.3em] uppercase hover:bg-white/90 transition-all disabled:opacity-50"
                          >
                            {enhancing ? 'Processing...' : 'Enhance'}
                          </button>
                        </div>
                      )}

                      {selectedArticle.reference_links && selectedArticle.reference_links.length > 0 && (
                        <div className="mt-16 pt-8 border-t border-white/5">
                          <h3 className="font-mono text-[10px] tracking-[0.5em] text-white/30 uppercase mb-6">Sources</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {selectedArticle.reference_links.map((ref, i) => (
                              <a
                                key={i}
                                href={ref.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-4 border border-white/5 bg-white/[0.01] hover:border-white/20 transition-all group block"
                              >
                                <div className="flex flex-col gap-1.5">
                                  <span className="text-sm text-white/60 group-hover:text-white transition-colors line-clamp-1">{ref.title}</span>
                                  <span className="font-mono text-[9px] text-white/20 uppercase tracking-widest">{new URL(ref.url).hostname}</span>
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {viewMode === 'compare' && (
                  <motion.div
                    key="compare"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex min-h-0 bg-[#050505]"
                  >
                    {!enhancedVersion && !originalVersion ? (
                      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <AlertCircle className="w-10 h-10 text-white/20 mb-4" />
                        <h2 className="text-xl font-display uppercase mb-3">No Comparison Available</h2>
                        <p className="text-white/40 text-sm max-w-md mb-6">
                          Run the enhancement sequence to compare original and restructured versions.
                        </p>
                        <button
                          onClick={() => handleEnhance(selectedArticle.id)}
                          className="px-5 py-2.5 border border-white/20 font-mono text-[10px] tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all"
                        >
                          Enhance Now
                        </button>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col md:flex-row w-full h-full p-3 sm:p-4 md:p-6 gap-3 sm:gap-4 md:gap-6 overflow-y-auto">
                        {/* Original Panel */}
                        <div className="flex-1 flex flex-col min-h-[40vh] md:min-h-0 bg-[#0a0a0a] rounded-lg border border-white/5 overflow-hidden">
                          <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full border border-white/20" />
                              <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">Original Source</span>
                            </div>
                          </div>
                          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            <h2 className="text-xl font-display uppercase mb-6 leading-tight">{(originalVersion || selectedArticle).title}</h2>
                            <div className="text-white/60 leading-relaxed font-sans text-sm whitespace-pre-wrap">
                              {(originalVersion || selectedArticle).content}
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Panel */}
                        <div className="flex-1 flex flex-col min-h-[40vh] md:min-h-0 bg-[#0a0a0a] rounded-lg border border-sky-500/10 overflow-hidden relative">
                          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sky-500/20 to-transparent" />
                          <div className="px-6 py-4 border-b border-white/5 bg-sky-500/[0.02] flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
                              <span className="font-mono text-[10px] tracking-[0.2em] text-sky-500 uppercase">Enhanced Intelligence</span>
                            </div>
                            <Zap className="w-3 h-3 text-sky-500/50" />
                          </div>
                          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            <h2 className="text-xl font-display uppercase mb-6 leading-tight">{(enhancedVersion || selectedArticle).title}</h2>
                            {isEditing ? (
                              <div>
                                <div className="mb-3 flex items-center gap-2">
                                  <Edit2 className="w-4 h-4 text-sky-500/60" />
                                  <span className="font-mono text-[10px] tracking-[0.2em] text-sky-500/60 uppercase">
                                    Editing Enhanced Article
                                  </span>
                                </div>
                                <textarea
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  className="w-full min-h-[400px] bg-white/[0.03] border border-sky-500/20 rounded-lg p-4 text-white/90 font-mono text-sm leading-relaxed resize-y focus:outline-none focus:border-sky-500/40 transition-colors"
                                  placeholder="Enter markdown content..."
                                  spellCheck={false}
                                />
                              </div>
                            ) : (
                              <div className="prose prose-invert prose-sm max-w-none leading-loose text-white/90">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{(enhancedVersion || selectedArticle).content}</ReactMarkdown>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {viewMode === 'chat' && (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 flex flex-col min-h-0 bg-[#050505]"
                  >
                    <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6 custom-scrollbar">
                      {chatMessages.length === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-40">
                          <MessageSquare className="w-12 h-12 mb-6" />
                          <h3 className="text-xl font-display uppercase mb-2">Intelligence Chat</h3>
                          <p className="text-sm max-w-xs text-white/60">Ask questions about "{selectedArticle.title}"</p>
                        </div>
                      )}
                      {chatMessages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] px-5 py-4 rounded-lg font-sans ${msg.role === 'user'
                            ? 'bg-white text-black'
                            : 'bg-white/5 border border-white/10 text-white/90'
                            }`}>
                            <div className="text-sm leading-relaxed">
                              {msg.role === 'assistant' ? (
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                              ) : (
                                msg.content
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {isChatLoading && (
                        <div className="flex justify-start">
                          <div className="bg-white/5 border border-white/10 px-5 py-4 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm text-white/60 typewriter-cursor">Thinking</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    <div className="p-3 sm:p-4 md:p-6 border-t border-white/5 bg-[#080808]">
                      <div className="max-w-4xl mx-auto flex gap-2 sm:gap-4">
                        <input
                          type="text"
                          value={inputMessage}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)}
                          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Type a message..."
                          className="flex-1 bg-white/5 border border-white/10 px-3 sm:px-5 py-3 sm:py-4 rounded-lg text-sm focus:outline-none focus:border-white/30 transition-all font-sans"
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={isChatLoading || !inputMessage.trim()}
                          className="px-4 sm:px-8 py-3 sm:py-4 bg-white text-black font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase rounded-lg hover:bg-white/90 transition-all disabled:opacity-50"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="p-12 border border-white/5 bg-white/[0.01] text-center max-w-md">
              <History className="w-12 h-12 text-white/10 mx-auto mb-6" />
              <h2 className="text-2xl font-display uppercase tracking-tighter mb-4">No Context Selected</h2>
              <p className="text-white/40 text-sm mb-8">
                Initialize the scraper, upload a document, or select an article from the archives.
              </p>
              <div className="flex flex-col gap-3 w-full">
                <button onClick={handleScrape} className="w-full py-4 border border-white/20 font-mono text-[10px] tracking-[0.4em] uppercase hover:bg-white hover:text-black transition-all">
                  Execute Scan
                </button>
                <button onClick={() => setIsSidebarOpen(true)} className="md:hidden w-full py-4 border border-white/10 font-mono text-[10px] tracking-[0.4em] uppercase hover:bg-white/5 transition-all">
                  Open Archives
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploadOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUploadOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 p-12 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <button
                onClick={() => setIsUploadOpen(false)}
                className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"
                aria-label="Close upload modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-10">
                <h2 className="text-3xl font-display uppercase mb-4">Integrate Document</h2>
                <p className="text-white/40 text-sm font-mono tracking-widest uppercase">Protocol: Data Assimilation v2.4</p>
              </div>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed transition-all p-16 flex flex-col items-center justify-center gap-6 cursor-pointer ${isDragActive ? 'border-white bg-white/5' : 'border-white/10 hover:border-white/30 bg-white/[0.02]'
                  }`}
              >
                <input {...getInputProps()} />
                <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white/40" />
                </div>
                <div className="flex flex-col gap-2 text-center">
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase">
                    {isDragActive ? 'Release to initiate upload' : 'Drop File or Click to Browse'}
                  </p>
                  <p className="text-[10px] text-white/20 uppercase tracking-widest font-mono">Supports TXT, MD</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .archives-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .archives-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .archives-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 3px;
        }
        .archives-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }
      `}</style>
    </main>
  );
}
