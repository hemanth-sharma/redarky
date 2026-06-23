import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Swords,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { productProfile } from '@/data/mockData';
import { cn } from '@/lib/utils';

const steps = [
  { id: 0, label: 'Product', icon: Zap },
  { id: 1, label: 'Audience', icon: Target },
  { id: 2, label: 'Keywords', icon: Search },
  { id: 3, label: 'Communities', icon: Users },
  { id: 4, label: 'Competitors', icon: Swords },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({
    product_name: '',
    tagline: '',
    description: '',
    target_audience: '',
    pain_points: [''],
    keywords: [''],
    subreddits: [''],
    hn_enabled: true,
    competitors: [''],
  });

  const update = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const updateArrayItem = (field, idx, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === idx ? value : item)),
    }));
  };

  const addArrayItem = (field) => {
    setProfile((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field, idx) => {
    setProfile((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== idx),
    }));
  };

  const canProceed = () => {
    if (step === 0)
      return profile.product_name && profile.tagline && profile.description;
    if (step === 1) return profile.target_audience && profile.pain_points[0];
    if (step === 2) return profile.keywords[0];
    if (step === 3) return profile.subreddits[0] || profile.hn_enabled;
    if (step === 4) return profile.competitors[0];
    return true;
  };

  const handleFinish = () => {
    navigate('/queue');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-8 md:px-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl gradient-accent shadow-sm">
            <Zap className="h-6 w-6 text-white" fill="white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Set Up Your Product Profile
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
                <Label htmlFor="product_name" className="text-sm font-medium">
                  Product Name
                </Label>
                <Input
                  id="product_name"
                  value={profile.product_name}
                  onChange={(e) => update('product_name', e.target.value)}
                  placeholder="e.g. ScrapeFlow"
                  className="mt-1.5 h-11"
                />
              </div>
              <div>
                <Label htmlFor="tagline" className="text-sm font-medium">
                  Tagline
                </Label>
                <Input
                  id="tagline"
                  value={profile.tagline}
                  onChange={(e) => update('tagline', e.target.value)}
                  placeholder="One-line description of what you do"
                  className="mt-1.5 h-11"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-sm font-medium">
                  Product Description
                </Label>
                <Textarea
                  id="description"
                  value={profile.description}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder="Describe your product in detail — what it does, who it's for, what makes it different. The AI uses this to draft accurate replies."
                  className="mt-1.5 min-h-[120px]"
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Be specific. This is what the AI uses to generate technically
                  accurate, value-first replies.
                </p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <Label htmlFor="target_audience" className="text-sm font-medium">
                  Target Audience
                </Label>
                <Textarea
                  id="target_audience"
                  value={profile.target_audience}
                  onChange={(e) => update('target_audience', e.target.value)}
                  placeholder="Who are your ideal customers? What roles do they have, what are they working on?"
                  className="mt-1.5 min-h-[80px]"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">
                  Pain Points Your Product Solves
                </Label>
                <p className="mb-2 text-xs text-muted-foreground">
                  What problems do buyers describe that your product fixes?
                </p>
                <div className="space-y-2">
                  {profile.pain_points.map((point, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <Input
                        value={point}
                        onChange={(e) =>
                          updateArrayItem('pain_points', idx, e.target.value)
                        }
                        placeholder="e.g. Existing scraping tools fail on JavaScript-heavy sites"
                        className="h-10"
                      />
                      {profile.pain_points.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 shrink-0 text-muted-foreground"
                          onClick={() => removeArrayItem('pain_points', idx)}
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
                  onClick={() => addArrayItem('pain_points')}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add pain point
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <Label className="text-sm font-medium">
                  Keywords to Monitor
                </Label>
                <p className="mb-2 text-xs text-muted-foreground">
                  These are the phrases RedArky searches for in community
                  posts. Be specific — "web scraping tool" beats "scraping".
                </p>
                <div className="space-y-2">
                  {profile.keywords.map((keyword, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <Input
                        value={keyword}
                        onChange={(e) =>
                          updateArrayItem('keywords', idx, e.target.value)
                        }
                        placeholder="e.g. web scraping tool"
                        className="h-10"
                      />
                      {profile.keywords.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 shrink-0 text-muted-foreground"
                          onClick={() => removeArrayItem('keywords', idx)}
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
                  onClick={() => addArrayItem('keywords')}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add keyword
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <Label className="text-sm font-medium">
                  Subreddits to Watch
                </Label>
                <p className="mb-2 text-xs text-muted-foreground">
                  Which subreddits should RedArky monitor for your keywords?
                </p>
                <div className="space-y-2">
                  {profile.subreddits.map((sub, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">r/</span>
                      <Input
                        value={sub}
                        onChange={(e) =>
                          updateArrayItem('subreddits', idx, e.target.value)
                        }
                        placeholder="webscraping"
                        className="h-10"
                      />
                      {profile.subreddits.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 shrink-0 text-muted-foreground"
                          onClick={() => removeArrayItem('subreddits', idx)}
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
                  onClick={() => addArrayItem('subreddits')}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add subreddit
                </Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Monitor Hacker News
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Include Ask HN, Show HN, and front page posts
                  </p>
                </div>
                <Switch
                  checked={profile.hn_enabled}
                  onCheckedChange={(checked) => update('hn_enabled', checked)}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div>
                <Label className="text-sm font-medium">
                  Competitor Names
                </Label>
                <p className="mb-2 text-xs text-muted-foreground">
                  RedArky will watch for posts mentioning these competitors —
                  especially complaints, which are churn-capture opportunities.
                </p>
                <div className="space-y-2">
                  {profile.competitors.map((comp, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Swords className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <Input
                        value={comp}
                        onChange={(e) =>
                          updateArrayItem('competitors', idx, e.target.value)
                        }
                        placeholder="e.g. ZenRows"
                        className="h-10"
                      />
                      {profile.competitors.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 shrink-0 text-muted-foreground"
                          onClick={() => removeArrayItem('competitors', idx)}
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
                  onClick={() => addArrayItem('competitors')}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add competitor
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
            disabled={step === 0}
            className="gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="gap-1.5"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              disabled={!canProceed()}
              className="gap-1.5"
            >
              <Check className="h-4 w-4" />
              Start Finding Leads
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}