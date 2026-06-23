import React, { useState } from 'react';
import { Zap, Plus, X, Save, Check, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { productProfile } from '@/data/mockData';

const platforms = [
  { id: 'reddit', label: 'Reddit', description: 'Monitor subreddits for keyword matches' },
  { id: 'hackernews', label: 'Hacker News', description: 'Scan Ask HN, Show HN, and front page' },
  { id: 'discord', label: 'Discord', description: 'Watch public dev community servers' },
  { id: 'twitter', label: 'Twitter / X', description: 'Track developer mentions and threads' },
];

export default function ProductProfile() {
  const [profile, setProfile] = useState({
    product_name: productProfile.product_name,
    website: 'https://scrapeflow.io',
    description: productProfile.description,
    competitors: productProfile.competitors,
    platforms: { reddit: true, hackernews: true, discord: false, twitter: false },
  });
  const [tagInput, setTagInput] = useState('');
  const [saved, setSaved] = useState(false);

  const update = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const togglePlatform = (id) => {
    setProfile((prev) => ({
      ...prev,
      platforms: { ...prev.platforms, [id]: !prev.platforms[id] },
    }));
  };

  const addCompetitor = () => {
    const val = tagInput.trim();
    if (val && !profile.competitors.includes(val)) {
      update('competitors', [...profile.competitors, val]);
    }
    setTagInput('');
  };

  const removeCompetitor = (comp) => {
    update(
      'competitors',
      profile.competitors.filter((c) => c !== comp)
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Product Profile
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure your product details. This is the brain of the system —
          everything downstream uses it.
        </p>
      </div>

      <div className="space-y-5">
        {/* Product Name */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-primary" />
              Product Name
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={profile.product_name}
              onChange={(e) => update('product_name', e.target.value)}
              placeholder="e.g. ScrapeFlow"
              className="h-10"
            />
          </CardContent>
        </Card>

        {/* Website */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-primary" />
              Website Link / Domain
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={profile.website}
              onChange={(e) => update('website', e.target.value)}
              placeholder="https://yourproduct.com"
              className="h-10"
            />
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Product Description</CardTitle>
            <CardDescription className="text-xs">
              Describe your product in detail. The AI uses this to draft
              technically accurate, value-first replies.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={profile.description}
              onChange={(e) => update('description', e.target.value)}
              className="min-h-[140px] resize-y"
            />
          </CardContent>
        </Card>

        {/* Competitors tag input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Main Competitors</CardTitle>
            <CardDescription className="text-xs">
              RedArky watches for posts mentioning these competitors —
              especially complaints, which are churn-capture opportunities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 rounded-lg border border-input bg-background p-2.5">
              {profile.competitors.map((comp) => (
                <span
                  key={comp}
                  className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                >
                  {comp}
                  <button
                    onClick={() => removeCompetitor(comp)}
                    className="text-primary/60 hover:text-primary"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCompetitor();
                  }
                }}
                onBlur={addCompetitor}
                placeholder={profile.competitors.length === 0 ? 'Type a competitor and press Enter...' : 'Add another...'}
                className="flex-1 min-w-[140px] bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
              />
            </div>
          </CardContent>
        </Card>

        {/* Target Communities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Target Communities / Platforms</CardTitle>
            <CardDescription className="text-xs">
              Select which platforms RedArky should monitor for your keywords.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {platforms.map((platform) => (
                <label
                  key={platform.id}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/30"
                >
                  <Checkbox
                    checked={profile.platforms[platform.id]}
                    onCheckedChange={() => togglePlatform(platform.id)}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {platform.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {platform.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save bar */}
      <div className="sticky bottom-0 mt-6 flex items-center justify-end gap-3 border-t border-border bg-background/80 py-4 backdrop-blur-md">
        {saved && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <Check className="h-4 w-4" />
            Profile saved
          </span>
        )}
        <Button onClick={handleSave} className="gap-1.5">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}