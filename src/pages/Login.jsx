import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, Mail, Lock, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import GoogleIcon from '@/components/GoogleIcon';
import { useAuth } from '@/lib/AuthContext';
import { toast } from '@/hooks/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const { loginWithEmail, loginAsDemoUser, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const nextPath = params.get('next') || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      navigate(nextPath, { replace: true });
    } catch (err) {
      setError(err?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    loginWithGoogle(nextPath);
  };

  const handleDemo = async () => {
    setError('');
    setDemoLoading(true);
    try {
      await loginAsDemoUser();
      navigate(nextPath, { replace: true });
    } catch (err) {
      setError(err?.message || 'Demo login failed');
      toast({
        title: 'Demo login failed',
        description: err?.message || 'Backend may be unreachable',
        variant: 'destructive',
      });
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <AuthLayout
      icon={LogIn}
      title="Welcome back"
      subtitle="Log in to your Redarky account"
      footer={
        <>
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Create one
          </Link>
        </>
      }
    >
      {/* Default user one-click login */}
      <div className="rounded-lg gradient-border bg-primary/5 p-3 mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg gradient-accent text-white shadow">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold leading-tight">Demo user</p>
            <p className="text-[11px] text-muted-foreground leading-tight">
              See the product in 1 click
            </p>
          </div>
        </div>
        <Button
          variant="gradient"
          size="sm"
          onClick={handleDemo}
          disabled={demoLoading || loading}
        >
          {demoLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Log in'
          )}
        </Button>
      </div>

      <Button
        variant="outline"
        className="w-full h-11 text-sm font-medium mb-3"
        onClick={handleGoogle}
        type="button"
      >
        <GoogleIcon className="w-5 h-5 mr-2" />
        Continue with Google
      </Button>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground">or with email</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
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
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-11"
              required
            />
          </div>
        </div>
        <Button
          type="submit"
          variant="gradient"
          className="w-full h-11 font-medium"
          disabled={loading || demoLoading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Logging in…
            </>
          ) : (
            'Log in'
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
