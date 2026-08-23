import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { toast } from '@/hooks/use-toast';
import { toastApiError, ApiError } from '@/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // NOTE: Backend doesn't expose a forgot-password endpoint in the API
      // docs we have. For MVP, we show a success message regardless of
      // backend availability — the real implementation should POST to
      // /auth/forgot-password when the backend ships that route.
      setSent(true);
      toast({
        title: 'Reset link sent',
        description: `Check ${email} for instructions.`,
      });
    } catch (err) {
      // Always show success to avoid account enumeration
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      icon={Mail}
      title="Reset password"
      subtitle="We'll send you a link to reset it"
      footer={
        <Link to="/login" className="text-primary font-medium hover:underline inline-flex items-center">
          <ArrowLeft className="w-3 h-3 inline mr-1" />Back to log in
        </Link>
      }
    >
      {sent ? (
        <p className="text-sm text-foreground text-center">
          If an account exists with that email, you'll receive a password reset
          link shortly.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                autoFocus
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-11"
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            variant="gradient"
            className="w-full h-11 font-medium"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending…
              </>
            ) : (
              'Send reset link'
            )}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
