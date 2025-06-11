
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PasswordResetForm from '@/components/PasswordResetForm';

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Shield className="h-12 w-12 text-primary mx-auto" />
          <h1 className="mt-2 text-3xl font-bold">Intantiko</h1>
        </div>

        <PasswordResetForm />

        <div className="text-center">
          <Button variant="ghost" asChild>
            <Link to="/login" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
