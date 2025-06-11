
import { 
  Home, 
  Target, 
  BarChart3, 
  Users, 
  Calendar, 
  TrendingUp, 
  Settings, 
  Building, 
  HelpCircle,
  Activity,
  Palette,
  Shield,
  Code
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredRole?: string;
}

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
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
  },
  {
    title: "Industry",
    url: "/industry",
    icon: TrendingUp,
  },
  {
    title: "Resources", 
    url: "/resources",
    icon: HelpCircle,
  },
  {
    title: "Analytics",
    url: "/analytics", 
    icon: BarChart3,
    requiredRole: "analyst",
  },
  {
    title: "Teams",
    url: "/teams",
    icon: Users,
    requiredRole: "manager",
  },
  {
    title: "Organization",
    url: "/organization",
    icon: Building,
    requiredRole: "manager",
  },
  {
    title: "Infrastructure",
    url: "/infrastructure", 
    icon: Activity,
    requiredRole: "admin",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];
