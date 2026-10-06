import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, RefreshCw, Shield, FileText } from 'lucide-react';
import { Link } from 'react-router';
import logoImg from '../imports/logo.png';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

export interface LegalPageProps {
  type: 'terms' | 'privacy';
  onBack?: () => void;
}

const SUPABASE_STORAGE_BASE =
  'https://csbrbxvhmvpinpzsdwgo.supabase.co/storage/v1/object/public/legal';

export const LegalPage: React.FC<LegalPageProps> = ({ type, onBack }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const fileName = type === 'terms' ? 'TERMS_OF_USE.md' : 'PRIVACY_POLICY.md';
  const title = type === 'terms' ? 'Terms of Use' : 'Privacy Policy';
  const subtitle =
    type === 'terms'
      ? 'Please read these terms carefully before using Zeffrix.'
      : 'Learn how Zeffrix collects, uses, and safeguards your personal information.';

  const fetchDocument = () => {
    setLoading(true);
    setError(false);
    fetch(`${SUPABASE_STORAGE_BASE}/${fileName}?t=${Date.now()}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load document');
        return res.text();
      })
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDocument();
  }, [type]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#A0A0A0] py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#E8611A]/20 selection:text-[#E8611A]">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#222222]">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#E8611A] hover:text-[#F07030] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back</span>
          </button>

          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center">
              <ImageWithFallback src={logoImg} alt="Zeffrix Logo" className="w-full h-full object-contain grayscale opacity-80" />
            </div>
            <span className="font-bold tracking-widest text-sm text-white uppercase">Zeffrix</span>
          </Link>
        </div>

        {/* Header Title Area */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8611A]/10 border border-[#E8611A]/20 text-[#E8611A] text-xs font-semibold uppercase tracking-wider mb-3">
            {type === 'terms' ? <FileText size={14} /> : <Shield size={14} />}
            <span>Legal Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-zinc-400">
            {subtitle}
          </p>
        </div>

        {/* Content Container */}
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 sm:p-10 shadow-2xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <div className="w-10 h-10 border-2 border-[#E8611A] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-[#777777]">Fetching latest {title}...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-lg font-bold text-white mb-2">Could not load {title}</p>
              <p className="text-sm text-[#888888] mb-6 max-w-sm mx-auto">
                Unable to reach the live legal document storage. Please check your connection and try again.
              </p>
              <button
                onClick={fetchDocument}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#E8611A] text-white font-semibold text-sm hover:bg-[#F07030] transition-colors cursor-pointer"
              >
                <RefreshCw size={16} />
                <span>Retry</span>
              </button>
            </div>
          ) : (
            <article className="prose prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ ...props }) => (
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 border-b border-[#2A2A2A] pb-4" {...props} />
                  ),
                  h2: ({ ...props }) => (
                    <h2 className="text-lg sm:text-xl font-bold text-[#E8611A] mt-10 mb-4 tracking-wide" {...props} />
                  ),
                  h3: ({ ...props }) => (
                    <h3 className="text-base font-semibold text-white mt-6 mb-2" {...props} />
                  ),
                  h4: ({ ...props }) => (
                    <h4 className="text-sm font-semibold text-zinc-200 mt-4 mb-2" {...props} />
                  ),
                  p: ({ ...props }) => (
                    <p className="text-sm sm:text-base text-[#B0B0B0] leading-relaxed mb-4" {...props} />
                  ),
                  ul: ({ ...props }) => (
                    <ul className="list-disc list-inside space-y-2 mb-4 text-sm sm:text-base text-[#B0B0B0]" {...props} />
                  ),
                  ol: ({ ...props }) => (
                    <ol className="list-decimal list-inside space-y-2 mb-4 text-sm sm:text-base text-[#B0B0B0]" {...props} />
                  ),
                  li: ({ ...props }) => (
                    <li className="text-[#B0B0B0] leading-relaxed" {...props} />
                  ),
                  strong: ({ ...props }) => (
                    <strong className="font-semibold text-white" {...props} />
                  ),
                  a: ({ ...props }) => (
                    <a className="text-[#E8611A] hover:text-[#F07030] underline underline-offset-2 transition-colors cursor-pointer" {...props} />
                  ),
                  hr: ({ ...props }) => (
                    <hr className="border-[#2A2A2A] my-8" {...props} />
                  ),
                  blockquote: ({ ...props }) => (
                    <blockquote className="border-l-4 border-[#E8611A]/60 pl-4 py-1 italic text-zinc-400 bg-zinc-900/40 rounded-r my-4" {...props} />
                  ),
                  code: ({ ...props }) => (
                    <code className="bg-[#1F1F1F] text-orange-300 px-1.5 py-0.5 rounded text-xs font-mono" {...props} />
                  )
                }}
              >
                {content}
              </ReactMarkdown>
            </article>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-[#222222] flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>&copy; {new Date().getFullYear()} Zeffrix Fitness. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link
              to="/terms"
              className={`hover:text-[#E8611A] transition-colors cursor-pointer ${type === 'terms' ? 'text-white font-medium' : ''}`}
            >
              Terms of Use
            </Link>
            <span>&bull;</span>
            <Link
              to="/privacy"
              className={`hover:text-[#E8611A] transition-colors cursor-pointer ${type === 'privacy' ? 'text-white font-medium' : ''}`}
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
