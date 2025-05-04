import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, date, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations, type InferSelectModel } from "drizzle-orm";

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull().default("user"),
  position: text("position"),
  avatarUrl: text("avatar_url"),
  language: text("language").notNull().default("ru"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type User = InferSelectModel<typeof users>;
export const insertUserSchema = createInsertSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;

// Clients
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contactPerson: text("contact_person"),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Client = InferSelectModel<typeof clients>;
export const insertClientSchema = createInsertSchema(clients);
export type InsertClient = z.infer<typeof insertClientSchema>;

// Carriers
export const carriers = pgTable("carriers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contactPerson: text("contact_person"),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  vehicleType: text("vehicle_type"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Carrier = InferSelectModel<typeof carriers>;
export const insertCarrierSchema = createInsertSchema(carriers);
export type InsertCarrier = z.infer<typeof insertCarrierSchema>;

// Vehicles
export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  carrierId: integer("carrier_id").references(() => carriers.id).notNull(),
  type: text("type").notNull(),
  regNumber: text("reg_number").notNull(),
  capacity: text("capacity"),
  driverName: text("driver_name"),
  driverPhone: text("driver_phone"),
  status: text("status").notNull().default("available"),
  maintenanceDate: date("maintenance_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Vehicle = InferSelectModel<typeof vehicles>;
export const insertVehicleSchema = createInsertSchema(vehicles);
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;

// Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  clientId: integer("client_id").references(() => clients.id).notNull(),
  carrierId: integer("carrier_id").references(() => carriers.id),
  route: text("route").notNull(),
  originAddress: text("origin_address").notNull(),
  destinationAddress: text("destination_address").notNull(),
  status: text("status").notNull().default("pending"),
  type: text("type").notNull(),
  weight: text("weight"),
  volume: text("volume"),
  price: decimal("price", { precision: 10, scale: 2 }),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  orderDate: date("order_date").notNull(),
  deliveryDate: date("delivery_date"),
  managerId: integer("manager_id").references(() => users.id),
  details: jsonb("details"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Order = InferSelectModel<typeof orders>;
export const insertOrderSchema = createInsertSchema(orders);
export type InsertOrder = z.infer<typeof insertOrderSchema>;

// Routes
export const routes = pgTable("routes", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  vehicleId: integer("vehicle_id").references(() => vehicles.id),
  startPoint: text("start_point").notNull(),
  endPoint: text("end_point").notNull(),
  waypoints: jsonb("waypoints"),
  status: text("status").notNull().default("pending"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  progress: integer("progress").default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Route = InferSelectModel<typeof routes>;
export const insertRouteSchema = createInsertSchema(routes);
export type InsertRoute = z.infer<typeof insertRouteSchema>;

// Documents
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  fileData: text("file_data"),
  fileUrl: text("file_url"),
  uploadDate: timestamp("upload_date").defaultNow().notNull(),
  uploadedBy: integer("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Document = InferSelectModel<typeof documents>;
export const insertDocumentSchema = createInsertSchema(documents);
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

// Tasks
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  assignedTo: integer("assigned_to").references(() => users.id),
  relatedOrderId: integer("related_order_id").references(() => orders.id),
  status: text("status").notNull().default("pending"),
  priority: text("priority").notNull().default("medium"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Task = InferSelectModel<typeof tasks>;
export const insertTaskSchema = createInsertSchema(tasks);
export type InsertTask = z.infer<typeof insertTaskSchema>;

// Transportation Requests
export const transportationRequests = pgTable("transportation_requests", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  carrierId: integer("carrier_id").references(() => carriers.id).notNull(),
  requestNumber: text("request_number").notNull(),
  description: text("description"),
  cargoDetails: text("cargo_details"),
  price: decimal("price", { precision: 10, scale: 2 }),
  status: text("status").notNull().default("pending"),
  requestDate: date("request_date").notNull(),
  deliveryDate: date("delivery_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type TransportationRequest = InferSelectModel<typeof transportationRequests>;
export const insertTransportationRequestSchema = createInsertSchema(transportationRequests);
export type InsertTransportationRequest = z.infer<typeof insertTransportationRequestSchema>;

// Notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default("info"),
  isRead: boolean("is_read").notNull().default(false),
  relatedOrderId: integer("related_order_id").references(() => orders.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Notification = InferSelectModel<typeof notifications>;
export const insertNotificationSchema = createInsertSchema(notifications);
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

// Define all validation schemas
export const userValidationSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Must provide a valid email"),
  role: z.string().default("user"),
  language: z.string().default("ru")
});

export const clientValidationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Must provide a valid email").optional(),
});

export const carrierValidationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Must provide a valid email").optional(),
});

export const vehicleValidationSchema = z.object({
  type: z.string().min(2, "Type must be at least 2 characters"),
  regNumber: z.string().min(3, "Registration number must be at least 3 characters"),
  carrierId: z.number(),
});

export const orderValidationSchema = z.object({
  orderNumber: z.string().min(5, "Order number must be at least 5 characters"),
  route: z.string().min(3, "Route must be at least 3 characters"),
  originAddress: z.string().min(5, "Origin address must be at least 5 characters"),
  destinationAddress: z.string().min(5, "Destination address must be at least 5 characters"),
  type: z.string().min(3, "Type must be at least 3 characters"),
  clientId: z.number(),
  status: z.string().default("pending"),
  orderDate: z.date(),
});

export const routeValidationSchema = z.object({
  startPoint: z.string().min(3, "Start point must be at least 3 characters"),
  endPoint: z.string().min(3, "End point must be at least 3 characters"),
  orderId: z.number(),
  status: z.string().default("pending"),
});

export const taskValidationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  status: z.string().default("pending"),
  priority: z.string().default("medium"),
});

export const transportationRequestValidationSchema = z.object({
  orderId: z.number(),
  carrierId: z.number(),
  requestNumber: z.string().min(5, "Request number must be at least 5 characters"),
  status: z.string().default("pending"),
  requestDate: z.date(),
  description: z.string().optional(),
  cargoDetails: z.string().optional(),
  price: z.number().optional()
});

export const notificationValidationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  message: z.string().min(5, "Message must be at least 5 characters"),
  userId: z.number(),
  type: z.string().default("info"),
  isRead: z.boolean().default(false)
});

// Now define relations after all tables are defined to avoid circular dependencies
export const clientsRelations = relations(clients, ({ many }) => ({
  orders: many(orders),
}));

export const carriersRelations = relations(carriers, ({ many }) => ({
  vehicles: many(vehicles),
  orders: many(orders),
}));

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  carrier: one(carriers, {
    fields: [vehicles.carrierId],
    references: [carriers.id],
  }),
  routes: many(routes),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  client: one(clients, {
    fields: [orders.clientId],
    references: [clients.id],
  }),
  carrier: one(carriers, {
    fields: [orders.carrierId],
    references: [carriers.id],
  }),
  manager: one(users, {
    fields: [orders.managerId],
    references: [users.id],
  }),
  routes: many(routes),
  documents: many(documents),
  transportationRequests: many(transportationRequests),
}));

export const routesRelations = relations(routes, ({ one }) => ({
  order: one(orders, {
    fields: [routes.orderId],
    references: [orders.id],
  }),
  vehicle: one(vehicles, {
    fields: [routes.vehicleId],
    references: [vehicles.id],
  }),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  order: one(orders, {
    fields: [documents.orderId],
    references: [orders.id],
  }),
  uploader: one(users, {
    fields: [documents.uploadedBy],
    references: [users.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  assignee: one(users, {
    fields: [tasks.assignedTo],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [tasks.relatedOrderId],
    references: [orders.id],
  }),
}));

export const transportationRequestsRelations = relations(transportationRequests, ({ one }) => ({
  order: one(orders, {
    fields: [transportationRequests.orderId],
    references: [orders.id],
  }),
  carrier: one(carriers, {
    fields: [transportationRequests.carrierId],
    references: [carriers.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [notifications.relatedOrderId],
    references: [orders.id],
  }),
}));