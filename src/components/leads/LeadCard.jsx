import React, { useState } from 'react';
import { MessageSquare, Twitter, Terminal, Bot, X, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LeadCard({ lead }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'reddit':
        return (
          <div className="w-8 h-8 rounded-full bg-[#ff4500]/10 flex items-center justify-center text-[#ff4500]">
            <MessageSquare className="w-4 h-4" />
          </div>
        );
      case 'twitter':
      case 'x':
        return (
          <div className="w-8 h-8 rounded-full bg-[#1DA1F2]/10 flex items-center justify-center text-[#1DA1F2]">
            <Twitter className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-[#ff6600]/10 flex items-center justify-center text-[#ff6600]">
            <Terminal className="w-4 h-4" />
          </div>
        );
    }
  };

  const getIntentColor = (score) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 80) return 'text-amber-500';
    return 'text-slate-500';
  };

  const handleGenerateResponse = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <article className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-400 transition-all group shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {getPlatformIcon(lead.platform)}
          <div>
            <p className="text-sm font-bold text-slate-900 flex items-center gap-1">
              {lead.author} <span className="text-slate-500 font-normal">in {lead.channel}</span>
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {lead.timeAgo} • <span className="text-blue-600 font-medium">{lead.keyword}</span>
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">Intent Score</p>
          <p className={`text-3xl font-black leading-none ${getIntentColor(lead.intentScore)}`}>
            {lead.intentScore}
          </p>
        </div>
      </div>

      <div className="mb-5">
        <h3 className="text-lg font-bold mb-2 text-slate-900">{lead.title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          {/* Mocking the highlighted keyword spans from your design */}
          {lead.content.split(/(real-time conversational data|outbound scaling pain points|deep semantic intent)/).map((part, i) => 
            ['real-time conversational data', 'outbound scaling pain points', 'deep semantic intent'].includes(part) ? 
              <span key={i} className="bg-indigo-50 text-indigo-900 font-semibold px-1 rounded">{part}</span> : 
              part
          )}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button className="text-xs font-medium text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1.5">
            <X className="w-4 h-4" /> Reject
          </button>
          <a 
            href={lead.sourceUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-4 h-4" /> View Source
          </a>
        </div>

        {lead.id === 1 ? (
          <Button 
            size="icon"
            className="bg-blue-700 hover:bg-blue-800 text-white rounded-lg w-10 h-10 shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        ) : (
          <Button 
            onClick={handleGenerateResponse}
            disabled={isGenerating}
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold flex items-center gap-2 rounded-lg px-4 shadow-sm"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Drafting...
              </>
            ) : (
              <>
                <Bot className="w-4 h-4" /> Generate AI Response
              </>
            )}
          </Button>
        )}
      </div>
    </article>
  );
}