
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, CheckCircle, KeyRound } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { logAuditEvent } from '@/services/auditService';

const MfaVerify = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number>(3);

  // Get the redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    // If user is already MFA verified, redirect to the intended destination
    if (user?.mfaVerified) {
      navigate(from, { replace: true });
    }
    
    // In a real app, we would send the OTP code to the user's device
    // For this example, we'll log the mock code to the console
    console.log('DEMO: MFA code is 123456');
    
    // Log MFA verification attempt
    if (user) {
      logAuditEvent({
        action: 'mfa_verify',
        resource: 'user',
        resourceId: user.id,
        description: 'MFA verification page accessed',
        userId: user.id,
        severity: 'medium',
      });
    }
  }, [user, navigate, from]);

  const handleVerify = async () => {
    if (!user) return;
    
    setIsProcessing(true);
    
    try {
      // In a real app, we would verify the OTP with a backend service
      // For this example, we'll accept "123456" as a valid code
      if (otp === '123456') {
        // Mock successful verification
        setTimeout(() => {
          // Log successful verification
          logAuditEvent({
            action: 'mfa_verify',
            resource: 'user',
            resourceId: user.id,
            description: 'MFA verification successful',
            userId: user.id,
            severity: 'medium',
          });
          
          toast.success('Verification successful', {
            description: 'Your identity has been verified'
          });
          
          // This would update the user object in a real app
          // Since we don't have the actual update function here, we'll just redirect
          navigate(from, { replace: true });
        }, 1500);
      } else {
        // Failed verification
        const newAttempts = remainingAttempts - 1;
        setRemainingAttempts(newAttempts);
        
        // Log failed verification
        logAuditEvent({
          action: 'mfa_verify',
          resource: 'user',
          resourceId: user.id,
          description: 'MFA verification failed',
          userId: user.id,
          severity: 'high',
          metadata: {
            remainingAttempts: newAttempts
          }
        });
        
        if (newAttempts <= 0) {
          toast.error('Too many failed attempts', {
            description: 'Your account has been temporarily locked. Please try again later.'
          });
          
          // In a real app, we would lock the account temporarily
          // For this example, we'll just redirect to login
          navigate('/login', { replace: true });
        } else {
          toast.error('Invalid verification code', {
            description: `Please try again. ${newAttempts} attempt${newAttempts === 1 ? '' : 's'} remaining.`
          });
        }
      }
    } catch (error) {
      console.error('MFA verification error:', error);
      toast.error('Verification failed', {
        description: 'An error occurred during verification. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <h1 className="mt-2 text-3xl font-bold">Two-Factor Authentication</h1>
          <p className="mt-2 text-muted-foreground">
            Enter the verification code sent to your device
          </p>
        </div>

        <div className="rounded-lg border p-6 shadow-sm space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit code to verify your identity
            </p>
            <div className="flex justify-center py-4">
              <InputOTP 
                maxLength={6} 
                value={otp} 
                onChange={setOtp}
                render={({ slots }) => (
                  <InputOTPGroup>
                    {slots.map((slot, index) => (
                      <InputOTPSlot key={index} {...slot} />
                    ))}
                  </InputOTPGroup>
                )}
              />
            </div>
            <p className="text-xs text-center text-muted-foreground italic">
              For this demo, use code: 123456
            </p>
          </div>

          <Button 
            onClick={handleVerify} 
            className="w-full"
            disabled={isProcessing || otp.length !== 6}
          >
            {isProcessing ? (
              <>
                <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Verifying...
              </>
            ) : (
              <>
                <KeyRound className="h-4 w-4 mr-2" />
                Verify Identity
              </>
            )}
          </Button>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              {remainingAttempts < 3 ? (
                <span className="text-destructive font-medium">
                  {remainingAttempts} attempt{remainingAttempts === 1 ? '' : 's'} remaining
                </span>
              ) : (
                "Security verification helps protect your account"
              )}
            </p>
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            Having issues? Contact support for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MfaVerify;
