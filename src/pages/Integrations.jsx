import React, { useState } from 'react';
import { Slack, Mail, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function Integrations() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [slackConnected, setSlackConnected] = useState(false);
  const [digestEnabled, setDigestEnabled] = useState(false);

  const handleConnectSlack = () => {
    if (webhookUrl.trim()) {
      setSlackConnected(true);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:px-6 md:py-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Integrations
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Connect external services to route alerts and summaries.
        </p>
      </div>

      <div className="space-y-5">
        {/* Slack Push Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Slack className="h-4 w-4 text-primary" />
              Slack Push Alerts
            </CardTitle>
            <CardDescription className="text-xs">
              Receive real-time push alerts to a Slack channel when high-intent
              leads are captured.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Slack Webhook URL</Label>
                <Input
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
                  className="mt-1.5 h-10 font-mono text-xs"
                  disabled={slackConnected}
                />
              </div>
              <Button
                onClick={handleConnectSlack}
                disabled={!webhookUrl.trim() || slackConnected}
                className="gap-1.5"
              >
                {slackConnected ? (
                  <>
                    <Check className="h-4 w-4" />
                    Connected
                  </>
                ) : (
                  'Connect'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Daily Summary Digest */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-primary" />
              Daily Summary Digest
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label className="text-sm font-medium">
                  Enable Daily Summary Digest
                </Label>
                <p className="mt-1 text-xs text-muted-foreground">
                  Receive a summary of new leads, top intent scores, and
                  pipeline stats at 07:00 UTC every morning.
                </p>
              </div>
              <Switch
                checked={digestEnabled}
                onCheckedChange={setDigestEnabled}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}