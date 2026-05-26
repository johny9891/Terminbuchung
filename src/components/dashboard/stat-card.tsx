import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  accent?: "primary" | "pink" | "emerald" | "amber";
}

const accents = {
  primary: "from-purple-500/20 to-purple-500/0 text-purple-500",
  pink: "from-pink-500/20 to-pink-500/0 text-pink-500",
  emerald: "from-emerald-500/20 to-emerald-500/0 text-emerald-500",
  amber: "from-amber-500/20 to-amber-500/0 text-amber-500",
};

export function StatCard({ label, value, hint, icon: Icon, accent = "primary" }: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
            {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
          </div>
          <div
            className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${accents[accent]}`}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
