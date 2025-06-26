import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Home, 
  Users, 
  Calendar, 
  BarChart2, 
  Settings,
  MessageSquare,
  FileText,
  HelpCircle,
  User,
  Shield,
  Euro
} from "lucide-react";
import logo from "/logo-exe-crm-sport.png";

interface SidebarProps {
  isOpen: boolean;
}

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

const sidebarItems: SidebarItem[] = [
  {
    name: "Tableau de bord",
    href: "/dashboard",
    icon: <Home size={20} />,
  },
  {
    name: "Membres",
    href: "/members",
    icon: <Users size={20} />,
  },
  {
    name: "Calendrier",
    href: "/calendar",
    icon: <Calendar size={20} />,
  },
  {
    name: "Rapports",
    href: "/reports",
    icon: <BarChart2 size={20} />,
  },
  {
    name: "Messages",
    href: "/messages",
    icon: <MessageSquare size={20} />,
  },
  {
    name: "Activités",
    href: "/activities",
    icon: <Calendar size={20} />,
  },
  {
    name: "Documents",
    href: "/documents",
    icon: <FileText size={20} />,
  },
  {
    name: "Mon Profil",
    href: "/profile",
    icon: <User size={20} />,
  },
  {
    name: "Cotisations",
    href: "/cotisation",
    icon: <Euro size={20} />,
  },
  {
    name: "Paramètres",
    href: "/settings",
    icon: <Settings size={20} />,
  },
  {
    name: "Aide",
    href: "/help",
    icon: <HelpCircle size={20} />,
  },
  {
    name: "Logs Admin",
    href: "/admin/logs",
    icon: <Shield size={20} />,
    adminOnly: true,
  },
];

const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Filter items based on user role
  const filteredItems = sidebarItems.filter(item => {
    if (item.adminOnly && user?.role !== 'admin') {
      return false;
    }
    return true;
  });
  
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => {}}
        />
      )}
      
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-20 flex flex-col h-full bg-background border-r transition-all duration-300 ease-in-out",
          isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full lg:translate-x-0 lg:w-20",
        )}
      >
        <div className="h-16 flex items-center justify-center border-b px-3">
          <div className={cn("flex items-center gap-2", !isOpen && "lg:justify-center")}>
            <img
              src={logo}
              alt="Exe CRM Sport Logo"
              className={cn(
                "h-10 w-10 rounded-md object-contain bg-white shadow login-logo-animated",
                !isOpen && "lg:mx-auto"
              )}
              draggable={false}
            />
            <span className={cn("font-semibold text-sm sm:text-base truncate", !isOpen && "lg:hidden")}>
              Exe CRM Connect
            </span>
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="py-4 space-y-1 px-2 sm:px-3">
            {filteredItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 h-10 px-3",
                    location.pathname === item.href && "bg-accent text-accent-foreground",
                    !isOpen && "lg:justify-center lg:px-2"
                  )}
                >
                  {item.icon}
                  <span className={cn("truncate text-sm", !isOpen && "lg:hidden")}>
                    {item.name}
                  </span>
                </Button>
              </Link>
            ))}
          </div>
        </ScrollArea>
        
        <div className="p-3 border-t">
          <div className={cn(
            "text-xs text-muted-foreground",
            !isOpen && "lg:text-center"
          )}>
            {isOpen ? (
              <span>© 2025 Exe CRM Connect</span>
            ) : (
              <span className="hidden lg:inline-block">© 2025</span>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
