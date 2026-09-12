/**
 * ProductProfile — edit the active product, manage keywords + sources,
 * configure platforms. Multiple products are supported: pick the one you're
 * editing from the TopBar switcher, and create new ones with the button here.
 */
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Plus,
  X,
  Save,
  Globe,
  Loader2,
  Search,
  Trash2,
  Power,
  Layers,
  MessageCircle,
  Twitter,
  Linkedin,
  Rocket,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { projectsApi, keywordsApi, sourcesApi } from '@/api';
import { useProduct } from '@/lib/ProductContext';
import { toast } from '@/hooks/use-toast';
import { toastApiError } from '@/api';
import { cn } from '@/lib/utils';

/**
 * The platform catalog. Reddit is live today; the rest are wired into the
 * product config (stored in `projects.platforms`) and will activate as
 * their collectors ship — flipping one on later needs no schema change.
 */
const PLATFORM_CATALOG = [
  { id: 'reddit', label: 'Reddit', icon: MessageCircle, available: true, hint: 'Posts + comments across subreddits and keyword search' },
  { id: 'hacker_news', label: 'Hacker News', icon: Rocket, available: false, hint: 'Coming soon' },
  { id: 'x', label: 'X / Twitter', icon: Twitter, available: false, hint: 'Coming soon' },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, available: false, hint: 'Coming soon' },
];

