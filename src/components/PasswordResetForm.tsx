
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle, Mail } from 'lucide-react';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { toast } from 'sonner';

const resetSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ResetFormValues = z.infer<typeof resetSchema>;

const PasswordResetForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword } = useSimpleAuth();
  
  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ResetFormValues) => {
    try {
      await resetPassword(data.email);
      setIsSubmitted(true);
    } catch (error) {
      toast.error('Failed to send reset email. Please try again.');
    }
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle>Check Your Email</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            We've sent a password reset link to your email address. 
            Please check your inbox and follow the instructions to reset your password.
          </p>
          <Button 
            variant="outline" 
            onClick={() => setIsSubmitted(false)}
            className="w-full"
          >
            Send Another Email
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Mail className="h-12 w-12 text-primary" />
        </div>
        <CardTitle>Reset Your Password</CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...form.register('email')}
              className={form.formState.errors.email ? 'border-red-500' : ''}
            />
            {form.formState.errors.email && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                {form.formState.errors.email.message}
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PasswordResetForm;
