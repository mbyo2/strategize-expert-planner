import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import UserMenu from './UserMenu';
import CommandPalette from './CommandPalette';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const AppLayout = () => {
  const openSearch = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
  };
  return (
    <SidebarProvider>
      <AppSidebar />
      <CommandPalette />
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Button
            variant="outline"
            size="sm"
            onClick={openSearch}
            className="gap-2 text-muted-foreground w-56 justify-start"
          >
            <Search className="h-4 w-4" />
            <span className="text-sm">Search…</span>
            <kbd className="ml-auto pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              ⌘K
            </kbd>
          </Button>
          <div className="flex-1" />
          <UserMenu />
        </header>
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;
