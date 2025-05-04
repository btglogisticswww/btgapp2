import { db } from "@db";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";
import session from "express-session";
import { pool } from "@db";

// Using memory store for sessions
const MemoryStore = session.MemoryStore;

export interface IStorage {
  getUser(id: number): Promise<schema.User | undefined>;
  getUserByUsername(username: string): Promise<schema.User | undefined>;
  createUser(user: schema.InsertUser): Promise<schema.User>;
  
  // Orders management
  getOrders(): Promise<schema.Order[]>;
  getOrderById(id: number): Promise<schema.Order | undefined>;
  getOrdersByStatus(status: string): Promise<schema.Order[]>;
  createOrder(order: schema.InsertOrder): Promise<schema.Order>;
  updateOrder(id: number, order: Partial<schema.Order>): Promise<schema.Order | undefined>;
  
  // Clients management
  getClients(): Promise<schema.Client[]>;
  getClientById(id: number): Promise<schema.Client | undefined>;
  createClient(client: schema.InsertClient): Promise<schema.Client>;
  updateClient(id: number, client: Partial<schema.Client>): Promise<schema.Client | undefined>;
  
  // Carriers management
  getCarriers(): Promise<schema.Carrier[]>;
  getCarrierById(id: number): Promise<schema.Carrier | undefined>;
  createCarrier(carrier: schema.InsertCarrier): Promise<schema.Carrier>;
  updateCarrier(id: number, carrier: Partial<schema.Carrier>): Promise<schema.Carrier | undefined>;
  
  // Routes management
  getRoutes(): Promise<schema.Route[]>;
  getRouteById(id: number): Promise<schema.Route | undefined>;
  getRoutesByOrderId(orderId: number): Promise<schema.Route[]>;
  createRoute(route: schema.InsertRoute): Promise<schema.Route>;
  updateRoute(id: number, route: Partial<schema.Route>): Promise<schema.Route | undefined>;
  
  // Transportation Requests management
  getTransportationRequests(): Promise<schema.TransportationRequest[]>;
  getTransportationRequestById(id: number): Promise<schema.TransportationRequest | undefined>;
  getTransportationRequestsByOrderId(orderId: number): Promise<schema.TransportationRequest[]>;
  getTransportationRequestsByCarrierId(carrierId: number): Promise<schema.TransportationRequest[]>;
  createTransportationRequest(request: schema.InsertTransportationRequest): Promise<schema.TransportationRequest>;
  updateTransportationRequest(id: number, request: Partial<schema.TransportationRequest>): Promise<schema.TransportationRequest | undefined>;
  
  // Vehicles management
  getVehicles(): Promise<schema.Vehicle[]>;
  getVehicleById(id: number): Promise<schema.Vehicle | undefined>;
  getVehiclesByCarrierId(carrierId: number): Promise<schema.Vehicle[]>;
  createVehicle(vehicle: schema.InsertVehicle): Promise<schema.Vehicle>;
  updateVehicle(id: number, vehicle: Partial<schema.Vehicle>): Promise<schema.Vehicle | undefined>;
  
  // Tasks management
  getTasks(): Promise<schema.Task[]>;
  getTaskById(id: number): Promise<schema.Task | undefined>;
  getTasksByUserId(userId: number): Promise<schema.Task[]>;
  getTasksByOrderId(orderId: number): Promise<schema.Task[]>;
  createTask(task: schema.InsertTask): Promise<schema.Task>;
  updateTask(id: number, task: Partial<schema.Task>): Promise<schema.Task | undefined>;
  
  // Notifications management
  getNotifications(): Promise<schema.Notification[]>;
  getNotificationById(id: number): Promise<schema.Notification | undefined>;
  getNotificationsByUserId(userId: number): Promise<schema.Notification[]>;
  createNotification(notification: schema.InsertNotification): Promise<schema.Notification>;
  updateNotification(id: number, notification: Partial<schema.Notification>): Promise<schema.Notification | undefined>;
  