export default function ProductProfile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { products, activeProduct, loadingProjects, setActiveProduct } = useProduct();
  const project = activeProduct;

  const [form, setForm] = useState({
    name: '',
    goal_description: '',
    company_name: '',
    company_url: '',
    company_description: '',
    llm_threshold: 0.7,
    data_retention_days: 30,
    platforms: ['reddit'],
  });

  useEffect(() => {
    if (project) {
      setForm({
        name: project.name || '',
        goal_description: project.goal_description || '',
        company_name: project.company_name || '',
        company_url: project.company_url || '',
        company_description: project.company_description || '',
        llm_threshold: project.llm_threshold ?? 0.7,
        data_retention_days: project.data_retention_days ?? 30,
        platforms: project.platforms?.length ? project.platforms : ['reddit'],
      });
    }
  }, [project]);

  const updateMutation = useMutation({
    mutationFn: (data) => projectsApi.update(project.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Product updated' });
    },
    onError: (e) => toastApiError(e, 'Failed to update product'),
  });

  const activateMutation = useMutation({
    mutationFn: () => projectsApi.activate(project.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Pipeline activated', description: 'The next collection batch runs within 30 minutes.' });
    },
    onError: (e) => toastApiError(e),
  });
  const deactivateMutation = useMutation({
    mutationFn: () => projectsApi.deactivate(project.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Pipeline paused' });
    },
    onError: (e) => toastApiError(e),
  });

  const handleSave = (e) => {
    e.preventDefault();
    updateMutation.mutate(form);
  };

  const togglePlatform = (platformId, enabled) => {
    if (!enabled) {
      // Never allow removing the last platform
      if (form.platforms.length <= 1) {
        toast({
          title: 'At least one platform required',
          description: 'A product must monitor at least one platform.',
        });
        return;
      }
      setForm({ ...form, platforms: form.platforms.filter((p) => p !== platformId) });
    } else {
      setForm({ ...form, platforms: [...form.platforms, platformId] });
    }
  };

  if (loadingProjects) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <h2 className="text-2xl font-bold mb-2">No products yet</h2>
        <p className="text-muted-foreground mb-6">
          Create your first product to start configuring keywords, sources and platforms.
        </p>
        <Button variant="gradient" onClick={() => navigate('/onboarding')}>
          Set up a product
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Product Profile</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This is the brain of the pipeline — everything downstream uses it.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate('/onboarding')} className="gap-1.5">
            <Plus className="h-4 w-4" /> New product
          </Button>
          {project.is_pipeline_active ? (
            <Button
              variant="outline"
              onClick={() => deactivateMutation.mutate()}
              disabled={deactivateMutation.isPending}
            >
              <Power className="h-4 w-4 text-red-500" /> Pause pipeline
            </Button>
          ) : (
            <Button
              variant="gradient"
              onClick={() => activateMutation.mutate()}
              disabled={activateMutation.isPending}
            >
              <Power className="h-4 w-4" /> Activate pipeline
            </Button>
          )}
        </div>
      </div>

      {/* All products overview — status at a glance, click to switch */}
      {products.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Layers className="h-4 w-4 text-primary" />
              Your products ({products.length})
            </CardTitle>
            <CardDescription className="text-xs">
              Click a product to edit it — its pipeline status is shown live.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {products.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveProduct(p)}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left transition',
                  p.id === project.id
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-border hover:bg-muted/40'
                )}
              >
                <span
                  className={cn(
                    'h-2 w-2 shrink-0 rounded-full',
                    p.is_pipeline_active ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{p.name}</span>
                  <span className="block text-[10px] text-muted-foreground">
                    {p.is_pipeline_active ? 'Pipeline active' : 'Pipeline paused'}
                  </span>
                </span>
                {(p.platforms || []).length > 0 && (
                  <Badge variant="outline" className="text-[9px] shrink-0">
                    {(p.platforms || ['reddit']).join(', ')}
                  </Badge>
                )}
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        {/* Project basics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-primary" />
              Project details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1.5 h-10"
                required
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Goal description</Label>
              <Textarea
                value={form.goal_description}
                onChange={(e) => setForm({ ...form, goal_description: e.target.value })}
                placeholder="e.g. Find people asking for a Notion alternative"
                className="mt-1.5 min-h-[80px]"
                required
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                The semantic matcher and the AI lead agent both use this to decide
                what's relevant for this product.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Platform configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-primary" />
              Platforms
            </CardTitle>
            <CardDescription className="text-xs">
              Choose where this product's pipeline pulls data from when active.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PLATFORM_CATALOG.map((platform) => {
              const Icon = platform.icon;
              const enabled = form.platforms.includes(platform.id);
              return (
                <div
                  key={platform.id}
                  className={cn(
                    'flex items-center gap-3 rounded-lg border p-3 transition',
                    enabled ? 'border-primary/50 bg-primary/5' : 'border-border',
                    !platform.available && 'opacity-60'
                  )}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted shrink-0">
                    <Icon className="h-4.5 w-4.5 h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{platform.label}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{platform.hint}</p>
                  </div>
                  {platform.available ? (
                    <Switch
                      checked={enabled}
                      onCheckedChange={(v) => togglePlatform(platform.id, v)}
                      aria-label={`Toggle ${platform.label}`}
                    />
                  ) : (
                    <Badge variant="secondary" className="text-[9px] shrink-0">
                      Soon
                    </Badge>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Company info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-primary" />
              Company info
            </CardTitle>
            <CardDescription className="text-xs">
              Optional — but useful for the AI agent's context.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Company name</Label>
                <Input
                  value={form.company_name}
                  onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                  className="mt-1.5 h-10"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Company URL</Label>
                <Input
                  value={form.company_url}
                  onChange={(e) => setForm({ ...form, company_url: e.target.value })}
                  placeholder="https://…"
                  className="mt-1.5 h-10"
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Company description</Label>
              <Textarea
                value={form.company_description}
                onChange={(e) => setForm({ ...form, company_description: e.target.value })}
                className="mt-1.5 min-h-[80px]"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">
                  AI agent threshold ({form.llm_threshold.toFixed(2)})
                </Label>
                <Input
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  value={form.llm_threshold}
                  onChange={(e) => setForm({ ...form, llm_threshold: parseFloat(e.target.value) })}
                  className="mt-1.5 h-10"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Posts scoring above this go to the LLM lead agent.
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Data retention (days)</Label>
                <Input
                  type="number"
                  min="1"
                  max="90"
                  value={form.data_retention_days}
                  onChange={(e) => setForm({ ...form, data_retention_days: parseInt(e.target.value) })}
                  className="mt-1.5 h-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save bar */}
        <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-border bg-background/80 py-4 backdrop-blur-md">
          <Button type="submit" disabled={updateMutation.isPending} className="gap-1.5">
            {updateMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save changes
          </Button>
        </div>
      </form>

      {/* Keywords manager */}
      <KeywordsManager projectId={project.id} />

      {/* Sources manager */}
      <SourcesManager projectId={project.id} />
    </div>
  );
}

function KeywordsManager({ projectId }) {
  const queryClient = useQueryClient();
  const [newKeyword, setNewKeyword] = useState('');
  const [newType, setNewType] = useState('include');

  const { data: keywords = [] } = useQuery({
    queryKey: ['keywords', projectId],
    queryFn: () => keywordsApi.list(projectId),
    enabled: !!projectId,
  });

  const addMutation = useMutation({
    mutationFn: () =>
      keywordsApi.create({
        keyword: newKeyword.trim(),
        keyword_type: newType,
        project_id: projectId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keywords', projectId] });
      setNewKeyword('');
      toast({ title: 'Keyword added' });
    },
    onError: (e) => toastApiError(e, 'Failed to add keyword'),
  });

  const removeMutation = useMutation({
    mutationFn: (id) => keywordsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keywords', projectId] });
    },
  });

  const typeColor = (t) => {
    if (t === 'brand') return 'bg-purple-500';
    if (t === 'exclude') return 'bg-red-500';
    return 'bg-indigo-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Search className="h-4 w-4 text-primary" />
          Keywords ({keywords.length})
        </CardTitle>
        <CardDescription className="text-xs">
          Words and phrases the pipeline searches for in posts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Add form */}
        <div className="flex gap-2">
          <Input
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newKeyword.trim()) {
                e.preventDefault();
                addMutation.mutate();
              }
            }}
            placeholder="Add a keyword, e.g. notion alternative"
            className="h-10"
          />
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-2 text-sm"
          >
            <option value="include">include</option>
            <option value="exclude">exclude</option>
            <option value="brand">brand</option>
          </select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => addMutation.mutate()}
            disabled={!newKeyword.trim() || addMutation.isPending}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* List */}
        <div className="space-y-1.5 max-h-72 overflow-y-auto scrollbar-thin">
          {keywords.length === 0 && (
            <p className="text-xs text-muted-foreground/70 italic px-1 py-2">
              No keywords yet. Add one above.
            </p>
          )}
          {keywords.map((kw) => (
            <div
              key={kw.id}
              className="flex items-center gap-2 rounded-md border border-border px-3 py-2 group hover:bg-muted/30"
            >
              <div className={cn('h-2 w-2 rounded-full shrink-0', typeColor(kw.keyword_type))} />
              <span className="text-sm font-medium flex-1 truncate">{kw.keyword}</span>
              <Badge variant="outline" className="text-[10px] capitalize">
                {kw.keyword_type}
              </Badge>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                onClick={() => removeMutation.mutate(kw.id)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SourcesManager({ projectId }) {
  const queryClient = useQueryClient();
  const [newIdentifier, setNewIdentifier] = useState('');

  const { data: sources = [] } = useQuery({
    queryKey: ['sources', projectId],
    queryFn: () => sourcesApi.list(projectId),
    enabled: !!projectId,
  });

  const addMutation = useMutation({
    mutationFn: () =>
      sourcesApi.add(projectId, {
        source_type: 'reddit',
        identifier: newIdentifier.trim().startsWith('r/')
          ? newIdentifier.trim()
          : `r/${newIdentifier.trim()}`,
        interval_minutes: 30,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sources', projectId] });
      setNewIdentifier('');
      toast({ title: 'Source added' });
    },
    onError: (e) => toastApiError(e, 'Failed to add source'),
  });

  const removeMutation = useMutation({
    mutationFn: (sourceId) => sourcesApi.remove(projectId, sourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sources', projectId] });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Globe className="h-4 w-4 text-primary" />
          Sources ({sources.length})
        </CardTitle>
        <CardDescription className="text-xs">
          Subreddits the pipeline pulls latest posts from.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={newIdentifier}
            onChange={(e) => setNewIdentifier(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newIdentifier.trim()) {
                e.preventDefault();
                addMutation.mutate();
              }
            }}
            placeholder="e.g. SaaS or r/SaaS"
            className="h-10"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => addMutation.mutate()}
            disabled={!newIdentifier.trim() || addMutation.isPending}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-1.5 max-h-72 overflow-y-auto scrollbar-thin">
          {sources.length === 0 && (
            <p className="text-xs text-muted-foreground/70 italic px-1 py-2">
              No sources yet. Add one above.
            </p>
          )}
          {sources.map((src) => (
            <div
              key={src.id}
              className="flex items-center gap-2 rounded-md border border-border px-3 py-2 group hover:bg-muted/30"
            >
              <div className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-sm font-medium flex-1 truncate">{src.identifier}</span>
              {src.is_active ? (
                <Badge variant="success" className="text-[10px]">active</Badge>
              ) : (
                <Badge variant="secondary" className="text-[10px]">inactive</Badge>
              )}
              <span className="text-[10px] text-muted-foreground">
                {src.subscriber_count} subscriber{src.subscriber_count === 1 ? '' : 's'}
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                onClick={() => removeMutation.mutate(src.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
