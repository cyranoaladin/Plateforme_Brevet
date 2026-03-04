"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Swords, 
  Trophy, 
  MessageSquare, 
  GraduationCap, 
  BookText,
  Medal,
  Users
} from "lucide-react";

const navItems = [
  { name: "QG", path: "/", icon: LayoutDashboard },
  { name: "Mathématiques", path: "/learn/maths", icon: BookOpen },
  { name: "Français", path: "/learn/francais", icon: BookText },
  { name: "Histoire-Géo & EMC", path: "/learn/hg_emc", icon: BookOpen },
  { name: "Stats & Progression", path: "/stats", icon: Trophy },
  { name: "Classement", path: "/leaderboard", icon: Medal },
  { name: "Examens Blancs", path: "/exams", icon: GraduationCap },
  { name: "Duels", path: "/duels", icon: Swords },
  { name: "Mentor ARIA", path: "/mentor", icon: MessageSquare },
  { name: "Espace Parent", path: "/parent", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-surface border-r border-surface-hover hidden md:flex flex-col h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-surface-hover">
        <h1 className="font-bebas text-2xl tracking-wider text-primary-500">BREVET MASTER</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-primary-500/10 text-primary-500" 
                  : "text-gray-400 hover:bg-surface-hover hover:text-white"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-primary-500" : "text-gray-500 group-hover:text-white"}`} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-surface-hover">
        <button className="flex items-center space-x-3 px-4 py-3 w-full text-gray-500 hover:text-red-400 transition-colors">
          <span className="font-medium text-sm">Déconnexion</span>
        </button>
      </div>
    </div>
  );
}
