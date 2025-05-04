import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { useTheme } from "@/hooks/use-theme";
import { 
  Menu, 
  Bell, 
  MessageSquare, 
  Moon, 
  Sun, 
  ChevronDown,
  X
} from "lucide-react";

interface HeaderProps {
  title: string;
  toggleSidebar: () => void;
  toggleNotificationPanel: () => void;
}

export default function Header({ title, toggleSidebar, toggleNotificationPanel }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  
  return (
    <header className="bg-secondary text-white h-16 flex items-center z-10 sticky top-0">
      <div className="flex-1 flex items-center justify-between px-4">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="mr-4 md:hidden text-white hover:text-white/70 focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-medium text-white tracking-tight">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <div className="relative">
            <button 
              className="flex items-center text-white hover:text-white/70"
              onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
            >
              <span className="text-sm mr-1">
                {language === "ru" ? "RU" : language === "en" ? "EN" : "DE"}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {languageMenuOpen && (
              <div className="absolute right-0 mt-2 w-16 bg-popover border border-border rounded-md shadow-lg py-1 z-10">
                <button 
                  className={`block px-4 py-2 text-sm w-full text-left ${language === "ru" ? "bg-accent text-accent-foreground" : "text-popover-foreground hover:bg-accent hover:text-accent-foreground"}`}
                  onClick={() => {
                    setLanguage("ru");
                    setLanguageMenuOpen(false);
                  }}
                >
                  RU
                </button>
                <button 
                  className={`block px-4 py-2 text-sm w-full text-left ${language === "en" ? "bg-accent text-accent-foreground" : "text-popover-foreground hover:bg-accent hover:text-accent-foreground"}`}
                  onClick={() => {
                    setLanguage("en");
                    setLanguageMenuOpen(false);
                  }}
                >
                  EN
                </button>
                <button 
                  className={`block px-4 py-2 text-sm w-full text-left ${language === "de" ? "bg-accent text-accent-foreground" : "text-popover-foreground hover:bg-accent hover:text-accent-foreground"}`}
                  onClick={() => {
                    setLanguage("de");
                    setLanguageMenuOpen(false);
                  }}
                >
                  DE
                </button>
              </div>
            )}
          </div>
          
          {/* Notifications */}
          <button 
            className="relative text-white hover:text-white/70"
            onClick={toggleNotificationPanel}
            aria-label="Notifications"
          >
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-destructive"></span>
          </button>
          
          {/* Messages */}
          <button 
            className="text-white hover:text-white/70"
            aria-label="Messages"
          >
            <MessageSquare className="h-6 w-6" />
          </button>
          
          {/* Theme Toggle */}
          <button 
            className="text-white hover:text-white/70"
            onClick={toggleTheme}
            aria-label={theme === "light" ? t("darkMode") : t("lightMode")}
          >
            {theme === "light" ? (
              <Moon className="h-6 w-6" />
            ) : (
              <Sun className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export function NotificationPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t } = useLanguage();
  
  return (
    <div 
      className={`fixed inset-y-0 right-0 w-80 bg-card border-l border-border shadow-xl transform transition-transform duration-300 ease-in-out z-30 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="h-full flex flex-col">
        <div className="px-4 py-3 bg-muted border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-medium text-foreground">{t("notifications")}</h2>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close notifications"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
          <div className="space-y-4">
            {/* Notification Items will be dynamically populated here */}
            <div className="p-3 bg-destructive/10 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Bell className="h-5 w-5 text-destructive" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm text-foreground">Задержка в доставке заказа #12345</p>
                  <p className="mt-1 text-xs text-muted-foreground">5 мин. назад</p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-card border border-border rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Bell className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm text-foreground">Документы по заказу #12347 подтверждены</p>
                  <p className="mt-1 text-xs text-muted-foreground">2 часа назад</p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-card border border-border rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm text-foreground">Новое сообщение от клиента ИП Смирнов А.В.</p>
                  <p className="mt-1 text-xs text-muted-foreground">Вчера</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
