/**
 * Integrations — connect channels where new-lead alerts are delivered,
 * plus bring-your-own LLM so Stage 3 runs on the user's own model.
 *
 * Backed by /integrations (real persistence + test pings):
 *   slack | discord | teams | whatsapp | email | llm
 */
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Slack,
  Mail,
  MessageCircle,
  Users,
  Phone,
  Bot,
  Check,
  Plus,
  Loader2,
  Trash2,
  Zap,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { integrationsApi } from '@/api';
import { toast } from '@/hooks/use-toast';
import { toastApiError } from '@/api';
import { cn, formatRelativeTime } from '@/lib/utils';

/**
 * Channel catalog — each card renders its own config form.
 * webhook channels: slack, discord, teams, whatsapp
 * email:            to_email
 * llm:              api_key + base_url + model
 */
const CHANNELS = [
  {
    type: 'slack',
    label: 'Slack',
    icon: Slack,
    accent: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
    description: 'Push alerts to a Slack channel when a high-intent lead is captured.',
    configFields: [
      { key: 'webhook_url', label: 'Slack Webhook URL', placeholder: 'https://hooks.slack.com/services/…' },
    ],
  },
  {
    type: 'discord',
    label: 'Discord',
    icon: MessageCircle,
    accent: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    description: 'Send new-lead alerts to a Discord channel via an incoming webhook.',
    configFields: [
      { key: 'webhook_url', label: 'Discord Webhook URL', placeholder: 'https://discord.com/api/webhooks/…' },
    ],
  },
  {
    type: 'teams',
    label: 'Microsoft Teams',
    icon: Users,
    accent: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    description: 'Post lead alerts to a Teams channel with a Workflows incoming webhook.',
    configFields: [
      { key: 'webhook_url', label: 'Teams Webhook URL', placeholder: 'https://….webhook.office.com/webhookb2/…' },
    ],
  },
  {
    type: 'whatsapp',
    label: 'WhatsApp',
    icon: Phone,
    accent: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    description: 'Route lead alerts through a WhatsApp webhook gateway (e.g. Twilio, 360dialog).',
    configFields: [
      { key: 'webhook_url', label: 'WhatsApp Gateway Webhook URL', placeholder: 'https://your-gateway/…' },
    ],
  },
  {
    type: 'email',
    label: 'Email',
    icon: Mail,
    accent: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    description: 'Receive an email for every new lead (uses the platform SMTP settings).',
    configFields: [
      { key: 'to_email', label: 'Notification email address', placeholder: 'you@company.com', type: 'email' },
    ],
  },
  {
    type: 'llm',
    label: 'Custom LLM',
    icon: Bot,
    accent: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400',
    description:
      'Bring your own OpenAI-compatible model. The Stage-3 lead agent uses it to grade posts for your products instead of the platform default.',
    configFields: [
      { key: 'api_key', label: 'API key', placeholder: 'sk-…', type: 'password' },
      { key: 'base_url', label: 'Base URL (optional — OpenAI-compatible)', placeholder: 'https://api.openai.com/v1' },
      { key: 'model', label: 'Model (optional)', placeholder: 'gpt-4o-mini' },
    ],
  },
];

