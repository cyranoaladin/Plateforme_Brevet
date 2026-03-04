"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Swords, Trophy, MessageSquare, GraduationCap, BookText } from "lucide-react";

const navItems = [
  { name: "QG", path: "/", icon: LayoutDashboard },
  { name: "Mathématiques", path: "/learn/maths", icon: BookOpen },
  { name: "Français", path: "/learn/francais", icon: BookText },
  { name: "Histoire-Géo & EMC", path: "/learn/hg_emc", icon: BookOpen },
  { name: "Stats & Progression", path: "/stats", icon: Trophy },
  { name: "Examens Blancs", path: "/exams", icon: GraduationCap },
  { name: "Duels", path: "/duels", icon: Swords },
  { name: "Mentor ARIA", path: "/mentor", icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-surface border-r border-surface-hover hidden md:flex flex-col h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-surface-hover">
        <h1 className="font-bebas text-2xl tracking-wider text-primary-500">
          BREVET <span className="text-white">MASTER</span>
        </h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-primary-500/20 text-primary-500 shadow-sm shadow-primary-500/10"
                  : "text-gray-400 hover:bg-surface-hover hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-surface-hover">
        <div className="bg-surface-hover rounded-lg p-4 text-center">
          <p className="text-sm text-gray-400 mb-2">Brevet dans</p>
          <p className="font-bebas text-3xl text-accent-500">114 Jours</p>
        </div>
      </div>
    </div>
  );
}