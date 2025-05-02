import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  subtext: string;
}

export default function StatCard({ icon, title, value, subtext }: StatCardProps) {
  return (
    <div className="bg-card rounded-lg shadow-sm p-6">
      <div className="flex items-start">
        <div className="p-2 rounded-md bg-primary/10 text-primary">
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="mt-1">
            <p className="text-2xl font-semibold text-card-foreground">{value}</p>
            <p className="text-sm text-muted-foreground">{subtext}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
