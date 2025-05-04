import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // API prefix
  const apiPrefix = "/api";

  // Orders API
  app.get(`${apiPrefix}/orders`, async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get(`${apiPrefix}/orders/status/:status`, async (req, res) => {
    try {
      const { status } = req.params;
      const orders = await storage.getOrdersByStatus(status);
      res.json(orders);
    } catch (error) {
      console.error(`Error fetching orders with status ${req.params.status}:`, error);
      res.status(500).json({ message: "Failed to fetch orders by status" });
    }
  });

  app.get(`${apiPrefix}/orders/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const order = await storage.getOrderById(parseInt(id));
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error(`Error fetching order ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post(`${apiPrefix}/orders`, async (req, res) => {
    try {
      const order = await storage.createOrder(req.body);
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.put(`${apiPrefix}/orders/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedOrder = await storage.updateOrder(parseInt(id), req.body);
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(updatedOrder);
    } catch (error) {
      console.error(`Error updating order ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  // Clients API
  app.get(`${apiPrefix}/clients`, async (req, res) => {
    try {
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });

  app.get(`${apiPrefix}/clients/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const client = await storage.getClientById(parseInt(id));
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      console.error(`Error fetching client ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch client" });
    }
  });

  app.post(`${apiPrefix}/clients`, async (req, res) => {
    try {
      const client = await storage.createClient(req.body);
      res.status(201).json(client);
    } catch (error) {
      console.error("Error creating client:", error);
      res.status(500).json({ message: "Failed to create client" });
    }
  });

  app.put(`${apiPrefix}/clients/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedClient = await storage.updateClient(parseInt(id), req.body);
      if (!updatedClient) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(updatedClient);
    } catch (error) {
      console.error(`Error updating client ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update client" });
    }
  });

  app.patch(`${apiPrefix}/clients/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedClient = await storage.updateClient(parseInt(id), req.body);
      if (!updatedClient) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(updatedClient);
    } catch (error) {
      console.error(`Error updating client ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update client" });
    }
  });

  // Carriers API
  app.get(`${apiPrefix}/carriers`, async (req, res) => {
    try {
      const carriers = await storage.getCarriers();
      res.json(carriers);
    } catch (error) {
      console.error("Error fetching carriers:", error);
      res.status(500).json({ message: "Failed to fetch carriers" });
    }
  });

  app.get(`${apiPrefix}/carriers/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const carrier = await storage.getCarrierById(parseInt(id));
      if (!carrier) {
        return res.status(404).json({ message: "Carrier not found" });
      }
      res.json(carrier);
    } catch (error) {
      console.error(`Error fetching carrier ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch carrier" });
    }
  });

  app.post(`${apiPrefix}/carriers`, async (req, res) => {
    try {
      const carrier = await storage.createCarrier(req.body);
      res.status(201).json(carrier);
    } catch (error) {
      console.error("Error creating carrier:", error);
      res.status(500).json({ message: "Failed to create carrier" });
    }
  });

  app.put(`${apiPrefix}/carriers/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedCarrier = await storage.updateCarrier(parseInt(id), req.body);
      if (!updatedCarrier) {
        return res.status(404).json({ message: "Carrier not found" });
      }
      res.json(updatedCarrier);
    } catch (error) {
      console.error(`Error updating carrier ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update carrier" });
    }
  });

  app.patch(`${apiPrefix}/carriers/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedCarrier = await storage.updateCarrier(parseInt(id), req.body);
      if (!updatedCarrier) {
        return res.status(404).json({ message: "Carrier not found" });
      }
      res.json(updatedCarrier);
    } catch (error) {
      console.error(`Error updating carrier ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update carrier" });
    }
  });

  // Routes API
  app.get(`${apiPrefix}/routes`, async (req, res) => {
    try {
      const routes = await storage.getRoutes();
      res.json(routes);
    } catch (error) {
      console.error("Error fetching routes:", error);
      res.status(500).json({ message: "Failed to fetch routes" });
    }
  });

  app.get(`${apiPrefix}/routes/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const route = await storage.getRouteById(parseInt(id));
      if (!route) {
        return res.status(404).json({ message: "Route not found" });
      }
      res.json(route);
    } catch (error) {
      console.error(`Error fetching route ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch route" });
    }
  });

  app.get(`${apiPrefix}/orders/:orderId/routes`, async (req, res) => {
    try {
      const { orderId } = req.params;
      const routes = await storage.getRoutesByOrderId(parseInt(orderId));
      res.json(routes);
    } catch (error) {
      console.error(`Error fetching routes for order ${req.params.orderId}:`, error);
      res.status(500).json({ message: "Failed to fetch routes for order" });
    }
  });

  app.post(`${apiPrefix}/routes`, async (req, res) => {
    try {
      const route = await storage.createRoute(req.body);
      res.status(201).json(route);
    } catch (error) {
      console.error("Error creating route:", error);
      res.status(500).json({ message: "Failed to create route" });
    }
  });

  app.put(`${apiPrefix}/routes/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedRoute = await storage.updateRoute(parseInt(id), req.body);
      if (!updatedRoute) {
        return res.status(404).json({ message: "Route not found" });
      }
      res.json(updatedRoute);
    } catch (error) {
      console.error(`Error updating route ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update route" });
    }
  });
  
  // Add PATCH endpoint for routes (same functionality as PUT but matches client request method)
  app.patch(`${apiPrefix}/routes/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedRoute = await storage.updateRoute(parseInt(id), req.body);
      if (!updatedRoute) {
        return res.status(404).json({ message: "Route not found" });
      }
      res.json(updatedRoute);
    } catch (error) {
      console.error(`Error updating route ${req.params.id} with PATCH:`, error);
      res.status(500).json({ message: "Failed to update route" });
    }
  });

  // Vehicles API
  app.get(`${apiPrefix}/vehicles`, async (req, res) => {
    try {
      const vehicles = await storage.getVehicles();
      res.json(vehicles);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      res.status(500).json({ message: "Failed to fetch vehicles" });
    }
  });

  app.get(`${apiPrefix}/vehicles/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const vehicle = await storage.getVehicleById(parseInt(id));
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      res.json(vehicle);
    } catch (error) {
      console.error(`Error fetching vehicle ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch vehicle" });
    }
  });

  app.get(`${apiPrefix}/carriers/:carrierId/vehicles`, async (req, res) => {
    try {
      const { carrierId } = req.params;
      const vehicles = await storage.getVehiclesByCarrierId(parseInt(carrierId));
      res.json(vehicles);
    } catch (error) {
      console.error(`Error fetching vehicles for carrier ${req.params.carrierId}:`, error);
      res.status(500).json({ message: "Failed to fetch vehicles for carrier" });
    }
  });

  app.post(`${apiPrefix}/vehicles`, async (req, res) => {
    try {
      const vehicle = await storage.createVehicle(req.body);
      res.status(201).json(vehicle);
    } catch (error) {
      console.error("Error creating vehicle:", error);
      res.status(500).json({ message: "Failed to create vehicle" });
    }
  });

  app.put(`${apiPrefix}/vehicles/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedVehicle = await storage.updateVehicle(parseInt(id), req.body);
      if (!updatedVehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      res.json(updatedVehicle);
    } catch (error) {
      console.error(`Error updating vehicle ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update vehicle" });
    }
  });

  // Tasks API
  app.get(`${apiPrefix}/tasks`, async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.get(`${apiPrefix}/tasks/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const task = await storage.getTaskById(parseInt(id));
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      console.error(`Error fetching task ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch task" });
    }
  });

  app.get(`${apiPrefix}/users/:userId/tasks`, async (req, res) => {
    try {
      const { userId } = req.params;
      const tasks = await storage.getTasksByUserId(parseInt(userId));
      res.json(tasks);
    } catch (error) {
      console.error(`Error fetching tasks for user ${req.params.userId}:`, error);
      res.status(500).json({ message: "Failed to fetch tasks for user" });
    }
  });

  app.get(`${apiPrefix}/orders/:orderId/tasks`, async (req, res) => {
    try {
      const { orderId } = req.params;
      const tasks = await storage.getTasksByOrderId(parseInt(orderId));
      res.json(tasks);
    } catch (error) {
      console.error(`Error fetching tasks for order ${req.params.orderId}:`, error);
      res.status(500).json({ message: "Failed to fetch tasks for order" });
    }
  });

  app.post(`${apiPrefix}/tasks`, async (req, res) => {
    try {
      const task = await storage.createTask(req.body);
      res.status(201).json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.put(`${apiPrefix}/tasks/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedTask = await storage.updateTask(parseInt(id), req.body);
      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(updatedTask);
    } catch (error) {
      console.error(`Error updating task ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  // Notifications API
  app.get(`${apiPrefix}/notifications`, async (req, res) => {
    try {
      const notifications = await storage.getNotifications();
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.get(`${apiPrefix}/notifications/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const notification = await storage.getNotificationById(parseInt(id));
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      res.json(notification);
    } catch (error) {
      console.error(`Error fetching notification ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch notification" });
    }
  });

  app.get(`${apiPrefix}/users/:userId/notifications`, async (req, res) => {
    try {
      const { userId } = req.params;
      const notifications = await storage.getNotificationsByUserId(parseInt(userId));
      res.json(notifications);
    } catch (error) {
      console.error(`Error fetching notifications for user ${req.params.userId}:`, error);
      res.status(500).json({ message: "Failed to fetch notifications for user" });
    }
  });

  app.post(`${apiPrefix}/notifications`, async (req, res) => {
    try {
      const notification = await storage.createNotification(req.body);
      res.status(201).json(notification);
    } catch (error) {
      console.error("Error creating notification:", error);
      res.status(500).json({ message: "Failed to create notification" });
    }
  });

  app.put(`${apiPrefix}/notifications/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedNotification = await storage.updateNotification(parseInt(id), req.body);
      if (!updatedNotification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      res.json(updatedNotification);
    } catch (error) {
      console.error(`Error updating notification ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update notification" });
    }
  });

  // Documents API
  app.get(`${apiPrefix}/documents`, async (req, res) => {
    try {
      const documents = await storage.getDocuments();
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.get(`${apiPrefix}/documents/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const document = await storage.getDocumentById(parseInt(id));
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.json(document);
    } catch (error) {
      console.error(`Error fetching document ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch document" });
    }
  });

  app.get(`${apiPrefix}/orders/:orderId/documents`, async (req, res) => {
    try {
      const { orderId } = req.params;
      const documents = await storage.getDocumentsByOrderId(parseInt(orderId));
      res.json(documents);
    } catch (error) {
      console.error(`Error fetching documents for order ${req.params.orderId}:`, error);
      res.status(500).json({ message: "Failed to fetch documents for order" });
    }
  });

  app.post(`${apiPrefix}/documents`, async (req, res) => {
    try {
      const document = await storage.createDocument(req.body);
      res.status(201).json(document);
    } catch (error) {
      console.error("Error creating document:", error);
      res.status(500).json({ message: "Failed to create document" });
    }
  });

  app.put(`${apiPrefix}/documents/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedDocument = await storage.updateDocument(parseInt(id), req.body);
      if (!updatedDocument) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.json(updatedDocument);
    } catch (error) {
      console.error(`Error updating document ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update document" });
    }
  });

  // Transportation Requests API
  app.get(`${apiPrefix}/transportation-requests`, async (req, res) => {
    try {
      const requests = await storage.getTransportationRequests();
      res.json(requests);
    } catch (error) {
      console.error("Error fetching transportation requests:", error);
      res.status(500).json({ message: "Failed to fetch transportation requests" });
    }
  });

  app.get(`${apiPrefix}/transportation-requests/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const request = await storage.getTransportationRequestById(parseInt(id));
      if (!request) {
        return res.status(404).json({ message: "Transportation request not found" });
      }
      res.json(request);
    } catch (error) {
      console.error(`Error fetching transportation request ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch transportation request" });
    }
  });

  app.get(`${apiPrefix}/orders/:orderId/transportation-requests`, async (req, res) => {
    try {
      const { orderId } = req.params;
      const requests = await storage.getTransportationRequestsByOrderId(parseInt(orderId));
      res.json(requests);
    } catch (error) {
      console.error(`Error fetching transportation requests for order ${req.params.orderId}:`, error);
      res.status(500).json({ message: "Failed to fetch transportation requests for order" });
    }
  });

  app.get(`${apiPrefix}/carriers/:carrierId/transportation-requests`, async (req, res) => {
    try {
      const { carrierId } = req.params;
      const requests = await storage.getTransportationRequestsByCarrierId(parseInt(carrierId));
      res.json(requests);
    } catch (error) {
      console.error(`Error fetching transportation requests for carrier ${req.params.carrierId}:`, error);
      res.status(500).json({ message: "Failed to fetch transportation requests for carrier" });
    }
  });

  app.post(`${apiPrefix}/transportation-requests`, async (req, res) => {
    try {
      const request = await storage.createTransportationRequest(req.body);
      res.status(201).json(request);
    } catch (error) {
      console.error("Error creating transportation request:", error);
      res.status(500).json({ message: "Failed to create transportation request" });
    }
  });

  app.put(`${apiPrefix}/transportation-requests/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedRequest = await storage.updateTransportationRequest(parseInt(id), req.body);
      if (!updatedRequest) {
        return res.status(404).json({ message: "Transportation request not found" });
      }
      res.json(updatedRequest);
    } catch (error) {
      console.error(`Error updating transportation request ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update transportation request" });
    }
  });

  app.patch(`${apiPrefix}/transportation-requests/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedRequest = await storage.updateTransportationRequest(parseInt(id), req.body);
      if (!updatedRequest) {
        return res.status(404).json({ message: "Transportation request not found" });
      }
      res.json(updatedRequest);
    } catch (error) {
      console.error(`Error updating transportation request ${req.params.id} with PATCH:`, error);
      res.status(500).json({ message: "Failed to update transportation request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
