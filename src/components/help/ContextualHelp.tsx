
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HelpCircle } from 'lucide-react';

interface ContextualHelpProps {
  content: string;
  title?: string;
}

const ContextualHelp: React.FC<ContextualHelpProps> = ({ content, title }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-5 w-5">
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        {title && <h4 className="font-semibold mb-2">{title}</h4>}
        <p className="text-sm text-muted-foreground">{content}</p>
      </PopoverContent>
    </Popover>
  );
};

export default ContextualHelp;
