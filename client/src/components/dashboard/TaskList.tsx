import { useLanguage } from "@/hooks/use-language";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Task } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { CheckCircle, Phone, FileText, FileOutput } from "lucide-react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

export default function TaskList() {
  const { t } = useLanguage();
  
  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });
  
  const completeTaskMutation = useMutation({
    mutationFn: async (taskId: number) => {
      const res = await apiRequest("PUT", `/api/tasks/${taskId}`, {
        status: "completed"
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });
  
  if (isLoading) {
    return (
      <div className="bg-card rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-muted border-b border-border flex justify-between items-center">
          <h2 className="text-sm font-medium text-foreground">{t("todayTasks")}</h2>
          <button className="text-primary hover:text-primary/80">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
        <div className="p-4 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  const pendingTasks = tasks?.filter(task => task.status === "pending") || [];
  
  function getTaskIcon(title: string) {
    if (title.toLowerCase().includes("связаться") || title.toLowerCase().includes("contact")) {
      return <Phone className="h-5 w-5" />;
    } else if (title.toLowerCase().includes("документ") || title.toLowerCase().includes("check") || title.toLowerCase().includes("document")) {
      return <FileText className="h-5 w-5" />;
    } else if (title.toLowerCase().includes("отправить") || title.toLowerCase().includes("send")) {
      return <FileOutput className="h-5 w-5" />;
    }
    return <FileText className="h-5 w-5" />;
  }
  
  return (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 py-3 bg-muted border-b border-border flex justify-between items-center">
        <h2 className="text-sm font-medium text-foreground">{t("todayTasks")}</h2>
        <button className="text-primary hover:text-primary/80">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
      
      {pendingTasks.length > 0 ? (
        <ul className="divide-y divide-border">
          {pendingTasks.slice(0, 3).map((task) => (
            <li key={task.id} className="p-4 hover:bg-muted/50">
              <div className="flex items-center">
                <div className="flex-shrink-0 text-primary">
                  {getTaskIcon(task.title)}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">{task.title}</p>
                    <div className="flex items-center">
                      {task.dueDate && (
                        <p className="text-sm text-muted-foreground">
                          {t("deadline")} {format(new Date(task.dueDate), 'HH:mm')}
                        </p>
                      )}
                      <button 
                        className="ml-4 text-muted-foreground hover:text-primary"
                        onClick={() => completeTaskMutation.mutate(task.id)}
                        disabled={completeTaskMutation.isPending}
                      >
                        {completeTaskMutation.isPending ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <CheckCircle className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-4 text-center text-muted-foreground">
          {t("noData")}
        </div>
      )}
      
      <div className="px-4 py-3 bg-muted border-t border-border text-center">
        <a href="#" className="text-sm font-medium text-primary hover:text-primary/80">{t("allTasks")}</a>
      </div>
    </div>
  );
}
