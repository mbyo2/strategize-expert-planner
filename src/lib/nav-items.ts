
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

export const navItems = [
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
    title: "Analytics",
    url: "/analytics", 
    icon: BarChart3,
  },
  {
    title: "Teams",
    url: "/teams",
    icon: Users,
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
    title: "Organization",
    url: "/organization",
    icon: Building,
  },
  {
    title: "Infrastructure",
    url: "/infrastructure", 
    icon: Activity,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Resources", 
    url: "/resources",
    icon: HelpCircle,
  },
];
