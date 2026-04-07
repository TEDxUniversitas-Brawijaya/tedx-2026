import { TRPCError } from "@trpc/server";
import {
  exportCSVInputSchema,
  exportCSVOutputSchema,
} from "../../schemas/analytics";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

const csv = protectedProcedure
  .input(exportCSVInputSchema)
  .output(exportCSVOutputSchema)
  .query(() => {
    // TODO: Implement admin.export.csv
    // - Based on entity type, fetch relevant data
    // - Convert data to CSV format
    // - Return CSV string and filename
    // NOTE: May need to use a plain Hono route instead of tRPC for streaming file download
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "admin.export.csv is not implemented yet",
    });
  });

export const exportRouter = createTRPCRouter({
  csv,
});
