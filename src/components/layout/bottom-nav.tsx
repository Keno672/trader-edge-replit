import { Link, useLocation } from "wouter";
import { Home, LineChart, List, ShieldAlert, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/top5", icon: LineChart, label: "Top 5" },
    { href: "/news", icon: Newspaper, label: "News" },
    { href: "/watchlist", icon: List, label: "Watchlist" },
    { href: "/premium", icon: ShieldAlert, label: "Premium" },
  ];

  // Hide nav on chart and decision pages for full screen focus
  if (location.startsWith("/chart") || location.startsWith("/decision")) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border pb-safe">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-4">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <div
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 h-full",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground transition-colors"
                )}
              >
                <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
