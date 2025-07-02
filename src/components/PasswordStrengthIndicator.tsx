
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Check, X } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const { t } = useLanguage();
  
  const requirements = [
    { label: t('password.requirement.length'), test: (pwd: string) => pwd.length >= 8 },
    { label: t('password.requirement.uppercase'), test: (pwd: string) => /[A-Z]/.test(pwd) },
    { label: t('password.requirement.lowercase'), test: (pwd: string) => /[a-z]/.test(pwd) },
    { label: t('password.requirement.number'), test: (pwd: string) => /\d/.test(pwd) },
    { label: t('password.requirement.special'), test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) }
  ];

  const passedRequirements = requirements.filter(req => req.test(password));
  const strength = (passedRequirements.length / requirements.length) * 100;

  const getStrengthLabel = () => {
    if (strength < 40) return t('password.weak');
    if (strength < 80) return t('password.medium');
    return t('password.strong');
  };

  const getStrengthColor = () => {
    if (strength < 40) return 'bg-red-500';
    if (strength < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (!password) return null;

  return (
    <div className="space-y-2 mt-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{t('password.strength')}</span>
        <span className={`text-sm font-medium ${
          strength < 40 ? 'text-red-600' : strength < 80 ? 'text-yellow-600' : 'text-green-600'
        }`}>
          {getStrengthLabel()}
        </span>
      </div>
      <Progress value={strength} className={`h-2 ${getStrengthColor()}`} />
      <div className="space-y-1">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            {req.test(password) ? (
              <Check className="h-3 w-3 text-green-600" />
            ) : (
              <X className="h-3 w-3 text-red-600" />
            )}
            <span className={req.test(password) ? 'text-green-600' : 'text-muted-foreground'}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
