
import { 
  Home, 
  Target, 
  Calendar, 
  BarChart3, 
  Building, 
  Users, 
  Settings, 
  User,
  Zap,
  Shield
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
    title: "Planning",
    url: "/planning", 
    icon: Calendar,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Industry Analysis",
    url: "/industry",
    icon: Building,
  },
  {
    title: "Teams",
    url: "/teams",
    icon: Users,
  },
  {
    title: "Integrations",
    url: "/integrations",
    icon: Zap,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Admin",
    url: "/admin",
    icon: Shield,
    requiresRole: "admin"
  }
];
