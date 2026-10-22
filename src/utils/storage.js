
import AsyncStorage from "@react-native-async-storage/async-storage";

import { initialCustomers } from "../data/customers";
import { initialOrders } from "../data/orders";
import { initialServices } from "../data/services";

const KEYS = {
  customers: "washtrack_customers_v1",
  services: "washtrack_services_v1",
  orders: "washtrack_orders_v1",
};

async function readArray(key) {
  const raw = await AsyncStorage.getItem(key);

  if (raw === null) {
    return [];
  }

  const value = JSON.parse(raw);

  return Array.isArray(value) ? value : [];
}

async function writeArray(key, items) {
  await AsyncStorage.setItem(key, JSON.stringify(items));
}

export function getServicePrice(service) {
  const values = [
    service?.pricePerKg,
    service?.price,
    service?.rate,
  ];

  for (const value of values) {
    if (value === null || value === undefined || value === "") {
      continue;
    }

    const number = Number(value);

    if (Number.isFinite(number) && number > 0) {
      return number;
    }
  }

  return 0;
}

export function getOrderTotal(order) {
  const values = [
    order?.totalPrice,
    order?.total,
    order?.price,
    order?.amount,
  ];

  for (const value of values) {
    if (value === null || value === undefined || value === "") {
      continue;
    }

    const number = Number(value);

    if (Number.isFinite(number) && number > 0) {
      return number;
    }
  }

  return 0;
}

export async function initializeData() {
  const entries = [
    [KEYS.customers, initialCustomers],
    [KEYS.services, initialServices],
    [KEYS.orders, initialOrders],
  ];

  for (const [key, initialValue] of entries) {
    const stored = await AsyncStorage.getItem(key);

    if (stored === null) {
      await writeArray(key, initialValue);
    }
  }
}

export async function getCustomers() {
  await initializeData();

  return readArray(KEYS.customers);
}

export async function getCustomerById(id) {
  const customers = await getCustomers();

  return (
    customers.find(
      (item) =>
        String(item.id).toLowerCase() ===
        String(id).trim().toLowerCase()
    ) || null
  );
}

export async function addCustomer(customer) {
  const customers = await getCustomers();

  if (!customer.name?.trim() || !customer.phone?.trim()) {
    throw new Error("Customer name and phone are required.");
  }

  if (
    customers.some(
      (item) => String(item.id) === String(customer.id)
    )
  ) {
    throw new Error("Customer ID already exists.");
  }

  customers.push(customer);

  await writeArray(KEYS.customers, customers);

  return customer;
}

export async function updateCustomer(id, changes) {
  const customers = await getCustomers();

  const index = customers.findIndex(
    (item) => String(item.id) === String(id)
  );

  if (index === -1) {
    throw new Error("Customer not found.");
  }

  customers[index] = {
    ...customers[index],
    ...changes,
    id: customers[index].id,
  };

  await writeArray(KEYS.customers, customers);

  return customers[index];
}

export async function getServices() {
  await initializeData();

  return readArray(KEYS.services);
}

export async function addService(service) {
  const services = await getServices();

  const price = getServicePrice(service);

  if (!service.name?.trim() || price <= 0) {
    throw new Error("Enter a service name and valid price.");
  }

  if (
    services.some(
      (item) => String(item.id) === String(service.id)
    )
  ) {
    throw new Error("Service ID already exists.");
  }

  const newService = {
    ...service,
    price,
    pricePerKg: price,
  };

  services.push(newService);

  await writeArray(KEYS.services, services);

  return newService;
}

