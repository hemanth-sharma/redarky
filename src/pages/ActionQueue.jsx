import React, { useState, useMemo } from 'react';
import { ListChecks, SlidersHorizontal, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import LeadCard from '@/components/leads/LeadCard';
import { mockLeads } from '@/data/mockData';

export default function ActionQueue() {
  const [leads, setLeads] = useState(mockLeads);
  const [sourceFilter, setSourceFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (sourceFilter !== 'all' && lead.source !== sourceFilter) return false;
      if (scoreFilter === 'high' && lead.intent_score < 80) return false;
      if (scoreFilter === 'medium' && (lead.intent_score < 50 || lead.intent_score >= 80))
        return false;
      if (scoreFilter === 'low' && lead.intent_score >= 50) return false;
      return true;
    });
  }, [leads, sourceFilter, scoreFilter]);

  const handleApprove = (id) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  const handleReject = (id) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Feed
          </h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {leads.length} leads waiting for review. Approve to copy reply and
          open the thread, or reject to dismiss.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filter:
        </div>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="h-8 w-[130px] text-xs">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sources</SelectItem>
            <SelectItem value="reddit">Reddit</SelectItem>
            <SelectItem value="hackernews">Hacker News</SelectItem>
          </SelectContent>
        </Select>
        <Select value={scoreFilter} onValueChange={setScoreFilter}>
          <SelectTrigger className="h-8 w-[150px] text-xs">
            <SelectValue placeholder="Intent score" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All scores</SelectItem>
            <SelectItem value="high">High (80+)</SelectItem>
            <SelectItem value="medium">Medium (50–79)</SelectItem>
            <SelectItem value="low">Low (below 50)</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground">
          Showing {filteredLeads.length} of {leads.length}
        </span>
      </div>

      {/* Lead list */}
      {filteredLeads.length > 0 ? (
        <div className="space-y-4">
          {filteredLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Inbox className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-base font-semibold text-foreground">
            {leads.length === 0 ? 'Queue is clear' : 'No leads match your filters'}
          </h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {leads.length === 0
              ? "You've reviewed all current leads. Check back later — the pipeline scans every 15 minutes."
              : 'Try adjusting your filters to see more leads.'}
          </p>
        </div>
      )}
    </div>
  );
}