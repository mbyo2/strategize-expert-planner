
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from './LanguageProvider';
import { Check, Languages } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  asButton?: boolean;
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  asButton = true,
  className 
}) => {
  const { currentLanguage, changeLanguage, languageNames, t } = useLanguage();
  const [open, setOpen] = useState(false);
  
  const handleSelect = (language: string) => {
    changeLanguage(language as any);
    setOpen(false);
  };
  
  if (!asButton) {
    return (
      <div className={cn("space-y-4", className)}>
        <label className="block text-sm font-medium">{t('settings.language')}</label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {Object.entries(languageNames).map(([code, name]) => (
            <button
              key={code}
              onClick={() => handleSelect(code)}
              className={cn(
                "flex items-center justify-center py-2 px-3 border rounded-md hover:bg-muted transition-colors",
                code === currentLanguage && "border-primary bg-primary/5"
              )}
              aria-label={`Select ${name}`}
              aria-pressed={code === currentLanguage}
            >
              <span>{name}</span>
              {code === currentLanguage && (
                <Check className="h-4 w-4 ml-2 text-primary" />
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "fixed bottom-4 right-4 z-50 gap-2 hover:bg-primary hover:text-primary-foreground",
            className
          )}
          onClick={() => setOpen(true)}
          aria-label="Change language"
        >
          <Languages className="h-4 w-4" />
          <span className="sr-only md:not-sr-only md:inline-flex">
            {languageNames[currentLanguage]}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            {t('settings.language')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
          {Object.entries(languageNames).map(([code, name]) => (
            <button
              key={code}
              onClick={() => handleSelect(code)}
              className={cn(
                "flex items-center justify-start gap-2 p-3 border rounded-md hover:bg-muted transition-colors",
                code === currentLanguage && "border-primary bg-primary/5"
              )}
            >
              {code === currentLanguage && (
                <Check className="h-4 w-4 text-primary" />
              )}
              <span className={code === currentLanguage ? "font-medium" : ""}>
                {name}
              </span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageSwitcher;
