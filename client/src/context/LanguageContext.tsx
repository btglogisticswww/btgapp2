import { createContext, ReactNode, useContext, useState, useEffect } from "react";

type Language = "ru" | "en" | "de";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const translations: Record<Language, Record<string, string>> = {
  ru: {
    // Auth
    "login": "Вход",
    "register": "Регистрация",
    "username": "Имя пользователя",
    "password": "Пароль",
    "fullName": "Полное имя",
    "email": "Email",
    "forgotPassword": "Забыли пароль?",
    "rememberMe": "Запомнить меня",
    "loginButton": "Войти",
    "registerButton": "Зарегистрироваться",
    "loginTitle": "Вход в систему",
    "registerTitle": "Регистрация в системе",
    "copyrightText": "© 2023 БТГ+ WORLDWIDE LOGISTICS. Все права защищены.",
    "companyDescription": "Международная транспортно-логистическая компания",
    
    // Navigation
    "dashboard": "Главная",
    "orders": "Заказы",
    "routes": "Маршруты",
    "clients": "Клиенты",
    "carriers": "Перевозчики",
    "finances": "Финансы",
    "documents": "Документы",
    "analytics": "Аналитика",
    "settings": "Настройки",
    
    // Dashboard
    "keyMetrics": "Ключевые показатели",
    "activeOrders": "Активные заказы",
    "revenue": "Выручка",
    "completedOrders": "Выполнено заказов",
    "tasks": "Задачи",
    "currentlyActive": "В работе сейчас",
    "currentMonth": "За текущий месяц",
    "lastWeek": "За последнюю неделю",
    "needAttention": "Требуют внимания",
    "recentOrders": "Последние заказы",
    "allOrders": "Все заказы",
    "ordersActivity": "Активность по заказам",
    "week": "Неделя",
    "month": "Месяц",
    "quarter": "Квартал",
    "todayTasks": "Задачи на сегодня",
    "allTasks": "Все задачи",
    "activeRoutes": "Активные маршруты",
    "details": "Подробнее",
    "notifications": "Уведомления",
    "allNotifications": "Все уведомления",
    
    // Order statuses
    "all": "Все",
    "active": "Активные",
    "pending": "Ожидающие",
    "completed": "Завершенные",
    "cancelled": "Отмененные",
    "in_transit": "В пути",
    "preparing": "Подготовка",
    "waiting": "Ожидание",
    
    // Orders page
    "ordersManagement": "Управление заказами",
    "search": "Поиск",
    "filters": "Фильтры",
    "newOrder": "Новый заказ",
    "id": "ID",
    "client": "Клиент",
    "route": "Маршрут",
    "status": "Статус",
    "date": "Дата",
    "price": "Стоимость",
    "type": "Тип",
    "weight": "Вес",
    "volume": "Объем",
    "manager": "Менеджер",
    "showing": "Показано",
    "of": "из",
    "orderDetails": "Детали заказа",
    "order": "Заказ",
    "generalInfo": "Общая информация",
    "senderInfo": "Информация об отправителе",
    "recipientInfo": "Информация о получателе",
    "cargoInfo": "Информация о грузе",
    "timeline": "Хронология",
    "sender": "Отправитель",
    "recipient": "Получатель",
    "cargo": "Груз",
    "documentation": "Документация",
    "name": "Имя",
    "address": "Адрес",
    "contact": "Контакт",
    "phone": "Телефон",
    "description": "Описание",
    "packaging": "Упаковка",
    "hazardClass": "Класс опасности",
    "temperature": "Температурный режим",
    "docs": "Документы",
    "event": "Событие",
    "time": "Время",
    
    // Routes page
    "routesManagement": "Управление маршрутами",
    "newRoute": "Новый маршрут",
    "routesMap": "Карта маршрутов",
    "find": "Найти",
    "filter": "Фильтр",
    "scale": "Масштаб",
    "routeDetails": "Детали маршрута",
    "startPoint": "Пункт отправления",
    "endPoint": "Пункт назначения",
    "waypoints": "Промежуточные пункты",
    "progress": "Прогресс",
    "startDate": "Дата начала",
    "endDate": "Дата окончания",
    "vehicle": "Транспортное средство",
    "driver": "Водитель",
    "regNumber": "Рег. номер",
    
    // Vehicle statuses
    "available": "Свободен",
    "maintenance": "Ремонт",
    
    // Tasks
    "contactClient": "Связаться с клиентом",
    "checkDocuments": "Проверить документы",
    "sendInvoices": "Отправить накладные",
    "deadline": "до",
    
    // Other
    "logout": "Выход",
    "profile": "Профиль",
    "darkMode": "Темная тема",
    "lightMode": "Светлая тема",
    "save": "Сохранить",
    "cancel": "Отмена",
    "delete": "Удалить",
    "edit": "Редактировать",
    "create": "Создать",
    "update": "Обновить",
    "previous": "Предыдущая",
    "next": "Следующая",
    "back": "Назад",
    "forward": "Вперед",
    "loading": "Загрузка...",
    "noData": "Нет данных"
  },
  en: {
    // Auth
    "login": "Login",
    "register": "Register",
    "username": "Username",
    "password": "Password",
    "fullName": "Full Name",
    "email": "Email",
    "forgotPassword": "Forgot password?",
    "rememberMe": "Remember me",
    "loginButton": "Login",
    "registerButton": "Register",
    "loginTitle": "Login to system",
    "registerTitle": "Register in system",
    "copyrightText": "© 2023 BTG+ WORLDWIDE LOGISTICS. All rights reserved.",
    "companyDescription": "International transportation and logistics company",
    
    // Navigation
    "dashboard": "Dashboard",
    "orders": "Orders",
    "routes": "Routes",
    "clients": "Clients",
    "carriers": "Carriers",
    "finances": "Finances",
    "documents": "Documents",
    "analytics": "Analytics",
    "settings": "Settings",
    
    // Dashboard
    "keyMetrics": "Key Metrics",
    "activeOrders": "Active Orders",
    "revenue": "Revenue",
    "completedOrders": "Completed Orders",
    "tasks": "Tasks",
    "currentlyActive": "Currently active",
    "currentMonth": "Current month",
    "lastWeek": "Last week",
    "needAttention": "Need attention",
    "recentOrders": "Recent Orders",
    "allOrders": "All Orders",
    "ordersActivity": "Orders Activity",
    "week": "Week",
    "month": "Month",
    "quarter": "Quarter",
    "todayTasks": "Today's Tasks",
    "allTasks": "All Tasks",
    "activeRoutes": "Active Routes",
    "details": "Details",
    "notifications": "Notifications",
    "allNotifications": "All Notifications",
    
    // Order statuses
    "all": "All",
    "active": "Active",
    "pending": "Pending",
    "completed": "Completed",
    "cancelled": "Cancelled",
    "in_transit": "In Transit",
    "preparing": "Preparing",
    "waiting": "Waiting",
    
    // Orders page
    "ordersManagement": "Orders Management",
    "search": "Search",
    "filters": "Filters",
    "newOrder": "New Order",
    "id": "ID",
    "client": "Client",
    "route": "Route",
    "status": "Status",
    "date": "Date",
    "price": "Price",
    "type": "Type",
    "weight": "Weight",
    "volume": "Volume",
    "manager": "Manager",
    "showing": "Showing",
    "of": "of",
    "orderDetails": "Order Details",
    "order": "Order",
    "generalInfo": "General Information",
    "senderInfo": "Sender Information",
    "recipientInfo": "Recipient Information",
    "cargoInfo": "Cargo Information",
    "timeline": "Timeline",
    "sender": "Sender",
    "recipient": "Recipient",
    "cargo": "Cargo",
    "documentation": "Documentation",
    "name": "Name",
    "address": "Address",
    "contact": "Contact",
    "phone": "Phone",
    "description": "Description",
    "packaging": "Packaging",
    "hazardClass": "Hazard Class",
    "temperature": "Temperature",
    "docs": "Documents",
    "event": "Event",
    "time": "Time",
    
    // Routes page
    "routesManagement": "Routes Management",
    "newRoute": "New Route",
    "routesMap": "Routes Map",
    "find": "Find",
    "filter": "Filter",
    "scale": "Scale",
    "routeDetails": "Route Details",
    "startPoint": "Start Point",
    "endPoint": "End Point",
    "waypoints": "Waypoints",
    "progress": "Progress",
    "startDate": "Start Date",
    "endDate": "End Date",
    "vehicle": "Vehicle",
    "driver": "Driver",
    "regNumber": "Reg. Number",
    
    // Vehicle statuses
    "available": "Available",
    "maintenance": "Maintenance",
    
    // Tasks
    "contactClient": "Contact Client",
    "checkDocuments": "Check Documents",
    "sendInvoices": "Send Invoices",
    "deadline": "due",
    
    // Other
    "logout": "Logout",
    "profile": "Profile",
    "darkMode": "Dark Mode",
    "lightMode": "Light Mode",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "create": "Create",
    "update": "Update",
    "previous": "Previous",
    "next": "Next",
    "back": "Back",
    "forward": "Forward",
    "loading": "Loading...",
    "noData": "No data"
  },
  de: {
    // Auth
    "login": "Anmelden",
    "register": "Registrieren",
    "username": "Benutzername",
    "password": "Passwort",
    "fullName": "Vollständiger Name",
    "email": "E-Mail",
    "forgotPassword": "Passwort vergessen?",
    "rememberMe": "Angemeldet bleiben",
    "loginButton": "Anmelden",
    "registerButton": "Registrieren",
    "loginTitle": "Systemanmeldung",
    "registerTitle": "Systemregistrierung",
    "copyrightText": "© 2023 BTG+ WORLDWIDE LOGISTICS. Alle Rechte vorbehalten.",
    "companyDescription": "Internationale Transport- und Logistikunternehmen",
    
    // Navigation
    "dashboard": "Dashboard",
    "orders": "Aufträge",
    "routes": "Routen",
    "clients": "Kunden",
    "carriers": "Spediteure",
    "finances": "Finanzen",
    "documents": "Dokumente",
    "analytics": "Analytik",
    "settings": "Einstellungen",
    
    // Dashboard
    "keyMetrics": "Schlüsselkennzahlen",
    "activeOrders": "Aktive Aufträge",
    "revenue": "Umsatz",
    "completedOrders": "Abgeschlossene Aufträge",
    "tasks": "Aufgaben",
    "currentlyActive": "Derzeit aktiv",
    "currentMonth": "Aktueller Monat",
    "lastWeek": "Letzte Woche",
    "needAttention": "Benötigen Aufmerksamkeit",
    "recentOrders": "Neueste Aufträge",
    "allOrders": "Alle Aufträge",
    "ordersActivity": "Auftragsaktivität",
    "week": "Woche",
    "month": "Monat",
    "quarter": "Quartal",
    "todayTasks": "Heutige Aufgaben",
    "allTasks": "Alle Aufgaben",
    "activeRoutes": "Aktive Routen",
    "details": "Details",
    "notifications": "Benachrichtigungen",
    "allNotifications": "Alle Benachrichtigungen",
    
    // Order statuses
    "all": "Alle",
    "active": "Aktiv",
    "pending": "Ausstehend",
    "completed": "Abgeschlossen",
    "cancelled": "Storniert",
    "in_transit": "In Transit",
    "preparing": "In Vorbereitung",
    "waiting": "Warten",
    
    // Orders page
    "ordersManagement": "Auftragsverwaltung",
    "search": "Suche",
    "filters": "Filter",
    "newOrder": "Neuer Auftrag",
    "id": "ID",
    "client": "Kunde",
    "route": "Route",
    "status": "Status",
    "date": "Datum",
    "price": "Preis",
    "type": "Typ",
    "weight": "Gewicht",
    "volume": "Volumen",
    "manager": "Manager",
    "showing": "Anzeigen",
    "of": "von",
    "orderDetails": "Auftragsdetails",
    "order": "Auftrag",
    "generalInfo": "Allgemeine Informationen",
    "senderInfo": "Absenderinformationen",
    "recipientInfo": "Empfängerinformationen",
    "cargoInfo": "Frachtinformationen",
    "timeline": "Zeitachse",
    "sender": "Absender",
    "recipient": "Empfänger",
    "cargo": "Fracht",
    "documentation": "Dokumentation",
    "name": "Name",
    "address": "Adresse",
    "contact": "Kontakt",
    "phone": "Telefon",
    "description": "Beschreibung",
    "packaging": "Verpackung",
    "hazardClass": "Gefahrenklasse",
    "temperature": "Temperatur",
    "docs": "Dokumente",
    "event": "Ereignis",
    "time": "Zeit",
    
    // Routes page
    "routesManagement": "Routenverwaltung",
    "newRoute": "Neue Route",
    "routesMap": "Routenkarte",
    "find": "Finden",
    "filter": "Filter",
    "scale": "Maßstab",
    "routeDetails": "Routendetails",
    "startPoint": "Startpunkt",
    "endPoint": "Endpunkt",
    "waypoints": "Wegpunkte",
    "progress": "Fortschritt",
    "startDate": "Startdatum",
    "endDate": "Enddatum",
    "vehicle": "Fahrzeug",
    "driver": "Fahrer",
    "regNumber": "Kennzeichen",
    
    // Vehicle statuses
    "available": "Verfügbar",
    "maintenance": "Wartung",
    
    // Tasks
    "contactClient": "Kunde kontaktieren",
    "checkDocuments": "Dokumente prüfen",
    "sendInvoices": "Rechnungen senden",
    "deadline": "fällig",
    
    // Other
    "logout": "Abmelden",
    "profile": "Profil",
    "darkMode": "Dunkler Modus",
    "lightMode": "Heller Modus",
    "save": "Speichern",
    "cancel": "Abbrechen",
    "delete": "Löschen",
    "edit": "Bearbeiten",
    "create": "Erstellen",
    "update": "Aktualisieren",
    "previous": "Zurück",
    "next": "Weiter",
    "back": "Zurück",
    "forward": "Vorwärts",
    "loading": "Wird geladen...",
    "noData": "Keine Daten"
  }
};

export const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ru");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && ["ru", "en", "de"].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
