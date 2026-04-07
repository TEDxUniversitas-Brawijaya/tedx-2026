import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: `${import.meta.env.VITE_PUBLIC_API_URL}/auth`,
  plugins: [
    // https://better-auth.com/docs/concepts/typescript#inferring-additional-fields
    // ! Make sure same as server side
    inferAdditionalFields({
      user: {
        role: {
          type: ["admin", "superadmin"],
          defaultValue: "admin",
          input: true,
          required: true,
        },
      },
    }),
  ],
});
