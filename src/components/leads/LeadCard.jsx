import React, { useState, useRef, useEffect } from 'react';
import {
  ExternalLink,
  Check,
  X,
  Zap,
  Sparkles,
  TrendingUp,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import IntentScoreBadge from '@/components/leads/IntentScoreBadge';

export default function LeadCard({ lead, onApprove, onReject }) {
  const [draftState, setDraftState] = useState('idle'); // idle | loading | streaming | done
  const [reply, setReply] = useState('');
  const [copied, setCopied] = useState(false);
  const streamRef = useRef(null);
  const textareaRef = useRef(null);

  const sourceIcon = lead.source === 'reddit' ? '🔵' : '🟠';
  const sourceLabel = lead.source === 'reddit' ? 'Reddit' : 'Hacker News';

  useEffect(() => {
    return () => {
      if (streamRef.current) clearInterval(streamRef.current);
    };
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [reply]);

  const handleGenerate = () => {
    setDraftState('loading');
    setTimeout(() => {
      setDraftState('streaming');
      const fullText = lead.drafted_reply;
      const words = fullText.split(' ');
      let wordIdx = 0;
      const interval = setInterval(() => {
        if (wordIdx < words.length) {
          setReply(words.slice(0, wordIdx + 3).join(' '));
          wordIdx += 3;
        } else {
          setReply(fullText);
          setDraftState('done');
          clearInterval(interval);
        }
      }, 30);
      streamRef.current = interval;
    }, 1200);
  };

  const handleCopyAndOpen = async () => {
    try {
      await navigator.clipboard.writeText(reply);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // clipboard might not be available
    }
    window.open(lead.thread_url, '_blank', 'noopener,noreferrer');
  };

  const handleApprove = () => {
    onApprove(lead.id, reply);
    handleCopyAndOpen();
  };

  return (
    <div className="group rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1 text-[11px] font-medium">
              <span>{sourceIcon}</span>
              {sourceLabel}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {lead.subreddit}
            </span>
            <span className="text-muted-foreground/40">•</span>
            <span className="text-xs text-muted-foreground">
              {lead.post_score} upvotes
            </span>
            <span className="text-muted-foreground/40">•</span>
            <span className="text-xs text-muted-foreground">{lead.time_ago}</span>
          </div>
          <h3 className="text-base font-semibold leading-snug text-foreground">
            {lead.thread_title}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            by {lead.author}
          </p>
        </div>
        <IntentScoreBadge score={lead.intent_score} />
      </div>

      {/* Pain point */}
      <div className="mt-4 rounded-lg bg-muted/50 p-3.5">
        <div className="mb-1.5 flex items-center gap-1.5">
          <MessageSquare className="h-3.5 w-3.5 text-primary" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
            Extracted Pain Point
          </span>
        </div>
        <p className="text-sm leading-relaxed text-foreground/80">
          {lead.pain_point}
        </p>
      </div>

      {/* Intent reasoning — always visible */}
      <div className="mt-3 flex items-start gap-2 rounded-lg border border-border/60 bg-background/50 p-3">
        <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Why this scored {lead.intent_score}
          </span>
          <p className="mt-0.5 text-xs font-medium leading-relaxed text-muted-foreground">
            {lead.intent_reasoning}
          </p>
        </div>
      </div>

      {draftState === 'loading' && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-primary" />
            <span className="text-xs font-medium text-primary">
              Generating draft...
            </span>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[75%]" />
          <Skeleton className="h-4 w-[85%]" />
          <Skeleton className="h-4 w-[60%]" />
        </div>
      )}

      {(draftState === 'streaming' || draftState === 'done') && (
        <div className="mt-4">
          <div className="mb-2 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              AI Drafted Reply
              {draftState === 'streaming' && (
                <span className="ml-1.5 animate-pulse text-muted-foreground">streaming...</span>
              )}
            </span>
          </div>
          <Textarea
            ref={textareaRef}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="min-h-[160px] resize-y text-sm leading-relaxed"
            readOnly={draftState === 'streaming'}
          />
        </div>
      )}

      {/* Footer actions */}
      <div className="mt-4 flex items-center gap-2">
        {draftState === 'idle' && (
          <Button onClick={handleGenerate} size="sm" className="gap-1.5">
            <Zap className="h-3.5 w-3.5" />
            Generate AI Response Draft
          </Button>
        )}
        {(draftState === 'loading' || draftState === 'streaming') && (
          <Button size="sm" className="gap-1.5" disabled>
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            Generating...
          </Button>
        )}
        {draftState === 'done' && (
          <Button onClick={handleApprove} className="gap-1.5" size="sm">
            <Check className="h-4 w-4" />
            {copied ? 'Copied! Open thread →' : 'Approve & Copy'}
          </Button>
        )}
        <Button
          onClick={() => onReject(lead.id)}
          variant="outline"
          size="sm"
          className="gap-1.5"
        >
          <X className="h-4 w-4" />
          Reject
        </Button>
        <a
          href={lead.thread_url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground hover:underline"
        >
          View source
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}