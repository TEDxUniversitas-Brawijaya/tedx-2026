import {
  accountRelations,
  accountTable,
  sessionRelations,
  sessionTable,
  userRelations,
  userTable,
  verificationTable,
} from "./auth";
import { configTable } from "./config";
import {
  orderItemsRelations,
  orderItemsTable,
  ordersRelations,
  ordersTable,
} from "./orders";
import { productsTable } from "./products";
import { refundRequestsRelations, refundRequestsTable } from "./refunds";
import { ticketsRelations, ticketsTable } from "./tickets";

export const schema = {
  // Auth
  userTable,
  sessionTable,
  accountTable,
  verificationTable,
  userRelations,
  accountRelations,
  sessionRelations,

  // Config
  configTable,

  // Products
  productsTable,

  // Orders
  ordersTable,
  orderItemsTable,
  ordersRelations,
  orderItemsRelations,

  // Tickets
  ticketsTable,
  ticketsRelations,

  // Refunds
  refundRequestsTable,
  refundRequestsRelations,
};
