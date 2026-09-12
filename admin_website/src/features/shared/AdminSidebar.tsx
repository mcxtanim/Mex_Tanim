"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  FolderTree, 
  Store, 
  Settings, 
  ShieldCheck,
  Star,
  MessageSquare,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

interface NavSection {
  title: string;
  items: {
    name: string;
    href: string;
    icon: React.ElementType;
  }[];
}

export function AdminSidebar() {
  const pathname = usePathname();

  const sections: NavSection[] = [
    {
      title: "OVERVIEW",
      items: [
        { name: "Dashboard", href: "/", icon: LayoutDashboard },
        { name: "Analytics & Finance", href: "/analytics", icon: TrendingUp },
      ]
    },
    {
      title: "CATALOG",
      items: [
        { name: "Products", href: "/products", icon: Package },
        { name: "Categories", href: "/categories", icon: FolderTree },
      ]
    },
    {
      title: "SALES & CUSTOMERS",
      items: [
        { name: "Orders", href: "/orders", icon: ShoppingCart },
        { name: "Messages", href: "/messages", icon: MessageSquare },
        { name: "Customer Reviews", href: "/reviews", icon: Star },
      ]
    },
    {
      title: "SETTINGS",
      items: [
        { name: "Settings", href: "/settings", icon: Settings },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 z-30 shrink-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20 font-black text-lg">
              M
            </div>
            <div>
              <h1 className="font-extrabold text-slate-100 text-sm leading-tight flex items-center gap-1.5 tracking-tight">
                Mex Tanim
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </h1>
              <p className="text-[11px] text-emerald-400 font-semibold tracking-wide">Gaming Store Admin</p>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="px-3.5 py-5 space-y-6 overflow-y-auto max-h-[calc(100vh-8.5rem)] scrollbar-thin">
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1.5">
              <p className="px-3 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                {section.title}
              </p>
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                        isActive
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-xs"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/80"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-200"}`} />
                        <span>{item.name}</span>
                      </div>
                      {isActive && (
                        <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Store Currency */}
      <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/60">
        <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 border border-emerald-500/30">
              BD
            </div>
            <div className="truncate">
              <p className="text-[11px] font-semibold text-slate-200 truncate">Store Currency</p>
              <p className="text-[10px] text-emerald-400 font-mono font-bold">BDT (৳ Taka)</p>
            </div>
          </div>
          <Store className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </div>
      </div>
    </aside>
  );
}
