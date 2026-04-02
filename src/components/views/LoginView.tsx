// src/components/views/LoginView.tsx
import React, { useState } from 'react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginView(): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.api.auth.login.$post({ json: { email, password } });
      console.log('res',res)
      const data = await res.json();
      
      if (data.success && 'token' in data) {
        login(data.token);
      } else {
        setError((data as any).error || 'Authentication rejected.');
      }
    } catch (err) {
      setError('A secure connection could not be established.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background selection:bg-primary/20">
      <Card className="w-full max-w-md shadow-lg border-border/60 animate-in slide-in-from-bottom-4 duration-700">
        <CardHeader className="space-y-3 pb-6 text-center">
          <CardTitle className="text-3xl font-black text-foreground tracking-tighter uppercase">
            Access Portal
          </CardTitle>
          <CardDescription className="text-sm font-medium">
            Requires secure credentials to proceed. Or <a href="/register" className="text-primary hover:underline underline-offset-4 font-bold">provision an account</a>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="text-xs font-bold text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20 tracking-wide uppercase text-center">
                {error}
              </div>
            )}
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  Identity (Email)
                </label>
                <Input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="h-10 text-sm font-medium" placeholder="administrator@domain.com" />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  Passphrase
                </label>
                <Input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  className="h-10 text-sm font-medium" placeholder="Password" />
              </div>
            </div>
            <div className="pt-2">
              <Button type="submit" disabled={isLoading} className="w-full h-11 text-xs font-black tracking-widest uppercase transition-all">
                {isLoading ? 'Verifying Identity...' : 'Initiate Session'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}