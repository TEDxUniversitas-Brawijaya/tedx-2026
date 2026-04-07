import { TRPCError } from "@trpc/server";
import z from "zod";
import { createTRPCRouter, superadminOnlyProcedure } from "../trpc";

const getAllFiles = superadminOnlyProcedure.query(async (c) => {
  return await c.ctx.services.file.getAllFiles();
});

const uploadFile = superadminOnlyProcedure
  .input(z.instanceof(FormData))
  .mutation(async (c) => {
    const formData = c.input;
    const file = formData.get("file");
    if (!(file instanceof File)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "File is required",
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    return c.ctx.services.file.uploadFile(file.name, arrayBuffer, "temp");
  });

const deleteFile = superadminOnlyProcedure
  .input(z.array(z.string()))
  .mutation(async (c) => {
    const keys = c.input;
    await c.ctx.services.file.deleteFile(keys);
  });

export const fileRouter = createTRPCRouter({
  getAllFiles,
  uploadFile,
  deleteFile,
});
