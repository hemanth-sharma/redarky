/**
 * Feedback — strict verified-email feedback flow.
 *
 * Step 1: enter your email → a 6-digit code is sent (in local dev without
 *         SMTP the code is returned as `dev_code` and auto-filled).
 * Step 2: enter the code to verify the address.
 * Step 3: write your feedback — only submittable with a verified email.
 *
 * The verified email matters: it lets us reply when we act on the feedback.
 */
import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  Mail,
  MailCheck,
  Loader2,
  MessageSquareHeart,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Send,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { feedbackApi } from '@/api';
import { useAuth } from '@/lib/AuthContext';
import { toastApiError } from '@/api';
import { toast } from '@/hooks/use-toast';
import { cn, isValidEmail } from '@/lib/utils';

const CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'bug', label: 'Bug report' },
  { value: 'feature_request', label: 'Feature request' },
  { value: 'other', label: 'Other' },
];

export default function Feedback() {
  const { user } = useAuth();

  // step: 'email' → 'code' → 'message' → 'done'
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState(user?.email || '');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('general');
  const [devCode, setDevCode] = useState(null);

  // If the logged-in user's email was already verified before, jump ahead
  useEffect(() => {
    if (!email) return;
    feedbackApi
      .status(email)
      .then((res) => {
        if (res?.verified) setStep('message');
      })
      .catch(() => {});
  }, []);

  const requestCodeMutation = useMutation({
    mutationFn: () => feedbackApi.requestVerification(email.trim()),
    onSuccess: (res) => {
      setDevCode(res?.dev_code || null);
      if (res?.dev_code) setCode(res.dev_code);
      setStep('code');
      toast({
        title: 'Verification code sent',
        description: res?.dev_code
          ? `Dev mode: code is ${res.dev_code} (SMTP not configured)`
          : `Check ${email.trim()} for a 6-digit code.`,
      });
    },
    onError: (e) => toastApiError(e, 'Failed to send verification code'),
  });

  const verifyMutation = useMutation({
    mutationFn: () => feedbackApi.verify(email.trim(), code.trim()),
    onSuccess: () => {
      setDevCode(null);
      setStep('message');
      toast({ title: 'Email verified', description: 'You can now send feedback.' });
    },
    onError: (e) => toastApiError(e, 'Verification failed'),
  });

  const submitMutation = useMutation({
    mutationFn: () =>
      feedbackApi.submit({ email: email.trim(), message: message.trim(), category }),
    onSuccess: () => {
      setStep('done');
      toast({ title: 'Feedback sent', description: 'Thank you — we read every message.' });
    },
    onError: (e) => toastApiError(e, 'Failed to submit feedback'),
  });

  const steps = [
    { id: 'email', label: 'Your email', icon: Mail },
    { id: 'code', label: 'Verify', icon: ShieldCheck },
    { id: 'message', label: 'Feedback', icon: MessageSquareHeart },
  ];
  const stepIndex = steps.findIndex((s) => s.id === step);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
          <MessageSquareHeart className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Send Feedback</h2>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Tell us what's working, what's broken, or what you'd love to see next.
          We verify your email so we can follow up when we act on it.
        </p>
      </div>

      {/* Step indicator */}
      {step !== 'done' && (
        <div className="flex items-center justify-center gap-0">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const done = i < stepIndex;
            const active = i === stepIndex;
            return (
              <React.Fragment key={s.id}>
                {i > 0 && (
                  <div
                    className={cn(
                      'h-px w-10 sm:w-16',
                      done ? 'bg-primary' : 'bg-border'
                    )}
                  />
                )}
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-colors',
                      done && 'border-primary bg-primary text-primary-foreground',
                      active && 'border-primary bg-primary/10 text-primary',
                      !done && !active && 'border-border text-muted-foreground'
                    )}
                  >
                    {done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span
                    className={cn(
                      'text-[10px] font-medium',
                      active ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {s.label}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Step content */}
      {step === 'email' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              What's your email?
            </CardTitle>
            <CardDescription className="text-xs">
              We'll send a one-time 6-digit code to verify it's really you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Email address</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && isValidEmail(email)) requestCodeMutation.mutate();
                }}
                placeholder="you@company.com"
                className="mt-1.5 h-10"
              />
            </div>
            <Button
              className="w-full gap-1.5"
              onClick={() => requestCodeMutation.mutate()}
              disabled={!isValidEmail(email) || requestCodeMutation.isPending}
            >
              {requestCodeMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Send verification code
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'code' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Enter your verification code
            </CardTitle>
            <CardDescription className="text-xs">
              We sent a 6-digit code to <span className="font-semibold text-foreground">{email}</span>.
              It expires in 15 minutes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Verification code</Label>
              <Input
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && code.length === 6) verifyMutation.mutate();
                }}
                placeholder="••••••"
                className="mt-1.5 h-12 text-center text-lg font-mono tracking-[0.5em]"
              />
            </div>

            {devCode && (
              <div className="rounded-md border border-amber-300/50 bg-amber-100/50 dark:border-amber-900 dark:bg-amber-950/30 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
                <Badge variant="warning" className="mr-1.5 text-[9px]">Dev mode</Badge>
                SMTP isn't configured, so your code is <span className="font-mono font-bold">{devCode}</span> —
                it's already filled in.
              </div>
            )}

            <Button
              className="w-full gap-1.5"
              onClick={() => verifyMutation.mutate()}
              disabled={code.length !== 6 || verifyMutation.isPending}
            >
              {verifyMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
              Verify email
            </Button>

            <div className="flex items-center justify-between text-xs">
              <button
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition"
                onClick={() => setStep('email')}
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Wrong email?
              </button>
              <button
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition disabled:opacity-50"
                onClick={() => requestCodeMutation.mutate()}
                disabled={requestCodeMutation.isPending}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {requestCodeMutation.isPending ? 'Sending…' : 'Resend code'}
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'message' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <MailCheck className="h-4 w-4 text-emerald-500" />
              Verified — write your feedback
            </CardTitle>
            <CardDescription className="text-xs">
              <span className="font-semibold text-foreground">{email}</span> is verified. We'll
              reply there when we work on your feedback.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1.5 h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">Your feedback</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What should we improve, fix, or build next?"
                className="mt-1.5 min-h-[140px]"
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                {message.trim().length}/5000 characters
              </p>
            </div>
            <Button
              className="w-full gap-1.5"
              onClick={() => submitMutation.mutate()}
              disabled={message.trim().length < 5 || submitMutation.isPending}
            >
              {submitMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Send feedback
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'done' && (
        <Card>
          <CardContent className="py-10 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60">
              <CheckCircle2 className="h-7 w-7 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Feedback received!</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Thanks for taking the time — a verified email means we can reach
                you at <span className="font-medium text-foreground">{email}</span> once
                we've acted on it.
              </p>
            </div>
            <Button
              variant="outline"
              className="gap-1.5"
              onClick={() => {
                setStep('message');
                setMessage('');
                setCategory('general');
              }}
            >
              <MessageSquareHeart className="h-4 w-4" />
              Send more feedback
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
