import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { navItems } from '@/lib/nav-items';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
} from '@/components/ui/sidebar';

const navGroups = [
  {
    label: 'Overview',
    items: ['Dashboard', 'Strategic Goals', 'Planning'],
  },
  {
    label: 'Intelligence',
    items: ['Analytics', 'Industry', 'Tactical Map'],
  },
  {
    label: 'Management',
    items: ['Teams', 'Organization', 'ERP'],
  },
  {
    label: 'System',
    items: ['User Management', 'Admin', 'Support', 'Settings'],
  },
];

const AppSidebar = () => {
  const { hasRole } = useSimpleAuth();
  const location = useLocation();

  const filteredNavItems = navItems.filter(item => {
    if (!item.requiredRole) return true;
    return hasRole(item.requiredRole);
  });

  const isActive = (url: string) => {
    if (url === '/') return location.pathname === '/';
    return location.pathname.startsWith(url);
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-base text-sidebar-foreground leading-tight">
              Strategic
            </span>
            <span className="text-[11px] text-sidebar-foreground/60 leading-tight">
              Dashboard
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {navGroups.map((group) => {
          const groupItems = group.items
            .map(title => filteredNavItems.find(item => item.title === title))
            .filter((item): item is NonNullable<typeof item> => item != null);

          if (groupItems.length === 0) return null;

          return (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel className="text-sidebar-foreground/40 text-[11px] uppercase tracking-wider font-semibold">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {groupItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.url);
                    return (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          tooltip={item.title}
                          className={cn(
                            'transition-all duration-150',
                            active && 'bg-sidebar-primary/10 text-sidebar-primary font-medium'
                          )}
                        >
                          <Link to={item.url} className="no-underline">
                            <Icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="p-3 group-data-[collapsible=icon]:hidden">
        <div className="rounded-lg bg-sidebar-accent/50 p-3">
          <p className="text-[11px] text-sidebar-foreground/60 leading-relaxed">
            Strategic Intelligence Platform
          </p>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
