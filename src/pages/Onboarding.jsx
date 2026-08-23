/**
 * Onboarding — 5-step wizard that creates the first project + keywords + sources.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Zap,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  X,
  MessageSquare,
  Target,
  Search,
  Users,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { projectsApi, keywordsApi, sourcesApi } from '@/api';
import { toast } from '@/hooks/use-toast';
import { toastApiError } from '@/api';
import { cn } from '@/lib/utils';

const steps = [
  { id: 0, label: 'Project', icon: Zap },
  { id: 1, label: 'Goal', icon: Target },
  { id: 2, label: 'Keywords', icon: Search },
  { id: 3, label: 'Sources', icon: Users },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    goal_description: '',
    goal_type: 'lead_gen',
    company_name: '',
    company_url: '',
    company_description: '',
    keywords: [{ keyword: '', keyword_type: 'include' }],
    sources: [{ identifier: '' }],
  });

  const update = (field, value) => setForm({ ...form, [field]: value });
  const updateArrayItem = (field, idx, value) =>
    setForm({
      ...form,
      [field]: form[field].map((item, i) => (i === idx ? value : item)),
    });

  const createProjectMutation = useMutation({
    mutationFn: (data) => projectsApi.create(data),
  });
  const createKeywordMutation = useMutation({
    mutationFn: (data) => keywordsApi.create(data),
  });
  const addSourceMutation = useMutation({
    mutationFn: (data) => sourcesApi.add(data.projectId, data.payload),
  });
  const activateMutation = useMutation({
    mutationFn: (projectId) => projectsApi.activate(projectId),
  });

  const canProceed = () => {
    if (step === 0) return form.name.trim();
    if (step === 1) return form.goal_description.trim();
    if (step === 2) return form.keywords.some((k) => k.keyword.trim());
    if (step === 3) return form.sources.some((s) => s.identifier.trim());
    return true;
  };

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      // 1. Create project
      const project = await createProjectMutation.mutateAsync({
        name: form.name,
        goal_description: form.goal_description,
        goal_type: form.goal_type,
        company_name: form.company_name || undefined,
        company_url: form.company_url || undefined,
        company_description: form.company_description || undefined,
      });

      // 2. Create keywords
      const kwPromises = form.keywords
        .filter((k) => k.keyword.trim())
        .map((k) =>
          createKeywordMutation.mutateAsync({
            keyword: k.keyword.trim(),
            keyword_type: k.keyword_type || 'include',
            project_id: project.id,
          })
        );
      await Promise.allSettled(kwPromises);

      // 3. Add sources
      const srcPromises = form.sources
        .filter((s) => s.identifier.trim())
        .map((s) => {
          const id = s.identifier.trim().startsWith('r/')
            ? s.identifier.trim()
            : `r/${s.identifier.trim()}`;
          return addSourceMutation.mutateAsync({
            projectId: project.id,
            payload: {
              source_type: 'reddit',
              identifier: id,
              interval_minutes: 30,
            },
          });
        });
      await Promise.allSettled(srcPromises);

      // 4. Activate pipeline
      try {
        await activateMutation.mutateAsync(project.id);
      } catch (e) {
        // Activation is best-effort
        console.warn('Activation failed', e);
      }

      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: 'Project created!',
        description: 'Your pipeline is active. First scrape runs within 30 minutes.',
      });
      navigate('/queue', { replace: true });
    } catch (e) {
      toastApiError(e, 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-8 md:px-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl gradient-accent shadow-sm">
            <Zap className="h-6 w-6 text-white" fill="white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Set up your monitoring project
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            This is the brain of the system — everything downstream uses it.
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <React.Fragment key={s.id}>
                <div
                  className={cn(
                    'flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                    idx === step
                      ? 'bg-primary text-primary-foreground'
                      : idx < step
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {idx < step ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Icon className="h-3.5 w-3.5" />
                  )}
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={cn(
                      'h-px w-6 md:w-12',
                      idx < step ? 'bg-primary/30' : 'bg-border'
                    )}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Step content */}
        <div className="flex-1">
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Project name
                </Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="e.g. SaaS Lead Generation"
                  className="mt-1.5 h-11"
                />
              </div>
              <div>
                <Label htmlFor="company_name" className="text-sm font-medium">
                  Company name <span className="text-muted-foreground/60">(optional)</span>
                </Label>
                <Input
                  id="company_name"
                  value={form.company_name}
                  onChange={(e) => update('company_name', e.target.value)}
                  placeholder="Your company"
                  className="mt-1.5 h-11"
                />
              </div>
              <div>
                <Label htmlFor="company_url" className="text-sm font-medium">
                  Website <span className="text-muted-foreground/60">(optional)</span>
                </Label>
                <Input
                  id="company_url"
                  value={form.company_url}
                  onChange={(e) => update('company_url', e.target.value)}
                  placeholder="https://…"
                  className="mt-1.5 h-11"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <Label htmlFor="goal_description" className="text-sm font-medium">
                  Monitoring goal
                </Label>
                <Textarea
                  id="goal_description"
                  value={form.goal_description}
                  onChange={(e) => update('goal_description', e.target.value)}
                  placeholder="e.g. Find people asking for a Notion alternative"
                  className="mt-1.5 min-h-[100px]"
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  The matcher uses this to score semantic relevance of each post.
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Goal type</Label>
                <select
                  value={form.goal_type}
                  onChange={(e) => update('goal_type', e.target.value)}
                  className="mt-1.5 w-full h-11 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="lead_gen">Lead generation</option>
                  <option value="brand_monitoring">Brand monitoring</option>
                  <option value="competitor_tracking">Competitor tracking</option>
                </select>
              </div>
              <div>
                <Label htmlFor="company_description" className="text-sm font-medium">
                  Product / company description <span className="text-muted-foreground/60">(optional)</span>
                </Label>
                <Textarea
                  id="company_description"
                  value={form.company_description}
                  onChange={(e) => update('company_description', e.target.value)}
                  placeholder="What does your product do, and for whom?"
                  className="mt-1.5 min-h-[100px]"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <Label className="text-sm font-medium">Keywords to monitor</Label>
                <p className="mb-3 text-xs text-muted-foreground">
                  Be specific — "notion alternative" beats "notion".
                </p>
                <div className="space-y-2">
                  {form.keywords.map((kw, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <Input
                        value={kw.keyword}
                        onChange={(e) =>
                          updateArrayItem('keywords', idx, { ...kw, keyword: e.target.value })
                        }
                        placeholder="e.g. notion alternative"
                        className="h-10"
                      />
                      <select
                        value={kw.keyword_type}
                        onChange={(e) =>
                          updateArrayItem('keywords', idx, { ...kw, keyword_type: e.target.value })
                        }
                        className="h-10 rounded-md border border-input bg-background px-2 text-sm"
                      >
                        <option value="include">include</option>
                        <option value="exclude">exclude</option>
                        <option value="brand">brand</option>
                      </select>
                      {form.keywords.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 shrink-0 text-muted-foreground"
                          onClick={() =>
                            update('keywords', form.keywords.filter((_, i) => i !== idx))
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 gap-1.5"
                  onClick={() =>
                    update('keywords', [
                      ...form.keywords,
                      { keyword: '', keyword_type: 'include' },
                    ])
                  }
                >
                  <Plus className="h-3.5 w-3.5" /> Add keyword
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <Label className="text-sm font-medium">Subreddits to watch</Label>
                <p className="mb-3 text-xs text-muted-foreground">
                  Redarky pulls the latest posts from these subreddits in addition to keyword search.
                </p>
                <div className="space-y-2">
                  {form.sources.map((src, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">r/</span>
                      <Input
                        value={src.identifier}
                        onChange={(e) =>
                          updateArrayItem('sources', idx, { identifier: e.target.value })
                        }
                        placeholder="e.g. SaaS"
                        className="h-10"
                      />
                      {form.sources.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 shrink-0 text-muted-foreground"
                          onClick={() =>
                            update('sources', form.sources.filter((_, i) => i !== idx))
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 gap-1.5"
                  onClick={() =>
                    update('sources', [...form.sources, { identifier: '' }])
                  }
                >
                  <Plus className="h-3.5 w-3.5" /> Add subreddit
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          <Button
            variant="ghost"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0 || submitting}
            className="gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          {step < steps.length - 1 ? (
            <Button
              variant="gradient"
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="gap-1.5"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="gradient"
              onClick={handleFinish}
              disabled={!canProceed() || submitting}
              className="gap-1.5"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Creating…
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" /> Start finding leads
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
