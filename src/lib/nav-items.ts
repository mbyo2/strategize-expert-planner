
import { 
  BarChart3, 
  Target, 
  Users, 
  Building2, 
  Calendar, 
  Lightbulb,
  Map,
  Settings,
  TrendingUp,
  UserCheck,
  Shield,
  Ticket,
  Package,
  LucideIcon
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  requiredRole?: 'viewer' | 'analyst' | 'manager' | 'admin';
}

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
  },
  {
    title: "Strategic Goals",
    url: "/goals",
    icon: Target,
  },
  {
    title: "Planning",
    url: "/planning",
    icon: Calendar,
    requiredRole: 'manager',
  },
  {
    title: "Teams",
    url: "/teams",
    icon: Users,
    requiredRole: 'manager',
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: TrendingUp,
    requiredRole: 'analyst',
  },
  {
    title: "Industry",
    url: "/industry",
    icon: Lightbulb,
    requiredRole: 'analyst',
  },
  {
    title: "Tactical Map",
    url: "/tactical-map",
    icon: Map,
    requiredRole: 'manager',
  },
  {
    title: "ERP",
    url: "/erp",
    icon: Package,
    requiredRole: 'manager',
  },
  {
    title: "Organization",
    url: "/organization",
    icon: Building2,
    requiredRole: 'manager',
  },
  {
    title: "User Management",
    url: "/user-management",
    icon: UserCheck,
    requiredRole: 'admin',
  },
  {
    title: "Admin",
    url: "/admin",
    icon: Shield,
    requiredRole: 'admin',
  },
  {
    title: "Support",
    url: "/support",
    icon: Ticket,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];