  // Documents management
  getDocuments(): Promise<schema.Document[]>;
  getDocumentById(id: number): Promise<schema.Document | undefined>;
  getDocumentsByOrderId(orderId: number): Promise<schema.Document[]>;
  createDocument(document: schema.InsertDocument): Promise<schema.Document>;
  updateDocument(id: number, document: Partial<schema.Document>): Promise<schema.Document | undefined>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new MemoryStore();
  }

  // User methods
  async getUser(id: number): Promise<schema.User | undefined> {
    const users = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return users[0];
  }

  async getUserByUsername(username: string): Promise<schema.User | undefined> {
    const users = await db.select().from(schema.users).where(eq(schema.users.username, username));
    return users[0];
  }

  async createUser(user: schema.InsertUser): Promise<schema.User> {
    const insertedUsers = await db.insert(schema.users).values(user).returning();
    return insertedUsers[0];
  }

  // Orders methods
  async getOrders(): Promise<schema.Order[]> {
    return await db.select().from(schema.orders);
  }

  async getOrderById(id: number): Promise<schema.Order | undefined> {
    const orders = await db.select().from(schema.orders).where(eq(schema.orders.id, id));
    return orders[0];
  }

  async getOrdersByStatus(status: string): Promise<schema.Order[]> {
    return await db.select().from(schema.orders).where(eq(schema.orders.status, status));
  }

  async createOrder(order: schema.InsertOrder): Promise<schema.Order> {
    const insertedOrders = await db.insert(schema.orders).values(order).returning();
    return insertedOrders[0];
  }

  async updateOrder(id: number, order: Partial<schema.Order>): Promise<schema.Order | undefined> {
    const updatedOrders = await db.update(schema.orders)
      .set(order)
      .where(eq(schema.orders.id, id))
      .returning();
    return updatedOrders[0];
  }

  // Clients methods
  async getClients(): Promise<schema.Client[]> {
    return await db.select().from(schema.clients);
  }

  async getClientById(id: number): Promise<schema.Client | undefined> {
    const clients = await db.select().from(schema.clients).where(eq(schema.clients.id, id));
    return clients[0];
  }

  async createClient(client: schema.InsertClient): Promise<schema.Client> {
    const insertedClients = await db.insert(schema.clients).values(client).returning();
    return insertedClients[0];
  }

  async updateClient(id: number, client: Partial<schema.Client>): Promise<schema.Client | undefined> {
    const updatedClients = await db.update(schema.clients)
      .set(client)
      .where(eq(schema.clients.id, id))
      .returning();
    return updatedClients[0];
  }

  // Carriers methods
  async getCarriers(): Promise<schema.Carrier[]> {
    return await db.select().from(schema.carriers);
  }

  async getCarrierById(id: number): Promise<schema.Carrier | undefined> {
    const carriers = await db.select().from(schema.carriers).where(eq(schema.carriers.id, id));
    return carriers[0];
  }

  async createCarrier(carrier: schema.InsertCarrier): Promise<schema.Carrier> {
    const insertedCarriers = await db.insert(schema.carriers).values(carrier).returning();
    return insertedCarriers[0];
  }

  async updateCarrier(id: number, carrier: Partial<schema.Carrier>): Promise<schema.Carrier | undefined> {
    const updatedCarriers = await db.update(schema.carriers)
      .set(carrier)
      .where(eq(schema.carriers.id, id))
      .returning();
    return updatedCarriers[0];
  }

  // Routes methods
  async getRoutes(): Promise<schema.Route[]> {
    return await db.select().from(schema.routes);
  }

  async getRouteById(id: number): Promise<schema.Route | undefined> {
    const routes = await db.select().from(schema.routes).where(eq(schema.routes.id, id));
    return routes[0];
  }

  async getRoutesByOrderId(orderId: number): Promise<schema.Route[]> {
    return await db.select().from(schema.routes).where(eq(schema.routes.orderId, orderId));
  }

  async createRoute(route: schema.InsertRoute): Promise<schema.Route> {
    const insertedRoutes = await db.insert(schema.routes).values(route).returning();
    return insertedRoutes[0];
  }

  async updateRoute(id: number, route: Partial<schema.Route>): Promise<schema.Route | undefined> {
    const updatedRoutes = await db.update(schema.routes)
      .set(route)
      .where(eq(schema.routes.id, id))
      .returning();
    return updatedRoutes[0];
  }

  // Vehicles methods
  async getVehicles(): Promise<schema.Vehicle[]> {
    return await db.select().from(schema.vehicles);
  }

  async getVehicleById(id: number): Promise<schema.Vehicle | undefined> {
    const vehicles = await db.select().from(schema.vehicles).where(eq(schema.vehicles.id, id));
    return vehicles[0];
  }

  async getVehiclesByCarrierId(carrierId: number): Promise<schema.Vehicle[]> {
    return await db.select().from(schema.vehicles).where(eq(schema.vehicles.carrierId, carrierId));
  }

  async createVehicle(vehicle: schema.InsertVehicle): Promise<schema.Vehicle> {
    const insertedVehicles = await db.insert(schema.vehicles).values(vehicle).returning();
    return insertedVehicles[0];
  }

  async updateVehicle(id: number, vehicle: Partial<schema.Vehicle>): Promise<schema.Vehicle | undefined> {
    const updatedVehicles = await db.update(schema.vehicles)
      .set(vehicle)
      .where(eq(schema.vehicles.id, id))
      .returning();
    return updatedVehicles[0];
  }

  // Tasks methods
  async getTasks(): Promise<schema.Task[]> {
    return await db.select().from(schema.tasks);
  }

  async getTaskById(id: number): Promise<schema.Task | undefined> {
    const tasks = await db.select().from(schema.tasks).where(eq(schema.tasks.id, id));
    return tasks[0];
  }

  async getTasksByUserId(userId: number): Promise<schema.Task[]> {
    return await db.select().from(schema.tasks).where(eq(schema.tasks.assignedTo, userId));
  }

  async getTasksByOrderId(orderId: number): Promise<schema.Task[]> {
    return await db.select().from(schema.tasks).where(eq(schema.tasks.relatedOrderId, orderId));
  }

  async createTask(task: schema.InsertTask): Promise<schema.Task> {
    const insertedTasks = await db.insert(schema.tasks).values(task).returning();
    return insertedTasks[0];
  }

  async updateTask(id: number, task: Partial<schema.Task>): Promise<schema.Task | undefined> {
    const updatedTasks = await db.update(schema.tasks)
      .set(task)
      .where(eq(schema.tasks.id, id))
      .returning();
    return updatedTasks[0];
  }

  // Notifications methods
  async getNotifications(): Promise<schema.Notification[]> {
    return await db.select().from(schema.notifications);
  }

  async getNotificationById(id: number): Promise<schema.Notification | undefined> {
    const notifications = await db.select().from(schema.notifications).where(eq(schema.notifications.id, id));
    return notifications[0];
  }

  async getNotificationsByUserId(userId: number): Promise<schema.Notification[]> {
    return await db.select().from(schema.notifications).where(eq(schema.notifications.userId, userId));
  }

  async createNotification(notification: schema.InsertNotification): Promise<schema.Notification> {
    const insertedNotifications = await db.insert(schema.notifications).values(notification).returning();
    return insertedNotifications[0];
  }

  async updateNotification(id: number, notification: Partial<schema.Notification>): Promise<schema.Notification | undefined> {
    const updatedNotifications = await db.update(schema.notifications)
      .set(notification)
      .where(eq(schema.notifications.id, id))
      .returning();
    return updatedNotifications[0];
  }

  // Documents methods
  async getDocuments(): Promise<schema.Document[]> {
    return await db.select().from(schema.documents);
  }

  async getDocumentById(id: number): Promise<schema.Document | undefined> {
    const documents = await db.select().from(schema.documents).where(eq(schema.documents.id, id));
    return documents[0];
  }

  async getDocumentsByOrderId(orderId: number): Promise<schema.Document[]> {
    return await db.select().from(schema.documents).where(eq(schema.documents.orderId, orderId));
  }

  async createDocument(document: schema.InsertDocument): Promise<schema.Document> {
    const insertedDocuments = await db.insert(schema.documents).values(document).returning();
    return insertedDocuments[0];
  }

  async updateDocument(id: number, document: Partial<schema.Document>): Promise<schema.Document | undefined> {
    const updatedDocuments = await db.update(schema.documents)
      .set(document)
      .where(eq(schema.documents.id, id))
      .returning();
    return updatedDocuments[0];
  }
  
  // Transportation Requests methods
  async getTransportationRequests(): Promise<schema.TransportationRequest[]> {
    return await db.select().from(schema.transportationRequests);
  }

  async getTransportationRequestById(id: number): Promise<schema.TransportationRequest | undefined> {
    const requests = await db.select().from(schema.transportationRequests).where(eq(schema.transportationRequests.id, id));
    return requests[0];
  }

  async getTransportationRequestsByOrderId(orderId: number): Promise<schema.TransportationRequest[]> {
    return await db.select().from(schema.transportationRequests).where(eq(schema.transportationRequests.orderId, orderId));
  }
  
  async getTransportationRequestsByCarrierId(carrierId: number): Promise<schema.TransportationRequest[]> {
    return await db.select().from(schema.transportationRequests).where(eq(schema.transportationRequests.carrierId, carrierId));
  }

  async createTransportationRequest(request: schema.InsertTransportationRequest): Promise<schema.TransportationRequest> {
    const insertedRequests = await db.insert(schema.transportationRequests).values(request).returning();
    return insertedRequests[0];
  }

  async updateTransportationRequest(id: number, request: Partial<schema.TransportationRequest>): Promise<schema.TransportationRequest | undefined> {
    const updatedRequests = await db.update(schema.transportationRequests)
      .set(request)
      .where(eq(schema.transportationRequests.id, id))
      .returning();
    return updatedRequests[0];
  }
}

// Export a singleton instance
export const storage = new DatabaseStorage();
