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
  LogOut,
  ChevronRight,
  ShieldCheck,
  Star,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Products", href: "/products", icon: Package },
    { name: "Orders", href: "/orders", icon: ShoppingCart },
    { name: "Categories", href: "/categories", icon: FolderTree },
    { name: "Reviews", href: "/reviews", icon: Star },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 z-30 shrink-0">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 font-bold text-xl">
              M
            </div>
            <div>
              <h1 className="font-bold text-slate-100 text-sm leading-tight flex items-center gap-1.5">
                Mex Tanim Store
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </h1>
              <p className="text-xs text-emerald-400 font-medium">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="px-4 py-6">
          <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-3">
            Main Menu
          </p>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-200"}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && (
                    <ChevronRight className="w-4 h-4 text-emerald-400" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer / Store Quick Switch */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/30">
        <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-slate-300 font-semibold text-xs shrink-0">
              BD
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-200 truncate">Store Currency</p>
              <p className="text-[11px] text-emerald-400 font-mono">BDT (৳ Taka)</p>
            </div>
          </div>
          <Store className="w-4 h-4 text-slate-400 shrink-0" />
        </div>
      </div>
    </aside>
  );
}
