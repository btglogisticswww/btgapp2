import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";

type PeriodType = "week" | "month" | "quarter";

export default function ActivityChart() {
  const { t } = useLanguage();
  const [activePeriod, setActivePeriod] = useState<PeriodType>("month");
  
  // Weekly data - these would typically come from an API
  const weeklyData = [
    { day: "Пн", value: 16 },
    { day: "Вт", value: 32 },
    { day: "Ср", value: 24 },
    { day: "Чт", value: 40 },
    { day: "Пт", value: 44 },
    { day: "Сб", value: 12 },
    { day: "Вс", value: 8 }
  ];
  
  // Monthly data (first 2 weeks) - these would typically come from an API
  const monthlyData = [
    { day: "Пн", value: 16 },
    { day: "Вт", value: 32 },
    { day: "Ср", value: 24 },
    { day: "Чт", value: 40 },
    { day: "Пт", value: 44 },
    { day: "Сб", value: 12 },
    { day: "Вс", value: 8 },
    { day: "Пн", value: 20 },
    { day: "Вт", value: 36 },
    { day: "Ср", value: 28 },
    { day: "Чт", value: 42 },
    { day: "Пт", value: 42 },
    { day: "Сб", value: 10 },
    { day: "Вс", value: 6 }
  ];
  
  // Display data based on selected period
  const displayData = activePeriod === "week" 
    ? weeklyData 
    : activePeriod === "month" 
      ? monthlyData 
      : monthlyData; // For quarter, we're using monthly data as placeholder
  
  // Find max value for normalization
  const maxValue = Math.max(...displayData.map(item => item.value));
  
  return (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 py-3 bg-muted border-b border-border flex justify-between items-center">
        <h2 className="text-sm font-medium text-foreground">{t("ordersActivity")}</h2>
        <div className="flex space-x-2">
          <button 
            className={`inline-flex items-center px-2 py-1 border rounded text-xs font-medium ${
              activePeriod === "week" 
                ? "border-transparent bg-primary text-primary-foreground" 
                : "border-border text-foreground bg-background hover:bg-muted"
            }`}
            onClick={() => setActivePeriod("week")}
          >
            {t("week")}
          </button>
          <button 
            className={`inline-flex items-center px-2 py-1 border rounded text-xs font-medium ${
              activePeriod === "month" 
                ? "border-transparent bg-primary text-primary-foreground" 
                : "border-border text-foreground bg-background hover:bg-muted"
            }`}
            onClick={() => setActivePeriod("month")}
          >
            {t("month")}
          </button>
          <button 
            className={`inline-flex items-center px-2 py-1 border rounded text-xs font-medium ${
              activePeriod === "quarter" 
                ? "border-transparent bg-primary text-primary-foreground" 
                : "border-border text-foreground bg-background hover:bg-muted"
            }`}
            onClick={() => setActivePeriod("quarter")}
          >
            {t("quarter")}
          </button>
        </div>
      </div>
      
      <div className="px-4 py-4">
        <div className="h-64">
          <div className="flex items-end justify-between h-48 mt-4">
            {displayData.map((item, index) => {
              // Calculate height based on value (normalized against max)
              const height = (item.value / maxValue) * 100;
              const isToday = index === displayData.length - 4; // For demo purposes, highlight 4th from the end
              
              return (
                <div key={index} className="flex-1 mx-1 flex flex-col items-center">
                  <div 
                    className={`${isToday ? "bg-primary" : "bg-secondary"} w-6 rounded-t transition-all duration-300`} 
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="text-xs text-muted-foreground text-center mt-2">{item.day}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