export async function updateService(id, changes) {
  const services = await getServices();

  const index = services.findIndex(
    (item) => String(item.id) === String(id)
  );

  if (index === -1) {
    throw new Error("Service not found.");
  }

  const existing = services[index];

  const updated = {
    ...existing,
    ...changes,
  };

  const newPriceProvided =
    changes.pricePerKg !== undefined ||
    changes.price !== undefined ||
    changes.rate !== undefined;

  const price = newPriceProvided
    ? getServicePrice({
        pricePerKg:
          changes.pricePerKg ??
          changes.price ??
          changes.rate,
      })
    : getServicePrice(existing);

  if (!updated.name?.trim() || price <= 0) {
    throw new Error("Enter a service name and valid price.");
  }

  services[index] = {
    ...updated,
    id: existing.id,
    price,
    pricePerKg: price,
  };

  await writeArray(KEYS.services, services);

  return services[index];
}

export async function deleteService(id) {
  const services = await getServices();
  const orders = await getOrders();

  const usedByOrder = orders.some(
    (order) => String(order.serviceId) === String(id)
  );

  if (usedByOrder) {
    throw new Error(
      "This service is used by existing orders."
    );
  }

  const filtered = services.filter(
    (item) => String(item.id) !== String(id)
  );

  if (filtered.length === services.length) {
    throw new Error("Service not found.");
  }

  await writeArray(KEYS.services, filtered);

  return true;
}

export async function getOrders() {
  await initializeData();

  const orders = await readArray(KEYS.orders);

  return orders.map((order) => {
    const amount = getOrderTotal(order);

    return {
      ...order,
      totalPrice: amount,
      total: amount,
      price: amount,
    };
  });
}

export async function getOrderById(id) {
  const orders = await getOrders();

  return (
    orders.find(
      (order) => String(order.id) === String(id)
    ) || null
  );
}

export async function getOrdersByCustomer(customerId) {
  const orders = await getOrders();

  return orders.filter(
    (order) =>
      String(order.customerId).toLowerCase() ===
      String(customerId).trim().toLowerCase()
  );
}

export async function addOrder(order) {
  const orders = await getOrders();
  const customers = await getCustomers();
  const services = await getServices();

  const customer = customers.find(
    (item) => String(item.id) === String(order.customerId)
  );

  const service = services.find(
    (item) => String(item.id) === String(order.serviceId)
  );

  if (!customer) {
    throw new Error("Customer not found.");
  }

  if (!service) {
    throw new Error("Laundry service not found.");
  }

  const weight = Number(order.weight);

  if (!Number.isFinite(weight) || weight <= 0) {
    throw new Error("Weight must be greater than zero.");
  }

  const unitPrice = getServicePrice(service);

  if (unitPrice <= 0) {
    throw new Error(
      "Service price must be greater than zero."
    );
  }

  const totalPrice = Number(
    (weight * unitPrice).toFixed(2)
  );

  if (totalPrice <= 0) {
    throw new Error(
      "Order price must be greater than zero."
    );
  }

  const nextId =
    Math.max(
      0,
      ...orders.map(
        (item) => Number(item.id) || 0
      )
    ) + 1;

  const newOrder = {
    ...order,
    id: String(nextId),
    customerId: customer.id,
    serviceId: service.id,
    weight,
    price: totalPrice,
    total: totalPrice,
    totalPrice,
    status: "Pending",
    createdAt:
      order.createdAt ||
      new Date().toISOString(),
  };

  orders.push(newOrder);

  await writeArray(KEYS.orders, orders);

  return newOrder;
}

export async function updateOrderStatus(id, status) {
  const orders = await getOrders();

  const index = orders.findIndex(
    (order) => String(order.id) === String(id)
  );

  if (index === -1) {
    throw new Error("Order not found.");
  }

  const statuses = [
    "Pending",
    "Ongoing",
    "Ready",
    "Completed",
  ];

  const currentIndex = statuses.indexOf(
    orders[index].status
  );

  const nextIndex = statuses.indexOf(status);

  if (nextIndex !== currentIndex + 1) {
    throw new Error(
      "Orders must follow the correct status sequence."
    );
  }

  orders[index] = {
    ...orders[index],
    status,
  };

  await writeArray(KEYS.orders, orders);

  return orders[index];
}
