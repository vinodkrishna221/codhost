"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { signIn, signUp, resetPassword } from '@/lib/supabase/auth';
import { useRouter } from 'next/navigation';

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type AuthFormData = z.infer<typeof authSchema>;

interface AuthFormProps {
  mode: 'signin' | 'signup' | 'reset';
  onSuccess?: () => void;
}

export function AuthForm({ mode, onSuccess }: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true);
    try {
      let result;
      
      switch (mode) {
        case 'signin':
          result = await signIn(data.email, data.password);
          if (!result.error) {
            toast({
              title: 'Success',
              description: 'Successfully signed in',
            });
            router.push('/dashboard');
            router.refresh();
          }
          break;
        case 'signup':
          result = await signUp(data.email, data.password);
          if (!result.error) {
            toast({
              title: 'Success',
              description: 'Please check your email to verify your account',
            });
            router.push('/auth/signin');
          }
          break;
        case 'reset':
          result = await resetPassword(data.email);
          if (!result.error) {
            toast({
              title: 'Success',
              description: 'Check your email for reset instructions',
            });
            router.push('/auth/signin');
          }
          break;
      }

      if (result?.error) {
        throw result.error;
      }

      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          type="email"
          placeholder="Email"
          {...register('email')}
          disabled={loading}
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      {mode !== 'reset' && (
        <div>
          <Input
            type="password"
            placeholder="Password"
            {...register('password')}
            disabled={loading}
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Reset Password'}
      </Button>
    </form>
  );
}