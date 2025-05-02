import { db } from "./index";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seed() {
  try {
    console.log("Starting seed process...");

    // Check if users already exist
    const existingUsers = await db.select().from(schema.users);
    if (existingUsers.length === 0) {
      console.log("Seeding users...");
      
      // Insert default admin user
      const adminPass = await hashPassword("admin123");
      await db.insert(schema.users).values({
        username: "admin",
        password: adminPass,
        fullName: "Administrator",
        email: "admin@btg-logistics.eu",
        role: "admin",
        position: "Administrator",
        language: "ru"
      });

      // Insert sample users with different roles
      const logistPass = await hashPassword("logist123");
      await db.insert(schema.users).values({
        username: "ivanov",
        password: logistPass,
        fullName: "Иванов Сергей",
        email: "ivanov@btg-logistics.eu",
        role: "logist",
        position: "Логист",
        language: "ru"
      });

      const managerPass = await hashPassword("manager123");
      await db.insert(schema.users).values({
        username: "petrova",
        password: managerPass,
        fullName: "Петрова Елена",
        email: "petrova@btg-logistics.eu",
        role: "manager",
        position: "Менеджер",
        language: "ru"
      });

      const financierPass = await hashPassword("financier123");
      await db.insert(schema.users).values({
        username: "sokolov",
        password: financierPass,
        fullName: "Соколов Дмитрий",
        email: "sokolov@btg-logistics.eu",
        role: "financier",
        position: "Финансист",
        language: "ru"
      });
    }

    // Check if clients already exist
    const existingClients = await db.select().from(schema.clients);
    if (existingClients.length === 0) {
      console.log("Seeding clients...");
      
      await db.insert(schema.clients).values([
        {
          name: "ООО ТрансЛогистик",
          contactPerson: "Петров А.А.",
          phone: "+7 (999) 123-45-67",
          email: "info@translogistic.ru",
          address: "г. Москва, ул. Ленина, 10",
          notes: "Постоянный клиент"
        },
        {
          name: "ИП Смирнов А.В.",
          contactPerson: "Смирнов А.В.",
          phone: "+7 (999) 222-33-44",
          email: "smirnov@example.com",
          address: "г. Екатеринбург, ул. Мира, 15",
          notes: "Новый клиент"
        },
        {
          name: "АО Металлпром",
          contactPerson: "Морозов К.Л.",
          phone: "+7 (999) 888-99-00",
          email: "info@metallprom.ru",
          address: "г. Челябинск, ул. Заводская, 1",
          notes: "Крупный клиент"
        },
        {
          name: "ООО ФудМаркет",
          contactPerson: "Лебедев А.Н.",
          phone: "+7 (999) 444-55-66",
          email: "info@foodmarket.ru",
          address: "г. Воронеж, ул. Центральная, 12",
          notes: "Требуется рефрижератор"
        },
        {
          name: "ООО ТехноПром",
          contactPerson: "Козлов Д.И.",
          phone: "+7 (999) 333-22-11",
          email: "info@technoprom.ru",
          address: "г. Москва, ул. Тверская, 30",
          notes: "Электроника и компьютерное оборудование"
        }
      ]);
    }

    // Check if carriers already exist
    const existingCarriers = await db.select().from(schema.carriers);
    if (existingCarriers.length === 0) {
      console.log("Seeding carriers...");
      
      await db.insert(schema.carriers).values([
        {
          name: "ООО ТрансАвто",
          contactPerson: "Волков И.П.",
          phone: "+7 (999) 111-22-33",
          email: "info@transauto.ru",
          address: "г. Москва, ул. Транспортная, 5",
          vehicleType: "Грузовой",
          notes: "Надежный перевозчик"
        },
        {
          name: "ИП Сидоров И.И.",
          contactPerson: "Сидоров И.И.",
          phone: "+7 (999) 222-33-44",
          email: "sidorov@example.com",
          address: "г. Санкт-Петербург, ул. Невская, 10",
          vehicleType: "Малотоннажный",
          notes: "Работает в северо-западном регионе"
        },
        {
          name: "АО Логистик Групп",
          contactPerson: "Иванов А.А.",
          phone: "+7 (999) 333-44-55",
          email: "info@logisticgroup.ru",
          address: "г. Нижний Новгород, ул. Грузовая, 15",
          vehicleType: "Разнотипный",
          notes: "Крупная транспортная компания"
        }
      ]);
    }

    // Get clients and carriers for foreign keys
    const clients = await db.select().from(schema.clients);
    const carriers = await db.select().from(schema.carriers);
    const users = await db.select().from(schema.users);

    // Find manager user
    const manager = users.find(user => user.role === "manager");
    const managerId = manager ? manager.id : null;

    // Check if vehicles already exist
    const existingVehicles = await db.select().from(schema.vehicles);
    if (existingVehicles.length === 0 && carriers.length > 0) {
      console.log("Seeding vehicles...");
      
      await db.insert(schema.vehicles).values([
        {
          carrierId: carriers[0].id,
          type: "MAN TGX",
          regNumber: "AB123CD",
          capacity: "20 тонн",
          driverName: "Петров А.",
          driverPhone: "+7 (999) 123-45-67",
          status: "active",
          notes: "Новый автомобиль"
        },
        {
          carrierId: carriers[0].id,
          type: "Volvo FH",
          regNumber: "XY789ZW",
          capacity: "15 тонн",
          driverName: "Сидоров И.",
          driverPhone: "+7 (999) 987-65-43",
          status: "available",
          notes: "Стандартная комплектация"
        },
        {
          carrierId: carriers[1].id,
          type: "Mercedes Actros",
          regNumber: "PQ456RS",
          capacity: "18 тонн",
          driverName: "Иванов П.",
          driverPhone: "+7 (999) 555-44-33",
          status: "maintenance",
          notes: "На ремонте до 22.06.2023"
        }
      ]);
    }

    // Check if orders already exist
    const existingOrders = await db.select().from(schema.orders);
    if (existingOrders.length === 0 && clients.length > 0 && carriers.length > 0) {
      console.log("Seeding orders...");
      
      // Get current date
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const prevWeek = new Date(today);
      prevWeek.setDate(prevWeek.getDate() - 7);
      
      await db.insert(schema.orders).values([
        {
          orderNumber: "ORD-12345",
          clientId: clients[0].id,
          carrierId: carriers[0].id,
          route: "Москва - Санкт-Петербург",
          originAddress: "г. Москва, ул. Ленина, 10",
          destinationAddress: "г. Санкт-Петербург, пр. Невский, 20",
          status: "active",
          type: "Автоперевозка",
          weight: "1200 кг",
          volume: "3.5 м³",
          price: "85000",
          cost: "65000",
          orderDate: today,
          deliveryDate: null,
          managerId: managerId,
          details: JSON.stringify({
            sender: {
              name: "ООО ТрансЛогистик",
              address: "г. Москва, ул. Ленина, 10",
              contact: "Петров А.А.",
              phone: "+7 (999) 123-45-67"
            },
            recipient: {
              name: "ООО СевероЗапад",
              address: "г. Санкт-Петербург, пр. Невский, 20",
              contact: "Сидоров В.В.",
              phone: "+7 (999) 765-43-21"
            },
            cargo: {
              description: "Электроника",
              packaging: "Коробки",
              hazardClass: "Нет",
              temperature: "Не требуется",
              documents: ["Накладная", "Счет-фактура", "Сертификат соответствия"]
            },
            timeline: [
              { date: "12.05.2023", time: "10:30", event: "Заказ создан" },
              { date: "13.05.2023", time: "14:15", event: "Документы подготовлены" },
              { date: "14.05.2023", time: "09:00", event: "Груз принят" },
              { date: "14.05.2023", time: "12:30", event: "Транспорт выехал" }
            ]
          }),
          notes: "Срочная доставка"
        },
        {
          orderNumber: "ORD-12346",
          clientId: clients[1].id,
          carrierId: carriers[1].id,
          route: "Екатеринбург - Новосибирск",
          originAddress: "г. Екатеринбург, ул. Мира, 15",
          destinationAddress: "г. Новосибирск, ул. Советская, 5",
          status: "pending",
          type: "Мультимодальная",
          weight: "3500 кг",
          volume: "8.2 м³",
          price: "120000",
          cost: "90000",
          orderDate: today,
          deliveryDate: null,
          managerId: managerId,
          details: JSON.stringify({
            sender: {
              name: "ИП Смирнов А.В.",
              address: "г. Екатеринбург, ул. Мира, 15",
              contact: "Смирнов А.В.",
              phone: "+7 (999) 222-33-44"
            },
            recipient: {
              name: "ООО СибТорг",
              address: "г. Новосибирск, ул. Советская, 5",
              contact: "Кузнецов Д.М.",
              phone: "+7 (999) 555-66-77"
            },
            cargo: {
              description: "Строительные материалы",
              packaging: "Паллеты",
              hazardClass: "Нет",
              temperature: "Не требуется",
              documents: ["Накладная", "Счет-фактура", "Договор поставки"]
            },
            timeline: [
              { date: "14.05.2023", time: "11:45", event: "Заказ создан" },
              { date: "15.05.2023", time: "10:20", event: "Документы подготовлены" }
            ]
          }),
          notes: "Требуется согласование с получателем"
        },
        {
          orderNumber: "ORD-12347",
          clientId: clients[2].id,
          carrierId: carriers[2].id,
          route: "Челябинск - Краснодар",
          originAddress: "г. Челябинск, ул. Заводская, 1",
          destinationAddress: "г. Краснодар, ул. Промышленная, 8",
          status: "completed",
          type: "Железнодорожная",
          weight: "12000 кг",
          volume: "24 м³",
          price: "210000",
          cost: "170000",
          orderDate: prevWeek,
          deliveryDate: yesterday,
          managerId: managerId,
          details: JSON.stringify({
            sender: {
              name: "АО Металлпром",
              address: "г. Челябинск, ул. Заводская, 1",
              contact: "Морозов К.Л.",
              phone: "+7 (999) 888-99-00"
            },
            recipient: {
              name: "ООО ЮгМеталл",
              address: "г. Краснодар, ул. Промышленная, 8",
              contact: "Волков Р.С.",
              phone: "+7 (999) 111-22-33"
            },
            cargo: {
              description: "Металлопрокат",
              packaging: "Связки",
              hazardClass: "Нет",
              temperature: "Не требуется",
              documents: ["Накладная", "Счет-фактура", "Сертификат качества", "Договор поставки"]
            },
            timeline: [
              { date: "05.05.2023", time: "09:15", event: "Заказ создан" },
              { date: "06.05.2023", time: "14:30", event: "Документы подготовлены" },
              { date: "07.05.2023", time: "10:00", event: "Груз принят" },
              { date: "07.05.2023", time: "16:45", event: "Транспорт выехал" },
              { date: "10.05.2023", time: "11:20", event: "Доставка завершена" }
            ]
          }),
          notes: "Выполнено в срок"
        },
        {
          orderNumber: "ORD-12348",
          clientId: clients[3].id,
          carrierId: carriers[0].id,
          route: "Воронеж - Ростов-на-Дону",
          originAddress: "г. Воронеж, ул. Центральная, 12",
          destinationAddress: "г. Ростов-на-Дону, пр. Ворошиловский, 25",
          status: "active",
          type: "Рефрижератор",
          weight: "5000 кг",
          volume: "12 м³",
          price: "95000",
          cost: "70000",
          orderDate: today,
          deliveryDate: null,
          managerId: managerId,
          details: JSON.stringify({
            sender: {
              name: "ООО ФудМаркет",
              address: "г. Воронеж, ул. Центральная, 12",
              contact: "Лебедев А.Н.",
              phone: "+7 (999) 444-55-66"
            },
            recipient: {
              name: "ООО ЮжныйТорг",
              address: "г. Ростов-на-Дону, пр. Ворошиловский, 25",
              contact: "Соловьев М.В.",
              phone: "+7 (999) 777-88-99"
            },
            cargo: {
              description: "Продукты питания",
              packaging: "Коробки, паллеты",
              hazardClass: "Нет",
              temperature: "+2°C...+6°C",
              documents: ["Накладная", "Счет-фактура", "Сертификаты качества", "Ветеринарное свидетельство"]
            },
            timeline: [
              { date: "12.05.2023", time: "08:30", event: "Заказ создан" },
              { date: "13.05.2023", time: "11:45", event: "Документы подготовлены" },
              { date: "14.05.2023", time: "07:00", event: "Груз принят" },
              { date: "14.05.2023", time: "10:15", event: "Транспорт выехал" }
            ]
          }),
          notes: "Особый температурный режим"
        },
        {
          orderNumber: "ORD-12349",
          clientId: clients[4].id,
          carrierId: null,
          route: "Москва - Казань",
          originAddress: "г. Москва, ул. Тверская, 30",
          destinationAddress: "г. Казань, ул. Баумана, 18",
          status: "pending",
          type: "Автоперевозка",
          weight: "2800 кг",
          volume: "7.5 м³",
          price: "110000",
          cost: null,
          orderDate: today,
          deliveryDate: null,
          managerId: managerId,
          details: JSON.stringify({
            sender: {
              name: "ООО ТехноПром",
              address: "г. Москва, ул. Тверская, 30",
              contact: "Козлов Д.И.",
              phone: "+7 (999) 333-22-11"
            },
            recipient: {
              name: "ООО КазаньТех",
              address: "г. Казань, ул. Баумана, 18",
              contact: "Новиков А.П.",
              phone: "+7 (999) 666-77-88"
            },
            cargo: {
              description: "Компьютерное оборудование",
              packaging: "Коробки, специальная упаковка",
              hazardClass: "Нет",
              temperature: "Не требуется",
              documents: ["Накладная", "Счет-фактура", "Гарантийные талоны"]
            },
            timeline: [
              { date: "15.05.2023", time: "13:20", event: "Заказ создан" },
              { date: "16.05.2023", time: "15:40", event: "Документы подготовлены" }
            ]
          }),
          notes: "Ждет назначения перевозчика"
        }
      ]);
    }

    // Get orders and vehicles for foreign keys
    const orders = await db.select().from(schema.orders);
    const vehicles = await db.select().from(schema.vehicles);

    // Check if routes already exist
    const existingRoutes = await db.select().from(schema.routes);
    if (existingRoutes.length === 0 && orders.length > 0 && vehicles.length > 0) {
      console.log("Seeding routes...");
      
      // Get today's date
      const today = new Date();
      const fiveDaysLater = new Date(today);
      fiveDaysLater.setDate(fiveDaysLater.getDate() + 5);
      const twoDaysLater = new Date(today);
      twoDaysLater.setDate(twoDaysLater.getDate() + 2);
      
      await db.insert(schema.routes).values([
        {
          orderId: orders[0].id,
          vehicleId: vehicles[0].id,
          startPoint: "Москва",
          endPoint: "Берлин",
          waypoints: JSON.stringify([
            { name: "Минск", expected: "21.06.2023" },
            { name: "Варшава", expected: "22.06.2023" },
            { name: "Берлин", expected: "25.06.2023" }
          ]),
          status: "active",
          startDate: today,
          endDate: fiveDaysLater,
          progress: 45,
          notes: "Международная перевозка"
        },
        {
          orderId: orders[1].id,
          vehicleId: vehicles[1].id,
          startPoint: "Санкт-Петербург",
          endPoint: "Хельсинки",
          waypoints: JSON.stringify([
            { name: "Выборг", expected: "23.06.2023" },
            { name: "Хельсинки", expected: "24.06.2023" }
          ]),
          status: "pending",
          startDate: twoDaysLater,
          endDate: null,
          progress: 15,
          notes: "Ожидает подтверждения"
        },
        {
          orderId: orders[2].id,
          vehicleId: vehicles[2].id,
          startPoint: "Минск",
          endPoint: "Варшава",
          waypoints: JSON.stringify([
            { name: "Брест", expected: "26.06.2023" },
            { name: "Варшава", expected: "27.06.2023" }
          ]),
          status: "pending",
          startDate: null,
          endDate: null,
          progress: 5,
          notes: "Требуется оформление документов"
        }
      ]);
    }

    // Check if tasks already exist
    const existingTasks = await db.select().from(schema.tasks);
    if (existingTasks.length === 0 && users.length > 0 && orders.length > 0) {
      console.log("Seeding tasks...");
      
      // Set due dates
      const today = new Date();
      const dueLaterToday = new Date(today);
      dueLaterToday.setHours(17, 0, 0, 0);
      const dueEarlierToday = new Date(today);
      dueEarlierToday.setHours(15, 0, 0, 0);
      const dueTomorrow = new Date(today);
      dueTomorrow.setDate(dueTomorrow.getDate() + 1);
      dueTomorrow.setHours(18, 30, 0, 0);
      
      // Find a logist
      const logist = users.find(user => user.role === "logist");
      const logistId = logist ? logist.id : users[0].id;
      
      await db.insert(schema.tasks).values([
        {
          title: "Связаться с клиентом",
          description: "Обсудить детали заказа и подтвердить даты доставки",
          dueDate: dueEarlierToday,
          assignedTo: logistId,
          relatedOrderId: orders[0].id,
          status: "pending",
          priority: "high"
        },
        {
          title: "Проверить документы",
          description: "Убедиться, что все документы готовы для отправки",
          dueDate: dueLaterToday,
          assignedTo: logistId,
          relatedOrderId: orders[0].id,
          status: "pending",
          priority: "medium"
        },
        {
          title: "Отправить накладные",
          description: "Отправить все необходимые накладные перевозчику",
          dueDate: dueTomorrow,
          assignedTo: logistId,
          relatedOrderId: orders[2].id,
          status: "pending",
          priority: "medium"
        },
        {
          title: "Согласовать цену с перевозчиком",
          description: "Обсудить стоимость перевозки и заключить договор",
          dueDate: dueLaterToday,
          assignedTo: logistId,
          relatedOrderId: orders[4].id,
          status: "pending",
          priority: "high"
        },
        {
          title: "Проверить статус отправки",
          description: "Убедиться, что груз отправлен вовремя",
          dueDate: dueTomorrow,
          assignedTo: logistId,
          relatedOrderId: orders[3].id,
          status: "pending",
          priority: "low"
        }
      ]);
    }

    // Check if notifications already exist
    const existingNotifications = await db.select().from(schema.notifications);
    if (existingNotifications.length === 0 && users.length > 0 && orders.length > 0) {
      console.log("Seeding notifications...");
      
      // Find a logist
      const logist = users.find(user => user.role === "logist");
      const logistId = logist ? logist.id : users[0].id;
      
      await db.insert(schema.notifications).values([
        {
          userId: logistId,
          title: "Задержка в доставке",
          message: "Задержка в доставке заказа #12345",
          type: "warning",
          isRead: false,
          relatedOrderId: orders[0].id
        },
        {
          userId: logistId,
          title: "Документы подтверждены",
          message: "Документы по заказу #12347 подтверждены",
          type: "success",
          isRead: false,
          relatedOrderId: orders[2].id
        },
        {
          userId: logistId,
          title: "Новое сообщение",
          message: "Новое сообщение от клиента ИП Смирнов А.В.",
          type: "info",
          isRead: false,
          relatedOrderId: orders[1].id
        },
        {
          userId: logistId,
          title: "Требуется подтверждение",
          message: "Требуется подтверждение заказа #12349",
          type: "info",
          isRead: false,
          relatedOrderId: orders[4].id
        }
      ]);
    }

    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Error during seed:", error);
  }
}

seed();