export default function Integrations() {
  const queryClient = useQueryClient();

  const { data: integrations = [], isLoading } = useQuery({
    queryKey: ['integrations'],
    queryFn: () => integrationsApi.list(),
  });

  const removeMutation = useMutation({
    mutationFn: (id) => integrationsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      toast({ title: 'Integration removed' });
    },
    onError: (e) => toastApiError(e, 'Failed to remove integration'),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }) => integrationsApi.update(id, { is_active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
    },
    onError: (e) => toastApiError(e, 'Failed to update integration'),
  });

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Integrations</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Connect channels where new leads are announced — or plug in your own LLM
          to power the AI lead agent.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-4">
          {CHANNELS.map((channel) => {
            const existing = integrations.find((i) => i.type === channel.type);
            return (
              <ChannelCard
                key={channel.type}
                channel={channel}
                existing={existing}
                onRemoved={(id) => removeMutation.mutate(id)}
                onToggled={(id, is_active) => toggleMutation.mutate({ id, is_active })}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function ChannelCard({ channel, existing, onRemoved, onToggled }) {
  const queryClient = useQueryClient();
  const [config, setConfig] = useState({});
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const Icon = channel.icon;
  const isConnected = !!existing;

  const connectMutation = useMutation({
    mutationFn: () => integrationsApi.create({ type: channel.type, config }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      toast({ title: `${channel.label} connected` });
      setConfig({});
    },
    onError: (e) => toastApiError(e, `Failed to connect ${channel.label}`),
  });

  const updateMutation = useMutation({
    mutationFn: (data) => integrationsApi.update(existing.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      toast({ title: 'Integration updated' });
      setConfig({});
    },
    onError: (e) => toastApiError(e, 'Failed to update integration'),
  });

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await integrationsApi.test(existing.id);
      setTestResult(res);
      if (res.ok) {
        toast({ title: 'Test passed', description: res.detail });
      } else {
        toast({
          title: 'Test failed',
          description: res.detail,
          variant: 'destructive',
        });
      }
    } catch (e) {
      setTestResult({ ok: false, detail: e.message });
      toastApiError(e, 'Test failed');
    } finally {
      setTesting(false);
    }
  };

  const isValid = () => {
    if (channel.type === 'llm') {
      const key = (config.api_key || existing?.config?.api_key || '').trim();
      return key.length > 4;
    }
    if (channel.type === 'email') {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(config.to_email || existing?.config?.to_email || '');
    }
    return (config.webhook_url || existing?.config?.webhook_url || '').startsWith('http');
  };

  const configChanged = Object.keys(config).length > 0;

  return (
    <Card className={cn('transition-colors', isConnected && 'border-primary/40')}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', channel.accent)}>
              <Icon className="h-4.5 w-4.5 h-4 w-4" />
            </div>
            <div className="min-w-0">
              <CardTitle className="flex items-center gap-2 text-sm">
                {channel.label}
                {isConnected && (
                  <Badge variant="success" className="text-[10px] gap-1">
                    <Check className="h-3 w-3" /> Connected
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-xs mt-1 leading-relaxed">
                {channel.description}
              </CardDescription>
            </div>
          </div>

          {isConnected && (
            <div className="flex items-center gap-2 shrink-0">
              <Switch
                checked={existing.is_active}
                onCheckedChange={(v) => onToggled(existing.id, v)}
                aria-label={`Toggle ${channel.label}`}
              />
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => onRemoved(existing.id)}
                aria-label="Remove integration"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Config form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {channel.configFields.map((field) => (
            <div
              key={field.key}
              className={channel.configFields.length === 1 ? 'sm:col-span-2' : ''}
            >
              <Label className="text-xs font-medium">{field.label}</Label>
              <Input
                type={field.type || 'text'}
                value={config[field.key] ?? existing?.config?.[field.key] ?? ''}
                onChange={(e) => setConfig({ ...config, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                className="mt-1 h-9 font-mono text-xs"
              />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {!isConnected ? (
            <Button
              size="sm"
              onClick={() => connectMutation.mutate()}
              disabled={!isValid() || connectMutation.isPending}
              className="gap-1.5"
            >
              {connectMutation.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              Connect
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateMutation.mutate({ config: { ...existing.config, ...config } })}
                disabled={!isValid() || !configChanged || updateMutation.isPending}
                className="gap-1.5"
              >
                {updateMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
                Save changes
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleTest}
                disabled={testing}
                className="gap-1.5"
              >
                {testing ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Zap className="h-3.5 w-3.5" />
                )}
                Send test
              </Button>
              <span className="text-[10px] text-muted-foreground">
                {existing.last_tested_at
                  ? `Last tested ${formatRelativeTime(existing.last_tested_at)}`
                  : 'Never tested'}
              </span>
            </>
          )}

          {testResult && (
            <Badge variant={testResult.ok ? 'success' : 'destructive'} className="text-[10px] gap-1">
              <Send className="h-3 w-3" />
              {testResult.ok ? 'Test OK' : 'Test failed'}
            </Badge>
          )}
        </div>

        {testResult && (
          <p className={cn('text-xs', testResult.ok ? 'text-emerald-600' : 'text-destructive')}>
            {testResult.detail}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
