
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
  Package
} from "lucide-react";

export const navItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
  },
  {
    title: "Tactical Map",
    url: "/tactical-map",
    icon: Map,
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
    title: "Teams",
    url: "/teams",
    icon: Users,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: TrendingUp,
  },
  {
    title: "Industry",
    url: "/industry",
    icon: Lightbulb,
  },
  {
    title: "ERP",
    url: "/erp",
    icon: Package,
  },
  {
    title: "Organization",
    url: "/organization",
    icon: Building2,
  },
  {
    title: "User Management",
    url: "/user-management",
    icon: UserCheck,
  },
  {
    title: "Admin",
    url: "/admin",
    icon: Shield,
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
