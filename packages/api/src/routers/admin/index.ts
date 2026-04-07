import { createTRPCRouter } from "../../trpc";
import { analyticsRouter } from "./analytics";
import { attendanceRouter } from "./attendance";
import { exportRouter } from "./export";
import { merchPickupRouter } from "./merch-pickup";
import { orderRouter } from "./order";
import { productRouter } from "./product";
import { adminUserRouter } from "./user";

export const adminRouter = createTRPCRouter({
  order: orderRouter,
  product: productRouter,
  attendance: attendanceRouter,
  merchPickup: merchPickupRouter,
  user: adminUserRouter,
  analytics: analyticsRouter,
  export: exportRouter,
});
